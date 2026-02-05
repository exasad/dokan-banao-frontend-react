import {useState, useEffect} from 'react';
import {
  Typography, Card, Form, Input, Switch, Button, Select, message, Spin, Row, Col,
  Divider, Space, Tag, Alert, ColorPicker,
} from 'antd';
import {
  ArrowLeftOutlined, SaveOutlined, FacebookOutlined, CheckCircleOutlined,
  CloseCircleOutlined, MessageOutlined, EyeOutlined, ShoppingOutlined,
  KeyOutlined, LockOutlined, CodeOutlined, BgColorsOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import adminAxios from '../../services/adminAxios';

const {Title, Text, Paragraph} = Typography;

const FacebookSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAxios.get('/settings/facebook');
        const formValues = {...res.data};
        formValues.fb_messenger_enabled = formValues.fb_messenger_enabled === '1';
        formValues.fb_pixel_enabled = formValues.fb_pixel_enabled === '1';
        formValues.fb_catalog_enabled = formValues.fb_catalog_enabled === '1';
        form.setFieldsValue(formValues);
      } catch {
        message.error('Failed to load Facebook settings');
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
      data.fb_messenger_enabled = data.fb_messenger_enabled ? '1' : '0';
      data.fb_pixel_enabled = data.fb_pixel_enabled ? '1' : '0';
      data.fb_catalog_enabled = data.fb_catalog_enabled ? '1' : '0';
      // Handle ColorPicker value
      if (data.fb_messenger_color && typeof data.fb_messenger_color === 'object') {
        data.fb_messenger_color = data.fb_messenger_color.toHexString();
      }
      await adminAxios.put('/settings/facebook', data);
      message.success('Facebook settings saved successfully');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error('Failed to save Facebook settings');
      }
    } finally {
      setSaving(false);
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
          <Title level={3} style={{margin: 0}}><FacebookOutlined style={{marginRight: 8, color: '#1877F2'}} />Facebook / Messenger</Title>
        </Space>
        <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving} size='large'>
          Save Settings
        </Button>
      </div>

      <Form form={form} layout='vertical'>
        <Row gutter={[24, 24]}>
          {/* Left Column */}
          <Col xs={24} lg={14}>

            {/* ── Messenger Chat Widget ── */}
            <Card
              style={{marginBottom: 24}}
              title={
                <Space>
                  <MessageOutlined style={{color: '#1877F2', fontSize: 18}} />
                  <Text strong style={{fontSize: 15}}>Messenger Chat Widget</Text>
                </Space>
              }
              extra={
                <Form.Item name='fb_messenger_enabled' valuePropName='checked' noStyle>
                  <Switch checkedChildren={<CheckCircleOutlined />} unCheckedChildren={<CloseCircleOutlined />} />
                </Form.Item>
              }
            >
              <Paragraph type='secondary' style={{marginBottom: 16}}>
                Embed a Facebook Messenger chat widget on your storefront so customers can message your page directly.
              </Paragraph>

              <Form.Item noStyle shouldUpdate={(prev, cur) => prev.fb_messenger_enabled !== cur.fb_messenger_enabled}>
                {({getFieldValue}) => {
                  if (!getFieldValue('fb_messenger_enabled')) {
                    return (
                      <div style={{textAlign: 'center', padding: '16px 0'}}>
                        <Text type='secondary'>Enable Messenger chat to configure settings</Text>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <Divider style={{margin: '0 0 16px'}} />
                      <Form.Item name='fb_page_id' label='Facebook Page ID'
                        rules={[{required: true, message: 'Page ID is required'}]}
                        extra='Your numeric Facebook Page ID (find it in Page Settings → About)'>
                        <Input prefix={<CodeOutlined />} placeholder='e.g. 123456789012345' />
                      </Form.Item>

                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item name='fb_messenger_color' label='Theme Color'
                            extra='Chat widget accent color'>
                            <Input prefix={<BgColorsOutlined />} placeholder='#1877F2' />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                          <Form.Item name='fb_messenger_locale' label='Locale'
                            extra='Language for the widget'>
                            <Select placeholder='Select locale' allowClear options={[
                              {value: 'en_US', label: 'English (US)'},
                              {value: 'bn_IN', label: 'Bengali (বাংলা)'},
                              {value: 'en_GB', label: 'English (UK)'},
                              {value: 'hi_IN', label: 'Hindi'},
                              {value: 'ar_AR', label: 'Arabic'},
                            ]} />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item name='fb_messenger_greeting' label='Greeting Text'
                        extra='Shown when customer opens the chat widget'>
                        <Input.TextArea rows={2} placeholder='Hi! How can we help you today?' maxLength={255} showCount />
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.Item>
            </Card>

            {/* ── Facebook Pixel ── */}
            <Card
              style={{marginBottom: 24}}
              title={
                <Space>
                  <EyeOutlined style={{color: '#1877F2', fontSize: 18}} />
                  <Text strong style={{fontSize: 15}}>Facebook Pixel</Text>
                </Space>
              }
              extra={
                <Form.Item name='fb_pixel_enabled' valuePropName='checked' noStyle>
                  <Switch checkedChildren={<CheckCircleOutlined />} unCheckedChildren={<CloseCircleOutlined />} />
                </Form.Item>
              }
            >
              <Paragraph type='secondary' style={{marginBottom: 16}}>
                Track visitor activity, conversions, and optimize your Facebook Ads campaigns with Pixel.
              </Paragraph>

              <Form.Item noStyle shouldUpdate={(prev, cur) => prev.fb_pixel_enabled !== cur.fb_pixel_enabled}>
                {({getFieldValue}) => {
                  if (!getFieldValue('fb_pixel_enabled')) {
                    return (
                      <div style={{textAlign: 'center', padding: '16px 0'}}>
                        <Text type='secondary'>Enable Facebook Pixel to configure tracking</Text>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <Divider style={{margin: '0 0 16px'}} />
                      <Form.Item name='fb_pixel_id' label='Pixel ID'
                        rules={[{required: true, message: 'Pixel ID is required'}]}
                        extra='Find your Pixel ID in Facebook Events Manager'>
                        <Input prefix={<CodeOutlined />} placeholder='e.g. 1234567890123456' />
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.Item>
            </Card>

            {/* ── Facebook Catalog ── */}
            <Card
              style={{marginBottom: 24}}
              title={
                <Space>
                  <ShoppingOutlined style={{color: '#1877F2', fontSize: 18}} />
                  <Text strong style={{fontSize: 15}}>Facebook Catalog Sync</Text>
                </Space>
              }
              extra={
                <Form.Item name='fb_catalog_enabled' valuePropName='checked' noStyle>
                  <Switch checkedChildren={<CheckCircleOutlined />} unCheckedChildren={<CloseCircleOutlined />} />
                </Form.Item>
              }
            >
              <Paragraph type='secondary' style={{marginBottom: 16}}>
                Sync your product catalog with Facebook Commerce Manager for Instagram Shopping and dynamic ads.
              </Paragraph>

              <Form.Item noStyle shouldUpdate={(prev, cur) => prev.fb_catalog_enabled !== cur.fb_catalog_enabled}>
                {({getFieldValue}) => {
                  if (!getFieldValue('fb_catalog_enabled')) {
                    return (
                      <div style={{textAlign: 'center', padding: '16px 0'}}>
                        <Text type='secondary'>Enable Catalog sync to configure credentials</Text>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <Divider style={{margin: '0 0 16px'}} />
                      <Form.Item name='fb_catalog_id' label='Catalog ID'
                        rules={[{required: true, message: 'Catalog ID is required'}]}
                        extra='From Facebook Commerce Manager → Catalog → Settings'>
                        <Input prefix={<CodeOutlined />} placeholder='e.g. 1234567890123456' />
                      </Form.Item>

                      <Form.Item name='fb_app_id' label='App ID'
                        rules={[{required: true, message: 'App ID is required'}]}
                        extra='From Facebook Developers → Your App → Settings → Basic'>
                        <Input prefix={<KeyOutlined />} placeholder='Enter Facebook App ID' />
                      </Form.Item>

                      <Form.Item name='fb_app_secret' label='App Secret'
                        rules={[{required: true, message: 'App Secret is required'}]}
                        extra='Keep this secret — never expose publicly'>
                        <Input.Password prefix={<LockOutlined />} placeholder='Enter Facebook App Secret' />
                      </Form.Item>

                      <Form.Item name='fb_access_token' label='Access Token'
                        rules={[{required: true, message: 'Access token is required'}]}
                        extra='A long-lived Page Access Token with catalog_management permission'>
                        <Input.Password prefix={<KeyOutlined />} placeholder='Enter long-lived access token' />
                      </Form.Item>
                    </div>
                  );
                }}
              </Form.Item>
            </Card>

            <div style={{textAlign: 'right'}}>
              <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving} size='large'>
                Save Facebook Settings
              </Button>
            </div>
          </Col>

          {/* Right Column — Guides & Tips */}
          <Col xs={24} lg={10}>

            {/* Why Facebook Matters */}
            <Card style={{marginBottom: 24}} size='small'>
              <Alert
                type='info'
                showIcon
                icon={<FacebookOutlined />}
                message='Why Facebook Integration?'
                description='In Bangladesh, over 90% of ecommerce orders originate from Facebook. Integrating Messenger chat, Pixel tracking, and Catalog sync is essential for reaching your customers where they are.'
              />
            </Card>

            {/* Messenger Setup Guide */}
            <Card title={<><MessageOutlined style={{marginRight: 8}} />Messenger Chat Setup</>} size='small' style={{marginBottom: 24}}>
              <Space direction='vertical' size={10} style={{width: '100%'}}>
                <div>
                  <Tag color='blue'>Step 1</Tag>
                  <Text style={{fontSize: 13}}>Go to your Facebook Page → Settings → Messaging.</Text>
                </div>
                <div>
                  <Tag color='blue'>Step 2</Tag>
                  <Text style={{fontSize: 13}}>Copy your <Text strong>Page ID</Text> from Page Settings → About (bottom of page).</Text>
                </div>
                <div>
                  <Tag color='blue'>Step 3</Tag>
                  <Text style={{fontSize: 13}}>Paste the Page ID here and enable the widget.</Text>
                </div>
                <div>
                  <Tag color='blue'>Step 4</Tag>
                  <Text style={{fontSize: 13}}>Whitelist your domain in Page Settings → Advanced Messaging → Whitelisted Domains.</Text>
                </div>
                <Divider style={{margin: '8px 0'}} />
                <Text type='secondary' style={{fontSize: 12}}>
                  The chat bubble will appear on the bottom-right of your storefront for logged-in Facebook users.
                </Text>
              </Space>
            </Card>

            {/* Pixel Setup Guide */}
            <Card title={<><EyeOutlined style={{marginRight: 8}} />Facebook Pixel Guide</>} size='small' style={{marginBottom: 24}}>
              <Space direction='vertical' size={10} style={{width: '100%'}}>
                <div>
                  <Tag color='green'>Step 1</Tag>
                  <Text style={{fontSize: 13}}>Go to <Text strong>Facebook Events Manager</Text> → Data Sources → Create Pixel.</Text>
                </div>
                <div>
                  <Tag color='green'>Step 2</Tag>
                  <Text style={{fontSize: 13}}>Copy the Pixel ID (numeric) and paste here.</Text>
                </div>
                <div>
                  <Tag color='green'>Step 3</Tag>
                  <Text style={{fontSize: 13}}>Events tracked automatically: <Text code>PageView</Text>, <Text code>ViewContent</Text>, <Text code>AddToCart</Text>, <Text code>Purchase</Text>.</Text>
                </div>
                <Divider style={{margin: '8px 0'}} />
                <Text type='secondary' style={{fontSize: 12}}>
                  Use the Facebook Pixel Helper Chrome extension to verify events are firing correctly.
                </Text>
              </Space>
            </Card>

            {/* Catalog Setup Guide */}
            <Card title={<><ShoppingOutlined style={{marginRight: 8}} />Catalog Sync Guide</>} size='small' style={{marginBottom: 24}}>
              <Space direction='vertical' size={10} style={{width: '100%'}}>
                <div>
                  <Tag color='purple'>Step 1</Tag>
                  <Text style={{fontSize: 13}}>Create a Facebook App at <Text strong>developers.facebook.com</Text>.</Text>
                </div>
                <div>
                  <Tag color='purple'>Step 2</Tag>
                  <Text style={{fontSize: 13}}>In Commerce Manager, create a Catalog and copy the Catalog ID.</Text>
                </div>
                <div>
                  <Tag color='purple'>Step 3</Tag>
                  <Text style={{fontSize: 13}}>Generate a long-lived Page Access Token with <Text code>catalog_management</Text> permission via the Graph API Explorer.</Text>
                </div>
                <div>
                  <Tag color='purple'>Step 4</Tag>
                  <Text style={{fontSize: 13}}>Enter App ID, App Secret, and Access Token here. Products will be synced to your Facebook/Instagram shop.</Text>
                </div>
              </Space>
            </Card>

            {/* Security Tips */}
            <Card title='Security Notes' size='small'>
              <Space direction='vertical' size={8} style={{width: '100%'}}>
                <Text style={{fontSize: 13}}><LockOutlined style={{marginRight: 6, color: '#52c41a'}} />App Secret and Access Token are stored encrypted.</Text>
                <Text style={{fontSize: 13}}><LockOutlined style={{marginRight: 6, color: '#52c41a'}} />Never share your App Secret publicly.</Text>
                <Text style={{fontSize: 13}}><LockOutlined style={{marginRight: 6, color: '#52c41a'}} />Use long-lived tokens — they expire after ~60 days.</Text>
                <Text style={{fontSize: 13}}><LockOutlined style={{marginRight: 6, color: '#52c41a'}} />Restrict your Facebook App to your domain only.</Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FacebookSettings;
