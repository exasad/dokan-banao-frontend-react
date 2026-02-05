import {useState, useEffect} from 'react';
import {Layout, ConfigProvider, App, Spin, Drawer} from 'antd';
import {Navigate, Outlet} from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import {useAdminAuth} from '../context/AdminAuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const {Content} = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const {isAuthenticated, isLoading} = useAdminAuth();
  useDocumentTitle();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

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
          {/* Desktop Sidebar */}
          {!isMobile && (
            <AdminSidebar
              collapsed={collapsed}
              onMenuClick={handleMenuClick}
            />
          )}

          {/* Mobile Drawer */}
          {isMobile && (
            <Drawer
              placement='left'
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              width={250}
              styles={{
                body: {padding: 0, background: '#001529'},
                header: {display: 'none'},
              }}
            >
              <AdminSidebar
                collapsed={false}
                isMobile={true}
                onMenuClick={handleMenuClick}
              />
            </Drawer>
          )}

          <Layout
            style={{
              marginLeft: isMobile ? 0 : (collapsed ? 80 : 200),
              transition: 'margin-left 0.2s',
              background: '#f0f2f5',
            }}
          >
            <AdminHeader
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              isMobile={isMobile}
              onMobileMenuClick={() => setMobileOpen(true)}
            />
            <Content
              style={{
                margin: isMobile ? 12 : 24,
                padding: isMobile ? 16 : 24,
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
