import {useState, useEffect, useCallback} from 'react';
import {Table, Input, Select, Tag, Typography, message, Space} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import affiliateAxios from '../../services/affiliateAxios';

const {Title} = Typography;

const statusColors = {
  pending: 'orange',
  approved: 'green',
  rejected: 'red',
  paid: 'blue',
};

const MyCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);

  const fetchCommissions = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await affiliateAxios.get('/commissions', {params});
      setCommissions(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch commissions');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  const columns = [
    {
      title: 'Order Ref',
      dataIndex: 'order_reference',
      key: 'order_reference',
    },
    {
      title: 'Tenant',
      dataIndex: ['tenant', 'name'],
      key: 'tenant',
    },
    {
      title: 'Coupon',
      dataIndex: ['coupon_usage', 'coupon', 'code'],
      key: 'coupon',
      render: (code) => code || '-',
    },
    {
      title: 'Order Amount',
      dataIndex: 'order_amount',
      key: 'order_amount',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
    {
      title: 'Commission Rate',
      dataIndex: 'commission_rate',
      key: 'commission_rate',
      render: (v) => (v ? `${v}%` : '-'),
    },
    {
      title: 'Commission Amount',
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

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Commissions</Title>
      </div>
      <div style={{marginBottom: 16}}>
        <Space>
          <Input
            placeholder='Search commissions...'
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{width: 250}}
            allowClear
          />
          <Select
            placeholder='Status'
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{width: 140}}
            options={[
              {value: 'pending', label: 'Pending'},
              {value: 'approved', label: 'Approved'},
              {value: 'rejected', label: 'Rejected'},
              {value: 'paid', label: 'Paid'},
            ]}
          />
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={commissions}
        rowKey='id'
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchCommissions(page, pageSize),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} commissions`,
        }}
      />
    </div>
  );
};

export default MyCommissions;
