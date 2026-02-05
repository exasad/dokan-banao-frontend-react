import {useState, useEffect} from 'react';
import {Form, Input, Button, Card, Typography, message, ConfigProvider} from 'antd';
import {MailOutlined, LockOutlined} from '@ant-design/icons';
import {useNavigate, Navigate} from 'react-router-dom';
import {useAdminAuth} from '../../context/AdminAuthContext';

const {Title, Text} = Typography;

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const {login, isAuthenticated, isLoading} = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Login | Admin';
  }, []);

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to='/dashboard' replace />;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      message.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {colorPrimary: '#1677ff'},
      }}
    >
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0958d9 0%, #1677ff 100%)',
        }}
      >
        <Card
          style={{
            width: 420,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{textAlign: 'center', marginBottom: 32}}>
            <Title level={2} style={{margin: 0}}>
              Admin Panel
            </Title>
            <Text type='secondary'>Sign in to your store dashboard</Text>
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

export default AdminLogin;
