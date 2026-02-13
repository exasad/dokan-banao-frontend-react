import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloudServerOutlined,
  LoadingOutlined, LockOutlined,
  MailOutlined,
  SaveOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form, Input,
  message,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Tag,
  Typography
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminAxios from '../../services/adminAxios';

const {Title, Text, Paragraph} = Typography;

const presets = [
  {label: 'Custom SMTP', value: 'custom', host: '', port: '587', encryption: 'tls'},
  {label: 'Gmail', value: 'gmail', host: 'smtp.gmail.com', port: '587', encryption: 'tls'},
  {label: 'Outlook / Hotmail', value: 'outlook', host: 'smtp.office365.com', port: '587', encryption: 'tls'},
  {label: 'Yahoo Mail', value: 'yahoo', host: 'smtp.mail.yahoo.com', port: '587', encryption: 'tls'},
  {label: 'Zoho Mail', value: 'zoho', host: 'smtp.zoho.com', port: '587', encryption: 'tls'},
  {label: 'SendGrid', value: 'sendgrid', host: 'smtp.sendgrid.net', port: '587', encryption: 'tls'},
  {label: 'Mailgun', value: 'mailgun', host: 'smtp.mailgun.org', port: '587', encryption: 'tls'},
  {label: 'Amazon SES', value: 'ses', host: 'email-smtp.us-east-1.amazonaws.com', port: '587', encryption: 'tls'},
  {label: 'Mailtrap (Testing)', value: 'mailtrap', host: 'sandbox.smtp.mailtrap.io', port: '2525', encryption: 'tls'},
  {label: 'Brevo (Sendinblue)', value: 'brevo', host: 'smtp-relay.brevo.com', port: '587', encryption: 'tls'},
  {label: 'Postmark', value: 'postmark', host: 'smtp.postmarkapp.com', port: '587', encryption: 'tls'},
  {label: 'Elastic Email', value: 'elasticemail', host: 'smtp.elasticemail.com', port: '2525', encryption: 'tls'},
];

