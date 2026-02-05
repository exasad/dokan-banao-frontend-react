import {useState, useEffect} from 'react';
import {Form, Input, Button, Card, Typography, message, ConfigProvider, theme} from 'antd';
import {MailOutlined, LockOutlined} from '@ant-design/icons';
import {useNavigate, Navigate} from 'react-router-dom';
import {useSuperAdminAuth} from '../../context/SuperAdminAuthContext';
import {useSettings} from '../../context/SettingsContext';

const {Title, Text} = Typography;

const SuperAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const {login, isAuthenticated, isLoading} = useSuperAdminAuth();
  const {getSetting} = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Login | Super Admin';
  }, []);

  const isDark = getSetting('appearance', 'default_theme', 'light') === 'dark';
  const primaryColor = getSetting('appearance', 'primary_color', '#1668dc');
  const siteTitle = getSetting('branding', 'site_title', 'SuperAdmin');
  const siteDescription = getSetting('branding', 'site_description', 'Sign in to your account');
  const siteLogo = getSetting('branding', 'site_logo', null);

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to='/superadmin/dashboard' replace />;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful');
      navigate('/superadmin/dashboard');
    } catch (err) {
      message.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {colorPrimary: primaryColor},
      }}
    >
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDark
            ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Card
          style={{
            width: 420,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{textAlign: 'center', marginBottom: 32}}>
            {siteLogo ? (
              <img
                src={siteLogo}
                alt='Logo'
                style={{height: 48, marginBottom: 16, objectFit: 'contain'}}
              />
            ) : null}
            <Title level={2} style={{margin: 0}}>
              {siteTitle}
            </Title>
            <Text type='secondary'>{siteDescription}</Text>
          </div>
          <Form layout='vertical' onFinish={onFinish} autoComplete='off'>
            <Form.Item
              name='email'
              rules={[
                {required: true, message: 'Please enter your email'},
                {type: 'email', message: 'Please enter a valid email'},
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder='Email'
                size='large'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[{required: true, message: 'Please enter your password'}]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Password'
                size='large'
              />
            </Form.Item>
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                block
                size='large'
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default SuperAdminLogin;
