import {useState, useEffect, useCallback} from 'react';
import {SuperAdminAuthContext} from './SuperAdminAuthContext';
import superadminAxios from '../services/superadminAxios';

const SuperAdminAuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('superadmin_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await superadminAxios.get('/me');
      setUser(res.data);
    } catch {
      localStorage.removeItem('superadmin_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await superadminAxios.post('/login', {email, password});
    const {access_token, user: userData} = res.data;
    localStorage.setItem('superadmin_token', access_token);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await superadminAxios.post('/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('superadmin_token');
    setUser(null);
  };

  return (
    <SuperAdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </SuperAdminAuthContext.Provider>
  );
};

export default SuperAdminAuthProvider;
