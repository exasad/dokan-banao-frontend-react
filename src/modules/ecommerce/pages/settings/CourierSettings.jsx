import {useState, useEffect} from 'react';
import {
  Typography, Card, Form, Input, Switch, Button, Select, message, Spin, Row, Col,
  Divider, Space, Tag, Collapse, Avatar, Badge,
} from 'antd';
import {
  ArrowLeftOutlined, SaveOutlined, ApiOutlined, CheckCircleOutlined,
  CloseCircleOutlined, LinkOutlined, KeyOutlined, UserOutlined, LockOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import adminAxios from '../../services/adminAxios';

const {Title, Text, Paragraph} = Typography;

const courierProviders = [
  {
    id: 'steadfast',
    name: 'Steadfast Courier',
    logo: 'S',
    color: '#e74c3c',
    description: 'Popular courier service in Bangladesh with API integration for order creation and tracking.',
    website: 'steadfast.com.bd',
    fields: [
      {key: 'steadfast_api_key', label: 'API Key', icon: <KeyOutlined />, placeholder: 'Enter Steadfast API key'},
      {key: 'steadfast_secret_key', label: 'Secret Key', icon: <LockOutlined />, placeholder: 'Enter Steadfast secret key', password: true},
      {key: 'steadfast_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://portal.steadfast.com.bd/api/v1'},
    ],
  },
  {
    id: 'pathao',
    name: 'Pathao Courier',
    logo: 'P',
    color: '#2ecc71',
    description: 'Pathao delivery service with OAuth2 authentication for parcel management.',
    website: 'pathao.com',
    fields: [
      {key: 'pathao_client_id', label: 'Client ID', icon: <KeyOutlined />, placeholder: 'Enter Pathao client ID'},
      {key: 'pathao_client_secret', label: 'Client Secret', icon: <LockOutlined />, placeholder: 'Enter Pathao client secret', password: true},
      {key: 'pathao_username', label: 'Username', icon: <UserOutlined />, placeholder: 'Enter Pathao username'},
      {key: 'pathao_password', label: 'Password', icon: <LockOutlined />, placeholder: 'Enter Pathao password', password: true},
      {key: 'pathao_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://api-hermes.pathao.com'},
    ],
  },
  {
    id: 'redx',
    name: 'RedX',
    logo: 'R',
    color: '#e74c3c',
    description: 'RedX logistics and delivery service with token-based API for parcel booking.',
    website: 'redx.com.bd',
    fields: [
      {key: 'redx_api_token', label: 'API Token', icon: <KeyOutlined />, placeholder: 'Enter RedX API token', password: true},
      {key: 'redx_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://openapi.redx.com.bd/v1.0.0-beta'},
    ],
  },
  {
    id: 'paperfly',
    name: 'Paperfly',
    logo: 'PF',
    color: '#3498db',
    description: 'Paperfly delivery with username/password authentication for order management.',
    website: 'paperfly.com.bd',
    fields: [
      {key: 'paperfly_username', label: 'Username', icon: <UserOutlined />, placeholder: 'Enter Paperfly username'},
      {key: 'paperfly_password', label: 'Password', icon: <LockOutlined />, placeholder: 'Enter Paperfly password', password: true},
      {key: 'paperfly_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://api.paperfly.com.bd'},
    ],
  },
  {
    id: 'ecourier',
    name: 'eCourier',
    logo: 'eC',
    color: '#f39c12',
    description: 'eCourier parcel delivery service with multi-key API authentication.',
    website: 'ecourier.com.bd',
    fields: [
      {key: 'ecourier_user_id', label: 'User ID', icon: <UserOutlined />, placeholder: 'Enter eCourier user ID'},
      {key: 'ecourier_api_key', label: 'API Key', icon: <KeyOutlined />, placeholder: 'Enter eCourier API key'},
      {key: 'ecourier_api_secret', label: 'API Secret', icon: <LockOutlined />, placeholder: 'Enter eCourier API secret', password: true},
      {key: 'ecourier_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://backoffice.ecourier.com.bd/api'},
    ],
  },
  {
    id: 'sundorban',
    name: 'Sundorban Courier',
    logo: 'SC',
    color: '#1abc9c',
    description: 'Sundorban Courier Service - one of the oldest courier services in Bangladesh.',
    website: 'sundorbancourierservice.com',
    fields: [
      {key: 'sundorban_api_key', label: 'API Key', icon: <KeyOutlined />, placeholder: 'Enter Sundorban API key', password: true},
      {key: 'sundorban_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://api.sundorbancourier.com'},
    ],
  },
  {
    id: 'sa_paribahan',
    name: 'SA Paribahan',
    logo: 'SA',
    color: '#9b59b6',
    description: 'SA Paribahan courier and logistics service across Bangladesh.',
    website: 'saparibahan.com',
    fields: [
      {key: 'sa_paribahan_api_key', label: 'API Key', icon: <KeyOutlined />, placeholder: 'Enter SA Paribahan API key', password: true},
      {key: 'sa_paribahan_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://api.saparibahan.com'},
    ],
  },
  {
    id: 'dhl',
    name: 'DHL Express',
    logo: 'DHL',
    color: '#ffcc00',
    description: 'International courier service - DHL Express for cross-border deliveries.',
    website: 'dhl.com',
    fields: [
      {key: 'dhl_api_key', label: 'API Key', icon: <KeyOutlined />, placeholder: 'Enter DHL API key', password: true},
      {key: 'dhl_account_number', label: 'Account Number', icon: <UserOutlined />, placeholder: 'Enter DHL account number'},
      {key: 'dhl_base_url', label: 'Base URL', icon: <LinkOutlined />, placeholder: 'https://express.api.dhl.com/mydhlapi'},
    ],
  },
];

const CourierSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAxios.get('/settings/couriers');
        setSettings(res.data);
        const formValues = {...res.data};
        // Convert enabled flags to booleans
        courierProviders.forEach((p) => {
          const key = `${p.id}_enabled`;
          formValues[key] = formValues[key] === '1';
        });
        form.setFieldsValue(formValues);
      } catch {
        message.error('Failed to load courier settings');
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
      // Convert enabled booleans to '1'/'0'
      const data = {...values};
      courierProviders.forEach((p) => {
        const key = `${p.id}_enabled`;
        data[key] = data[key] ? '1' : '0';
      });
      const res = await adminAxios.put('/settings/couriers', data);
      setSettings(res.data);
      message.success('Courier settings saved successfully');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error('Failed to save courier settings');
      }
    } finally {
      setSaving(false);
    }
  };

  const isEnabled = (providerId) => {
    const val = form.getFieldValue(`${providerId}_enabled`);
    return val === true || val === '1';
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;
  }

  const enabledCount = courierProviders.filter((p) => settings[`${p.id}_enabled`] === '1').length;

  const defaultCourierOptions = courierProviders
    .filter((p) => settings[`${p.id}_enabled`] === '1' || form.getFieldValue(`${p.id}_enabled`) === true)
    .map((p) => ({value: p.id, label: p.name}));

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12}}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/settings')} />
          <Title level={3} style={{margin: 0}}><ApiOutlined style={{marginRight: 8}} />Courier Integration</Title>
          <Badge count={enabledCount} style={{backgroundColor: '#52c41a'}} />
        </Space>
        <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving} size='large'>
          Save Settings
        </Button>
      </div>

      <Form form={form} layout='vertical'>
        {/* Default Courier */}
        <Card style={{marginBottom: 24}}>
          <Row align='middle' gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name='default_courier' label='Default Courier' style={{marginBottom: 0}}
                extra='This courier will be pre-selected when creating or editing orders'>
                <Select allowClear placeholder='Select default courier' options={defaultCourierOptions} style={{width: '100%'}} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Text type='secondary'>
                {enabledCount} of {courierProviders.length} couriers enabled
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Courier Cards */}
        <Row gutter={[24, 24]}>
          {courierProviders.map((provider) => {
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
                            <Text type='secondary'>Enable this courier to configure API credentials</Text>
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
            Save Courier Settings
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CourierSettings;
