import {useState, useEffect} from 'react';
import {Card, Form, Select, Switch, Button, Typography, message, Divider, Space} from 'antd';
import {SaveOutlined, GlobalOutlined} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';

const {Title, Text} = Typography;

const availableLocales = [
  {value: 'en', label: 'English'},
  {value: 'bn', label: 'Bengali (বাংলা)'},
];

const LanguageSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    adminAxios.get('/settings').then(({data}) => {
      form.setFieldsValue({
        default_locale: data.default_locale || 'en',
        enabled_locales: (data.enabled_locales || 'en,bn').split(','),
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [form]);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      await adminAxios.post('/settings', {
        default_locale: values.default_locale,
        enabled_locales: values.enabled_locales.join(','),
      });
      message.success('Language settings saved');
    } catch { message.error('Failed to save'); } finally { setSaving(false); }
  };

  return (
    <div>
      <Title level={3} style={{marginBottom: 16}}><GlobalOutlined style={{marginRight: 8}} />Language Settings</Title>
      <Card loading={loading}>
        <Form form={form} layout='vertical' onFinish={handleSave}>
          <Form.Item name='default_locale' label='Default Language' rules={[{required: true}]}>
            <Select options={availableLocales} style={{width: 200}} />
          </Form.Item>
          <Form.Item name='enabled_locales' label='Enabled Languages' rules={[{required: true}]}>
            <Select mode='multiple' options={availableLocales} style={{width: 300}} />
          </Form.Item>
          <Divider />
          <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={saving}>Save Settings</Button>
        </Form>
      </Card>
    </div>
  );
};

export default LanguageSettings;
