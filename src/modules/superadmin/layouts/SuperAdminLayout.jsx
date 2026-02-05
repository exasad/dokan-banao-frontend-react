import {useState} from 'react';
import {Layout, ConfigProvider, App, theme, Spin} from 'antd';
import {Navigate, Outlet} from 'react-router-dom';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminHeader from './SuperAdminHeader';
import {useSuperAdminAuth} from '../context/SuperAdminAuthContext';
import {useSettings} from '../context/SettingsContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const {Content} = Layout;

const SuperAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {isAuthenticated, isLoading} = useSuperAdminAuth();
  const {getSetting} = useSettings();
  useDocumentTitle();

  const isDark = getSetting('appearance', 'default_theme', 'light') === 'dark';
  const primaryColor = getSetting('appearance', 'primary_color', '#1668dc');
  const compact = getSetting('appearance', 'compact_mode', 'false') === 'true';

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
          <SuperAdminSidebar collapsed={collapsed} isDark={isDark} />
          <Layout
            style={{
              marginLeft: collapsed ? 80 : 200,
              transition: 'margin-left 0.2s',
              background: isDark ? '#141414' : '#f0f2f5',
            }}
          >
            <SuperAdminHeader
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              isDark={isDark}
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

export default SuperAdminLayout;
