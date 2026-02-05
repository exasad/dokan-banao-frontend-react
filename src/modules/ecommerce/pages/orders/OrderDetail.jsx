import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {
  Typography, Button, Space, Card, Row, Col, Tag, Descriptions, Divider, Timeline,
  Avatar, Table, Statistic, message, Select, Steps, Spin,
} from 'antd';
import {
  ArrowLeftOutlined, EditOutlined, PrinterOutlined, UserOutlined, PhoneOutlined,
  EnvironmentOutlined, MailOutlined,
  CheckCircleOutlined, ClockCircleOutlined, CarOutlined, ShoppingCartOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';
import {statusConfig, paymentStatusConfig, statuses} from './ordersData';

const {Title, Text, Paragraph} = Typography;

const OrderDetail = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const {data} = await adminAxios.get(`/orders/${id}`);
      setOrder(data);
    } catch {
      message.error('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) return <div style={{textAlign: 'center', padding: 50}}><Spin size="large" /></div>;
  if (!order) return null;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const {data} = await adminAxios.put(`/orders/${id}`, {status: newStatus});
      setOrder(data);
      message.success(`Order status updated to ${newStatus}`);
    } catch {
      message.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const {data} = await adminAxios.put(`/orders/${id}`, {payment_status: newStatus});
      setOrder(data);
      message.success(`Payment status updated to ${newStatus}`);
    } catch {
      message.error('Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  const stepItems = [
    {title: 'Placed', icon: <ClockCircleOutlined />},
    {title: 'Confirmed', icon: <CheckCircleOutlined />},
    {title: 'Processing', icon: <ShoppingCartOutlined />},
    {title: 'Shipped', icon: <CarOutlined />},
    {title: 'Delivered', icon: <CheckCircleOutlined />},
  ];
  const stepMap = {pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4};
  const currentStep = order.status === 'cancelled' || order.status === 'returned' ? -1 : (stepMap[order.status] ?? 0);

  const itemColumns = [
    {
      title: 'Product', key: 'product',
      render: (_, r) => (
        <Space>
          <Avatar shape='square' size={40} src={r.product?.thumbnail} style={{background: '#f0f0f0', color: '#666'}}>
            {r.product_name?.charAt(0) || 'P'}
          </Avatar>
          <div>
            <Text strong>{r.product_name}</Text>
            {r.variant_name && <div><Text type='secondary' style={{fontSize: 12}}>{r.variant_name}</Text></div>}
          </div>
        </Space>
      ),
    },
    {title: 'Price', dataIndex: 'price', key: 'price', width: 110, render: (v) => `৳${Number(v).toLocaleString('en-BD')}`},
    {title: 'Qty', dataIndex: 'quantity', key: 'quantity', width: 70, align: 'center'},
    {title: 'Total', dataIndex: 'total', key: 'total', width: 120, render: (v) => <Text strong>৳{Number(v).toLocaleString('en-BD')}</Text>},
  ];

  const formatDate = (d) => new Date(d).toLocaleString('en-GB', {day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'});

  return (
    <div>
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12}}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/orders')} />
          <Title level={3} style={{margin: 0}}>Order {order.order_number}</Title>
          <Tag icon={statusConfig[order.status]?.icon} color={statusConfig[order.status]?.color} style={{fontSize: 13, padding: '2px 12px'}}>
            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </Tag>
        </Space>
        <Space>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Print Invoice</Button>
          <Button type='primary' icon={<EditOutlined />} onClick={() => navigate(`/orders/${order.id}/edit`)}>Edit Order</Button>
        </Space>
      </div>

      {/* Order Progress Steps */}
      {order.status !== 'cancelled' && order.status !== 'returned' && (
        <Card style={{marginBottom: 24}}>
          <Steps current={currentStep} items={stepItems} size='small' />
        </Card>
      )}
      {order.status === 'cancelled' && (
        <Card style={{marginBottom: 24, borderColor: '#ff4d4f'}}>
          <div style={{textAlign: 'center'}}><CloseCircleOutlined style={{fontSize: 32, color: '#ff4d4f'}} /><Title level={4} style={{color: '#ff4d4f', margin: '8px 0 0'}}>Order Cancelled</Title></div>
        </Card>
      )}
      {order.status === 'returned' && (
        <Card style={{marginBottom: 24, borderColor: '#fa8c16'}}>
          <div style={{textAlign: 'center'}}><CloseCircleOutlined style={{fontSize: 32, color: '#fa8c16'}} /><Title level={4} style={{color: '#fa8c16', margin: '8px 0 0'}}>Order Returned</Title></div>
        </Card>
      )}

      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} lg={16}>
          {/* Order Items */}
          <Card title='Order Items' style={{marginBottom: 24}}>
            <Table columns={itemColumns} dataSource={order.items || []} rowKey='id' pagination={false} size='small' scroll={{ x: 'max-content' }} />
            <div style={{marginTop: 16, padding: '16px', background: '#fafafa', borderRadius: 8}}>
              <Row justify='end'>
                <Col xs={24} sm={12} md={8}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 6}}>
                    <Text type='secondary'>Subtotal</Text><Text>৳{Number(order.subtotal).toLocaleString('en-BD')}</Text>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 6}}>
                    <Text type='secondary'>Shipping</Text><Text>৳{Number(order.delivery_charge || 0).toLocaleString('en-BD')}</Text>
                  </div>
                  {Number(order.discount) > 0 && (
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 6}}>
                      <Text type='secondary'>Discount</Text><Text style={{color: '#f5222d'}}>-৳{Number(order.discount).toLocaleString('en-BD')}</Text>
                    </div>
                  )}
                  <Divider style={{margin: '8px 0'}} />
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Text strong style={{fontSize: 16}}>Total</Text>
                    <Text strong style={{fontSize: 16, color: '#1677ff'}}>৳{Number(order.total).toLocaleString('en-BD')}</Text>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card title='Notes' style={{marginBottom: 24}}>
              <Paragraph style={{margin: 0, padding: '8px 12px', background: '#fffbe6', borderRadius: 6, border: '1px solid #ffe58f'}}>{order.notes}</Paragraph>
            </Card>
          )}
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          {/* Quick Actions */}
          <Card title='Quick Actions' size='small' style={{marginBottom: 16}}>
            <div style={{marginBottom: 12}}>
              <Text type='secondary' style={{display: 'block', marginBottom: 4, fontSize: 12}}>Order Status</Text>
              <Select value={order.status} onChange={handleStatusChange} style={{width: '100%'}} loading={updating}
                options={statuses.map((s) => ({value: s, label: s.charAt(0).toUpperCase() + s.slice(1)}))} />
            </div>
            <div>
              <Text type='secondary' style={{display: 'block', marginBottom: 4, fontSize: 12}}>Payment Status</Text>
              <Select value={order.payment_status} onChange={handlePaymentStatusChange} style={{width: '100%'}} loading={updating}
                options={['pending', 'paid', 'failed', 'refunded'].map((s) => ({value: s, label: s.charAt(0).toUpperCase() + s.slice(1)}))} />
            </div>
          </Card>

          {/* Customer Info */}
          <Card title={<><UserOutlined style={{marginRight: 8}} />Customer</>} size='small' style={{marginBottom: 16}}>
            <Space direction='vertical' size={6} style={{width: '100%'}}>
              <Text strong style={{fontSize: 15}}>{order.name}</Text>
              {order.email && <Text><MailOutlined style={{marginRight: 8, color: '#999'}} />{order.email}</Text>}
              <Text><PhoneOutlined style={{marginRight: 8, color: '#999'}} />{order.phone}</Text>
              <Divider style={{margin: '8px 0'}} />
              <Text strong style={{fontSize: 12, color: '#999'}}>SHIPPING ADDRESS</Text>
              <Text><EnvironmentOutlined style={{marginRight: 8, color: '#999'}} />{order.address}</Text>
              {(order.city || order.area || order.postal_code) && (
                <Text type='secondary'>{[order.area, order.city, order.postal_code].filter(Boolean).join(', ')}</Text>
              )}
            </Space>
          </Card>

          {/* Payment Info */}
          <Card title='Payment' size='small' style={{marginBottom: 16}}>
            <Descriptions column={1} size='small'>
              <Descriptions.Item label='Method'>{order.payment_method?.toUpperCase() || 'COD'}</Descriptions.Item>
              <Descriptions.Item label='Status'>
                <Tag color={paymentStatusConfig[order.payment_status]?.color}>{order.payment_status?.toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label='Total'>
                <Text strong style={{color: '#1677ff'}}>৳{Number(order.total).toLocaleString('en-BD')}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Shipping Info */}
          <Card title='Shipping' size='small' style={{marginBottom: 16}}>
            <Descriptions column={1} size='small'>
              <Descriptions.Item label='Courier'>{order.courier_provider || 'Not assigned'}</Descriptions.Item>
              <Descriptions.Item label='Tracking'>
                {order.tracking_number ? <Text copyable>{order.tracking_number}</Text> : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label='Shipping Fee'>৳{Number(order.delivery_charge || 0).toLocaleString('en-BD')}</Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Coupon */}
          {order.coupon_code && (
            <Card title='Coupon' size='small' style={{marginBottom: 16}}>
              <Tag color='green'>{order.coupon_code}</Tag>
              {Number(order.discount) > 0 && <Text type='secondary' style={{marginLeft: 8}}>-৳{Number(order.discount).toLocaleString('en-BD')}</Text>}
            </Card>
          )}

          {/* Order Summary */}
          <Card title='Summary' size='small'>
            <Descriptions column={1} size='small'>
              <Descriptions.Item label='Order Date'>{formatDate(order.created_at)}</Descriptions.Item>
              <Descriptions.Item label='Last Updated'>{formatDate(order.updated_at)}</Descriptions.Item>
              <Descriptions.Item label='Items'>{order.items?.length || 0} product(s)</Descriptions.Item>
              <Descriptions.Item label='Total Quantity'>{order.items?.reduce((s, i) => s + i.quantity, 0) || 0}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetail;
