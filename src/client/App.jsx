import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Page from './Page.jsx';
import Login from './Login.jsx';
import Home from './pages/Home.jsx';
import User from './pages/User.jsx';
import ManageIcon from './pages/ManageIcon.jsx';
import ManageHabit from './pages/ManageHabit.jsx';

function App() {
  return (
      <Routes>
        <Route path="/" element={ <Page pageName={"Home"} children={<Home />}/>} />
        <Route path="/login" element={ <Login />} />
        <Route path="/home" element={ <Page pageName={"Home"} children={<Home />}/>} />
        <Route path="/user" element={ <Page pageName={"User"} children={<User />}/>} />
        <Route path="/manageIcon" element={ <Page pageName={"icon"} children={<ManageIcon />}/>} />
        <Route path="/manageHabit" element={ <Page pageName={"Habit for Recommend"} children={<ManageHabit />}/>} />
      </Routes>
  );
}
export default App