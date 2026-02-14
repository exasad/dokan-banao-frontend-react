import {useState, useEffect, useRef} from 'react';
import {Form, Input, Switch, Button, Card, Typography, message} from 'antd';
import {SaveOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
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

const PageForm = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState('');
  const contentRef = useRef(null);
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      adminAxios.get(`/pages/${id}`).then(({data}) => {
        form.setFieldsValue(data);
        setContent(data.content || '');
      }).catch(() => message.error('Failed to load')).finally(() => setLoading(false));
    }
  }, [id, form, isEdit]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const data = {...values, content};
      if (isEdit) { await adminAxios.put(`/pages/${id}`, data); message.success('Updated'); }
      else { await adminAxios.post('/pages', data); message.success('Created'); navigate('/pages'); }
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
          <Form.Item label='Content' required>
            <JoditEditor
              ref={contentRef}
              value={content}
              config={editorConfig}
              onBlur={(newContent) => setContent(newContent)}
            />
          </Form.Item>
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
