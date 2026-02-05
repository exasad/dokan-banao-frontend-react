import { useState, useEffect } from 'react';
import { Typography, Row, Col, Card, Statistic, Spin, Table, Tag, Progress, Avatar, DatePicker, Space, Button } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  ShoppingOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  InboxOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminAxios from '../../services/adminAxios';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0).replace('BDT', '৳');
};

// Preset date ranges
const rangePresets = [
  { label: 'Today', value: [dayjs(), dayjs()] },
  { label: 'Yesterday', value: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')] },
  { label: 'Last 7 Days', value: [dayjs().subtract(6, 'day'), dayjs()] },
  { label: 'Last 30 Days', value: [dayjs().subtract(29, 'day'), dayjs()] },
  { label: 'This Month', value: [dayjs().startOf('month'), dayjs()] },
  { label: 'Last Month', value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')] },
  { label: 'This Year', value: [dayjs().startOf('year'), dayjs()] },
];

const AdminDashboard = () => {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]); // Default to today
  const navigate = useNavigate();

  const fetchStats = async (dates = null) => {
    setLoading(true);
    try {
      const params = {};
      if (dates && dates[0] && dates[1]) {
        params.start_date = dates[0].format('YYYY-MM-DD');
        params.end_date = dates[1].format('YYYY-MM-DD');
      }
      const res = await adminAxios.get('/dashboard/stats', { params });
      setStats(res.data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats([dayjs(), dayjs()]); // Fetch today's data on mount
  }, []);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    fetchStats(dates);
  };

  const handleReset = () => {
    const today = [dayjs(), dayjs()];
    setDateRange(today);
    fetchStats(today);
  };

  const orderColumns = [
    {
      title: 'Order',
      dataIndex: 'order_number',
      key: 'order_number',
      render: (text) => <Text strong>#{text}</Text>,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div>
          <Text>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.phone}</Text>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      key: 'total',
      render: (val) => <Text strong>{formatCurrency(val)}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          pending: 'orange',
          confirmed: 'blue',
          processing: 'cyan',
          shipped: 'purple',
          delivered: 'green',
          cancelled: 'red',
        };
        return <Tag color={colors[status] || 'default'}>{status?.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Payment',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (status) => (
        <Tag color={status === 'paid' ? 'green' : 'orange'}>{status?.toUpperCase()}</Tag>
      ),
    },
  ];

  const StatCard = ({ title, value, prefix, suffix, color, icon, onClick }) => (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      bodyStyle={{ padding: '20px 24px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>{title}</Text>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            {prefix && <Text style={{ fontSize: 18, color }}>{prefix}</Text>}
            <Text strong style={{ fontSize: 28, color }}>{value}</Text>
            {suffix && <Text type="secondary" style={{ fontSize: 13 }}>{suffix}</Text>}
          </div>
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {icon}
        </div>
      </div>
    </Card>
  );

  const OrderStatusCard = ({ icon, label, count, color, total }) => {
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text>{label}</Text>
            <Text strong>{count}</Text>
          </div>
          <Progress percent={percent} showInfo={false} strokeColor={color} size="small" />
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header with Date Range Picker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>Dashboard</Title>
          <Text type="secondary">
            {dateRange && dateRange[0] && dateRange[1]
              ? dateRange[0].isSame(dayjs(), 'day') && dateRange[1].isSame(dayjs(), 'day')
                ? `Welcome back, ${user?.name}! Here's today's overview.`
                : `Showing data from ${dateRange[0].format('MMM D, YYYY')} to ${dateRange[1].format('MMM D, YYYY')}`
              : `Welcome back, ${user?.name}!`
            }
          </Text>
        </div>
        <Space wrap>
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            presets={rangePresets}
            format="MMM D, YYYY"
            allowClear={false}
            style={{ minWidth: 280 }}
          />
          {dateRange && (
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Reset
            </Button>
          )}
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Main Stats */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title={dateRange ? "Revenue (Selected Period)" : "Total Revenue"}
                value={formatCurrency(stats?.revenue?.total)}
                color="#52c41a"
                icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title={dateRange ? "Orders (Selected Period)" : "Total Orders"}
                value={stats?.orders?.total || 0}
                color="#1677ff"
                icon={<ShoppingCartOutlined style={{ fontSize: 24, color: '#1677ff' }} />}
                onClick={() => navigate('/orders')}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Total Products"
                value={stats?.products?.total || 0}
                color="#722ed1"
                icon={<ShoppingOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
                onClick={() => navigate('/products')}
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Total Customers"
                value={stats?.customers?.total || 0}
                color="#fa8c16"
                icon={<UserOutlined style={{ fontSize: 24, color: '#fa8c16' }} />}
              />
            </Col>
          </Row>

          {/* Today & This Month - Only show when no date filter */}
          {!dateRange && (
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12}>
                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <CalendarOutlined style={{ fontSize: 18, color: '#1677ff' }} />
                    <Text strong style={{ fontSize: 15 }}>Today</Text>
                  </div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Orders"
                        value={stats?.today?.orders || 0}
                        valueStyle={{ color: '#1677ff' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Revenue"
                        value={stats?.today?.revenue || 0}
                        prefix="৳"
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <RiseOutlined style={{ fontSize: 18, color: '#52c41a' }} />
                    <Text strong style={{ fontSize: 15 }}>This Month</Text>
                  </div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Orders"
                        value={stats?.this_month?.orders || 0}
                        valueStyle={{ color: '#1677ff' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Revenue"
                        value={stats?.this_month?.revenue || 0}
                        prefix="৳"
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          )}

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {/* Order Status */}
            <Col xs={24} lg={8}>
              <Card title="Order Status" bodyStyle={{ padding: '12px 24px' }}>
                <OrderStatusCard
                  icon={<ClockCircleOutlined />}
                  label="Pending"
                  count={stats?.orders?.pending || 0}
                  color="#fa8c16"
                  total={stats?.orders?.total || 0}
                />
                <OrderStatusCard
                  icon={<CheckCircleOutlined />}
                  label="Confirmed"
                  count={stats?.orders?.confirmed || 0}
                  color="#1677ff"
                  total={stats?.orders?.total || 0}
                />
                <OrderStatusCard
                  icon={<InboxOutlined />}
                  label="Processing"
                  count={stats?.orders?.processing || 0}
                  color="#13c2c2"
                  total={stats?.orders?.total || 0}
                />
                <OrderStatusCard
                  icon={<TruckOutlined />}
                  label="Shipped"
                  count={stats?.orders?.shipped || 0}
                  color="#722ed1"
                  total={stats?.orders?.total || 0}
                />
                <OrderStatusCard
                  icon={<CheckCircleOutlined />}
                  label="Delivered"
                  count={stats?.orders?.delivered || 0}
                  color="#52c41a"
                  total={stats?.orders?.total || 0}
                />
                <div style={{ paddingTop: 12 }}>
                  <OrderStatusCard
                    icon={<ClockCircleOutlined />}
                    label="Cancelled"
                    count={stats?.orders?.cancelled || 0}
                    color="#ff4d4f"
                    total={stats?.orders?.total || 0}
                  />
                </div>
              </Card>
            </Col>

            {/* Product Stats */}
            <Col xs={24} lg={8}>
              <Card title="Product Status" bodyStyle={{ padding: '16px 24px' }}>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Active Products</Text>
                    <Text strong style={{ color: '#52c41a' }}>{stats?.products?.active || 0}</Text>
                  </div>
                  <Progress
                    percent={stats?.products?.total > 0 ? Math.round((stats?.products?.active / stats?.products?.total) * 100) : 0}
                    strokeColor="#52c41a"
                    showInfo={false}
                  />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Low Stock</Text>
                    <Text strong style={{ color: '#fa8c16' }}>{stats?.products?.low_stock || 0}</Text>
                  </div>
                  <Progress
                    percent={stats?.products?.total > 0 ? Math.round((stats?.products?.low_stock / stats?.products?.total) * 100) : 0}
                    strokeColor="#fa8c16"
                    showInfo={false}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text>Out of Stock</Text>
                    <Text strong style={{ color: '#ff4d4f' }}>{stats?.products?.out_of_stock || 0}</Text>
                  </div>
                  <Progress
                    percent={stats?.products?.total > 0 ? Math.round((stats?.products?.out_of_stock / stats?.products?.total) * 100) : 0}
                    strokeColor="#ff4d4f"
                    showInfo={false}
                  />
                </div>

                <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Total Categories</Text>
                    <Text strong>{stats?.categories || 0}</Text>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Top Products */}
            <Col xs={24} lg={8}>
              <Card title={dateRange ? "Top Selling (Selected Period)" : "Top Selling Products"} bodyStyle={{ padding: '8px 0' }}>
                {stats?.top_products?.length > 0 ? (
                  stats.top_products.map((product, idx) => (
                    <div
                      key={product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 24px',
                        borderBottom: idx < stats.top_products.length - 1 ? '1px solid #f0f0f0' : 'none',
                      }}
                    >
                      <Text strong style={{ width: 20, color: idx < 3 ? '#1677ff' : '#999' }}>
                        #{idx + 1}
                      </Text>
                      <Avatar
                        shape="square"
                        size={40}
                        src={product.thumbnail}
                        style={{ borderRadius: 8 }}
                      >
                        {product.name?.[0]}
                      </Avatar>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text ellipsis style={{ display: 'block' }}>{product.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{formatCurrency(product.price)}</Text>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Text strong style={{ color: '#52c41a' }}>{product.sold_count || 0}</Text>
                        <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>sold</Text>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: 40, textAlign: 'center' }}>
                    <Text type="secondary">No sales data yet</Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* Recent Orders */}
          <Card
            title={dateRange ? "Orders (Selected Period)" : "Recent Orders"}
            extra={<a onClick={() => navigate('/orders')}>View All</a>}
          >
            <Table
              dataSource={stats?.recent_orders || []}
              columns={orderColumns}
              rowKey="id"
              pagination={false}
              size="middle"
              locale={{ emptyText: 'No orders found' }}
              onRow={(record) => ({
                onClick: () => navigate(`/orders/${record.id}`),
                style: { cursor: 'pointer' },
              })}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
