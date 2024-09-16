import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { HostName } from './util/HostName';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const authenticateUser = async () => {
    try {          
        const authResponse = await axios.get(`${HostName}/api/admin/protected-route`, { withCredentials: true });
        if (authResponse.data.success) {
          const userResponse = await axios.get(`${HostName}/api/admin/user_info`, { withCredentials: true });
          if (userResponse.data.ok) {
            setUser(userResponse.data.user);
            setIsLogin(true);
          }
        } else {
          throw new Error('Authorization failed');
        }
    } catch (error) {
      console.error('Authentication error:', error);
      setIsLogin(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;