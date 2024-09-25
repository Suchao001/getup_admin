import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Box, IconButton, Tooltip, Divider } from '@mui/material';
import { Home, Settings, People, Menu, CheckCircle, CalendarToday, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(4px)',
  },
  transition: theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme, open }) => ({
  minWidth: 0,
  marginRight: open ? theme.spacing(3) : 'auto',
  justifyContent: 'center',
}));

function Sidenav({ pageName, children }) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { to: '/', icon: <Home />, text: 'Home' },
    { to: '/user', icon: <People />, text: 'User' },
    { to: '/manageIcon', icon: <CalendarToday />, text: 'Icon' },
    { to: '/manageHabit', icon: <CheckCircle />, text: 'Habit for Recommend' },
    
  ];

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const ListItemLink = ({ to, icon, text }) => {
    const active = location.pathname === to;
    return (
      <Tooltip title={!open ? text : ''} placement="right" arrow>
        <StyledListItem
          button
          component={Link}
          to={to}
          active={active ? 1 : 0}
        >
          <StyledListItemIcon open={open}>
            {React.cloneElement(icon, { color: active ? 'secondary' : 'inherit' })}
          </StyledListItemIcon>
          <ListItemText 
            primary={text} 
            sx={{ 
              opacity: open ? 1 : 0,
              color: active ? theme.palette.secondary.main : 'inherit',
              fontWeight: active ? 'bold' : 'normal',
            }} 
          />
        </StyledListItem>
      </Tooltip>
    );
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer variant="permanent" open={open}>
        <DrawerHeader>
          {open && (
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, ml: 2 }}>
              Admin Panel
            </Typography>
          )}
          <IconButton onClick={toggleDrawer}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((menuItem) => (
            <ListItemLink 
              key={menuItem.to}
              to={menuItem.to}
              icon={menuItem.icon}
              text={menuItem.text}
            />
          ))}
        </List>
      </StyledDrawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}

export default Sidenav;