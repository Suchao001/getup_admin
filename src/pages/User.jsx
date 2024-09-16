import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HostName } from '../client/util/HostName';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Typography } from '@mui/material';

function User() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${HostName}/api/admin/user`, { withCredentials: true });
        if (response.data.ok) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
    
  }, []);

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" gutterBottom component="div" sx={{ p: 2 }}>
        User Management
      </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="user table">
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Profile Picture</TableCell>
            <TableCell>Profile Picture URL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{user.user_id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Avatar src={"image/"+user.profile_picture} alt={user.username}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </TableCell>
              <TableCell>{user.profile_picture}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default User;