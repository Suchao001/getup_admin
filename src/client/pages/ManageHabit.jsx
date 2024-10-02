import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, ButtonGroup, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Select, MenuItem } from '@mui/material';
import { HostName } from '../util/HostName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ficons from '@fortawesome/free-solid-svg-icons';
import ColorPicker from '../components/ColorPicker';
import IconPicker from '../components/IconPicker';
import { deleteConfirm } from '../util/sweet';
import {ArrowBack} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

function ManageHabit() {
  const [habitsCategory, setHabitsCategory] = useState([]);
  const [habits, setHabits] = useState([]);
  const [viewChange, setViewChange] = useState(false);
  const [title, setTitle] = useState('Manage Habit');
  const [editCategory, setEditCategory] = useState(null);
  const [editHabit, setEditHabit] = useState(null);
  const [icon, setIcon] = useState('faUser');
  const [selectedIconId, setSelectedIconId] = useState(null); 
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isAddHabit, setIsAddHabit] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(1);
  const [isAddCategory, setIsAddCategory] = useState(false);
  

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
    setIsAddCategory(false);
  };

  const handleEditHabit = (habit) => {
    setEditHabit(habit);
    console.log(habit);
    setSelectedIconId(habit.icon_id); 
    setIcon(habit.nameToUse);
    setIsAddHabit(false);
  };

  const handleDelete = async (habitId) => {
    const confirm = await deleteConfirm('Are you sure you want to delete this habit?', 'Delete Habit');
    try {
      if (confirm) {
      const response = await axios.delete(`${HostName}/api/admin/habit/habitRecommendation/${habitId}`);
      console.log(response);
      fetchHabitsCategory();
      
      }
      return;
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };
  const handleDeleteCategory = async (categoryId) => {
    const confirm = await deleteConfirm('Are you sure you want to delete this category?', 'Delete Category');
    try {
      if (confirm) {
        const response = await axios.delete(`${HostName}/api/admin/habit/habitCategory/${categoryId}`);
        console.log(response);
        fetchHabitsCategory();
      }
      return;
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleSee = (habitId, habitName) => {
    fetchHabits(habitId);
    setTitle(habitName);
    setViewChange(true);
    setSelectedHabit(habitId);
    setSelectedCategoryId(habitId);
  };

  const handleBack = () => {
    setViewChange(false);
    setTitle('Manage Habit');
  };

  const handleCloseEditCategory = () => {
    setEditCategory(null);
    setIsAddCategory(false);
  };

  const handleCloseEditHabit = () => {
    setEditHabit(null);
    setSelectedIconId(null);
    setIsAddHabit(false);
  };

  const handleSaveCategory = async () => {
    try {
      if (isAddCategory) {
        await axios.post(`${HostName}/api/admin/habit/category`, editCategory);
      } else {
        await axios.put(`${HostName}/api/admin/habit/category`, editCategory);
      }
      fetchHabitsCategory();
      setEditCategory(null);
      setIsAddCategory(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleSaveHabit = async () => {
    try {
      
      if (isAddHabit) {
        const data = {name: editHabit.name, icon_id: selectedIconId, categoryId: selectedCategoryId };
        const response = await axios.post(`${HostName}/api/admin/habit/habitRecommendation`, data, { withCredentials: true });
        console.log(response);
        fetchHabitsCategory();
      } else {
        const data = { id: editHabit.id, name: editHabit.name, icon_id: selectedIconId };
        await axios.put(`${HostName}/api/admin/habit/habitRecommendation`, data, { withCredentials: true });
        fetchHabits(selectedHabit);
      }
      handleCloseEditHabit();
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const handleAddHabit = () => {
    setEditHabit({ id: null, name: '', icon_id: 3 });
    setSelectedIconId(3);
    setIcon('faUser');
    setIsAddHabit(true);
  };

  const handleAddCategory = () => {
    setEditCategory({ id: null, name: '', color: '#000000' });
    setIsAddCategory(true);
  };

  const onSelectIcon = (icon) => {
    setIcon(icon);
  };

  const onSelectIconId = (id) => {
    setSelectedIconId(id); 
    setEditHabit({ ...editHabit, icon_id: id });
  };

  const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    marginTop: theme.spacing(3),
    boxShadow: theme.shadows[5],
    borderRadius: theme.shape.borderRadius,
  }));

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <Typography variant="h4" className='font1'>{title}</Typography>
        <div>
         { viewChange ? <Button onClick={handleBack} style={{marginRight: '10px'}}><ArrowBack/>Back</Button> : null}
          <Button variant="contained" color="primary" onClick={handleAddHabit} style={{marginRight: '10px'}}>Add Habit</Button>
          <Button variant="contained" color="secondary" onClick={handleAddCategory}>Add Category</Button>
        </div>
      </div>
     
        <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>{viewChange ? 'Icon' : 'Color'}</TableCell>
              <TableCell>Action</TableCell>
              {!viewChange && <TableCell>See</TableCell>}
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
               
              </TableRow>
            )) : Array.isArray(habitsCategory) && habitsCategory.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell sx={{ backgroundColor: category.color, color: 'white' }}>{category.color}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <Button variant="contained" sx={{ backgroundColor: '#fbb900', color: 'white', '&:hover': { backgroundColor: '#c79300' } }} onClick={() => handleEditCategory(category)}>Edit</Button>
                    <Button variant="contained" sx={{ backgroundColor: '#D50000', color: 'white', '&:hover': { backgroundColor: '#a20000' } }} onClick={() => handleDeleteCategory(category.id)}>Delete</Button>
                  </ButtonGroup>
                </TableCell>
                <TableCell>
                  <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: '#333' } }} onClick={() => handleSee(category.id, category.name)}>See</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Edit Category Dialog */}
      {editCategory && (
        <Dialog open={true} onClose={handleCloseEditCategory} PaperProps={{
          style: {
            overflow: 'visible',
          },
        }}>
          <DialogTitle>{isAddCategory ? 'Add Category' : 'Edit Category'}</DialogTitle>
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

      {/* Edit/Add Habit Dialog */}
      {editHabit && (
        <Dialog open={true} onClose={handleCloseEditHabit} >
          <DialogTitle>{isAddHabit ? 'Add Habit' : 'Edit Habit'}</DialogTitle>
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
            <div style={{ marginTop: '20px' ,display:'flex',gap:'10px'}}>
            <FontAwesomeIcon icon={ficons[icon]} size="2x" />
           <IconPicker
                icon={selectedIconId}
                onSelectIcon={(icon) => onSelectIcon(icon)}
                onSelectIconId={(id) => onSelectIconId(id)}
              />
            </div>
          
            {isAddHabit && (
              <div style={{ marginTop: '20px' }}>
                <Typography variant="body1">Select Category:</Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedCategoryId || editHabit.categoryId || habitsCategory[0]?.id || ''}
                    onChange={(e) => {
                      const newCategoryId = e.target.value;
                      setEditHabit({ ...editHabit, categoryId: newCategoryId });
                      setSelectedCategoryId(newCategoryId);
                    }}
                  >
                    {habitsCategory.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
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