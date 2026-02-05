import {createContext, useContext} from 'react';

export const SettingsContext = createContext({
  settings: {},
  isLoading: true,
  refreshSettings: async () => {},
  getSetting: () => null,
});

export const useSettings = () => useContext(SettingsContext);
