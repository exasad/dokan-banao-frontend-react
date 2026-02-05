import {useState, useEffect, useCallback} from 'react';
import {
  Table,
  Button,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const statusColors = {
  pending: 'gold',
  completed: 'green',
  failed: 'red',
};

const PayoutsList = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [affiliateFilter, setAffiliateFilter] = useState(undefined);
  const [affiliates, setAffiliates] = useState([]);

  useEffect(() => {
    superadminAxios
      .get('/affiliates', {params: {per_page: 1000}})
      .then((res) => setAffiliates(res.data.data || []))
      .catch(() => {});
  }, []);

  const fetchPayouts = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (statusFilter) params.status = statusFilter;
      if (affiliateFilter) params.affiliate_id = affiliateFilter;
      const res = await superadminAxios.get('/payouts', {params});
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
  }, [statusFilter, affiliateFilter]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  const handleAction = async (id, action) => {
    try {
      await superadminAxios.patch(`/payouts/${id}/${action}`);
      message.success(`Payout ${action}ed`);
      fetchPayouts(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || `Failed to ${action} payout`);
    }
  };

  const columns = [
    {title: 'ID', dataIndex: 'id', key: 'id'},
    {title: 'Affiliate', dataIndex: ['affiliate', 'name'], key: 'affiliate'},
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (v) => `$${parseFloat(v).toFixed(2)}`,
    },
    {title: 'Payment Method', dataIndex: 'payment_method', key: 'payment_method', render: (v) => v || '-'},
    {title: 'Reference', dataIndex: 'reference', key: 'reference', render: (v) => v || '-'},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={statusColors[s]}>{s}</Tag>,
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
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                icon={<CheckOutlined />}
                size='small'
                type='primary'
                onClick={() => handleAction(record.id, 'process')}
              >
                Process
              </Button>
              <Button
                icon={<CloseOutlined />}
                size='small'
                danger
                onClick={() => handleAction(record.id, 'reject')}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Title level={3} style={{margin: 0}}>Payouts</Title>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Space wrap style={{flex: 1}}>
          <Select
            placeholder='Status'
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{width: 140, minWidth: 100}}
            options={[
              {value: 'pending', label: 'Pending'},
              {value: 'completed', label: 'Completed'},
              {value: 'failed', label: 'Failed'},
            ]}
          />
          <Select
            placeholder='Affiliate'
            value={affiliateFilter}
            onChange={setAffiliateFilter}
            allowClear
            showSearch
            optionFilterProp='label'
            style={{width: 200, minWidth: 120}}
            options={affiliates.map((a) => ({value: a.id, label: a.name}))}
          />
        </Space>
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
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default PayoutsList;
