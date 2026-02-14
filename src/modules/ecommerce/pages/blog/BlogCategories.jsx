import {useState, useEffect, useCallback} from 'react';
import {Table, Button, Input, Space, Typography, message, Popconfirm, Modal, Form, Switch, InputNumber} from 'antd';
import {PlusOutlined, EditOutlined, DeleteOutlined, FolderOutlined} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';

const {Title} = Typography;

const BlogCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAxios.get('/blog-categories');
      setCategories(res.data.data || res.data || []);
    } catch { message.error('Failed to fetch'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (record) => { setEditing(record); form.setFieldsValue(record); setModalOpen(true); };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) { await adminAxios.put(`/blog-categories/${editing.id}`, values); message.success('Updated'); }
      else { await adminAxios.post('/blog-categories', values); message.success('Created'); }
      setModalOpen(false);
      fetchCategories();
    } catch (err) { message.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    try { await adminAxios.delete(`/blog-categories/${id}`); message.success('Deleted'); fetchCategories(); }
    catch { message.error('Failed'); }
  };

  const columns = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'Slug', dataIndex: 'slug', key: 'slug'},
    {title: 'Active', dataIndex: 'is_active', key: 'active', render: (v) => v ? 'Yes' : 'No'},
    {title: 'Order', dataIndex: 'sort_order', key: 'order'},
    {
      title: 'Actions', key: 'actions', width: 120,
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size='small' onClick={() => openEdit(r)} />
          <Popconfirm title='Delete?' onConfirm={() => handleDelete(r.id)}><Button icon={<DeleteOutlined />} size='small' danger /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}><FolderOutlined style={{marginRight: 8}} />Blog Categories</Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={openAdd}>Add Category</Button>
      </div>
      <Table columns={columns} dataSource={categories} rowKey='id' loading={loading} pagination={false} />
      <Modal title={editing ? 'Edit Category' : 'Add Category'} open={modalOpen} onOk={handleSubmit} onCancel={() => setModalOpen(false)}>
        <Form form={form} layout='vertical' initialValues={{is_active: true, sort_order: 0}}>
          <Form.Item name='name' label='Name' rules={[{required: true}]}><Input placeholder='Enter category name' /></Form.Item>
          <Form.Item name='slug' label='Slug'><Input placeholder='Auto-generated if empty' /></Form.Item>
          <Form.Item name='is_active' label='Active' valuePropName='checked'><Switch /></Form.Item>
          <Form.Item name='sort_order' label='Sort Order'><InputNumber min={0} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogCategories;
