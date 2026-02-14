import {useState, useEffect, useCallback} from 'react';
import {Typography, Table, Card, Tag, message} from 'antd';
import adminAxios from '../../services/adminAxios';

const {Title, Text} = Typography;

const ReferralRewardsList = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({current: 1, pageSize: 15, total: 0});

  const fetchRewards = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const {data} = await adminAxios.get('/referral-rewards', {params: {page, per_page: 15}});
      setRewards(data.data);
      setPagination({current: data.current_page, pageSize: data.per_page, total: data.total});
    } catch {
      message.error('Failed to load referral rewards');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const formatCurrency = (v) => `৳${Number(v || 0).toLocaleString('en-BD')}`;

  const columns = [
    {
      title: 'Referrer',
      key: 'referrer',
      render: (_, r) => <Text>{r.referrer?.name || 'N/A'}</Text>,
    },
    {
      title: 'Referred',
      key: 'referred',
      render: (_, r) => <Text>{r.referred?.name || 'N/A'}</Text>,
    },
    {
      title: 'Reward',
      dataIndex: 'reward_amount',
      key: 'reward_amount',
      render: (v) => <Text strong style={{color: '#52c41a'}}>{formatCurrency(v)}</Text>,
    },
    {
      title: 'Order',
      key: 'order',
      render: (_, r) => r.order ? <Text>#{r.order.order_number}</Text> : <Text type="secondary">N/A</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => {
        const colors = {pending: 'orange', credited: 'green', expired: 'red'};
        return <Tag color={colors[s] || 'default'}>{s?.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (d) => new Date(d).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}),
    },
  ];

  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>Referral Rewards</Title>
      <Card>
        <Table
          dataSource={rewards}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page) => fetchRewards(page),
            showSizeChanger: false,
          }}
          scroll={{x: 'max-content'}}
        />
      </Card>
    </div>
  );
};

export default ReferralRewardsList;
