import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HostName } from '../util/HostName';

function Home() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetchUserCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      const response = await axios.get(`${HostName}/api/admin/user/count`,{withCredentials:true});
    
      if (response.data.ok) {
        setUserCount(response.data.count);
      }
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };


  return (
    <div>
      <h1>Welcome to the Admin Dashboard</h1>
      <p>Total Users: {userCount}</p>
    </div>
  );
}

export default Home