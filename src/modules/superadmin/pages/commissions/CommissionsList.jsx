import {useState, useEffect, useCallback} from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Typography,
  message,
  Dropdown,
} from 'antd';
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
} from '@ant-design/icons';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const statusColors = {
  pending: 'gold',
  approved: 'blue',
  rejected: 'red',
  paid: 'green',
};

const CommissionsList = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [affiliateFilter, setAffiliateFilter] = useState(undefined);
  const [affiliates, setAffiliates] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    superadminAxios
      .get('/affiliates', {params: {per_page: 1000}})
      .then((res) => setAffiliates(res.data.data || []))
      .catch(() => {});
  }, []);

  const fetchCommissions = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (affiliateFilter) params.affiliate_id = affiliateFilter;
      const res = await superadminAxios.get('/commissions', {params});
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
  }, [search, statusFilter, affiliateFilter]);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  const handleAction = async (id, action) => {
    try {
      await superadminAxios.patch(`/commissions/${id}/${action}`);
      message.success(`Commission ${action}d`);
      fetchCommissions(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || `Failed to ${action} commission`);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await superadminAxios.post('/commissions/bulk-action', {
        ids: selectedRowKeys,
        action,
      });
      message.success(`${selectedRowKeys.length} commission(s) ${action}d`);
      setSelectedRowKeys([]);
      fetchCommissions(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || `Failed to ${action}`);
    }
  };

  const bulkMenuItems = {
    items: [
      {key: 'approve', label: 'Approve'},
      {key: 'reject', label: 'Reject', danger: true},
    ],
    onClick: ({key}) => handleBulkAction(key),
  };

  const columns = [
    {title: 'ID', dataIndex: 'id', key: 'id'},
    {title: 'Affiliate', dataIndex: ['affiliate', 'name'], key: 'affiliate'},
    {title: 'Tenant', dataIndex: ['tenant', 'name'], key: 'tenant'},
    {title: 'Coupon', dataIndex: ['coupon_usage', 'coupon', 'code'], key: 'coupon', render: (v) => v || '-'},
    {
      title: 'Order Amount',
      dataIndex: 'order_amount',
      key: 'order_amount',
      render: (v) => `$${parseFloat(v).toFixed(2)}`,
    },
    {
      title: 'Rate',
      dataIndex: 'commission_rate',
      key: 'commission_rate',
      render: (v) => `${v}%`,
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
      render: (s) => <Tag color={statusColors[s]}>{s}</Tag>,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v) => new Date(v).toLocaleDateString(),
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
                onClick={() => handleAction(record.id, 'approve')}
              >
                Approve
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
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Commissions</Title>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Space>
          <Input
            placeholder='Search by order reference...'
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
          <Select
            placeholder='Affiliate'
            value={affiliateFilter}
            onChange={setAffiliateFilter}
            allowClear
            showSearch
            optionFilterProp='label'
            style={{width: 200}}
            options={affiliates.map((a) => ({value: a.id, label: a.name}))}
          />
        </Space>
        {selectedRowKeys.length > 0 && (
          <Dropdown menu={bulkMenuItems}>
            <Button>
              Bulk Actions ({selectedRowKeys.length}) <DownOutlined />
            </Button>
          </Dropdown>
        )}
      </div>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
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

export default CommissionsList;
