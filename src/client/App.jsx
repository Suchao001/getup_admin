import React from 'react';
import { Routes,Route} from 'react-router-dom';
import Page from './Page.jsx';
import Login from './Login.jsx';
import Home from '../pages/Home.jsx';
import User from '../pages/User.jsx';
function App() {
  return (
      <Routes>
        <Route path="/" element={ <Page pageName={"Home"} children={<Home />}/>} />
        <Route path="/login" element={ <Login />} />
        <Route path="/home" element={ <Page pageName={"Home"} children={<Home />}/>} />
        <Route path="/user" element={ <Page pageName={"User"} children={<User />}/>} />
      </Routes>
  );
}
export default App