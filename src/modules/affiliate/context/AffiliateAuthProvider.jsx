import {useState, useEffect, useCallback} from 'react';
import {AffiliateAuthContext} from './AffiliateAuthContext';
import affiliateAxios from '../services/affiliateAxios';

const AffiliateAuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('affiliate_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await affiliateAxios.get('/me');
      setUser(res.data);
    } catch {
      localStorage.removeItem('affiliate_token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await affiliateAxios.post('/login', {email, password});
    const {access_token, user: userData} = res.data;
    localStorage.setItem('affiliate_token', access_token);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try {
      await affiliateAxios.post('/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('affiliate_token');
    setUser(null);
  };

  return (
    <AffiliateAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AffiliateAuthContext.Provider>
  );
};

export default AffiliateAuthProvider;
