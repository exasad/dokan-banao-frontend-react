import {useState, useEffect} from 'react';
import {
  Typography, Card, Form, Input, Switch, Button, message, Spin, Row, Col,
  Divider, Space, Tag, Alert, Upload,
} from 'antd';
import {
  ArrowLeftOutlined, SaveOutlined, SearchOutlined, GlobalOutlined,
  CodeOutlined, GoogleOutlined, PictureOutlined, DeleteOutlined,
  CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import adminAxios from '../../services/adminAxios';

const {Title, Text, Paragraph} = Typography;

const SeoSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ogImageUrl, setOgImageUrl] = useState(null);
  const [ogImageFile, setOgImageFile] = useState(null);
  const [removeOgImage, setRemoveOgImage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await adminAxios.get('/settings/seo');
        const formValues = {...res.data};
        formValues.seo_robots_index = formValues.seo_robots_index === '1' || formValues.seo_robots_index === null;
        form.setFieldsValue(formValues);
        if (formValues.seo_og_image) setOgImageUrl(formValues.seo_og_image);
      } catch {
        message.error('Failed to load SEO settings');
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
      formData.append('seo_meta_title', values.seo_meta_title || '');
      formData.append('seo_meta_description', values.seo_meta_description || '');
      formData.append('seo_meta_keywords', values.seo_meta_keywords || '');
      formData.append('seo_google_verification', values.seo_google_verification || '');
      formData.append('seo_bing_verification', values.seo_bing_verification || '');
      formData.append('seo_google_analytics_id', values.seo_google_analytics_id || '');
      formData.append('seo_gtm_id', values.seo_gtm_id || '');
      formData.append('seo_custom_head_scripts', values.seo_custom_head_scripts || '');
      formData.append('seo_robots_index', values.seo_robots_index ? '1' : '0');
      formData.append('seo_canonical_url', values.seo_canonical_url || '');

      if (ogImageFile) {
        formData.append('seo_og_image', ogImageFile);
      }
      if (removeOgImage) {
        formData.append('remove_seo_og_image', '1');
      }

      await adminAxios.put('/settings/seo', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      message.success('SEO settings saved successfully');
      setOgImageFile(null);
      setRemoveOgImage(false);
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error('Failed to save SEO settings');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleOgImageUpload = (info) => {
    const file = info.file;
    setOgImageFile(file);
    setRemoveOgImage(false);
    const reader = new FileReader();
    reader.onload = (e) => setOgImageUrl(e.target.result);
    reader.readAsDataURL(file);
    return false;
  };

  if (loading) {
    return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12}}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/settings')} />
          <Title level={3} style={{margin: 0}}><SearchOutlined style={{marginRight: 8, color: '#1890ff'}} />SEO Settings</Title>
        </Space>
        <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving} size='large'>
          Save Settings
        </Button>
      </div>

      <Form form={form} layout='vertical'>
        <Row gutter={[24, 24]}>
          {/* Left Column */}
          <Col xs={24} lg={14}>

            {/* ── Meta Tags ── */}
            <Card
              style={{marginBottom: 24}}
              title={
                <Space>
                  <FileTextOutlined style={{color: '#1890ff', fontSize: 18}} />
                  <Text strong style={{fontSize: 15}}>Meta Tags (Homepage)</Text>
                </Space>
              }
            >
              <Paragraph type='secondary' style={{marginBottom: 16}}>
                These meta tags apply to your homepage. Individual product and category pages generate their own meta tags automatically.
              </Paragraph>

              <Form.Item name='seo_meta_title' label='Meta Title'
                extra={<Text type='secondary' style={{fontSize: 12}}>Recommended: 50-60 characters. Shows in browser tab and Google results.</Text>}
                rules={[{max: 70, message: 'Max 70 characters'}]}>
                <Input placeholder='e.g. Best Online Shop in Bangladesh | Your Store' maxLength={70} showCount />
              </Form.Item>

              <Form.Item name='seo_meta_description' label='Meta Description'
                extra={<Text type='secondary' style={{fontSize: 12}}>Recommended: 120-160 characters. Shows below the title in Google results.</Text>}
                rules={[{max: 160, message: 'Max 160 characters'}]}>
                <Input.TextArea rows={3} placeholder='e.g. Shop quality products at best prices. Fast delivery across Bangladesh. Cash on delivery available.' maxLength={160} showCount />
              </Form.Item>

              <Form.Item name='seo_meta_keywords' label='Meta Keywords'
                extra={<Text type='secondary' style={{fontSize: 12}}>Comma-separated keywords. Less important for Google but used by other search engines.</Text>}>
                <Input.TextArea rows={2} placeholder='e.g. online shop bangladesh, buy online, ecommerce, best price' maxLength={500} showCount />
              </Form.Item>
            </Card>

            {/* ── OG Image & Social ── */}
            <Card
              style={{marginBottom: 24}}
              title={
                <Space>
                  <PictureOutlined style={{color: '#52c41a', fontSize: 18}} />
                  <Text strong style={{fontSize: 15}}>Social Sharing (Open Graph)</Text>
                </Space>
              }
            >
              <Paragraph type='secondary' style={{marginBottom: 16}}>
                Default image shown when your store link is shared on Facebook, Messenger, WhatsApp, etc.
              </Paragraph>

              <Form.Item label='OG Image (Share Image)'>
                {ogImageUrl && !removeOgImage ? (
                  <div style={{marginBottom: 12}}>
                    <img src={ogImageUrl} alt='OG Preview' style={{maxWidth: 300, maxHeight: 160, borderRadius: 8, border: '1px solid #f0f0f0'}} />
                    <div style={{marginTop: 8}}>
                      <Button
                        danger
                        size='small'
                        icon={<DeleteOutlined />}
                        onClick={() => {setRemoveOgImage(true); setOgImageUrl(null); setOgImageFile(null);}}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : null}
                <Upload
                  accept='image/jpeg,image/png,image/webp'
                  showUploadList={false}
                  beforeUpload={(file) => {handleOgImageUpload({file}); return false;}}
                >
                  <Button icon={<PictureOutlined />}>{ogImageUrl && !removeOgImage ? 'Change Image' : 'Upload Image'}</Button>
                </Upload>
                <Text type='secondary' style={{display: 'block', marginTop: 8, fontSize: 12}}>
                  Recommended: 1200x630px, JPG/PNG/WebP, max 2MB.
                </Text>
              </Form.Item>

              <Form.Item name='seo_canonical_url' label='Canonical URL'
                extra='The primary URL of your storefront. Leave empty to use default.'
                rules={[{type: 'url', message: 'Must be a valid URL'}]}>
                <Input prefix={<GlobalOutlined />} placeholder='https://www.yourstore.com' />
              </Form.Item>
            </Card>

            {/* ── Search Engine Verification ── */}
            <Card
              style={{marginBottom: 24}}
              title={
                <Space>
                  <GoogleOutlined style={{color: '#4285F4', fontSize: 18}} />
                  <Text strong style={{fontSize: 15}}>Search Engine Verification</Text>
                </Space>
              }
            >
              <Paragraph type='secondary' style={{marginBottom: 16}}>
                Verify your store with search engines to access Search Console and webmaster tools.
              </Paragraph>

              <Form.Item name='seo_google_verification' label='Google Search Console'
                extra='The "content" value from the meta tag provided by Google Search Console.'>
                <Input prefix={<CodeOutlined />} placeholder='e.g. abc123XYZ...' />
              </Form.Item>

              <Form.Item name='seo_bing_verification' label='Bing Webmaster Tools'
                extra='The "content" value from the meta tag provided by Bing Webmaster Tools.'>
                <Input prefix={<CodeOutlined />} placeholder='e.g. 1234ABCD...' />
              </Form.Item>
            </Card>

            {/* ── Analytics ── */}
            <Card
              style={{marginBottom: 24}}
              title={
                <Space>
                  <GlobalOutlined style={{color: '#F9AB00', fontSize: 18}} />
                  <Text strong style={{fontSize: 15}}>Analytics & Tracking</Text>
                </Space>
              }
            >
              <Paragraph type='secondary' style={{marginBottom: 16}}>
                Connect Google Analytics or Tag Manager to track visitor behavior.
              </Paragraph>

              <Form.Item name='seo_google_analytics_id' label='Google Analytics 4 (GA4) Measurement ID'
                extra='Starts with G-. Find it in GA4 → Admin → Data Streams.'>
                <Input prefix={<CodeOutlined />} placeholder='e.g. G-XXXXXXXXXX' />
              </Form.Item>

              <Form.Item name='seo_gtm_id' label='Google Tag Manager Container ID'
                extra='Starts with GTM-. Find it in Tag Manager → Container settings.'>
                <Input prefix={<CodeOutlined />} placeholder='e.g. GTM-XXXXXXX' />
              </Form.Item>
            </Card>

            {/* ── Advanced ── */}
            <Card
              style={{marginBottom: 24}}
              title={
                <Space>
                  <CodeOutlined style={{color: '#722ed1', fontSize: 18}} />
                  <Text strong style={{fontSize: 15}}>Advanced</Text>
                </Space>
              }
            >
              <Form.Item name='seo_robots_index' valuePropName='checked'>
                <Space>
                  <Switch checkedChildren={<CheckCircleOutlined />} unCheckedChildren={<CloseCircleOutlined />} />
                  <Text>Allow search engines to index this store</Text>
                </Space>
              </Form.Item>
              <Text type='secondary' style={{fontSize: 12, display: 'block', marginTop: -8, marginBottom: 16}}>
                Turning this OFF will add a noindex meta tag, preventing Google from showing your store in search results.
              </Text>

              <Divider style={{margin: '0 0 16px'}} />

              <Form.Item name='seo_custom_head_scripts' label='Custom Head Scripts'
                extra='Paste any custom HTML/JS that should be injected into the <head> tag. E.g. TikTok Pixel, Hotjar, etc.'>
                <Input.TextArea rows={5} placeholder={'<!-- Paste your tracking scripts here -->\n<script>...</script>'} maxLength={5000} showCount />
              </Form.Item>
            </Card>

            <div style={{textAlign: 'right'}}>
              <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving} size='large'>
                Save SEO Settings
              </Button>
            </div>
          </Col>

          {/* Right Column — Guides */}
          <Col xs={24} lg={10}>

            <Card style={{marginBottom: 24}} size='small'>
              <Alert
                type='info'
                showIcon
                icon={<SearchOutlined />}
                message='Why SEO Matters?'
                description='Good SEO helps your store appear higher in Google search results. This means more free organic traffic, more customers, and more sales — without spending on ads.'
              />
            </Card>

            <Card title={<><FileTextOutlined style={{marginRight: 8}} />Meta Tags Guide</>} size='small' style={{marginBottom: 24}}>
              <Space direction='vertical' size={10} style={{width: '100%'}}>
                <div>
                  <Tag color='blue'>Title</Tag>
                  <Text style={{fontSize: 13}}>Keep it under 60 characters. Include your store name and main keyword.</Text>
                </div>
                <div>
                  <Tag color='blue'>Description</Tag>
                  <Text style={{fontSize: 13}}>120-160 characters. Describe what your store sells. Include a call to action.</Text>
                </div>
                <div>
                  <Tag color='blue'>Keywords</Tag>
                  <Text style={{fontSize: 13}}>Add 5-10 relevant keywords, comma-separated. Think: what would a customer search?</Text>
                </div>
                <Divider style={{margin: '8px 0'}} />
                <Text type='secondary' style={{fontSize: 12}}>
                  Product and category pages automatically generate their own meta tags from their names and descriptions.
                </Text>
              </Space>
            </Card>

            <Card title={<><PictureOutlined style={{marginRight: 8}} />Social Sharing Tips</>} size='small' style={{marginBottom: 24}}>
              <Space direction='vertical' size={10} style={{width: '100%'}}>
                <div>
                  <Tag color='green'>OG Image</Tag>
                  <Text style={{fontSize: 13}}>Use 1200x630px size. This image appears when someone shares your store link on Facebook/WhatsApp.</Text>
                </div>
                <div>
                  <Tag color='green'>Tip</Tag>
                  <Text style={{fontSize: 13}}>Include your logo and a short tagline in the image for brand recognition.</Text>
                </div>
              </Space>
            </Card>

            <Card title={<><GoogleOutlined style={{marginRight: 8}} />Google Search Console</>} size='small' style={{marginBottom: 24}}>
              <Space direction='vertical' size={10} style={{width: '100%'}}>
                <div>
                  <Tag color='cyan'>Step 1</Tag>
                  <Text style={{fontSize: 13}}>Go to <Text strong>search.google.com/search-console</Text> and add your store URL.</Text>
                </div>
                <div>
                  <Tag color='cyan'>Step 2</Tag>
                  <Text style={{fontSize: 13}}>Choose "HTML tag" verification method.</Text>
                </div>
                <div>
                  <Tag color='cyan'>Step 3</Tag>
                  <Text style={{fontSize: 13}}>Copy only the <Text code>content="..."</Text> value and paste it here.</Text>
                </div>
                <div>
                  <Tag color='cyan'>Step 4</Tag>
                  <Text style={{fontSize: 13}}>Save settings, then click "Verify" in Search Console.</Text>
                </div>
              </Space>
            </Card>

            <Card title={<><GlobalOutlined style={{marginRight: 8}} />Analytics Setup</>} size='small'>
              <Space direction='vertical' size={10} style={{width: '100%'}}>
                <div>
                  <Tag color='orange'>GA4</Tag>
                  <Text style={{fontSize: 13}}>Go to Google Analytics → Admin → Data Streams → Web → Copy Measurement ID (starts with G-).</Text>
                </div>
                <div>
                  <Tag color='orange'>GTM</Tag>
                  <Text style={{fontSize: 13}}>Go to tagmanager.google.com → Copy Container ID (starts with GTM-).</Text>
                </div>
                <Divider style={{margin: '8px 0'}} />
                <Text type='secondary' style={{fontSize: 12}}>
                  Use GA4 for simple tracking. Use GTM if you need advanced tag management with multiple tracking tools.
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SeoSettings;
