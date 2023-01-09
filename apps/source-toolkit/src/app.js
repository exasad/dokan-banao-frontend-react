import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import AppContextProvider from '@crema/context/AppContextProvider';
import AppThemeProvider from '@crema/context/AppThemeProvider';
import AppLocaleProvider from '@crema/context/AppLocaleProvider';
import AppAuthProvider from './core/AppAuthProvider';
import AuthRoutes from '@crema/components/AuthRoutes';
import configureStore from './toolkit/store';
import AppLayout from './core/AppLayout';
import '@crema/mockapi';
import { GlobalStyles } from './core/theme/GlobalStyle';
import { Normalize } from 'styled-normalize';

const store = configureStore();

const App = () => (
  <AppContextProvider>
    <Provider store={store}>
      <AppThemeProvider>
        <AppLocaleProvider>
          <BrowserRouter>
            <AppAuthProvider>
              <AuthRoutes>
                <GlobalStyles />
                <Normalize />
                <AppLayout />
              </AuthRoutes>
            </AppAuthProvider>
          </BrowserRouter>
        </AppLocaleProvider>
      </AppThemeProvider>
    </Provider>
  </AppContextProvider>
);

export default App;
