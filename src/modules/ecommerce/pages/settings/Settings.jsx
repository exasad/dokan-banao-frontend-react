import {useState, useEffect} from 'react';
import {
  Typography, Card, Form, Input, Switch, Button, Upload, message, Image, Space, Spin, Row, Col, Divider, Radio, Tooltip,
} from 'antd';
import {
  UploadOutlined, DeleteOutlined, SaveOutlined, SettingOutlined, GiftOutlined, NotificationOutlined, BgColorsOutlined, CheckCircleFilled,
} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';

const {Title, Text} = Typography;
const {TextArea} = Input;

// Theme configurations for preview
const THEMES = [
  { id: 'default', name: 'Default', desc: 'Modern indigo design', primary: '#4f46e5', bg: '#ffffff', text: '#111827' },
  { id: 'gadget', name: 'Gadget', desc: 'Dark tech theme', primary: '#00d4ff', bg: '#0f172a', text: '#f1f5f9' },
  { id: 'fashion', name: 'Fashion', desc: 'Elegant pink theme', primary: '#be185d', bg: '#fffbfc', text: '#1f2937' },
  { id: 'grocery', name: 'Grocery', desc: 'Fresh green theme', primary: '#16a34a', bg: '#ffffff', text: '#14532d' },
  { id: 'luxury', name: 'Luxury', desc: 'Premium dark gold', primary: '#d4af37', bg: '#0a0a0a', text: '#fafafa' },
  { id: 'kids', name: 'Kids', desc: 'Fun colorful theme', primary: '#f97316', bg: '#fffbeb', text: '#1c1917' },
  { id: 'minimal', name: 'Minimal', desc: 'Ultra-clean design', primary: '#171717', bg: '#ffffff', text: '#171717' },
  { id: 'beauty', name: 'Beauty', desc: 'Soft pink theme', primary: '#ec4899', bg: '#fefefe', text: '#1f2937' },
  { id: 'sports', name: 'Sports', desc: 'Dynamic red theme', primary: '#dc2626', bg: '#ffffff', text: '#0f172a' },
  { id: 'ocean', name: 'Ocean', desc: 'Calming blue theme', primary: '#0891b2', bg: '#f0fdff', text: '#164e63' },
];

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [faviconUrl, setFaviconUrl] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [removeFavicon, setRemoveFavicon] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('default');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAxios.get('/settings');
        form.setFieldsValue({
          site_title: res.data.site_title || '',
          site_description: res.data.site_description || '',
          enable_guest_checkout: res.data.enable_guest_checkout === '1',
          theme: res.data.theme || 'default',
          announcement_enabled: res.data.announcement_enabled === '1',
          announcement_text: res.data.announcement_text || 'Free delivery on orders over ৳1,000 | Cash on Delivery Available',
          feature_1_title: res.data.feature_1_title || 'Free Shipping',
          feature_1_desc: res.data.feature_1_desc || 'On orders over ৳1,000',
          feature_2_title: res.data.feature_2_title || 'Secure Payment',
          feature_2_desc: res.data.feature_2_desc || 'Safe online payments',
          feature_3_title: res.data.feature_3_title || 'Easy Returns',
          feature_3_desc: res.data.feature_3_desc || '7-day return policy',
          feature_4_title: res.data.feature_4_title || '24/7 Support',
          feature_4_desc: res.data.feature_4_desc || 'Contact us anytime',
        });
        setLogoUrl(res.data.logo || null);
        setFaviconUrl(res.data.favicon || null);
        setSelectedTheme(res.data.theme || 'default');
      } catch {
        message.error('Failed to load settings');
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
      const formData = new FormData();
      formData.append('site_title', values.site_title || '');
      formData.append('site_description', values.site_description || '');
      formData.append('enable_guest_checkout', values.enable_guest_checkout ? '1' : '0');
      formData.append('theme', selectedTheme || 'default');
      formData.append('feature_1_title', values.feature_1_title || '');
      formData.append('feature_1_desc', values.feature_1_desc || '');
      formData.append('feature_2_title', values.feature_2_title || '');
      formData.append('feature_2_desc', values.feature_2_desc || '');
      formData.append('feature_3_title', values.feature_3_title || '');
      formData.append('feature_3_desc', values.feature_3_desc || '');
      formData.append('feature_4_title', values.feature_4_title || '');
      formData.append('feature_4_desc', values.feature_4_desc || '');
      formData.append('announcement_enabled', values.announcement_enabled ? '1' : '0');
      formData.append('announcement_text', values.announcement_text || '');

      if (logoFile) formData.append('logo', logoFile);
      if (faviconFile) formData.append('favicon', faviconFile);
      if (removeLogo) formData.append('remove_logo', '1');
      if (removeFavicon) formData.append('remove_favicon', '1');

      formData.append('_method', 'PUT');

      const res = await adminAxios.post('/settings', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      setLogoUrl(res.data.logo || null);
      setFaviconUrl(res.data.favicon || null);
      setLogoFile(null);
      setFaviconFile(null);
      setRemoveLogo(false);
      setRemoveFavicon(false);
      message.success('Settings saved successfully');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error('Failed to save settings');
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
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
        <Title level={3} style={{margin: 0}}><SettingOutlined style={{marginRight: 8}} />Settings</Title>
        <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving} size='large'>
          Save Settings
        </Button>
      </div>

      <Form form={form} layout='vertical'>
        <Row gutter={[24, 24]}>
          {/* Left Column - General Settings */}
          <Col xs={24} lg={14}>
            <Card title='General Settings' style={{marginBottom: 24}}>
              <Form.Item name='site_title' label='Site Title' rules={[{required: true, message: 'Site title is required'}]}>
                <Input placeholder='Enter your site title' size='large' />
              </Form.Item>
              <Form.Item name='site_description' label='Site Description'>
                <TextArea rows={4} placeholder='Brief description of your site...' showCount maxLength={1000} />
              </Form.Item>
            </Card>

            <Card title='Checkout Settings' style={{marginBottom: 24}}>
              <Form.Item name='enable_guest_checkout' label='Enable Guest Checkout' valuePropName='checked'
                extra='Allow customers to place orders without creating an account'>
                <Switch checkedChildren='Enabled' unCheckedChildren='Disabled' />
              </Form.Item>
            </Card>

            <Card title={<><BgColorsOutlined style={{marginRight: 8}} />Storefront Theme</>} style={{marginBottom: 24}}>
              <Text type='secondary' style={{display: 'block', marginBottom: 16}}>
                Choose a theme for your storefront. Each theme is designed for different store types.
              </Text>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12}}>
                {THEMES.map((theme) => (
                  <Tooltip key={theme.id} title={theme.desc}>
                    <div
                      onClick={() => setSelectedTheme(theme.id)}
                      style={{
                        cursor: 'pointer',
                        border: selectedTheme === theme.id ? '2px solid #1677ff' : '1px solid #d9d9d9',
                        borderRadius: 8,
                        padding: 8,
                        transition: 'all 0.2s',
                        position: 'relative',
                        background: selectedTheme === theme.id ? '#f0f5ff' : '#fff',
                      }}
                    >
                      {selectedTheme === theme.id && (
                        <CheckCircleFilled style={{position: 'absolute', top: 6, right: 6, color: '#1677ff', fontSize: 16}} />
                      )}
                      <div style={{
                        height: 60,
                        borderRadius: 4,
                        marginBottom: 8,
                        background: theme.bg,
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}>
                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                          <div style={{width: 24, height: 24, borderRadius: 4, background: theme.primary}} />
                          <div style={{width: 40, height: 6, borderRadius: 2, background: theme.text, opacity: 0.7}} />
                        </div>
                      </div>
                      <Text strong style={{fontSize: 12, display: 'block', textAlign: 'center'}}>{theme.name}</Text>
                    </div>
                  </Tooltip>
                ))}
              </div>
            </Card>

            <Card title={<><NotificationOutlined style={{marginRight: 8}} />Announcement Bar</>} style={{marginBottom: 24}}>
              <Text type='secondary' style={{display: 'block', marginBottom: 16}}>
                Configure the announcement bar displayed at the top of your storefront.
              </Text>
              <Form.Item name='announcement_enabled' label='Enable Announcement Bar' valuePropName='checked'
                extra='Show/hide the announcement bar on storefront'>
                <Switch checkedChildren='Enabled' unCheckedChildren='Disabled' />
              </Form.Item>
              <Form.Item name='announcement_text' label='Announcement Text'
                extra='The message displayed in the announcement bar'>
                <Input placeholder='e.g. Free delivery on orders over ৳1,000 | Cash on Delivery Available' size='large' />
              </Form.Item>
            </Card>

            <Card title={<><GiftOutlined style={{marginRight: 8}} />Storefront Features</>}>
              <Text type='secondary' style={{display: 'block', marginBottom: 16}}>
                These features are displayed on the storefront home page footer section.
              </Text>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name='feature_1_title' label='Feature 1 Title'>
                    <Input placeholder='e.g. Free Shipping' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='feature_1_desc' label='Feature 1 Description'>
                    <Input placeholder='e.g. On orders over ৳1,000' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name='feature_2_title' label='Feature 2 Title'>
                    <Input placeholder='e.g. Secure Payment' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='feature_2_desc' label='Feature 2 Description'>
                    <Input placeholder='e.g. Safe online payments' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name='feature_3_title' label='Feature 3 Title'>
                    <Input placeholder='e.g. Easy Returns' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='feature_3_desc' label='Feature 3 Description'>
                    <Input placeholder='e.g. 7-day return policy' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name='feature_4_title' label='Feature 4 Title'>
                    <Input placeholder='e.g. 24/7 Support' />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='feature_4_desc' label='Feature 4 Description'>
                    <Input placeholder='e.g. Contact us anytime' />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column - Branding */}
          <Col xs={24} lg={10}>
            <Card title='Logo' style={{marginBottom: 24}}>
              {(logoUrl && !removeLogo) ? (
                <div style={{marginBottom: 16}}>
                  <div style={{border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, textAlign: 'center', background: '#fafafa', marginBottom: 12}}>
                    <Image src={logoUrl} style={{maxHeight: 120, objectFit: 'contain'}} preview={false} />
                  </div>
                  <Space>
                    <Upload
                      beforeUpload={(file) => { setLogoFile(file); setRemoveLogo(false); return false; }}
                      showUploadList={false} accept='image/*'
                    >
                      <Button icon={<UploadOutlined />} size='small'>Change Logo</Button>
                    </Upload>
                    <Button icon={<DeleteOutlined />} size='small' danger onClick={() => { setRemoveLogo(true); setLogoFile(null); }}>
                      Remove
                    </Button>
                  </Space>
                </div>
              ) : logoFile ? (
                <div style={{marginBottom: 16}}>
                  <div style={{border: '1px dashed #1677ff', borderRadius: 8, padding: 16, textAlign: 'center', background: '#f0f5ff', marginBottom: 12}}>
                    <Image src={URL.createObjectURL(logoFile)} style={{maxHeight: 120, objectFit: 'contain'}} preview={false} />
                  </div>
                  <Text type='secondary' style={{fontSize: 12}}>New logo selected - save to apply</Text>
                  <div style={{marginTop: 8}}>
                    <Button size='small' onClick={() => setLogoFile(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Upload.Dragger
                  beforeUpload={(file) => { setLogoFile(file); setRemoveLogo(false); return false; }}
                  showUploadList={false} accept='image/*'
                  style={{marginBottom: 0}}
                >
                  <p style={{marginBottom: 8}}><UploadOutlined style={{fontSize: 24, color: '#999'}} /></p>
                  <p style={{margin: 0, color: '#666'}}>Click or drag logo image here</p>
                  <p style={{margin: 0, fontSize: 12, color: '#999'}}>JPG, PNG, SVG, WebP (max 2MB)</p>
                </Upload.Dragger>
              )}
            </Card>

            <Card title='Favicon'>
              {(faviconUrl && !removeFavicon) ? (
                <div style={{marginBottom: 16}}>
                  <div style={{border: '1px solid #f0f0f0', borderRadius: 8, padding: 16, textAlign: 'center', background: '#fafafa', marginBottom: 12}}>
                    <Image src={faviconUrl} style={{maxHeight: 64, objectFit: 'contain'}} preview={false} />
                  </div>
                  <Space>
                    <Upload
                      beforeUpload={(file) => { setFaviconFile(file); setRemoveFavicon(false); return false; }}
                      showUploadList={false} accept='image/*,.ico'
                    >
                      <Button icon={<UploadOutlined />} size='small'>Change Favicon</Button>
                    </Upload>
                    <Button icon={<DeleteOutlined />} size='small' danger onClick={() => { setRemoveFavicon(true); setFaviconFile(null); }}>
                      Remove
                    </Button>
                  </Space>
                </div>
              ) : faviconFile ? (
                <div style={{marginBottom: 16}}>
                  <div style={{border: '1px dashed #1677ff', borderRadius: 8, padding: 16, textAlign: 'center', background: '#f0f5ff', marginBottom: 12}}>
                    <Image src={URL.createObjectURL(faviconFile)} style={{maxHeight: 64, objectFit: 'contain'}} preview={false} />
                  </div>
                  <Text type='secondary' style={{fontSize: 12}}>New favicon selected - save to apply</Text>
                  <div style={{marginTop: 8}}>
                    <Button size='small' onClick={() => setFaviconFile(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Upload.Dragger
                  beforeUpload={(file) => { setFaviconFile(file); setRemoveFavicon(false); return false; }}
                  showUploadList={false} accept='image/*,.ico'
                  style={{marginBottom: 0}}
                >
                  <p style={{marginBottom: 8}}><UploadOutlined style={{fontSize: 24, color: '#999'}} /></p>
                  <p style={{margin: 0, color: '#666'}}>Click or drag favicon here</p>
                  <p style={{margin: 0, fontSize: 12, color: '#999'}}>ICO, PNG, SVG (max 1MB)</p>
                </Upload.Dragger>
              )}
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Settings;
