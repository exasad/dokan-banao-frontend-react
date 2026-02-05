import {Card, Table, Tag, Typography} from 'antd';

const {Title} = Typography;

const statusColors = {
  pending: 'orange',
  approved: 'green',
  rejected: 'red',
  paid: 'blue',
};

const columns = [
  {
    title: 'Order Ref',
    dataIndex: 'order_ref',
    key: 'order_ref',
  },
  {
    title: 'Coupon Code',
    dataIndex: ['coupon', 'code'],
    key: 'coupon_code',
    render: (code) => code || '-',
  },
  {
    title: 'Amount',
    dataIndex: 'order_amount',
    key: 'order_amount',
    render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
  },
  {
    title: 'Commission',
    dataIndex: 'commission_amount',
    key: 'commission_amount',
    render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (s) => <Tag color={statusColors[s]}>{s}</Tag>,
  },
  {
    title: 'Date',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (d) => (d ? new Date(d).toLocaleDateString() : '-'),
  },
];

const RecentCommissions = ({data, loading}) => {
  return (
    <Card>
      <Title level={5} style={{marginBottom: 16}}>
        Recent Commissions
      </Title>
      <Table
        columns={columns}
        dataSource={data?.slice(0, 5) || []}
        rowKey='id'
        loading={loading}
        pagination={false}
        size='small'
      />
    </Card>
  );
};

export default RecentCommissions;
