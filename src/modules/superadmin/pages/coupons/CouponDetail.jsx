import {useState, useEffect} from 'react';
import {
  Card,
  Typography,
  Descriptions,
  Tag,
  Table,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  message,
  Spin,
} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import {useParams, useNavigate} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const statusColors = {
  active: 'green',
  inactive: 'orange',
  expired: 'red',
};

const CouponDetail = () => {
  const [coupon, setCoupon] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [couponRes, statsRes] = await Promise.all([
          superadminAxios.get(`/coupons/${id}`),
          superadminAxios.get(`/coupons/${id}/stats`),
        ]);
        setCoupon(couponRes.data);
        setStats(statsRes.data);
      } catch {
        message.error('Failed to fetch coupon details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;
  if (!coupon) return null;

  const affiliateColumns = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'Email', dataIndex: 'email', key: 'email'},
    {title: 'Commission Rate', dataIndex: 'commission_rate', key: 'commission_rate', render: (v) => `${v}%`},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag>,
    },
  ];

  const usageColumns = [
    {title: 'ID', dataIndex: 'id', key: 'id'},
    {title: 'Affiliate', dataIndex: ['affiliate', 'name'], key: 'affiliate'},
    {title: 'Tenant', dataIndex: ['tenant', 'name'], key: 'tenant'},
    {
      title: 'Order Amount',
      dataIndex: 'order_amount',
      key: 'order_amount',
      render: (v) => `$${parseFloat(v).toFixed(2)}`,
    },
    {
      title: 'Discount',
      dataIndex: 'discount_amount',
      key: 'discount_amount',
      render: (v) => `$${parseFloat(v).toFixed(2)}`,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v) => new Date(v).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <Space style={{marginBottom: 16}}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/superadmin/coupons')}
        >
          Back
        </Button>
      </Space>
      <Title level={3} style={{marginBottom: 24}}>
        Coupon: {coupon.code}
      </Title>

      {stats && (
        <Row gutter={[16, 16]} style={{marginBottom: 24}}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic title='Total Uses' value={stats.total_uses} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic title='Total Discount Given' value={stats.total_discount} prefix='$' precision={2} valueStyle={{color: '#faad14'}} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic title='Total Order Revenue' value={stats.total_order_revenue} prefix='$' precision={2} valueStyle={{color: '#52c41a'}} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic title='Assigned Affiliates' value={stats.affiliates_count} />
            </Card>
          </Col>
        </Row>
      )}

      <Card style={{marginBottom: 24}} title='Coupon Details'>
        <Descriptions column={{xs: 1, sm: 2}}>
          <Descriptions.Item label='Code'>{coupon.code}</Descriptions.Item>
          <Descriptions.Item label='Type'>
            <Tag color={coupon.type === 'percentage' ? 'blue' : 'purple'}>{coupon.type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Value'>
            {coupon.type === 'percentage' ? `${coupon.value}%` : `$${parseFloat(coupon.value).toFixed(2)}`}
          </Descriptions.Item>
          <Descriptions.Item label='Status'>
            <Tag color={statusColors[coupon.status]}>{coupon.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Min Order Amount'>
            {coupon.min_order_amount ? `$${parseFloat(coupon.min_order_amount).toFixed(2)}` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Max Discount Amount'>
            {coupon.max_discount_amount ? `$${parseFloat(coupon.max_discount_amount).toFixed(2)}` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Usage'>
            {coupon.usage_count || 0}/{coupon.usage_limit || '\u221E'}
          </Descriptions.Item>
          <Descriptions.Item label='Description'>{coupon.description || '-'}</Descriptions.Item>
          <Descriptions.Item label='Starts At'>
            {coupon.starts_at ? new Date(coupon.starts_at).toLocaleDateString() : '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Expires At'>
            {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Created'>
            {new Date(coupon.created_at).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{marginBottom: 24}} title='Assigned Affiliates'>
        <Table
          columns={affiliateColumns}
          dataSource={coupon.affiliates || []}
          rowKey='id'
          pagination={false}
        />
      </Card>

      <Card title='Usage History'>
        <Table
          columns={usageColumns}
          dataSource={coupon.usages || []}
          rowKey='id'
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default CouponDetail;
