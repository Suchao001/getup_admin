import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, IconButton } from '@mui/material';
import { Home, Settings, Person, People, Menu, CheckCircle, CalendarToday, Image } from '@mui/icons-material';


import { Link } from 'react-router-dom';

function Sidenav({ pageName, children}) {
  const [open, setOpen] = useState(true);
  
  const menuItems = [
    { to: '/', icon: <Home />, text: 'Home' },
    { to: '/user', icon: <People />, text: 'User' },
    { to: '/manageIcon', icon: <CalendarToday />, text: 'Icon' },
    { to: '/manageHabit', icon: <CheckCircle />, text: 'Habit for Recommend' },
  ];
  

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const ListItemLink = ({ to, icon, text, selected }) => (
    <ListItem 
      button 
      component={Link} 
      to={to}
      sx={{
        backgroundColor: selected ? '#f0f0f0' : 'transparent',
        '&:hover': {
          backgroundColor: '#e0e0e0',
        },
      }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );

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
          {menuItems.map((menuItem) => (
            <ListItemLink 
              key={menuItem.to}
              to={menuItem.to}
              icon={menuItem.icon}
              text={menuItem.text}
              selected={pageName?.toLowerCase() === menuItem.to.split('/').pop()}
            />
          ))}
        </List>
      </Drawer>
      <Box sx={{ marginLeft: open ? '240px' : '60px', flexGrow: 1, p: 3, transition: 'margin-left 0.3s' }}>
        {children}
      </Box>
    </>
  );
}

export default Sidenav;