import {useState, useEffect, useRef} from 'react';
import {Form, Input, Select, Switch, DatePicker, Button, Card, Typography, message, Upload, Image} from 'antd';
import {SaveOutlined, ArrowLeftOutlined, UploadOutlined, DeleteOutlined} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import dayjs from 'dayjs';
import JoditEditor from 'jodit-react';
import adminAxios from '../../services/adminAxios';

const {Title} = Typography;

const editorConfig = {
  readonly: false,
  height: 400,
  buttons: [
    'bold', 'italic', 'underline', 'strikethrough', '|',
    'ul', 'ol', '|',
    'font', 'fontsize', 'paragraph', '|',
    'link', 'image', 'video', 'table', '|',
    'align', '|',
    'undo', 'redo', '|',
    'hr', 'eraser', 'fullsize', 'source',
  ],
  uploader: {insertImageAsBase64URI: true},
  showXPathInStatusbar: false,
  showCharsCounter: false,
  showWordsCounter: false,
};

const BlogForm = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const contentRef = useRef(null);
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
        setContent(data.content || '');
        if (data.featured_image) {
          setExistingImage(data.featured_image);
        }
      }).catch(() => message.error('Failed to load')).finally(() => setLoading(false));
    }
  }, [id, form, isEdit]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title || '');
      if (values.slug) formData.append('slug', values.slug);
      if (values.excerpt) formData.append('excerpt', values.excerpt);
      formData.append('content', content);
      formData.append('status', values.status || 'draft');
      formData.append('is_featured', values.is_featured ? '1' : '0');
      if (values.published_at) formData.append('published_at', values.published_at.format('YYYY-MM-DD HH:mm:ss'));
      if (values.meta_title) formData.append('meta_title', values.meta_title);
      if (values.meta_description) formData.append('meta_description', values.meta_description);
      if (values.category_ids) {
        values.category_ids.forEach((cid) => formData.append('category_ids[]', cid));
      }
      if (featuredImage) {
        formData.append('featured_image', featuredImage);
      }

      const config = {headers: {'Content-Type': 'multipart/form-data'}};

      if (isEdit) {
        formData.append('_method', 'PUT');
        await adminAxios.post(`/blog-posts/${id}`, formData, config);
        message.success('Post updated');
      } else {
        await adminAxios.post('/blog-posts', formData, config);
        message.success('Post created');
        navigate('/blog');
      }
    } catch (err) { message.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handleImageUpload = (info) => {
    const file = info.file?.originFileObj || info.file;
    if (file) {
      setFeaturedImage(file);
      setExistingImage(URL.createObjectURL(file));
    }
    return false;
  };

  const removeImage = () => {
    setFeaturedImage(null);
    setExistingImage(null);
  };

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/blog')} />
        <Title level={3} style={{margin: 0}}>{isEdit ? 'Edit Post' : 'New Blog Post'}</Title>
      </div>
      <Card loading={loading}>
        <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{status: 'draft', is_featured: false}}>
          <Form.Item name='title' label='Title' rules={[{required: true}]}><Input placeholder='Enter blog post title' /></Form.Item>
          <Form.Item name='slug' label='Slug'><Input placeholder='Auto-generated from title if empty' /></Form.Item>
          <Form.Item name='excerpt' label='Excerpt'><Input.TextArea rows={2} placeholder='Write a short summary of the post...' /></Form.Item>

          <Form.Item label='Content' required>
            <JoditEditor
              ref={contentRef}
              value={content}
              config={editorConfig}
              onBlur={(newContent) => setContent(newContent)}
            />
          </Form.Item>

          <Form.Item label='Featured Image'>
            {existingImage ? (
              <div style={{marginBottom: 8}}>
                <div style={{position: 'relative', display: 'inline-block'}}>
                  <Image src={existingImage} alt='Featured' style={{maxHeight: 200, objectFit: 'cover', borderRadius: 8}} />
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    size='small'
                    onClick={removeImage}
                    style={{position: 'absolute', top: 8, right: 8}}
                  />
                </div>
              </div>
            ) : null}
            <Upload
              accept='image/*'
              maxCount={1}
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleImageUpload}
            >
              <Button icon={<UploadOutlined />}>{existingImage ? 'Change Image' : 'Upload Image'}</Button>
            </Upload>
          </Form.Item>

          <Form.Item name='category_ids' label='Categories'>
            <Select mode='multiple' placeholder='Select categories' options={categories.map(c => ({value: c.id, label: c.name}))} />
          </Form.Item>
          <Form.Item name='status' label='Status' rules={[{required: true}]}>
            <Select options={[{value: 'draft', label: 'Draft'}, {value: 'published', label: 'Published'}]} style={{width: 150}} />
          </Form.Item>
          <Form.Item name='published_at' label='Publish Date'><DatePicker showTime format='YYYY-MM-DD HH:mm:ss' /></Form.Item>
          <Form.Item name='is_featured' label='Featured' valuePropName='checked'><Switch /></Form.Item>
          <Form.Item name='meta_title' label='Meta Title'><Input placeholder='SEO title for search engines' /></Form.Item>
          <Form.Item name='meta_description' label='Meta Description'><Input.TextArea rows={2} placeholder='SEO description for search engines...' /></Form.Item>
          <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={saving}>Save</Button>
        </Form>
      </Card>
    </div>
  );
};

export default BlogForm;
