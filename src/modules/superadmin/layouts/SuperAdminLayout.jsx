import {useState, useEffect} from 'react';
import {Layout, ConfigProvider, App, theme, Spin, Drawer} from 'antd';
import {Navigate, Outlet} from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminHeader from './SuperAdminHeader';
import {useSuperAdminAuth} from '../context/SuperAdminAuthContext';
import {useSettings} from '../context/SettingsContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const {Content} = Layout;

const SuperAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const {isAuthenticated, isLoading} = useSuperAdminAuth();
  const {getSetting} = useSettings();
  useDocumentTitle();

  const isDark = getSetting('appearance', 'default_theme', 'light') === 'dark';
  const primaryColor = getSetting('appearance', 'primary_color', '#1668dc');
  const compact = getSetting('appearance', 'compact_mode', 'false') === 'true';
  const sidebarColor = getSetting('appearance', 'sidebar_color', '#001529');

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
          background: isDark ? '#0a0a0a' : '#f5f5f5',
        }}
      >
        <Spin size='large' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/superadmin/login' replace />;
  }

  const algorithms = [isDark ? theme.darkAlgorithm : theme.defaultAlgorithm];
  if (compact) algorithms.push(theme.compactAlgorithm);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: algorithms,
        token: {
          colorPrimary: primaryColor,
          borderRadius: 6,
        },
      }}
    >
      <App>
        <Layout style={{minHeight: '100vh'}}>
          {/* Desktop Sidebar */}
          {!isMobile && (
            <SuperAdminSidebar
              collapsed={collapsed}
              isDark={isDark}
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
                body: {padding: 0, background: sidebarColor},
                header: {display: 'none'},
              }}
            >
              <SuperAdminSidebar
                collapsed={false}
                isDark={isDark}
                isMobile={true}
                onMenuClick={handleMenuClick}
              />
            </Drawer>
          )}

          <Layout
            style={{
              marginLeft: isMobile ? 0 : (collapsed ? 80 : 200),
              transition: 'margin-left 0.2s',
              background: isDark ? '#141414' : '#f0f2f5',
            }}
          >
            <SuperAdminHeader
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              isDark={isDark}
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

export default SuperAdminLayout;
