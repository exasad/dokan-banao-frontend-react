import {useState, useEffect} from 'react';
import {Typography, Form, Input, Button, Card, Space, Spin, message} from 'antd';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const useLandingForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    superadminAxios
      .get('/settings')
      .then((res) => {
        if (res.data.landing) form.setFieldsValue(res.data.landing);
      })
      .catch(() => message.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, [form]);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const settings = Object.entries(values).map(([key, value]) => ({
        key,
        value: value ?? '',
        group: 'landing',
      }));
      await superadminAxios.put('/settings', {settings});
      message.success('Settings saved');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return {loading, saving, form, handleSave};
};

const cardStyle = {background: 'var(--settings-card-bg, #fff)', marginBottom: 24};

// ===== HERO =====
export const LandingHero = () => {
  const {loading, saving, form, handleSave} = useLandingForm();
  if (loading) return <Spin size='large' style={{display: 'block', textAlign: 'center', padding: 80}} />;
  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>Hero Section</Title>
      <Form form={form} layout='vertical' onFinish={handleSave}>
        <Card style={cardStyle}>
          <Form.Item name='landing_hero_title' label='Hero Title'>
            <Input placeholder='Build Your Dream Store in Minutes' />
          </Form.Item>
          <Form.Item name='landing_hero_subtitle' label='Hero Subtitle'>
            <Input.TextArea rows={3} placeholder='No coding. No designers. No headaches. Launch a fully-functional ecommerce store...' />
          </Form.Item>
          <Form.Item name='landing_hero_cta' label='CTA Button Text'>
            <Input placeholder='Start Free Trial' />
          </Form.Item>
        </Card>
        <Button type='primary' htmlType='submit' loading={saving} size='large'>Save Hero Section</Button>
      </Form>
    </div>
  );
};

// ===== FEATURES =====
export const LandingFeatures = () => {
  const {loading, saving, form, handleSave} = useLandingForm();
  if (loading) return <Spin size='large' style={{display: 'block', textAlign: 'center', padding: 80}} />;
  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>Features Section</Title>
      <Form form={form} layout='vertical' onFinish={handleSave}>
        <Card style={cardStyle}>
          <Form.Item name='landing_features_title' label='Section Title'>
            <Input placeholder='Everything You Need to Sell Online' />
          </Form.Item>
        </Card>
        {[1, 2, 3, 4].map((n) => (
          <Card key={n} title={`Feature ${n}`} style={cardStyle} size='small'>
            <Form.Item name={`landing_feature_${n}_title`} label='Title' style={{marginBottom: 8}}>
              <Input placeholder={`Feature ${n} title`} />
            </Form.Item>
            <Form.Item name={`landing_feature_${n}_desc`} label='Description' style={{marginBottom: 0}}>
              <Input.TextArea rows={2} placeholder={`Feature ${n} description`} />
            </Form.Item>
          </Card>
        ))}
        <Button type='primary' htmlType='submit' loading={saving} size='large'>Save Features</Button>
      </Form>
    </div>
  );
};

// ===== STATS =====
export const LandingStats = () => {
  const {loading, saving, form, handleSave} = useLandingForm();
  if (loading) return <Spin size='large' style={{display: 'block', textAlign: 'center', padding: 80}} />;
  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>Stats</Title>
      <Form form={form} layout='vertical' onFinish={handleSave}>
        <Card style={cardStyle}>
          <Space size={16} wrap>
            <Form.Item name='landing_stats_stores' label='Active Stores'>
              <Input placeholder='500+' style={{width: 180}} />
            </Form.Item>
            <Form.Item name='landing_stats_products' label='Products Listed'>
              <Input placeholder='50K+' style={{width: 180}} />
            </Form.Item>
            <Form.Item name='landing_stats_orders' label='Orders Processed'>
              <Input placeholder='100K+' style={{width: 180}} />
            </Form.Item>
          </Space>
        </Card>
        <Button type='primary' htmlType='submit' loading={saving} size='large'>Save Stats</Button>
      </Form>
    </div>
  );
};

// ===== CTA =====
export const LandingCta = () => {
  const {loading, saving, form, handleSave} = useLandingForm();
  if (loading) return <Spin size='large' style={{display: 'block', textAlign: 'center', padding: 80}} />;
  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>Bottom CTA</Title>
      <Form form={form} layout='vertical' onFinish={handleSave}>
        <Card style={cardStyle}>
          <Form.Item name='landing_cta_title' label='CTA Title'>
            <Input placeholder='Ready to Launch Your Store?' />
          </Form.Item>
          <Form.Item name='landing_cta_subtitle' label='CTA Subtitle'>
            <Input.TextArea rows={2} placeholder='Join hundreds of successful merchants...' />
          </Form.Item>
        </Card>
        <Button type='primary' htmlType='submit' loading={saving} size='large'>Save CTA</Button>
      </Form>
    </div>
  );
};

// ===== FOOTER =====
export const LandingFooter = () => {
  const {loading, saving, form, handleSave} = useLandingForm();
  if (loading) return <Spin size='large' style={{display: 'block', textAlign: 'center', padding: 80}} />;
  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>Footer</Title>
      <Form form={form} layout='vertical' onFinish={handleSave}>
        <Card style={cardStyle}>
          <Form.Item name='landing_footer_text' label='Footer Text'>
            <Input placeholder='© 2026 DokanBanao. All rights reserved.' />
          </Form.Item>
        </Card>
        <Button type='primary' htmlType='submit' loading={saving} size='large'>Save Footer</Button>
      </Form>
    </div>
  );
};

// ===== ANALYTICS & SEO =====
export const LandingAnalytics = () => {
  const {loading, saving, form, handleSave} = useLandingForm();
  if (loading) return <Spin size='large' style={{display: 'block', textAlign: 'center', padding: 80}} />;
  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>Analytics & SEO</Title>
      <Form form={form} layout='vertical' onFinish={handleSave}>
        <Card title='Tracking' style={cardStyle}>
          <Form.Item name='landing_ga_id' label='Google Analytics 4 Measurement ID'>
            <Input placeholder='G-XXXXXXXXXX' />
          </Form.Item>
          <Form.Item name='landing_gtm_id' label='Google Tag Manager ID'>
            <Input placeholder='GTM-XXXXXXX' />
          </Form.Item>
          <Form.Item name='landing_fb_pixel_id' label='Facebook Pixel ID'>
            <Input placeholder='123456789012345' />
          </Form.Item>
          <Form.Item name='landing_custom_head_scripts' label='Custom Head Scripts'>
            <Input.TextArea rows={4} placeholder='Paste tracking scripts (Hotjar, Clarity, etc.)' />
          </Form.Item>
        </Card>
        <Card title='SEO' style={cardStyle}>
          <Form.Item name='landing_meta_title' label='Meta Title'>
            <Input placeholder='Dokan Banao — Launch Your Online Store' />
          </Form.Item>
          <Form.Item name='landing_meta_description' label='Meta Description'>
            <Input.TextArea rows={2} placeholder='Create your own ecommerce store in minutes...' />
          </Form.Item>
          <Form.Item name='landing_meta_keywords' label='Meta Keywords'>
            <Input placeholder='ecommerce, online store, create store' />
          </Form.Item>
          <Form.Item name='landing_og_image' label='OG Image URL'>
            <Input placeholder='https://yourdomain.com/og-image.png' />
          </Form.Item>
        </Card>
        <Button type='primary' htmlType='submit' loading={saving} size='large'>Save Analytics & SEO</Button>
      </Form>
    </div>
  );
};

// Default export (redirects to hero)
export default LandingHero;
