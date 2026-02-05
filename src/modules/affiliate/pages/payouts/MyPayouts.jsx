import {useState, useEffect, useCallback} from 'react';
import {Table, Button, Tag, Typography, message} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import affiliateAxios from '../../services/affiliateAxios';
import RequestPayoutModal from './RequestPayoutModal';

const {Title} = Typography;

const statusColors = {
  pending: 'orange',
  approved: 'green',
  rejected: 'red',
  paid: 'blue',
  processing: 'cyan',
};

const MyPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPayouts = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      const res = await affiliateAxios.get('/payouts', {params});
      setPayouts(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch payouts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  const columns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (v) => (v ? v.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '-'),
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      render: (v) => v || '-',
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
    {
      title: 'Processed At',
      dataIndex: 'processed_at',
      key: 'processed_at',
      render: (d) => (d ? new Date(d).toLocaleDateString() : '-'),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Payouts</Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
        >
          Request Payout
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={payouts}
        rowKey='id'
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchPayouts(page, pageSize),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} payouts`,
        }}
      />

      <RequestPayoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchPayouts(pagination.current, pagination.pageSize);
        }}
      />
    </div>
  );
};

export default MyPayouts;
