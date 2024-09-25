import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, ButtonGroup, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { HostName } from '../util/HostName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import ColorPicker from '../components/ColorPicker';
import IconPicker from '../components/IconPicker';

function ManageHabit() {
  const [habitsCategory, setHabitsCategory] = useState([]);
  const [habits, setHabits] = useState([]);
  const [viewChange, setViewChange] = useState(false);
  const [title, setTitle] = useState('Manage Habit');
  const [editCategory, setEditCategory] = useState(null);
  const [editHabit, setEditHabit] = useState(null);
  const [icon, setIcon] = useState(null);
  const [selectedIconId, setSelectedIconId] = useState(null); 

  const fetchHabitsCategory = async () => {
    try {
      const response = await axios.get(`${HostName}/api/admin/habit/category`);
      setHabitsCategory(response.data.habitsCategory);
    } catch (error) {
      console.error('Error fetching habits category:', error);
    }
  };

  useEffect(() => {
    fetchHabitsCategory();
  }, []);

  const fetchHabits = async (id) => {
    try {
      const response = await axios.get(`${HostName}/api/admin/habit/${id}`);
      setHabits(response.data);
   
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
  };

  const handleEditHabit = (habit) => {
    setEditHabit(habit);
    setSelectedIconId(habit.icon_id); 
    setIcon(habit.nameToUse);
  };

  const handleDelete = (habitId) => {
    console.log('Delete habit with ID:', habitId);
  };

  const handleSee = (habitId, habitName) => {
    fetchHabits(habitId);
    setTitle(habitName);
    setViewChange(true);
  };

  const handleBack = () => {
    setViewChange(false);
    setTitle('Manage Habit');
  };

  const handleCloseEditCategory = () => {
    setEditCategory(null);
  };

  const handleCloseEditHabit = () => {
    setEditHabit(null);
    setSelectedIconId(null); // Reset selectedIconId when closing edit habit dialog
  };

  const handleSaveCategory = async () => {
    try {
      await axios.put(`${HostName}/api/admin/habit/category`, editCategory);
      fetchHabitsCategory();
      setEditCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleSaveHabit = async () => {
    try {
      const data = {id: editHabit.id, name: editHabit.name, icon_id: selectedIconId};
      await axios.put(`${HostName}/api/admin/habit/habitRecommendation`, data,{withCredentials: true});
   
      setEditHabit(null);
      setSelectedIconId(null); 
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const onSelectIcon = (icon) => {
    setIcon(icon);
  };

  const onSelectIconId = (id) => {
    setSelectedIconId(id); 
    setEditHabit({ ...editHabit, icon_id: id });
  };

  return (
    <div>
      <h1>{title}</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>{viewChange ? 'Icon' : 'Name'}</TableCell>
              <TableCell>{viewChange ? 'Action' : 'Color'}</TableCell>
              <TableCell>{viewChange ? 'Back' : 'See'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {viewChange ? habits.map((habit) => (
              <TableRow key={habit.id}>
                <TableCell>{habit.name}</TableCell>
                <TableCell><FontAwesomeIcon icon={ficons[habit.nameToUse]} /></TableCell>
                <TableCell>
                  <ButtonGroup>
                    <Button variant="contained" sx={{ backgroundColor: '#fbb900', color: 'white', '&:hover': { backgroundColor: '#c79300' } }} onClick={() => handleEditHabit(habit)}>Edit</Button>
                    <Button variant="contained" sx={{ backgroundColor: '#D50000', color: 'white', '&:hover': { backgroundColor: '#a20000' } }} onClick={() => handleDelete(habit.id)}>Delete</Button>
                  </ButtonGroup>
                </TableCell>
                <TableCell>
                  <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: '#333' } }} onClick={handleBack}>Back</Button>
                </TableCell>
              </TableRow>
            )) : Array.isArray(habitsCategory) && habitsCategory.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell sx={{ backgroundColor: category.color, color: 'white' }}>{category.color}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <Button variant="contained" sx={{ backgroundColor: '#fbb900', color: 'white', '&:hover': { backgroundColor: '#c79300' } }} onClick={() => handleEditCategory(category)}>Edit</Button>
                    <Button variant="contained" sx={{ backgroundColor: '#D50000', color: 'white', '&:hover': { backgroundColor: '#a20000' } }} onClick={() => handleDelete(category.id)}>Delete</Button>
                  </ButtonGroup>
                </TableCell>
                <TableCell>
                  <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: '#333' } }} onClick={() => handleSee(category.id, category.name)}>See</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Category Dialog */}
      {editCategory && (
        <Dialog open={true} onClose={handleCloseEditCategory} PaperProps={{
          style: {
            overflow: 'visible',
          },
        }}>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Category Name"
              type="text"
              fullWidth
              variant="standard"
              value={editCategory.name}
              onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
            />
            <div style={{ overflow: 'auto', maxHeight: '90vh' }}>
              <ColorPicker
                color={editCategory.color}
                onChange={(color) => setEditCategory({ ...editCategory, color })}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditCategory}>Cancel</Button>
            <Button onClick={handleSaveCategory}>Save</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Edit Habit Dialog */}
      {editHabit && (
        <Dialog open={true} onClose={handleCloseEditHabit} >
          <DialogTitle>Edit Habit</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Habit Name"
              type="text"
              fullWidth
              variant="standard"
              value={editHabit.name}
              onChange={(e) => setEditHabit({ ...editHabit, name: e.target.value })}
            />
            <div style={{ marginTop: '20px' }}>
              <IconPicker
                icon={selectedIconId}
                onSelectIcon={(icon) => onSelectIcon(icon)}
                onSelectIconId={(id) => onSelectIconId(id)}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <FontAwesomeIcon icon={ficons[icon]} size="2x" />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditHabit}>Cancel</Button>
            <Button onClick={handleSaveHabit}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default ManageHabit;