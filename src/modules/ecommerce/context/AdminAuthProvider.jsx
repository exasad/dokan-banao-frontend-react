import {useState, useEffect, useCallback} from 'react';
import {AdminAuthContext} from './AdminAuthContext';
import adminAxios from '../services/adminAxios';

const AdminAuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await adminAxios.get('/me');
      setUser(res.data);
    } catch {
      localStorage.removeItem('admin_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await adminAxios.post('/login', {email, password});
    const {access_token, user: userData} = res.data;
    localStorage.setItem('admin_token', access_token);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await adminAxios.post('/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
