import {useState, useEffect} from 'react';
import {Form, Input, Select, Switch, DatePicker, Button, Card, Typography, message, Upload} from 'antd';
import {SaveOutlined, ArrowLeftOutlined, UploadOutlined} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import dayjs from 'dayjs';
import adminAxios from '../../services/adminAxios';

const {Title} = Typography;

const BlogForm = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const isEdit = !!id;

  useEffect(() => {
    adminAxios.get('/blog-categories', {params: {per_page: 100}}).then(({data}) => setCategories(data.data || data || [])).catch(() => {});
    if (isEdit) {
      setLoading(true);
      adminAxios.get(`/blog-posts/${id}`).then(({data}) => {
        form.setFieldsValue({
          ...data,
          published_at: data.published_at ? dayjs(data.published_at) : null,
          category_ids: data.categories?.map(c => c.id) || [],
        });
      }).catch(() => message.error('Failed to load')).finally(() => setLoading(false));
    }
  }, [id, form, isEdit]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const data = {...values, published_at: values.published_at?.format('YYYY-MM-DD HH:mm:ss')};
      if (isEdit) {
        await adminAxios.put(`/blog-posts/${id}`, data);
        message.success('Post updated');
      } else {
        await adminAxios.post('/blog-posts', data);
        message.success('Post created');
        navigate('/blog');
      }
    } catch (err) { message.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/blog')} />
        <Title level={3} style={{margin: 0}}>{isEdit ? 'Edit Post' : 'New Blog Post'}</Title>
      </div>
      <Card loading={loading}>
        <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{status: 'draft', is_featured: false}}>
          <Form.Item name='title' label='Title' rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name='slug' label='Slug'><Input placeholder='Auto-generated from title if empty' /></Form.Item>
          <Form.Item name='excerpt' label='Excerpt'><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name='content' label='Content' rules={[{required: true}]}><Input.TextArea rows={10} /></Form.Item>
          <Form.Item name='featured_image' label='Featured Image URL'><Input placeholder='https://...' /></Form.Item>
          <Form.Item name='category_ids' label='Categories'>
            <Select mode='multiple' placeholder='Select categories' options={categories.map(c => ({value: c.id, label: c.name}))} />
          </Form.Item>
          <Form.Item name='status' label='Status' rules={[{required: true}]}>
            <Select options={[{value: 'draft', label: 'Draft'}, {value: 'published', label: 'Published'}]} style={{width: 150}} />
          </Form.Item>
          <Form.Item name='published_at' label='Publish Date'><DatePicker showTime format='YYYY-MM-DD HH:mm:ss' /></Form.Item>
          <Form.Item name='is_featured' label='Featured' valuePropName='checked'><Switch /></Form.Item>
          <Form.Item name='meta_title' label='Meta Title'><Input /></Form.Item>
          <Form.Item name='meta_description' label='Meta Description'><Input.TextArea rows={2} /></Form.Item>
          <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={saving}>Save</Button>
        </Form>
      </Card>
    </div>
  );
};

export default BlogForm;
