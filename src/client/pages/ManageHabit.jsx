import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, ButtonGroup } from '@mui/material';
import { HostName} from '../util/HostName'

function ManageHabit() {
  const [habitsCategory, setHabitsCategory] = useState([]);
  const [habits, setHabits] = useState([]);
  const [viewChange, setViewChange] = useState(false);

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

  const handleEdit = (habit) => {
    console.log('Edit habit:', habit);
  };

  const handleDelete = (habitId) => {
    console.log('Delete habit with ID:', habitId);
  };
  const handleSee = (habitId) => {
    fetchHabits(habitId);
    setViewChange(true);
  };    
  const handleBack = () => {
    setViewChange(false);
  };

  return (
    <div>
      <h1>Manage Habit</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Icon ID</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>{viewChange ? 'Back' : 'See'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {viewChange ? habits.map((habit) => (
              <TableRow key={habit.id}>
                <TableCell>{habit.id}</TableCell>
                <TableCell>{habit.name}</TableCell>
                <TableCell>{habit.icon_id}</TableCell>
                <TableCell>   <ButtonGroup>
                                        <Button variant="contained" sx={{ backgroundColor: '#fbb900', color: 'white', '&:hover': { backgroundColor: '#c79300' } }} onClick={() => handleEdit(habit)}>Edit</Button>
                                        <Button variant="contained" sx={{ backgroundColor: '#D50000', color: 'white', '&:hover': { backgroundColor: '#a20000' } }} onClick={() => handleDelete(habit.id)}>Delete</Button>
                                    </ButtonGroup></TableCell>
                <TableCell>   <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: '#333' } }} onClick={handleBack}>Back</Button></TableCell>
              </TableRow>
            )) : Array.isArray(habitsCategory) && habitsCategory.map((habit) => (
              <TableRow key={habit.id}>
                <TableCell>{habit.id}</TableCell>
                <TableCell>{habit.name}</TableCell>
                <TableCell sx={{ backgroundColor: habit.color, color: 'white' }}>{habit.color}</TableCell>
                <TableCell>   <ButtonGroup>
                                        <Button variant="contained" sx={{ backgroundColor: '#fbb900', color: 'white', '&:hover': { backgroundColor: '#c79300' } }} onClick={() => handleEdit(habit)}>Edit</Button>
                                        <Button variant="contained" sx={{ backgroundColor: '#D50000', color: 'white', '&:hover': { backgroundColor: '#a20000' } }} onClick={() => handleDelete(habit.id)}>Delete</Button>
                                    </ButtonGroup></TableCell>
                <TableCell>   <Button variant="contained" sx={{ backgroundColor: '#333', color: 'white', '&:hover': { backgroundColor: '#333' } }} onClick={() => handleSee(habit.id)}>See</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ManageHabit;