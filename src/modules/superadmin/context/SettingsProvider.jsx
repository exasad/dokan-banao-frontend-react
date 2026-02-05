import {useState, useEffect, useCallback} from 'react';
import {SettingsContext} from './SettingsContext';
import superadminAxios from '../services/superadminAxios';

const SettingsProvider = ({children}) => {
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await superadminAxios.get('/settings');
      setSettings(res.data);
    } catch {
      // ignore - settings will use defaults
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('superadmin_token');
    if (token) {
      fetchSettings();
    } else {
      setIsLoading(false);
    }
  }, [fetchSettings]);

  const getSetting = useCallback(
    (group, key, defaultValue = null) => {
      return settings?.[group]?.[key] ?? defaultValue;
    },
    [settings],
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: fetchSettings,
        getSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
