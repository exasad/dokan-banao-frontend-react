import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
  Typography, Button, Space, Card, Row, Col, Form, Input, InputNumber, Select,
  Divider, Table, Tag, message, Avatar, Spin, Popconfirm,
} from 'antd';
import {
  ArrowLeftOutlined, SaveOutlined, UserOutlined, PhoneOutlined, EnvironmentOutlined,
  PlusOutlined, DeleteOutlined,
} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';
import {statusConfig, statuses, paymentMethods} from './ordersData';

const {Title, Text} = Typography;
const {TextArea} = Input;

const OrderEdit = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState([]);
  const [products, setProducts] = useState([]);
  const [addProductId, setAddProductId] = useState(undefined);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addVariantId, setAddVariantId] = useState(undefined);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [selectedDeliveryChargeId, setSelectedDeliveryChargeId] = useState(undefined);

  useEffect(() => {
    Promise.all([
      adminAxios.get('/delivery-charges', {params: {per_page: 100, is_active: '1'}}),
      adminAxios.get('/products', {params: {per_page: 200, is_active: '1'}}),
    ]).then(([dcRes, prodRes]) => {
      setDeliveryCharges(dcRes.data.data || []);
      setProducts(prodRes.data.data || []);
    }).catch(() => {});
  }, []);

  // Match delivery charge after both order and delivery charges are loaded
  useEffect(() => {
    if (order?.delivery_charge && deliveryCharges.length > 0) {
      const currentCharge = parseFloat(order.delivery_charge);
      const matchingDc = deliveryCharges.find(d => parseFloat(d.charge) === currentCharge);
      if (matchingDc) setSelectedDeliveryChargeId(matchingDc.id);
    }
  }, [order?.delivery_charge, deliveryCharges]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const {data} = await adminAxios.get(`/orders/${id}`);
        setOrder(data);
        form.setFieldsValue({
          name: data.name,
          email: data.email || '',
          phone: data.phone,
          address: data.address,
          city: data.city || '',
          area: data.area || '',
          postal_code: data.postal_code || '',
          status: data.status,
          payment_method: data.payment_method,
          payment_status: data.payment_status,
          courier_provider: data.courier_provider || '',
          tracking_number: data.tracking_number || '',
          delivery_charge: parseFloat(data.delivery_charge) || 0,
          discount: parseFloat(data.discount) || 0,
          notes: data.notes || '',
        });
      } catch {
        message.error('Order not found');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate, form]);

  const deliveryChargeVal = Form.useWatch('delivery_charge', form);
  const discountVal = Form.useWatch('discount', form);

  if (loading) return <div style={{textAlign: 'center', padding: 50}}><Spin size="large" /></div>;
  if (!order) return null;

  const subtotal = parseFloat(order.subtotal) || 0;
  const deliveryCharge = deliveryChargeVal || 0;
  const discount = discountVal || 0;
  const grandTotal = subtotal + deliveryCharge - discount;

  const handleProductSelect = async (productId) => {
    setAddProductId(productId);
    setAddVariantId(undefined);
    setSelectedProduct(null);

    if (!productId) return;

    setLoadingVariants(true);
    try {
      const {data} = await adminAxios.get(`/products/${productId}`);
      setSelectedProduct(data);
    } catch {
      message.error('Failed to load product details');
    } finally {
      setLoadingVariants(false);
    }
  };

  const handleAddProduct = async () => {
    if (!addProductId) return;

    // If product has variants, require variant selection
    if (selectedProduct?.variants?.length > 0 && !addVariantId) {
      message.warning('Please select a variant');
      return;
    }

    setAddingItem(true);
    try {
      const {data} = await adminAxios.post(`/orders/${id}/items`, {
        product_id: addProductId,
        variant_id: addVariantId || null,
        quantity: 1,
      });
      setOrder(data);
      setAddProductId(undefined);
      setAddVariantId(undefined);
      setSelectedProduct(null);
      message.success('Product added');
    } catch {
      message.error('Failed to add product');
    } finally {
      setAddingItem(false);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      const {data} = await adminAxios.put(`/orders/${id}/items/${itemId}`, {quantity});
      setOrder(data);
    } catch {
      message.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const {data} = await adminAxios.delete(`/orders/${id}/items/${itemId}`);
      setOrder(data);
      message.success('Product removed');
    } catch {
      message.error('Failed to remove product');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const {data} = await adminAxios.put(`/orders/${id}`, {
        name: values.name,
        email: values.email || null,
        phone: values.phone,
        address: values.address,
        city: values.city || null,
        area: values.area || null,
        postal_code: values.postal_code || null,
        status: values.status,
        payment_method: values.payment_method,
        payment_status: values.payment_status,
        courier_provider: values.courier_provider || null,
        tracking_number: values.tracking_number || null,
        delivery_charge: values.delivery_charge || 0,
        discount: values.discount || 0,
        notes: values.notes || null,
      });
      setOrder(data);
      message.success('Order updated successfully');
      navigate(`/orders/${order.id}`);
    } catch (err) {
      if (err.errorFields) {
        message.error('Please fill in all required fields');
      } else {
        message.error('Failed to update order');
      }
    } finally {
      setSaving(false);
    }
  };

  // Filter out products that are already in the order (but allow products with variants to be re-added for different variants)
  const orderProductIds = (order.items || []).filter(i => !i.variant_id).map(i => i.product_id);
  const availableProducts = products.filter(p => p.variants_count > 0 || !orderProductIds.includes(p.id));

  const itemColumns = [
    {
      title: 'Product', key: 'product',
      render: (_, r) => (
        <Space>
          <Avatar shape='square' size={36} src={r.product?.thumbnail} style={{background: '#f0f0f0', color: '#666'}}>
            {r.product_name?.charAt(0) || 'P'}
          </Avatar>
          <div>
            <Text strong style={{fontSize: 13}}>{r.product_name}</Text>
            {r.variant_name && <div><Text type='secondary' style={{fontSize: 11}}>{r.variant_name}</Text></div>}
            <div><Text type='secondary' style={{fontSize: 11}}>৳{Number(r.price).toLocaleString('en-BD')}/unit</Text></div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Qty', key: 'quantity', width: 120, align: 'center',
      render: (_, r) => (
        <InputNumber
          min={1}
          max={99}
          value={r.quantity}
          onChange={(v) => handleUpdateQuantity(r.id, v || 1)}
          size='small'
          style={{width: 70}}
        />
      ),
    },
    {
      title: 'Total', key: 'total', width: 120,
      render: (_, r) => <Text strong>৳{Number(r.total).toLocaleString('en-BD')}</Text>,
    },
    {
      title: '', key: 'action', width: 50,
      render: (_, r) => (
        <Popconfirm title='Remove this item?' onConfirm={() => handleRemoveItem(r.id)}>
          <Button icon={<DeleteOutlined />} size='small' danger type='text' />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12}}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/orders/${order.id}`)} />
          <Title level={3} style={{margin: 0}}>Edit Order {order.order_number}</Title>
          <Tag icon={statusConfig[order.status]?.icon} color={statusConfig[order.status]?.color}>
            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </Tag>
        </Space>
        <Space>
          <Button onClick={() => navigate(`/orders/${order.id}`)}>Cancel</Button>
          <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving}>Save Changes</Button>
        </Space>
      </div>

      <Form form={form} layout='vertical'>
        <Row gutter={[24, 24]}>
          {/* Left Column */}
          <Col xs={24} lg={16}>
            {/* Order Items */}
            <Card
              title='Order Items'
              style={{marginBottom: 24}}
              extra={
                <Space wrap>
                  <Select
                    placeholder='Select product...'
                    value={addProductId}
                    onChange={handleProductSelect}
                    showSearch
                    optionFilterProp='label'
                    style={{width: 220}}
                    loading={loadingVariants}
                    options={availableProducts.map((p) => ({
                      value: p.id,
                      label: `${p.name} - ৳${Number(p.price).toLocaleString('en-BD')}`,
                    }))}
                  />
                  {selectedProduct?.variants?.length > 0 && (() => {
                    const orderVariantIds = (order.items || []).filter(i => i.product_id === addProductId).map(i => i.variant_id);
                    const availableVariants = selectedProduct.variants.filter(v => v.is_active && !orderVariantIds.includes(v.id));
                    return availableVariants.length > 0 ? (
                      <Select
                        placeholder='Select variant...'
                        value={addVariantId}
                        onChange={setAddVariantId}
                        style={{width: 180}}
                        options={availableVariants.map((v) => ({
                          value: v.id,
                          label: `${v.name} - ৳${Number(v.price).toLocaleString('en-BD')}`,
                        }))}
                      />
                    ) : (
                      <Text type='secondary' style={{fontSize: 12}}>All variants added</Text>
                    );
                  })()}
                  <Button
                    icon={<PlusOutlined />}
                    onClick={handleAddProduct}
                    type='primary'
                    size='small'
                    loading={addingItem}
                    disabled={!addProductId || (selectedProduct?.variants?.length > 0 && !addVariantId)}
                  >
                    Add
                  </Button>
                </Space>
              }
            >
              <Table columns={itemColumns} dataSource={order.items || []} rowKey='id' pagination={false} size='small' scroll={{ x: 'max-content' }} />

              <div style={{marginTop: 16, padding: '16px', background: '#fafafa', borderRadius: 8}}>
                <Row justify='end'>
                  <Col xs={24} sm={12} md={10}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                      <Text type='secondary'>Subtotal</Text><Text>৳{Number(order.subtotal).toLocaleString('en-BD')}</Text>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                      <Text type='secondary'>Shipping (৳)</Text>
                      <Form.Item name='delivery_charge' noStyle><InputNumber min={0} size='small' style={{width: 100}} /></Form.Item>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                      <Text type='secondary'>Discount (৳)</Text>
                      <Form.Item name='discount' noStyle><InputNumber min={0} size='small' style={{width: 100}} /></Form.Item>
                    </div>
                    <Divider style={{margin: '8px 0'}} />
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <Text strong style={{fontSize: 16}}>Grand Total</Text>
                      <Text strong style={{fontSize: 16, color: '#1677ff'}}>৳{Number(order.total).toLocaleString('en-BD')}</Text>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>

            {/* Customer Information */}
            <Card title={<><UserOutlined style={{marginRight: 8}} />Customer Information</>} style={{marginBottom: 24}}>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name='name' label='Full Name' rules={[{required: true, message: 'Name is required'}]}>
                    <Input prefix={<UserOutlined />} placeholder='Customer name' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name='email' label='Email'>
                    <Input prefix={<span>@</span>} placeholder='Email address' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name='phone' label='Phone' rules={[{required: true, message: 'Phone is required'}]}>
                    <Input prefix={<PhoneOutlined />} placeholder='01XXXXXXXXX' />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation='left' style={{fontSize: 13}}>Shipping Address</Divider>
              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item name='address' label='Full Address' rules={[{required: true}]}>
                    <TextArea rows={2} prefix={<EnvironmentOutlined />} placeholder='House, Road, Area...' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name='city' label='City'>
                    <Input placeholder='City' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name='area' label='Area'>
                    <Input placeholder='Area' />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name='postal_code' label='Postal Code'>
                    <Input placeholder='ZIP' />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Notes */}
            <Card title='Notes' style={{marginBottom: 24}}>
              <Form.Item name='notes' label='Order Notes'>
                <TextArea rows={3} placeholder='Notes about this order...' />
              </Form.Item>
            </Card>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={8}>
            {/* Order Status */}
            <Card title='Order Status' size='small' style={{marginBottom: 16}}>
              <Form.Item name='status' label='Status'>
                <Select options={statuses.map((s) => ({value: s, label: s.charAt(0).toUpperCase() + s.slice(1)}))} />
              </Form.Item>
              <Form.Item name='payment_status' label='Payment Status'>
                <Select options={['pending', 'paid', 'failed', 'refunded'].map((s) => ({value: s, label: s.charAt(0).toUpperCase() + s.slice(1)}))} />
              </Form.Item>
              <Form.Item name='payment_method' label='Payment Method'>
                <Select options={paymentMethods.map((m) => ({value: m.toLowerCase().replace(/\s+/g, '_'), label: m}))} />
              </Form.Item>
            </Card>

            {/* Delivery Charge & Courier */}
            <Card title='Shipping & Courier' size='small' style={{marginBottom: 16}}>
              <Form.Item label='Delivery Charge'>
                <Select
                  allowClear
                  placeholder='Select delivery charge'
                  value={selectedDeliveryChargeId}
                  onChange={(val) => {
                    setSelectedDeliveryChargeId(val);
                    if (val !== undefined) {
                      const dc = deliveryCharges.find((d) => d.id === val);
                      if (dc) form.setFieldsValue({delivery_charge: parseFloat(dc.charge)});
                    } else {
                      form.setFieldsValue({delivery_charge: 0});
                    }
                  }}
                  options={deliveryCharges.map((d) => ({value: d.id, label: `${d.name} - ৳${parseFloat(d.charge).toFixed(2)}`}))}
                />
              </Form.Item>
              <Form.Item name='courier_provider' label='Courier'>
                <Input placeholder='e.g., Pathao, Steadfast, Redx' />
              </Form.Item>
              <Form.Item name='tracking_number' label='Tracking ID'>
                <Input placeholder='TRK000000' />
              </Form.Item>
            </Card>

            {/* Save Button (sticky at bottom on mobile) */}
            <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving} block size='large'>
              Save Changes
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default OrderEdit;
