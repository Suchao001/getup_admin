import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { HostName } from './util/HostName';
import { goodAlert, badAlert } from './util/sweet';
import  AuthContext  from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(username,password)
    try {
      const response = await axios.post(`${HostName}/api/admin/login`, { username, password });
      console.log(response.data)
      const { success } = response.data;
      if (success) {
        window.location.reload();
        goodAlert('Success', 'Login successful');
      } else {
        badAlert('Login failed', response.data.message);
      }
    } catch (error) {
      badAlert('Login failed', 'Error');
      console.error('Error:', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default Login;