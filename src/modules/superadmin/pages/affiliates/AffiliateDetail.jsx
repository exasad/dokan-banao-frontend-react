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
  Tabs,
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
  suspended: 'red',
};

const commissionStatusColors = {
  pending: 'gold',
  approved: 'blue',
  rejected: 'red',
  paid: 'green',
};

const payoutStatusColors = {
  pending: 'gold',
  completed: 'green',
  failed: 'red',
};

const AffiliateDetail = () => {
  const [affiliate, setAffiliate] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [affiliateRes, statsRes] = await Promise.all([
          superadminAxios.get(`/affiliates/${id}`),
          superadminAxios.get(`/affiliates/${id}/stats`),
        ]);
        setAffiliate(affiliateRes.data);
        setStats(statsRes.data);
      } catch {
        message.error('Failed to fetch affiliate details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;
  if (!affiliate) return null;

  const couponColumns = [
    {title: 'Code', dataIndex: 'code', key: 'code'},
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (t) => <Tag color={t === 'percentage' ? 'blue' : 'purple'}>{t}</Tag>,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (v, record) => record.type === 'percentage' ? `${v}%` : `$${parseFloat(v).toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag>,
    },
  ];

  const commissionColumns = [
    {title: 'ID', dataIndex: 'id', key: 'id'},
    {title: 'Coupon', dataIndex: ['coupon', 'code'], key: 'coupon'},
    {
      title: 'Order Amount',
      dataIndex: 'order_amount',
      key: 'order_amount',
      render: (v) => `$${parseFloat(v).toFixed(2)}`,
    },
    {
      title: 'Commission',
      dataIndex: 'commission_amount',
      key: 'commission_amount',
      render: (v) => `$${parseFloat(v).toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={commissionStatusColors[s]}>{s}</Tag>,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v) => new Date(v).toLocaleDateString(),
    },
  ];

  const payoutColumns = [
    {title: 'ID', dataIndex: 'id', key: 'id'},
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (v) => `$${parseFloat(v).toFixed(2)}`,
    },
    {title: 'Payment Method', dataIndex: 'payment_method', key: 'payment_method'},
    {title: 'Reference', dataIndex: 'reference', key: 'reference', render: (v) => v || '-'},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={payoutStatusColors[s]}>{s}</Tag>,
    },
    {
      title: 'Requested At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      title: 'Processed At',
      dataIndex: 'processed_at',
      key: 'processed_at',
      render: (v) => v ? new Date(v).toLocaleDateString() : '-',
    },
  ];

  const tabItems = [
    {
      key: 'coupons',
      label: 'Assigned Coupons',
      children: (
        <Table
          columns={couponColumns}
          dataSource={affiliate.coupons || []}
          rowKey='id'
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      ),
    },
    {
      key: 'commissions',
      label: 'Commissions',
      children: (
        <Table
          columns={commissionColumns}
          dataSource={affiliate.commissions || []}
          rowKey='id'
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      ),
    },
    {
      key: 'payouts',
      label: 'Payouts',
      children: (
        <Table
          columns={payoutColumns}
          dataSource={affiliate.payouts || []}
          rowKey='id'
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      ),
    },
  ];

  return (
    <div>
      <Space style={{marginBottom: 16}}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/superadmin/affiliates')}
        >
          Back
        </Button>
      </Space>
      <Title level={3} style={{marginBottom: 24}}>
        {affiliate.name}
      </Title>

      {stats && (
        <Row gutter={[16, 16]} style={{marginBottom: 24}}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic title='Total Earned' value={stats.total_earned} prefix='$' precision={2} valueStyle={{color: '#52c41a'}} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic title='Balance' value={stats.balance} prefix='$' precision={2} valueStyle={{color: '#1890ff'}} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic title='Commissions' value={stats.commissions_count} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic title='Payouts' value={stats.payouts_count} />
            </Card>
          </Col>
        </Row>
      )}

      <Card style={{marginBottom: 24}} title='Affiliate Details'>
        <Descriptions column={{xs: 1, sm: 2}}>
          <Descriptions.Item label='Email'>{affiliate.email}</Descriptions.Item>
          <Descriptions.Item label='Phone'>{affiliate.phone || '-'}</Descriptions.Item>
          <Descriptions.Item label='Company'>{affiliate.company || '-'}</Descriptions.Item>
          <Descriptions.Item label='Website'>{affiliate.website || '-'}</Descriptions.Item>
          <Descriptions.Item label='Commission Rate'>{affiliate.commission_rate}%</Descriptions.Item>
          <Descriptions.Item label='Status'>
            <Tag color={statusColors[affiliate.status]}>{affiliate.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Notes'>{affiliate.notes || '-'}</Descriptions.Item>
          <Descriptions.Item label='Created'>
            {new Date(affiliate.created_at).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

export default AffiliateDetail;
