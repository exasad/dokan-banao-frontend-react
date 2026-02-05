import {useState} from 'react';
import {Layout, ConfigProvider, App, Spin} from 'antd';
import {Navigate, Outlet} from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import {useAdminAuth} from '../context/AdminAuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const {Content} = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {isAuthenticated, isLoading} = useAdminAuth();
  useDocumentTitle();

  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
        }}
      >
        <Spin size='large' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <App>
        <Layout style={{minHeight: '100vh'}}>
          <AdminSidebar collapsed={collapsed} />
          <Layout
            style={{
              marginLeft: collapsed ? 80 : 200,
              transition: 'margin-left 0.2s',
              background: '#f0f2f5',
            }}
          >
            <AdminHeader
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
            <Content
              style={{
                margin: 24,
                padding: 24,
                minHeight: 280,
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </App>
    </ConfigProvider>
  );
};

export default AdminLayout;
