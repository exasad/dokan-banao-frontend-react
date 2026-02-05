import {useState, useEffect} from 'react';
import {
  Typography, Card, Form, Input, Switch, Button, Select, message, Spin, Row, Col,
  Divider, Space, Tag, Avatar, Badge, Checkbox,
} from 'antd';
import {
  ArrowLeftOutlined, SaveOutlined, CreditCardOutlined, CheckCircleOutlined,
  CloseCircleOutlined, LinkOutlined, KeyOutlined, UserOutlined, LockOutlined,
  BankOutlined, WalletOutlined, DollarOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import adminAxios from '../../services/adminAxios';

const {Title, Text, Paragraph} = Typography;

const paymentProviders = [
  {
    id: 'bkash',
    name: 'bKash',
    logo: 'b',
    color: '#E2136E',
    category: 'Mobile Banking',
    description: 'bKash is the largest mobile financial service in Bangladesh. Supports tokenized checkout for seamless payment.',
    website: 'bkash.com',
    fields: [
      {key: 'bkash_app_key', label: 'App Key', icon: <KeyOutlined />, placeholder: 'Enter bKash app key'},
      {key: 'bkash_app_secret', label: 'App Secret', icon: <LockOutlined />, placeholder: 'Enter bKash app secret', password: true},
      {key: 'bkash_username', label: 'Username', icon: <UserOutlined />, placeholder: 'Enter bKash username'},
      {key: 'bkash_password', label: 'Password', icon: <LockOutlined />, placeholder: 'Enter bKash password', password: true},
    ],
    hasSandbox: true,
  },
  {
    id: 'nagad',
    name: 'Nagad',
    logo: 'N',
    color: '#F6921E',
    category: 'Mobile Banking',
    description: 'Nagad is a digital financial service by Bangladesh Post Office. Supports merchant payment API.',
    website: 'nagad.com.bd',
    fields: [
      {key: 'nagad_merchant_id', label: 'Merchant ID', icon: <KeyOutlined />, placeholder: 'Enter Nagad merchant ID'},
      {key: 'nagad_merchant_number', label: 'Merchant Number', icon: <UserOutlined />, placeholder: '01XXXXXXXXX'},
      {key: 'nagad_public_key', label: 'Public Key', icon: <KeyOutlined />, placeholder: 'Enter Nagad public key'},
      {key: 'nagad_private_key', label: 'Private Key', icon: <LockOutlined />, placeholder: 'Enter Nagad private key', password: true},
    ],
    hasSandbox: true,
  },
  {
    id: 'rocket',
    name: 'Rocket (DBBL)',
    logo: 'R',
    color: '#8B2F8B',
    category: 'Mobile Banking',
    description: 'Rocket by Dutch-Bangla Bank - mobile banking service with merchant payment API.',
    website: 'dutchbanglabank.com',
    fields: [
      {key: 'rocket_merchant_id', label: 'Merchant ID', icon: <KeyOutlined />, placeholder: 'Enter Rocket merchant ID'},
      {key: 'rocket_merchant_password', label: 'Merchant Password', icon: <LockOutlined />, placeholder: 'Enter Rocket merchant password', password: true},
    ],
    hasSandbox: true,
  },
  {
    id: 'upay',
    name: 'Upay',
    logo: 'U',
    color: '#00A651',
    category: 'Mobile Banking',
    description: 'Upay digital payment by United Commercial Bank. Merchant API for online payments.',
    website: 'upaybd.com',
    fields: [
      {key: 'upay_merchant_id', label: 'Merchant ID', icon: <KeyOutlined />, placeholder: 'Enter Upay merchant ID'},
      {key: 'upay_merchant_key', label: 'Merchant Key', icon: <LockOutlined />, placeholder: 'Enter Upay merchant key', password: true},
      {key: 'upay_merchant_code', label: 'Merchant Code', icon: <KeyOutlined />, placeholder: 'Enter Upay merchant code'},
    ],
    hasSandbox: true,
  },
  {
    id: 'mycash',
    name: 'MyCash',
    logo: 'MC',
    color: '#0072BC',
    category: 'Mobile Banking',
    description: 'MyCash online payment gateway for merchants in Bangladesh.',
    website: 'mycash.com.bd',
    fields: [
      {key: 'mycash_merchant_id', label: 'Merchant ID', icon: <KeyOutlined />, placeholder: 'Enter MyCash merchant ID'},
      {key: 'mycash_merchant_key', label: 'Merchant Key', icon: <LockOutlined />, placeholder: 'Enter MyCash merchant key', password: true},
    ],
    hasSandbox: true,
  },
  {
    id: 'sslcommerz',
    name: 'SSLCommerz',
    logo: 'SSL',
    color: '#2B3990',
    category: 'Payment Gateway',
    description: 'SSLCommerz is the largest payment gateway in Bangladesh. Supports cards, mobile banking, and internet banking.',
    website: 'sslcommerz.com',
    fields: [
      {key: 'sslcommerz_store_id', label: 'Store ID', icon: <KeyOutlined />, placeholder: 'Enter SSLCommerz store ID'},
      {key: 'sslcommerz_store_password', label: 'Store Password', icon: <LockOutlined />, placeholder: 'Enter SSLCommerz store password', password: true},
    ],
    hasSandbox: true,
  },
  {
    id: 'aamarpay',
    name: 'aamarPay',
    logo: 'aP',
    color: '#FF6B00',
    category: 'Payment Gateway',
    description: 'aamarPay payment gateway - supports Visa, Mastercard, bKash, Nagad, Rocket, and internet banking.',
    website: 'aamarpay.com',
    fields: [
      {key: 'aamarpay_store_id', label: 'Store ID', icon: <KeyOutlined />, placeholder: 'Enter aamarPay store ID'},
      {key: 'aamarpay_signature_key', label: 'Signature Key', icon: <LockOutlined />, placeholder: 'Enter aamarPay signature key', password: true},
    ],
    hasSandbox: true,
  },
  {
    id: 'shurjopay',
    name: 'ShurjoPay',
    logo: 'SP',
    color: '#E31E24',
    category: 'Payment Gateway',
    description: 'ShurjoPay - leading online payment gateway in Bangladesh with multi-channel support.',
    website: 'shurjopay.com.bd',
    fields: [
      {key: 'shurjopay_username', label: 'Username', icon: <UserOutlined />, placeholder: 'Enter ShurjoPay username'},
      {key: 'shurjopay_password', label: 'Password', icon: <LockOutlined />, placeholder: 'Enter ShurjoPay password', password: true},
      {key: 'shurjopay_prefix', label: 'Order Prefix', icon: <KeyOutlined />, placeholder: 'e.g. SP'},
    ],
    hasSandbox: true,
  },
  {
    id: 'portwallet',
    name: 'PortWallet',
    logo: 'PW',
    color: '#1A237E',
    category: 'Payment Gateway',
    description: 'PortWallet online payment gateway with card, MFS, and bank transfer support.',
    website: 'portwallet.com',
    fields: [
      {key: 'portwallet_app_key', label: 'App Key', icon: <KeyOutlined />, placeholder: 'Enter PortWallet app key'},
      {key: 'portwallet_secret_key', label: 'Secret Key', icon: <LockOutlined />, placeholder: 'Enter PortWallet secret key', password: true},
    ],
    hasSandbox: true,
  },
  {
    id: 'ekpay',
    name: 'EkPay',
    logo: 'EK',
    color: '#00BCD4',
    category: 'Payment Gateway',
    description: 'EkPay payment aggregator supporting multiple banks and MFS in Bangladesh.',
    website: 'ekpay.gov.bd',
    fields: [
      {key: 'ekpay_merchant_id', label: 'Merchant ID', icon: <KeyOutlined />, placeholder: 'Enter EkPay merchant ID'},
      {key: 'ekpay_merchant_key', label: 'Merchant Key', icon: <LockOutlined />, placeholder: 'Enter EkPay merchant key', password: true},
    ],
    hasSandbox: true,
  },
  {
    id: 'tap',
    name: 'Tap Payments',
    logo: 'T',
    color: '#2ACE80',
    category: 'Payment Gateway',
    description: 'Tap Payments - international payment gateway with Visa/Mastercard support for cross-border payments.',
    website: 'tap.company',
    fields: [
      {key: 'tap_merchant_id', label: 'Merchant ID', icon: <KeyOutlined />, placeholder: 'Enter Tap merchant ID'},
      {key: 'tap_api_key', label: 'API Key', icon: <LockOutlined />, placeholder: 'Enter Tap API key', password: true},
    ],
    hasSandbox: true,
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    logo: '৳',
    color: '#607D8B',
    category: 'Manual',
    description: 'Accept cash payment when the order is delivered to the customer.',
    website: '',
    fields: [],
    hasSandbox: false,
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    logo: <BankOutlined />,
    color: '#37474F',
    category: 'Manual',
    description: 'Accept payment via direct bank transfer. Bank details will be shown to customer after checkout.',
    website: '',
    fields: [
      {key: 'bank_name', label: 'Bank Name', icon: <BankOutlined />, placeholder: 'e.g. Dutch-Bangla Bank Ltd.'},
      {key: 'bank_account_name', label: 'Account Name', icon: <UserOutlined />, placeholder: 'Account holder name'},
      {key: 'bank_account_number', label: 'Account Number', icon: <KeyOutlined />, placeholder: 'Enter account number'},
      {key: 'bank_branch', label: 'Branch', icon: <BankOutlined />, placeholder: 'e.g. Motijheel Branch'},
      {key: 'bank_routing_number', label: 'Routing Number', icon: <KeyOutlined />, placeholder: 'Enter routing number'},
    ],
    hasSandbox: false,
  },
];

const categories = ['Mobile Banking', 'Payment Gateway', 'Manual'];

const PaymentSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAxios.get('/settings/payments');
        setSettings(res.data);
        const formValues = {...res.data};
        paymentProviders.forEach((p) => {
          const key = `${p.id}_enabled`;
          formValues[key] = formValues[key] === '1';
          if (p.hasSandbox) {
            const sbKey = `${p.id}_sandbox`;
            formValues[sbKey] = formValues[sbKey] === '1';
          }
        });
        form.setFieldsValue(formValues);
      } catch {
        message.error('Failed to load payment settings');
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
      paymentProviders.forEach((p) => {
        const key = `${p.id}_enabled`;
        data[key] = data[key] ? '1' : '0';
        if (p.hasSandbox) {
          const sbKey = `${p.id}_sandbox`;
          data[sbKey] = data[sbKey] ? '1' : '0';
        }
      });
      const res = await adminAxios.put('/settings/payments', data);
      setSettings(res.data);
      message.success('Payment settings saved successfully');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error('Failed to save payment settings');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;
  }

  const enabledCount = paymentProviders.filter((p) => settings[`${p.id}_enabled`] === '1').length;

  const defaultOptions = paymentProviders
    .filter((p) => settings[`${p.id}_enabled`] === '1' || form.getFieldValue(`${p.id}_enabled`) === true)
    .map((p) => ({value: p.id, label: p.name}));

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12}}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/settings')} />
          <Title level={3} style={{margin: 0}}><CreditCardOutlined style={{marginRight: 8}} />Payment Gateways</Title>
          <Badge count={enabledCount} style={{backgroundColor: '#52c41a'}} />
        </Space>
        <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving} size='large'>
          Save Settings
        </Button>
      </div>

      <Form form={form} layout='vertical'>
        {/* Default Payment Gateway */}
        <Card style={{marginBottom: 24}}>
          <Row align='middle' gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name='default_payment_gateway' label='Default Payment Gateway' style={{marginBottom: 0}}
                extra='This payment method will be pre-selected at checkout'>
                <Select allowClear placeholder='Select default payment gateway' options={defaultOptions} style={{width: '100%'}} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Text type='secondary'>
                {enabledCount} of {paymentProviders.length} payment methods enabled
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Providers by category */}
        {categories.map((category) => {
          const providers = paymentProviders.filter((p) => p.category === category);
          return (
            <div key={category}>
              <Divider orientation='left' style={{fontSize: 16, fontWeight: 600}}>
                {category === 'Mobile Banking' && <WalletOutlined style={{marginRight: 8}} />}
                {category === 'Payment Gateway' && <CreditCardOutlined style={{marginRight: 8}} />}
                {category === 'Manual' && <DollarOutlined style={{marginRight: 8}} />}
                {category}
              </Divider>
              <Row gutter={[24, 24]} style={{marginBottom: 24}}>
                {providers.map((provider) => {
                  const enabledKey = `${provider.id}_enabled`;
                  const sandboxKey = `${provider.id}_sandbox`;
                  return (
                    <Col xs={24} lg={12} key={provider.id}>
                      <Card
                        style={{height: '100%'}}
                        title={
                          <Space>
                            <Avatar size={36} style={{backgroundColor: provider.color, fontWeight: 700, fontSize: typeof provider.logo === 'string' && provider.logo.length > 2 ? 10 : 14}}>
                              {provider.logo}
                            </Avatar>
                            <div>
                              <Text strong style={{fontSize: 15}}>{provider.name}</Text>
                              {provider.website && <div><Text type='secondary' style={{fontSize: 11}}>{provider.website}</Text></div>}
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
                                  <Text type='secondary'>Enable this payment method to configure</Text>
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
                                {provider.hasSandbox && (
                                  <Form.Item name={sandboxKey} valuePropName='checked' style={{marginBottom: 0}}>
                                    <Checkbox>
                                      <Space>
                                        Sandbox / Test Mode
                                        <Tag color='orange' style={{fontSize: 11}}>TEST</Tag>
                                      </Space>
                                    </Checkbox>
                                  </Form.Item>
                                )}
                              </div>
                            );
                          }}
                        </Form.Item>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          );
        })}

        <div style={{textAlign: 'right', marginTop: 8}}>
          <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving} size='large'>
            Save Payment Settings
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PaymentSettings;
