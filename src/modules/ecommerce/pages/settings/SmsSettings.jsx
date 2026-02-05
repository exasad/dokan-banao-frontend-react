import {useState, useEffect} from 'react';
import {
  Typography, Card, Form, Input, Switch, Button, Select, message, Spin, Row, Col,
  Divider, Space, Tag, Avatar, Badge, Alert,
} from 'antd';
import {
  ArrowLeftOutlined, SaveOutlined, MessageOutlined, CheckCircleOutlined,
  CloseCircleOutlined, LinkOutlined, KeyOutlined, SendOutlined,
  LoadingOutlined, PhoneOutlined, UserOutlined, LockOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import adminAxios from '../../services/adminAxios';

const {Title, Text, Paragraph} = Typography;

const smsProviders = [
  {
    id: 'bulksmsbd',
    name: 'BulkSMSBD',
    logo: 'BS',
    color: '#e74c3c',
    description: 'Popular bulk SMS provider in Bangladesh with simple API integration.',
    website: 'bulksmsbd.net',
    fields: [
      {key: 'bulksmsbd_api_key', label: 'API Key', icon: <KeyOutlined />, placeholder: 'Enter BulkSMSBD API key', password: true},
      {key: 'bulksmsbd_sender_id', label: 'Sender ID', icon: <UserOutlined />, placeholder: 'Enter sender ID'},
      {key: 'bulksmsbd_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://bulksmsbd.net/api'},
    ],
  },
  {
    id: 'sslwireless',
    name: 'SSL Wireless',
    logo: 'SSL',
    color: '#2ecc71',
    description: 'Enterprise SMS gateway by SSL Wireless with high delivery rate in Bangladesh.',
    website: 'sslwireless.com',
    fields: [
      {key: 'sslwireless_api_token', label: 'API Token', icon: <KeyOutlined />, placeholder: 'Enter SSL Wireless API token', password: true},
      {key: 'sslwireless_sid', label: 'SID', icon: <UserOutlined />, placeholder: 'Enter SSL Wireless SID'},
      {key: 'sslwireless_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://smsplus.sslwireless.com/api/v3'},
    ],
  },
  {
    id: 'alfa',
    name: 'Alfa SMS',
    logo: 'A',
    color: '#3498db',
    description: 'Alfa SMS gateway for reliable messaging services in Bangladesh.',
    website: 'alfa.com.bd',
    fields: [
      {key: 'alfa_api_key', label: 'API Key', icon: <KeyOutlined />, placeholder: 'Enter Alfa API key', password: true},
      {key: 'alfa_sender_id', label: 'Sender ID', icon: <UserOutlined />, placeholder: 'Enter sender ID'},
      {key: 'alfa_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://api.alfa.com.bd/api/v1'},
    ],
  },
  {
    id: 'muthofun',
    name: 'Muthofun SMS',
    logo: 'M',
    color: '#9b59b6',
    description: 'Muthofun SMS gateway for bulk and transactional messaging in BD.',
    website: 'muthofun.com',
    fields: [
      {key: 'muthofun_api_key', label: 'API Key', icon: <KeyOutlined />, placeholder: 'Enter Muthofun API key', password: true},
      {key: 'muthofun_sender_id', label: 'Sender ID', icon: <UserOutlined />, placeholder: 'Enter sender ID'},
      {key: 'muthofun_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://api.muthofun.com/api/v1'},
    ],
  },
  {
    id: 'teletalk',
    name: 'Teletalk SMS',
    logo: 'T',
    color: '#1abc9c',
    description: 'Teletalk — state-owned telecom operator SMS gateway in Bangladesh.',
    website: 'teletalk.com.bd',
    fields: [
      {key: 'teletalk_api_key', label: 'API Key', icon: <KeyOutlined />, placeholder: 'Enter Teletalk API key', password: true},
      {key: 'teletalk_sender_id', label: 'Sender ID', icon: <UserOutlined />, placeholder: 'Enter sender ID'},
      {key: 'teletalk_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://api.teletalk.com.bd/api/v1'},
    ],
  },
  {
    id: 'infobip',
    name: 'Infobip',
    logo: 'iB',
    color: '#f39c12',
    description: 'Global omnichannel communication platform with SMS API support.',
    website: 'infobip.com',
    fields: [
      {key: 'infobip_api_key', label: 'API Key', icon: <KeyOutlined />, placeholder: 'Enter Infobip API key', password: true},
      {key: 'infobip_sender_id', label: 'Sender ID', icon: <UserOutlined />, placeholder: 'Enter sender ID'},
      {key: 'infobip_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://api.infobip.com'},
    ],
  },
  {
    id: 'twilio',
    name: 'Twilio',
    logo: 'Tw',
    color: '#e91e63',
    description: 'Global cloud communication platform — SMS, voice, and more.',
    website: 'twilio.com',
    fields: [
      {key: 'twilio_account_sid', label: 'Account SID', icon: <UserOutlined />, placeholder: 'Enter Twilio Account SID'},
      {key: 'twilio_auth_token', label: 'Auth Token', icon: <LockOutlined />, placeholder: 'Enter Twilio Auth Token', password: true},
      {key: 'twilio_from_number', label: 'From Number', icon: <PhoneOutlined />, placeholder: '+1234567890'},
    ],
  },
  {
    id: 'elitbuzz',
    name: 'Elitbuzz SMS',
    logo: 'EB',
    color: '#ff9800',
    description: 'Elitbuzz bulk SMS service for Bangladesh with affordable rates.',
    website: 'elitbuzz-bd.com',
    fields: [
      {key: 'elitbuzz_api_key', label: 'API Key', icon: <KeyOutlined />, placeholder: 'Enter Elitbuzz API key', password: true},
      {key: 'elitbuzz_sender_id', label: 'Sender ID', icon: <UserOutlined />, placeholder: 'Enter sender ID'},
      {key: 'elitbuzz_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://msg.elitbuzz-bd.com/smsapi'},
    ],
  },
];

const SmsSettings = () => {
  const [form] = Form.useForm();
  const [testForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [settings, setSettings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAxios.get('/settings/sms');
        setSettings(res.data);
        const formValues = {...res.data};
        smsProviders.forEach((p) => {
          const key = `${p.id}_enabled`;
          formValues[key] = formValues[key] === '1';
        });
        form.setFieldsValue(formValues);
      } catch {
        message.error('Failed to load SMS settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [form]);

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const data = {...values};
      smsProviders.forEach((p) => {
        const key = `${p.id}_enabled`;
        data[key] = data[key] ? '1' : '0';
      });
      const res = await adminAxios.put('/settings/sms', data);
      setSettings(res.data);
      message.success('SMS settings saved successfully');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error('Failed to save SMS settings');
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
      const res = await adminAxios.post('/settings/sms/test', testValues);
      setTestResult({status: 'success', message: res.data.message});
    } catch (err) {
      setTestResult({status: 'error', message: err.response?.data?.message || 'Failed to send test SMS'});
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;
  }

  const enabledCount = smsProviders.filter((p) => settings[`${p.id}_enabled`] === '1').length;

  const defaultProviderOptions = smsProviders
    .filter((p) => settings[`${p.id}_enabled`] === '1' || form.getFieldValue(`${p.id}_enabled`) === true)
    .map((p) => ({value: p.id, label: p.name}));

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12}}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/settings')} />
          <Title level={3} style={{margin: 0}}><MessageOutlined style={{marginRight: 8}} />SMS Gateway</Title>
          <Badge count={enabledCount} style={{backgroundColor: '#52c41a'}} />
        </Space>
        <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving} size='large'>
          Save Settings
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Provider Config */}
        <Col xs={24} lg={14}>
          <Form form={form} layout='vertical'>
            {/* Default SMS Provider */}
            <Card style={{marginBottom: 24}}>
              <Row align='middle' gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name='default_sms_provider' label='Default SMS Provider' style={{marginBottom: 0}}
                    extra='This provider will be used for sending OTP and transactional SMS'>
                    <Select allowClear placeholder='Select default SMS provider' options={defaultProviderOptions} style={{width: '100%'}} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Text type='secondary'>
                    {enabledCount} of {smsProviders.length} providers enabled
                  </Text>
                </Col>
              </Row>
            </Card>

            {/* Provider Cards */}
            <Row gutter={[24, 24]}>
              {smsProviders.map((provider) => {
                const enabledKey = `${provider.id}_enabled`;
                return (
                  <Col xs={24} lg={12} key={provider.id}>
                    <Card
                      style={{height: '100%'}}
                      title={
                        <Space>
                          <Avatar size={36} style={{backgroundColor: provider.color, fontWeight: 700, fontSize: provider.logo.length > 2 ? 11 : 14}}>
                            {provider.logo}
                          </Avatar>
                          <div>
                            <Text strong style={{fontSize: 15}}>{provider.name}</Text>
                            <div><Text type='secondary' style={{fontSize: 11}}>{provider.website}</Text></div>
                          </div>
                        </Space>
                      }
                      extra={
                        <Form.Item name={enabledKey} valuePropName='checked' noStyle>
                          <Switch checkedChildren={<CheckCircleOutlined />} unCheckedChildren={<CloseCircleOutlined />} />
                        </Form.Item>
                      }
                    >
                      <Paragraph type='secondary' style={{fontSize: 13, marginBottom: 16}}>{provider.description}</Paragraph>

                      <Form.Item noStyle shouldUpdate={(prev, cur) => prev[enabledKey] !== cur[enabledKey]}>
                        {({getFieldValue}) => {
                          const enabled = getFieldValue(enabledKey);
                          if (!enabled) {
                            return (
                              <div style={{textAlign: 'center', padding: '16px 0'}}>
                                <Text type='secondary'>Enable this provider to configure credentials</Text>
                              </div>
                            );
                          }
                          return (
                            <div>
                              <Divider style={{margin: '0 0 16px'}} />
                              {provider.fields.map((field) => (
                                <Form.Item key={field.key} name={field.key} label={field.label} style={{marginBottom: 12}}>
                                  {field.password ? (
                                    <Input.Password prefix={field.icon} placeholder={field.placeholder} />
                                  ) : (
                                    <Input prefix={field.icon} placeholder={field.placeholder} />
                                  )}
                                </Form.Item>
                              ))}
                            </div>
                          );
                        }}
                      </Form.Item>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            <div style={{marginTop: 24, textAlign: 'right'}}>
              <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving} size='large'>
                Save SMS Settings
              </Button>
            </div>
          </Form>
        </Col>

        {/* Right Column - Test SMS + Tips */}
        <Col xs={24} lg={10}>
          <Card
            title={<><SendOutlined style={{marginRight: 8}} />Send Test SMS</>}
            style={{marginBottom: 24}}
          >
            <Paragraph type='secondary' style={{marginBottom: 16}}>
              Save your SMS settings first, then send a test SMS to verify the provider is working correctly.
            </Paragraph>

            <Form form={testForm} layout='vertical' onFinish={handleTest}>
              <Form.Item name='test_phone' label='Phone Number' rules={[{required: true, message: 'Enter a phone number'}]}
                extra='BD format: 01XXXXXXXXX or 8801XXXXXXXXX'>
                <Input prefix={<PhoneOutlined />} placeholder='01XXXXXXXXX' size='large' />
              </Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                icon={testing ? <LoadingOutlined /> : <SendOutlined />}
                loading={testing}
                block
                size='large'
              >
                {testing ? 'Sending...' : 'Send Test SMS'}
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

          {/* BD Phone Format Tips */}
          <Card title='BD Phone Format' size='small' style={{marginBottom: 24}}>
            <table style={{width: '100%', fontSize: 13}}>
              <thead>
                <tr style={{borderBottom: '1px solid #f0f0f0'}}>
                  <th style={{padding: '8px 0', textAlign: 'left'}}>Input</th>
                  <th style={{padding: '8px 0', textAlign: 'left'}}>Sent As</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{borderBottom: '1px solid #f0f0f0'}}>
                  <td style={{padding: '8px 0'}}><Tag>01XXXXXXXXX</Tag></td>
                  <td>8801XXXXXXXXX</td>
                </tr>
                <tr style={{borderBottom: '1px solid #f0f0f0'}}>
                  <td style={{padding: '8px 0'}}><Tag color='blue'>+8801XXXXXXXXX</Tag></td>
                  <td>8801XXXXXXXXX</td>
                </tr>
                <tr>
                  <td style={{padding: '8px 0'}}><Tag color='green'>8801XXXXXXXXX</Tag></td>
                  <td>8801XXXXXXXXX (no change)</td>
                </tr>
              </tbody>
            </table>
            <Text type='secondary' style={{display: 'block', marginTop: 8, fontSize: 12}}>
              Phone numbers are automatically normalized to international format before sending.
            </Text>
          </Card>

          {/* Provider Notes */}
          <Card title='Provider Notes' size='small'>
            <Space direction='vertical' size={12} style={{width: '100%'}}>
              <div>
                <Tag color='red'>BulkSMSBD</Tag>
                <Text style={{fontSize: 13}}>Register at bulksmsbd.net to get your API key and sender ID. Supports masking.</Text>
              </div>
              <div>
                <Tag color='green'>SSL Wireless</Tag>
                <Text style={{fontSize: 13}}>Enterprise-grade. Contact SSL Wireless for API token and SID credentials.</Text>
              </div>
              <div>
                <Tag color='pink'>Twilio</Tag>
                <Text style={{fontSize: 13}}>International provider. Use Account SID + Auth Token from your Twilio console. Requires a purchased phone number.</Text>
              </div>
              <div>
                <Tag color='orange'>Infobip</Tag>
                <Text style={{fontSize: 13}}>Use the API key from your Infobip dashboard. Base URL varies by account region.</Text>
              </div>
              <div>
                <Tag color='volcano'>Elitbuzz</Tag>
                <Text style={{fontSize: 13}}>Affordable BD SMS gateway. Get API key from elitbuzz-bd.com dashboard.</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SmsSettings;
