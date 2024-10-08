import React, { useState, useEffect } from "react";
import axios from "axios";
import { HostName } from "../util/HostName";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Search, Refresh } from "@mui/icons-material";
import { goodAlert, badAlert, deleteConfirm } from "../util/sweet";

function User() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${HostName}/api/admin/user`, {
        withCredentials: true,
      });
      if (response.data.ok) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_id.toString().includes(searchTerm)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const toggleUserStatus = async (user_id) => {
    try {
      const response = await axios.put(
        `${HostName}/api/admin/user/${user_id}`,
        {},
        { withCredentials: true }
      );
      if (response.data.ok) {
        goodAlert("User status toggled successfully");
        fetchUsers();
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      setError("Failed to toggle user status. Please try again.");
    }
  };

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="div">
          User Management
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2 }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} color="primary">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Profile Picture</TableCell>
              <TableCell>Profile Picture URL</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Toggle Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.user_id} hover>
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Avatar
                      src={`./../../../../public/image/${user.profile_picture}`}
                      alt={user.username}
                      sx={{ width: 40, height: 40 }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.profile_picture}</TableCell>
                  <TableCell>
                    {user.is_active ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => toggleUserStatus(user.user_id)}
                    >
                      Toggle Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default User;
