import {useState, useEffect} from 'react';
import {Form, Input, Switch, Button, Card, Typography, message} from 'antd';
import {SaveOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import adminAxios from '../../services/adminAxios';

const {Title} = Typography;

const PageForm = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      adminAxios.get(`/pages/${id}`).then(({data}) => form.setFieldsValue(data)).catch(() => message.error('Failed to load')).finally(() => setLoading(false));
    }
  }, [id, form, isEdit]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (isEdit) { await adminAxios.put(`/pages/${id}`, values); message.success('Updated'); }
      else { await adminAxios.post('/pages', values); message.success('Created'); navigate('/pages'); }
    } catch (err) { message.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/pages')} />
        <Title level={3} style={{margin: 0}}>{isEdit ? 'Edit Page' : 'New Page'}</Title>
      </div>
      <Card loading={loading}>
        <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{is_active: true}}>
          <Form.Item name='title' label='Title' rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name='slug' label='Slug'><Input placeholder='Auto-generated from title' /></Form.Item>
          <Form.Item name='content' label='Content' rules={[{required: true}]}><Input.TextArea rows={12} /></Form.Item>
          <Form.Item name='is_active' label='Active' valuePropName='checked'><Switch /></Form.Item>
          <Form.Item name='meta_title' label='Meta Title'><Input /></Form.Item>
          <Form.Item name='meta_description' label='Meta Description'><Input.TextArea rows={2} /></Form.Item>
          <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={saving}>Save</Button>
        </Form>
      </Card>
    </div>
  );
};

export default PageForm;
