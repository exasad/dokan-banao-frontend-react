import {createContext, useContext} from 'react';

export const AffiliateAuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAffiliateAuth = () => useContext(AffiliateAuthContext);
