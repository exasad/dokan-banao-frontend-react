import AdminAuthProvider from './context/AdminAuthProvider';
import AdminRoutes from './routes/AdminRoutes';

const AdminApp = () => {
  return (
    <AdminAuthProvider>
      <AdminRoutes />
    </AdminAuthProvider>
  );
};

export default AdminApp;