const SmtpSettings = () => {
  const [form] = Form.useForm();
  const [testForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [notifSettings, setNotifSettings] = useState({
    email_order_confirmation: true,
    email_order_status_update: true,
    email_welcome: true,
    email_cart_abandonment: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAxios.get('/settings/smtp');
        form.setFieldsValue({
          smtp_host: res.data.smtp_host || '',
          smtp_port: res.data.smtp_port || '587',
          smtp_username: res.data.smtp_username || '',
          smtp_password: res.data.smtp_password || '',
          smtp_encryption: res.data.smtp_encryption || 'tls',
          smtp_from_address: res.data.smtp_from_address || '',
          smtp_from_name: res.data.smtp_from_name || '',
        });
        setNotifSettings({
          email_order_confirmation: res.data.email_order_confirmation !== '0',
          email_order_status_update: res.data.email_order_status_update !== '0',
          email_welcome: res.data.email_welcome !== '0',
          email_cart_abandonment: res.data.email_cart_abandonment === '1',
        });
      } catch {
        message.error('Failed to load SMTP settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [form]);

  const handlePreset = (value) => {
    const preset = presets.find((p) => p.value === value);
    if (preset && preset.value !== 'custom') {
      form.setFieldsValue({
        smtp_host: preset.host,
        smtp_port: preset.port,
        smtp_encryption: preset.encryption,
      });
    }
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await adminAxios.put('/settings/smtp', {
        ...values,
        email_order_confirmation: notifSettings.email_order_confirmation ? '1' : '0',
        email_order_status_update: notifSettings.email_order_status_update ? '1' : '0',
        email_welcome: notifSettings.email_welcome ? '1' : '0',
        email_cart_abandonment: notifSettings.email_cart_abandonment ? '1' : '0',
      });
      message.success('SMTP settings saved successfully');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error('Failed to save SMTP settings');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    const testValues = await testForm.validateFields();
    setTesting(true);
    setTestResult(null);
    try {
      const res = await adminAxios.post('/settings/smtp/test', testValues);
      setTestResult({status: 'success', message: res.data.message});
    } catch (err) {
      setTestResult({status: 'error', message: err.response?.data?.message || 'Failed to send test email'});
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12}}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/settings')} />
          <Title level={3} style={{margin: 0}}><MailOutlined style={{marginRight: 8}} />SMTP / Email Settings</Title>
        </Space>
        <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving} size='large'>
          Save Settings
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - SMTP Config */}
        <Col xs={24} lg={14}>
          <Card title={<><CloudServerOutlined style={{marginRight: 8}} />SMTP Configuration</>} style={{marginBottom: 24}}>
            {/* Preset Selector */}
            <div style={{marginBottom: 24}}>
              <Text strong style={{display: 'block', marginBottom: 8}}>Quick Setup</Text>
              <Select
                placeholder='Select email provider preset...'
                onChange={handlePreset}
                style={{width: '100%'}}
                options={presets.map((p) => ({value: p.value, label: p.label}))}
              />
              <Text type='secondary' style={{display: 'block', marginTop: 4, fontSize: 12}}>
                Select a provider to auto-fill host, port, and encryption. You still need to enter your credentials.
              </Text>
            </div>

            <Divider />

            <Form form={form} layout='vertical'>
              <Row gutter={16}>
                <Col xs={24} sm={16}>
                  <Form.Item name='smtp_host' label='SMTP Host' rules={[{required: true, message: 'Host is required'}]}>
                    <Input prefix={<CloudServerOutlined />} placeholder='smtp.gmail.com' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name='smtp_port' label='Port' rules={[{required: true, message: 'Port is required'}]}>
                    <Input placeholder='587' />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name='smtp_encryption' label='Encryption'>
                <Select options={[
                  {value: 'tls', label: 'TLS (Recommended)'},
                  {value: 'ssl', label: 'SSL'},
                  {value: 'none', label: 'None'},
                ]} />
              </Form.Item>

              <Divider orientation='left' style={{fontSize: 13}}>Authentication</Divider>

              <Form.Item name='smtp_username' label='Username' rules={[{required: true, message: 'Username is required'}]}>
                <Input prefix={<UserOutlined />} placeholder='your@email.com' />
              </Form.Item>

              <Form.Item name='smtp_password' label='Password' rules={[{required: true, message: 'Password is required'}]}>
                <Input.Password prefix={<LockOutlined />} placeholder='App password or SMTP password' />
              </Form.Item>

              <Divider orientation='left' style={{fontSize: 13}}>Sender Information</Divider>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name='smtp_from_address' label='From Email Address' rules={[{required: true, message: 'Required'}, {type: 'email', message: 'Invalid email'}]}>
                    <Input prefix={<MailOutlined />} placeholder='noreply@yoursite.com' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name='smtp_from_name' label='From Name' rules={[{required: true, message: 'Required'}]}>
                    <Input prefix={<UserOutlined />} placeholder='Your Store Name' />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* Email Notification Toggles */}
          <Card title='Email Notifications' style={{marginBottom: 24}}>
            <Space direction='vertical' size={16} style={{width: '100%'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <Text strong>Order Confirmation</Text>
                  <br /><Text type='secondary' style={{fontSize: 12}}>Send email when order is placed</Text>
                </div>
                <Switch checked={notifSettings.email_order_confirmation} onChange={(v) => setNotifSettings(p => ({...p, email_order_confirmation: v}))} />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <Text strong>Order Status Updates</Text>
                  <br /><Text type='secondary' style={{fontSize: 12}}>Send email when order status changes</Text>
                </div>
                <Switch checked={notifSettings.email_order_status_update} onChange={(v) => setNotifSettings(p => ({...p, email_order_status_update: v}))} />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <Text strong>Welcome Email</Text>
                  <br /><Text type='secondary' style={{fontSize: 12}}>Send email when customer registers</Text>
                </div>
                <Switch checked={notifSettings.email_welcome} onChange={(v) => setNotifSettings(p => ({...p, email_welcome: v}))} />
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <Text strong>Cart Abandonment</Text>
                  <br /><Text type='secondary' style={{fontSize: 12}}>Send reminder for abandoned carts</Text>
                </div>
                <Switch checked={notifSettings.email_cart_abandonment} onChange={(v) => setNotifSettings(p => ({...p, email_cart_abandonment: v}))} />
              </div>
            </Space>
          </Card>

          {/* Provider Tips */}
          <Card title='Provider Notes' size='small'>
            <Space direction='vertical' size={12} style={{width: '100%'}}>
              <div>
                <Tag color='red'>Gmail</Tag>
                <Text style={{fontSize: 13}}>Use an <Text strong>App Password</Text> instead of your account password. Enable 2FA first, then generate an app password from Google Account settings.</Text>
              </div>
              <div>
                <Tag color='blue'>SendGrid</Tag>
                <Text style={{fontSize: 13}}>Use <Text code>apikey</Text> as username and your API key as the password.</Text>
              </div>
              <div>
                <Tag color='orange'>Amazon SES</Tag>
                <Text style={{fontSize: 13}}>Use SMTP credentials (not IAM credentials). Generate them from SES console &gt; SMTP Settings.</Text>
              </div>
              <div>
                <Tag color='green'>Mailtrap</Tag>
                <Text style={{fontSize: 13}}>Great for testing. Emails are captured in your Mailtrap inbox instead of being delivered.</Text>
              </div>
              <div>
                <Tag color='purple'>Postmark</Tag>
                <Text style={{fontSize: 13}}>Use your Server API Token as both username and password.</Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Right Column - Test */}
        <Col xs={24} lg={10}>
          <Card
            title={<><SendOutlined style={{marginRight: 8}} />Send Test Email</>}
            style={{marginBottom: 24}}
          >
            <Paragraph type='secondary' style={{marginBottom: 16}}>
              Save your SMTP settings first, then send a test email to verify everything is working correctly.
            </Paragraph>

            <Form form={testForm} layout='vertical' onFinish={handleTest}>
              <Form.Item name='test_email' label='Recipient Email' rules={[{required: true, message: 'Enter an email'}, {type: 'email', message: 'Invalid email'}]}>
                <Input prefix={<MailOutlined />} placeholder='test@example.com' size='large' />
              </Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                icon={testing ? <LoadingOutlined /> : <SendOutlined />}
                loading={testing}
                block
                size='large'
              >
                {testing ? 'Sending...' : 'Send Test Email'}
              </Button>
            </Form>

            {testResult && (
              <div style={{marginTop: 16}}>
                {testResult.status === 'success' ? (
                  <Alert
                    type='success'
                    showIcon
                    icon={<CheckCircleOutlined />}
                    message='Test Successful'
                    description={testResult.message}
                  />
                ) : (
                  <Alert
                    type='error'
                    showIcon
                    message='Test Failed'
                    description={testResult.message}
                  />
                )}
              </div>
            )}
          </Card>

          {/* Common Ports Reference */}
          <Card title='Common SMTP Ports' size='small' style={{marginBottom: 24}}>
            <table style={{width: '100%', fontSize: 13}}>
              <thead>
                <tr style={{borderBottom: '1px solid #f0f0f0'}}>
                  <th style={{padding: '8px 0', textAlign: 'left'}}>Port</th>
                  <th style={{padding: '8px 0', textAlign: 'left'}}>Encryption</th>
                  <th style={{padding: '8px 0', textAlign: 'left'}}>Usage</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{borderBottom: '1px solid #f0f0f0'}}>
                  <td style={{padding: '8px 0'}}><Tag color='blue'>587</Tag></td>
                  <td>TLS (STARTTLS)</td>
                  <td><Text type='secondary'>Recommended</Text></td>
                </tr>
                <tr style={{borderBottom: '1px solid #f0f0f0'}}>
                  <td style={{padding: '8px 0'}}><Tag color='green'>465</Tag></td>
                  <td>SSL</td>
                  <td><Text type='secondary'>Legacy SSL</Text></td>
                </tr>
                <tr style={{borderBottom: '1px solid #f0f0f0'}}>
                  <td style={{padding: '8px 0'}}><Tag>25</Tag></td>
                  <td>None / TLS</td>
                  <td><Text type='secondary'>Unencrypted (not recommended)</Text></td>
                </tr>
                <tr>
                  <td style={{padding: '8px 0'}}><Tag color='orange'>2525</Tag></td>
                  <td>TLS</td>
                  <td><Text type='secondary'>Alternative (Mailtrap, etc.)</Text></td>
                </tr>
              </tbody>
            </table>
          </Card>

          {/* Security Tips */}
          <Card title='Security Tips' size='small'>
            <Space direction='vertical' size={8} style={{width: '100%'}}>
              <Text style={{fontSize: 13}}><LockOutlined style={{marginRight: 6, color: '#52c41a'}} />Always use TLS or SSL encryption</Text>
              <Text style={{fontSize: 13}}><LockOutlined style={{marginRight: 6, color: '#52c41a'}} />Use app-specific passwords when available</Text>
              <Text style={{fontSize: 13}}><LockOutlined style={{marginRight: 6, color: '#52c41a'}} />Never share SMTP credentials publicly</Text>
              <Text style={{fontSize: 13}}><LockOutlined style={{marginRight: 6, color: '#52c41a'}} />Rotate passwords periodically</Text>
              <Text style={{fontSize: 13}}><LockOutlined style={{marginRight: 6, color: '#52c41a'}} />Use dedicated sending domains for better deliverability</Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SmtpSettings;
