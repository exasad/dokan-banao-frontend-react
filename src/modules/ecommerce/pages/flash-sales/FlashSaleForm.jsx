import {useState, useEffect} from 'react';
import {Form, Input, InputNumber, Select, Switch, DatePicker, Button, Card, Table, Typography, message, Space, Popconfirm} from 'antd';
import {SaveOutlined, ArrowLeftOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import dayjs from 'dayjs';
import adminAxios from '../../services/adminAxios';

const {Title} = Typography;

const FlashSaleForm = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [addProductModal, setAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({product_id: null, flash_price: 0, stock_limit: null});
  const isEdit = !!id;

  useEffect(() => {
    adminAxios.get('/products', {params: {per_page: 500}}).then(({data}) => setAllProducts(data.data || [])).catch(() => {});
    if (isEdit) {
      setLoading(true);
      adminAxios.get(`/flash-sales/${id}`).then(({data}) => {
        form.setFieldsValue({
          ...data,
          starts_at: data.starts_at ? dayjs(data.starts_at) : null,
          ends_at: data.ends_at ? dayjs(data.ends_at) : null,
        });
        setProducts(data.products || []);
      }).catch(() => message.error('Failed to load')).finally(() => setLoading(false));
    }
  }, [id, form, isEdit]);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const data = {...values, starts_at: values.starts_at?.format('YYYY-MM-DD HH:mm:ss'), ends_at: values.ends_at?.format('YYYY-MM-DD HH:mm:ss')};
      if (isEdit) {
        await adminAxios.put(`/flash-sales/${id}`, data);
        message.success('Updated');
      } else {
        const res = await adminAxios.post('/flash-sales', data);
        message.success('Created');
        navigate(`/flash-sales/${res.data.flash_sale.id}/edit`);
      }
    } catch (err) { message.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  const addProduct = async () => {
    if (!newProduct.product_id || !id) return;
    try {
      await adminAxios.post(`/flash-sales/${id}/products`, {products: [newProduct]});
      message.success('Product added');
      const res = await adminAxios.get(`/flash-sales/${id}`);
      setProducts(res.data.products || []);
      setNewProduct({product_id: null, flash_price: 0, stock_limit: null});
    } catch (err) { message.error(err.response?.data?.message || 'Failed'); }
  };

  const removeProduct = async (productId) => {
    try {
      await adminAxios.delete(`/flash-sales/${id}/products`, {data: {product_ids: [productId]}});
      setProducts(prev => prev.filter(p => p.product_id !== productId));
      message.success('Removed');
    } catch { message.error('Failed'); }
  };

  const productColumns = [
    {title: 'Product', key: 'name', render: (_, r) => r.product?.name || `Product #${r.product_id}`},
    {title: 'Original Price', key: 'price', render: (_, r) => `${r.product?.price || 0} BDT`},
    {title: 'Flash Price', dataIndex: 'flash_price', key: 'flash_price', render: (v) => `${v} BDT`},
    {title: 'Stock Limit', dataIndex: 'stock_limit', key: 'stock_limit', render: (v) => v || 'Unlimited'},
    {title: 'Sold', dataIndex: 'sold_count', key: 'sold_count'},
    {title: '', key: 'actions', render: (_, r) => <Popconfirm title='Remove?' onConfirm={() => removeProduct(r.product_id)}><Button icon={<DeleteOutlined />} size='small' danger /></Popconfirm>},
  ];

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/flash-sales')} />
        <Title level={3} style={{margin: 0}}>{isEdit ? 'Edit Flash Sale' : 'Create Flash Sale'}</Title>
      </div>

      <Card loading={loading}>
        <Form form={form} layout='vertical' onFinish={handleSubmit} initialValues={{is_active: true, discount_type: 'percentage', discount_value: 0}}>
          <Form.Item name='name' label='Name' rules={[{required: true}]}><Input /></Form.Item>
          <Form.Item name='description' label='Description'><Input.TextArea rows={2} /></Form.Item>
          <Space wrap>
            <Form.Item name='discount_type' label='Discount Type' rules={[{required: true}]}><Select style={{width: 150}} options={[{value: 'percentage', label: 'Percentage'}, {value: 'fixed', label: 'Fixed Amount'}]} /></Form.Item>
            <Form.Item name='discount_value' label='Discount Value' rules={[{required: true}]}><InputNumber min={0} style={{width: 150}} /></Form.Item>
          </Space>
          <Space wrap>
            <Form.Item name='starts_at' label='Start Date' rules={[{required: true}]}><DatePicker showTime format='YYYY-MM-DD HH:mm:ss' /></Form.Item>
            <Form.Item name='ends_at' label='End Date' rules={[{required: true}]}><DatePicker showTime format='YYYY-MM-DD HH:mm:ss' /></Form.Item>
          </Space>
          <Form.Item name='is_active' label='Active' valuePropName='checked'><Switch /></Form.Item>
          <Button type='primary' htmlType='submit' icon={<SaveOutlined />} loading={saving}>Save</Button>
        </Form>
      </Card>

      {isEdit && (
        <Card title='Flash Sale Products' style={{marginTop: 16}}>
          <Space style={{marginBottom: 16}} wrap>
            <Select placeholder='Select product' value={newProduct.product_id} onChange={(v) => setNewProduct(p => ({...p, product_id: v}))} style={{width: 250}} showSearch optionFilterProp='label'
              options={allProducts.filter(p => !products.some(fp => fp.product_id === p.id)).map(p => ({value: p.id, label: p.name}))}
            />
            <InputNumber placeholder='Flash Price' value={newProduct.flash_price} onChange={(v) => setNewProduct(p => ({...p, flash_price: v}))} min={0} />
            <InputNumber placeholder='Stock Limit (optional)' value={newProduct.stock_limit} onChange={(v) => setNewProduct(p => ({...p, stock_limit: v}))} min={0} />
            <Button icon={<PlusOutlined />} onClick={addProduct} type='primary'>Add</Button>
          </Space>
          <Table columns={productColumns} dataSource={products} rowKey='id' pagination={false} size='small' />
        </Card>
      )}
    </div>
  );
};

export default FlashSaleForm;
