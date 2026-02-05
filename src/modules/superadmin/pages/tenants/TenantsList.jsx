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
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  MoreOutlined,
  DownOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const statusColors = {
  active: 'green',
  suspended: 'orange',
  inactive: 'red',
  expired: 'default',
};

const TenantsList = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const fetchTenants = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await superadminAxios.get('/tenants', {params});
      setTenants(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch tenants');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleStatusChange = async (id, action) => {
    try {
      await superadminAxios.patch(`/tenants/${id}/${action}`);
      message.success(`Tenant ${action}d`);
      fetchTenants(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || `Failed to ${action} tenant`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await superadminAxios.delete(`/tenants/${id}`);
      message.success('Tenant deleted');
      fetchTenants(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await superadminAxios.post('/tenants/bulk-action', {
        ids: selectedRowKeys,
        action,
      });
      message.success(`${selectedRowKeys.length} tenant(s) ${action}d`);
      setSelectedRowKeys([]);
      fetchTenants(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || `Failed to ${action}`);
    }
  };

  const bulkMenuItems = {
    items: [
      {key: 'activate', label: 'Activate'},
      {key: 'suspend', label: 'Suspend'},
      {key: 'deactivate', label: 'Deactivate'},
      {key: 'expire', label: 'Expire'},
      {type: 'divider'},
      {key: 'delete', label: 'Delete', danger: true},
    ],
    onClick: ({key}) => handleBulkAction(key),
  };

  const getStatusActions = (record) => {
    const items = [];
    if (record.status !== 'active') items.push({key: 'activate', label: 'Activate'});
    if (record.status !== 'suspended') items.push({key: 'suspend', label: 'Suspend'});
    if (record.status !== 'inactive') items.push({key: 'deactivate', label: 'Deactivate'});
    if (record.status !== 'expired') items.push({key: 'expire', label: 'Expire'});
    return items;
  };

  const columns = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'Email', dataIndex: 'email', key: 'email'},
    {title: 'Domain', dataIndex: 'domain', key: 'domain', render: (v) => v || '-'},
    {title: 'Plan', dataIndex: ['plan', 'name'], key: 'plan'},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={statusColors[s]}>{s}</Tag>,
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size='small'
            onClick={() => navigate(`/superadmin/tenants/${record.id}`)}
          />
          <Button
            icon={<EditOutlined />}
            size='small'
            onClick={() => navigate(`/superadmin/tenants/${record.id}/edit`)}
          />
          <Dropdown
            menu={{
              items: getStatusActions(record),
              onClick: ({key}) => handleStatusChange(record.id, key),
            }}
          >
            <Button icon={<MoreOutlined />} size='small' />
          </Dropdown>
          <Popconfirm title='Delete this tenant?' onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size='small' danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Tenants</Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => navigate('/superadmin/tenants/create')}
        >
          Add Tenant
        </Button>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Space>
          <Input
            placeholder='Search tenants...'
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
              {value: 'active', label: 'Active'},
              {value: 'suspended', label: 'Suspended'},
              {value: 'inactive', label: 'Inactive'},
              {value: 'expired', label: 'Expired'},
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
        dataSource={tenants}
        rowKey='id'
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchTenants(page, pageSize),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} tenants`,
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default TenantsList;
