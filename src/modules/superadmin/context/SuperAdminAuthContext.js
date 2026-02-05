import {createContext, useContext} from 'react';

export const SuperAdminAuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const useSuperAdminAuth = () => useContext(SuperAdminAuthContext);
