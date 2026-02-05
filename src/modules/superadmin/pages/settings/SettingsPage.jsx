import {useState, useEffect} from 'react';
import {
  Typography,
  Tabs,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Card,
  ColorPicker,
  Upload,
  Avatar,
  InputNumber,
  message,
  Space,
  Spin,
} from 'antd';
import {UploadOutlined, PictureOutlined} from '@ant-design/icons';
import superadminAxios from '../../services/superadminAxios';
import {useSettings} from '../../context/SettingsContext';

const {Title, Text} = Typography;

const timezones = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Karachi',
  'Australia/Sydney',
  'Pacific/Auckland',
];

const dateFormats = [
  {value: 'YYYY-MM-DD', label: '2026-02-04 (YYYY-MM-DD)'},
  {value: 'DD/MM/YYYY', label: '04/02/2026 (DD/MM/YYYY)'},
  {value: 'MM/DD/YYYY', label: '02/04/2026 (MM/DD/YYYY)'},
  {value: 'DD-MM-YYYY', label: '04-02-2026 (DD-MM-YYYY)'},
  {value: 'MMM DD, YYYY', label: 'Feb 04, 2026 (MMM DD, YYYY)'},
];

const currencies = [
  {value: 'USD', label: 'USD ($)', symbol: '$'},
  {value: 'EUR', label: 'EUR (€)', symbol: '€'},
  {value: 'GBP', label: 'GBP (£)', symbol: '£'},
  {value: 'PKR', label: 'PKR (₨)', symbol: '₨'},
  {value: 'INR', label: 'INR (₹)', symbol: '₹'},
  {value: 'AED', label: 'AED (د.إ)', symbol: 'د.إ'},
  {value: 'SAR', label: 'SAR (﷼)', symbol: '﷼'},
  {value: 'AUD', label: 'AUD (A$)', symbol: 'A$'},
  {value: 'CAD', label: 'CAD (C$)', symbol: 'C$'},
];

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allSettings, setAllSettings] = useState({});
  const {refreshSettings} = useSettings();

  const [brandingForm] = Form.useForm();
  const [appearanceForm] = Form.useForm();
  const [generalForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [tenantForm] = Form.useForm();
  const [invoiceForm] = Form.useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await superadminAxios.get('/settings');
      setAllSettings(res.data);
      populateForms(res.data);
    } catch {
      message.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const populateForms = (data) => {
    if (data.branding) brandingForm.setFieldsValue(data.branding);
    if (data.appearance) {
      appearanceForm.setFieldsValue({
        ...data.appearance,
        compact_mode: data.appearance.compact_mode === 'true',
      });
    }
    if (data.general) generalForm.setFieldsValue(data.general);
    if (data.notifications) {
      notificationForm.setFieldsValue({
        ...data.notifications,
        email_notifications: data.notifications.email_notifications === 'true',
        notify_new_tenant: data.notifications.notify_new_tenant === 'true',
        notify_invoice_paid: data.notifications.notify_invoice_paid === 'true',
        notify_tenant_expired: data.notifications.notify_tenant_expired === 'true',
      });
    }
    if (data.tenant) {
      tenantForm.setFieldsValue({
        ...data.tenant,
        auto_suspend_on_expiry: data.tenant.auto_suspend_on_expiry === 'true',
        allow_tenant_registration: data.tenant.allow_tenant_registration === 'true',
      });
    }
    if (data.invoice) invoiceForm.setFieldsValue(data.invoice);
  };

  const saveSettings = async (values, group) => {
    setSaving(true);
    try {
      const settings = Object.entries(values).map(([key, value]) => ({
        key,
        value: typeof value === 'boolean' ? String(value) : (value ?? ''),
        group,
      }));
      const res = await superadminAxios.put('/settings', {settings});
      setAllSettings(res.data.settings);
      await refreshSettings();
      message.success('Settings saved successfully');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    try {
      const res = await superadminAxios.post('/settings/logo', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      brandingForm.setFieldValue('site_logo', res.data.url);
      await refreshSettings();
      message.success('Logo uploaded');
    } catch {
      message.error('Failed to upload logo');
    }
    return false;
  };

  const handleFaviconUpload = async (file) => {
    const formData = new FormData();
    formData.append('favicon', file);
    try {
      const res = await superadminAxios.post('/settings/favicon', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      brandingForm.setFieldValue('site_favicon', res.data.url);
      await refreshSettings();
      message.success('Favicon uploaded');
    } catch {
      message.error('Failed to upload favicon');
    }
    return false;
  };

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: 80}}>
        <Spin size='large' />
      </div>
    );
  }

  const cardStyle = {
    background: 'var(--settings-card-bg, #fff)',
    marginBottom: 24,
  };

  const tabItems = [
    {
      key: 'branding',
      label: 'Branding',
      children: (
        <Card style={cardStyle}>
          <Form
            form={brandingForm}
            layout='vertical'
            onFinish={(v) => saveSettings(v, 'branding')}
          >
            <Form.Item name='site_title' label='Site Title'>
              <Input placeholder='SuperAdmin' />
            </Form.Item>
            <Form.Item name='site_description' label='Site Description'>
              <Input.TextArea rows={2} placeholder='Multi-Tenant Management Platform' />
            </Form.Item>
            <Form.Item name='footer_text' label='Footer Text'>
              <Input placeholder='© 2026 Your Company' />
            </Form.Item>
            <Form.Item label='Logo'>
              <Space align='center'>
                {allSettings?.branding?.site_logo && (
                  <Avatar
                    src={allSettings.branding.site_logo}
                    shape='square'
                    size={64}
                  />
                )}
                <Upload
                  beforeUpload={handleLogoUpload}
                  showUploadList={false}
                  accept='image/*'
                >
                  <Button icon={<UploadOutlined />}>Upload Logo</Button>
                </Upload>
              </Space>
            </Form.Item>
            <Form.Item label='Favicon'>
              <Space align='center'>
                {allSettings?.branding?.site_favicon && (
                  <Avatar
                    src={allSettings.branding.site_favicon}
                    shape='square'
                    size={32}
                  />
                )}
                <Upload
                  beforeUpload={handleFaviconUpload}
                  showUploadList={false}
                  accept='image/png,image/x-icon,image/svg+xml'
                >
                  <Button icon={<PictureOutlined />}>Upload Favicon</Button>
                </Upload>
              </Space>
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' loading={saving}>
                Save Branding
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'appearance',
      label: 'Appearance',
      children: (
        <Card style={cardStyle}>
          <Form
            form={appearanceForm}
            layout='vertical'
            onFinish={(v) =>
              saveSettings(
                {
                  ...v,
                  primary_color:
                    typeof v.primary_color === 'string'
                      ? v.primary_color
                      : v.primary_color?.toHexString?.() || '#1668dc',
                  sidebar_color:
                    typeof v.sidebar_color === 'string'
                      ? v.sidebar_color
                      : v.sidebar_color?.toHexString?.() || '#001529',
                },
                'appearance',
              )
            }
          >
            <Form.Item name='default_theme' label='Default Theme'>
              <Select
                options={[
                  {value: 'light', label: 'Light'},
                  {value: 'dark', label: 'Dark'},
                ]}
              />
            </Form.Item>
            <Form.Item name='primary_color' label='Primary Color'>
              <ColorPicker showText />
            </Form.Item>
            <Form.Item name='sidebar_color' label='Sidebar Color'>
              <ColorPicker showText />
            </Form.Item>
            <Form.Item name='compact_mode' label='Compact Mode' valuePropName='checked'>
              <Switch />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' loading={saving}>
                Save Appearance
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'general',
      label: 'General',
      children: (
        <Card style={cardStyle}>
          <Form
            form={generalForm}
            layout='vertical'
            onFinish={(v) => saveSettings(v, 'general')}
          >
            <Form.Item name='timezone' label='Timezone'>
              <Select
                showSearch
                options={timezones.map((tz) => ({value: tz, label: tz}))}
              />
            </Form.Item>
            <Form.Item name='date_format' label='Date Format'>
              <Select options={dateFormats} />
            </Form.Item>
            <Form.Item name='currency' label='Currency'>
              <Select
                options={currencies}
                onChange={(val) => {
                  const found = currencies.find((c) => c.value === val);
                  if (found) generalForm.setFieldValue('currency_symbol', found.symbol);
                }}
              />
            </Form.Item>
            <Form.Item name='currency_symbol' label='Currency Symbol'>
              <Input style={{width: 100}} />
            </Form.Item>
            <Form.Item name='default_pagination' label='Default Rows Per Page'>
              <Select
                options={[
                  {value: '10', label: '10'},
                  {value: '15', label: '15'},
                  {value: '20', label: '20'},
                  {value: '25', label: '25'},
                  {value: '50', label: '50'},
                  {value: '100', label: '100'},
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' loading={saving}>
                Save General
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'notifications',
      label: 'Notifications',
      children: (
        <Card style={cardStyle}>
          <Form
            form={notificationForm}
            layout='vertical'
            onFinish={(v) => saveSettings(v, 'notifications')}
          >
            <Form.Item name='admin_email' label='Admin Email'>
              <Input placeholder='admin@example.com' />
            </Form.Item>
            <Form.Item
              name='email_notifications'
              label='Enable Email Notifications'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name='notify_new_tenant'
              label='Notify on New Tenant'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name='notify_invoice_paid'
              label='Notify on Invoice Paid'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name='notify_tenant_expired'
              label='Notify on Tenant Expired'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' loading={saving}>
                Save Notifications
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'tenant',
      label: 'Tenant Defaults',
      children: (
        <Card style={cardStyle}>
          <Form
            form={tenantForm}
            layout='vertical'
            onFinish={(v) => saveSettings(v, 'tenant')}
          >
            <Form.Item name='default_trial_days' label='Default Trial Days'>
              <Input type='number' style={{width: 200}} />
            </Form.Item>
            <Form.Item
              name='auto_suspend_on_expiry'
              label='Auto Suspend on Expiry'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name='allow_tenant_registration'
              label='Allow Tenant Self-Registration'
              valuePropName='checked'
            >
              <Switch />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' loading={saving}>
                Save Tenant Defaults
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'invoice',
      label: 'Invoice',
      children: (
        <Card style={cardStyle}>
          <Form
            form={invoiceForm}
            layout='vertical'
            onFinish={(v) => saveSettings(v, 'invoice')}
          >
            <Form.Item name='invoice_prefix' label='Invoice Prefix'>
              <Input style={{width: 200}} placeholder='INV-' />
            </Form.Item>
            <Form.Item name='default_tax_rate' label='Default Tax Rate (%)'>
              <Input type='number' style={{width: 200}} />
            </Form.Item>
            <Form.Item name='invoice_due_days' label='Default Due Days'>
              <Input type='number' style={{width: 200}} />
            </Form.Item>
            <Form.Item name='invoice_notes' label='Default Invoice Notes'>
              <Input.TextArea rows={2} />
            </Form.Item>
            <Title level={5} style={{marginTop: 16}}>Company Details (shown on invoices)</Title>
            <Form.Item name='company_name' label='Company Name'>
              <Input placeholder='Your Company Name' />
            </Form.Item>
            <Form.Item name='company_address' label='Company Address'>
              <Input.TextArea rows={2} placeholder='123 Business St, City, Country' />
            </Form.Item>
            <Space size={16}>
              <Form.Item name='company_phone' label='Phone'>
                <Input placeholder='+1 234 567 890' />
              </Form.Item>
              <Form.Item name='company_email' label='Email'>
                <Input placeholder='billing@company.com' />
              </Form.Item>
            </Space>
            <Form.Item>
              <Button type='primary' htmlType='submit' loading={saving}>
                Save Invoice Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>Settings</Title>
      <Tabs items={tabItems} tabPosition='left' style={{minHeight: 400}} />
    </div>
  );
};

export default SettingsPage;
