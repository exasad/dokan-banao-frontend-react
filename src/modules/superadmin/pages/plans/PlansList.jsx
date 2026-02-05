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
  Popconfirm,
  Dropdown,
} from 'antd';
import {PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const PlansList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const fetchPlans = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await superadminAxios.get('/plans', {params});
      setPlans(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDelete = async (id) => {
    try {
      await superadminAxios.delete(`/plans/${id}`);
      message.success('Plan deleted');
      fetchPlans(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete plan');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await superadminAxios.post('/plans/bulk-action', {
        ids: selectedRowKeys,
        action,
      });
      message.success(`${selectedRowKeys.length} plan(s) ${action}d`);
      setSelectedRowKeys([]);
      fetchPlans(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || `Failed to ${action}`);
    }
  };

  const bulkMenuItems = {
    items: [
      {key: 'activate', label: 'Activate'},
      {key: 'deactivate', label: 'Deactivate'},
      {type: 'divider'},
      {key: 'delete', label: 'Delete', danger: true},
    ],
    onClick: ({key}) => handleBulkAction(key),
  };

  const columns = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (v) => `$${parseFloat(v).toFixed(2)}`,
    },
    {title: 'Duration', dataIndex: 'duration_days', key: 'duration_days', render: (v) => `${v} days`},
    {title: 'Trial', dataIndex: 'trial_days', key: 'trial_days', render: (v) => v ? `${v} days` : '-'},
    {title: 'Max Products', dataIndex: 'max_products', key: 'max_products', render: (v) => (v === -1 ? 'Unlimited' : v)},
    {title: 'Max Orders', dataIndex: 'max_orders', key: 'max_orders', render: (v) => (v === -1 ? 'Unlimited' : v)},
    {title: 'Tenants', dataIndex: 'tenants_count', key: 'tenants_count'},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={s === 'active' ? 'green' : 'red'}>{s}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size='small'
            onClick={() => navigate(`/superadmin/plans/${record.id}/edit`)}
          />
          <Popconfirm title='Delete this plan?' onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size='small' danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Title level={3} style={{margin: 0}}>Plans</Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => navigate('/superadmin/plans/create')}
        >
          Add Plan
        </Button>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Space wrap style={{flex: 1}}>
          <Input
            placeholder='Search plans...'
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{width: 250, minWidth: 150, maxWidth: '100%'}}
            allowClear
          />
          <Select
            placeholder='Status'
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{width: 120, minWidth: 100}}
            options={[
              {value: 'active', label: 'Active'},
              {value: 'inactive', label: 'Inactive'},
            ]}
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
        dataSource={plans}
        rowKey='id'
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchPlans(page, pageSize),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} plans`,
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default PlansList;
