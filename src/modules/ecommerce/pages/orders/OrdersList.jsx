import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Table, Button, Input, Select, Space, Tag, Typography, Card, Row, Col, Statistic, Badge, Dropdown, message, Spin,
} from 'antd';
import {
  SearchOutlined, EyeOutlined, EditOutlined, DownOutlined,
  ShoppingCartOutlined, PhoneOutlined, UserOutlined,
} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';
import {statuses, paymentMethods, statusConfig, paymentStatusConfig} from './ordersData';

const {Title, Text} = Typography;

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [paymentFilter, setPaymentFilter] = useState(undefined);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({current: 1, pageSize: 15, total: 0});

  const fetchOrders = async (page = 1, pageSize = 15) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('per_page', pageSize);
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (paymentFilter) params.set('payment_status', paymentFilter);
      if (paymentMethodFilter) params.set('payment_method', paymentMethodFilter);

      const {data} = await adminAxios.get(`/orders?${params.toString()}`);
      setOrders(data.data || []);
      setPagination({
        current: data.current_page,
        pageSize: data.per_page,
        total: data.total,
      });
    } catch {
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const {data} = await adminAxios.get('/orders/stats');
      setStats(data);
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchOrders(1, pagination.pageSize);
  }, [search, statusFilter, paymentFilter, paymentMethodFilter]);

  const handleTableChange = (pag) => {
    fetchOrders(pag.current, pag.pageSize);
  };

  const handleBulkAction = async ({key}) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await adminAxios.post('/orders/bulk-action', {
        ids: selectedRowKeys,
        action: key,
      });
      message.success(`${selectedRowKeys.length} order(s) updated`);
      setSelectedRowKeys([]);
      fetchOrders(pagination.current, pagination.pageSize);
      fetchStats();
    } catch {
      message.error('Failed to update orders');
    }
  };

  const bulkMenuItems = {
    items: [
      {key: 'confirmed', label: 'Mark Confirmed'},
      {key: 'processing', label: 'Mark Processing'},
      {key: 'shipped', label: 'Mark Shipped'},
      {key: 'delivered', label: 'Mark Delivered'},
      {type: 'divider'},
      {key: 'cancelled', label: 'Cancel Orders', danger: true},
    ],
    onClick: handleBulkAction,
  };

  const columns = [
    {
      title: 'Order No', dataIndex: 'order_number', key: 'order_number', width: 150,
      render: (v, r) => (
        <Text strong style={{color: '#1677ff', cursor: 'pointer'}} onClick={(e) => { e.stopPropagation(); navigate(`/orders/${r.id}`); }}>
          {v}
        </Text>
      ),
    },
    {
      title: 'Customer', key: 'customer', width: 200,
      render: (_, r) => (
        <div>
          <div><UserOutlined style={{marginRight: 4}} /><Text strong>{r.name}</Text></div>
          <Text type='secondary' style={{fontSize: 12}}><PhoneOutlined style={{marginRight: 4}} />{r.phone}</Text>
        </div>
      ),
    },
    {
      title: 'Items', key: 'items', width: 70,
      render: (_, r) => <Badge count={r.items?.length || 0} style={{backgroundColor: '#1677ff'}} />,
    },
    {
      title: 'Total', dataIndex: 'total', key: 'total', width: 120,
      render: (v) => <Text strong>৳{Number(v).toLocaleString('en-BD')}</Text>,
    },
    {
      title: 'Payment', key: 'payment', width: 160,
      render: (_, r) => (
        <div>
          <div style={{fontSize: 12, textTransform: 'uppercase'}}>{r.payment_method}</div>
          <Tag color={paymentStatusConfig[r.payment_status]?.color} style={{marginTop: 2}}>{r.payment_status?.toUpperCase()}</Tag>
        </div>
      ),
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 130,
      render: (s) => <Tag icon={statusConfig[s]?.icon} color={statusConfig[s]?.color}>{s?.charAt(0).toUpperCase() + s?.slice(1)}</Tag>,
    },
    {
      title: 'Date', dataIndex: 'created_at', key: 'created_at', width: 120,
      render: (v) => {
        const d = new Date(v);
        return (
          <div>
            <div style={{fontSize: 12}}>{d.toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}</div>
            <Text type='secondary' style={{fontSize: 11}}>{d.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</Text>
          </div>
        );
      },
    },
    {
      title: 'Actions', key: 'actions', width: 100, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} size='small' onClick={(e) => { e.stopPropagation(); navigate(`/orders/${record.id}`); }} />
          <Button icon={<EditOutlined />} size='small' onClick={(e) => { e.stopPropagation(); navigate(`/orders/${record.id}/edit`); }} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Title level={3} style={{margin: 0}}>Orders</Title>
      </div>

      <Row gutter={[16, 16]} style={{marginBottom: 16}}>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'><Statistic title='Total Orders' value={stats.total || 0} prefix={<ShoppingCartOutlined />} /></Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'><Statistic title='Pending' value={stats.pending || 0} valueStyle={{color: '#faad14'}} /></Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'><Statistic title='Processing' value={(stats.processing || 0) + (stats.confirmed || 0)} valueStyle={{color: '#13c2c2'}} /></Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'><Statistic title='Shipped' value={stats.shipped || 0} valueStyle={{color: '#722ed1'}} /></Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'><Statistic title='Delivered' value={stats.delivered || 0} valueStyle={{color: '#52c41a'}} /></Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size='small'><Statistic title='Revenue' value={stats.revenue || 0} prefix='৳' valueStyle={{color: '#52c41a'}} /></Card>
        </Col>
      </Row>

      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Space wrap style={{flex: 1}}>
          <Input placeholder='Order no, name, phone...' prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} style={{width: 240, minWidth: 150, maxWidth: '100%'}} allowClear />
          <Select placeholder='Status' value={statusFilter} onChange={setStatusFilter} allowClear style={{width: 140, minWidth: 100}}
            options={statuses.map((s) => ({value: s, label: s.charAt(0).toUpperCase() + s.slice(1)}))} />
          <Select placeholder='Payment Status' value={paymentFilter} onChange={setPaymentFilter} allowClear style={{width: 150, minWidth: 100}}
            options={[{value: 'pending', label: 'Pending'}, {value: 'paid', label: 'Paid'}, {value: 'failed', label: 'Failed'}, {value: 'refunded', label: 'Refunded'}]} />
          <Select placeholder='Payment Method' value={paymentMethodFilter} onChange={setPaymentMethodFilter} allowClear style={{width: 160, minWidth: 100}}
            options={paymentMethods.map((m) => ({value: m.toLowerCase().replace(/\s+/g, '_'), label: m}))} />
        </Space>
        {selectedRowKeys.length > 0 && (
          <Dropdown menu={bulkMenuItems}>
            <Button>Bulk Actions ({selectedRowKeys.length}) <DownOutlined /></Button>
          </Dropdown>
        )}
      </div>

      <Table
        rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}}
        columns={columns}
        dataSource={orders}
        rowKey='id'
        loading={loading}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({onClick: () => navigate(`/orders/${record.id}`), style: {cursor: 'pointer'}})}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} orders`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default OrdersList;
