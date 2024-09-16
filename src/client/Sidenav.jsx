import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, IconButton } from '@mui/material';
import { Home, Settings, Person, People, Menu } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Sidenav({pageName, children}) {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
        edge="start"
        sx={{
          marginRight: 2,
          ...(open && { display: 'none' }),
        }}
      >
        <Menu />
      </IconButton>
      <Drawer
        variant="permanent"
        anchor="left"
        open={open}
        sx={{
          width: open ? 240 : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? 240 : 60,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: 'width 0.3s',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
          {open && (
            <Typography variant="h6" noWrap component="div">
              Admin Panel
            </Typography>
          )}
          <IconButton onClick={toggleDrawer}>
            <Menu />
          </IconButton>
        </Box>
        <List>
          <ListItem 
            button 
            component={Link} 
            to="/home"
            sx={{
              backgroundColor: pageName?.toLowerCase() === 'home' ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            {open && <ListItemText primary="Home" />}
          </ListItem>
          <ListItem 
            button 
            component={Link} 
            to="/user"
            sx={{
              backgroundColor: pageName?.toLowerCase() === 'user' ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            <ListItemIcon>
              <People />
            </ListItemIcon>
            {open && <ListItemText primary="User" />}
          </ListItem>
          <ListItem 
            button 
            component={Link} 
            to="/profile"
            sx={{
              backgroundColor: pageName?.toLowerCase() === 'profile' ? '#f0f0f0' : 'transparent',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            {open && <ListItemText primary="Profile" />}
          </ListItem>
        </List>
      </Drawer>
      <Box sx={{ marginLeft: open ? '240px' : '60px', flexGrow: 1, p: 3, transition: 'margin-left 0.3s' }}>
        {children}
      </Box>
    </>
  );
}

export default Sidenav;