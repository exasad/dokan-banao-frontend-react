import {createContext, useContext} from 'react';

export const AdminAuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  setUser: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);
