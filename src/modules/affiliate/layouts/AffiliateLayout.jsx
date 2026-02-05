import {useState} from 'react';
import {Layout, ConfigProvider, App, Spin} from 'antd';
import {Navigate, Outlet} from 'react-router-dom';
import AffiliateSidebar from './AffiliateSidebar';
import AffiliateHeader from './AffiliateHeader';
import {useAffiliateAuth} from '../context/AffiliateAuthContext';

const {Content} = Layout;

const AffiliateLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {isAuthenticated, isLoading} = useAffiliateAuth();

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
    return <Navigate to='/affiliate/login' replace />;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#13c2c2',
          borderRadius: 6,
        },
      }}
    >
      <App>
        <Layout style={{minHeight: '100vh'}}>
          <AffiliateSidebar collapsed={collapsed} />
          <Layout
            style={{
              marginLeft: collapsed ? 80 : 200,
              transition: 'margin-left 0.2s',
              background: '#f0f2f5',
            }}
          >
            <AffiliateHeader
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

export default AffiliateLayout;
