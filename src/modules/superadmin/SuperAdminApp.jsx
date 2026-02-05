import SuperAdminAuthProvider from './context/SuperAdminAuthProvider';
import SettingsProvider from './context/SettingsProvider';
import SuperAdminRoutes from './routes/SuperAdminRoutes';

const SuperAdminApp = () => {
  return (
    <SuperAdminAuthProvider>
      <SettingsProvider>
        <SuperAdminRoutes />
      </SettingsProvider>
    </SuperAdminAuthProvider>
  );
};

export default SuperAdminApp;
