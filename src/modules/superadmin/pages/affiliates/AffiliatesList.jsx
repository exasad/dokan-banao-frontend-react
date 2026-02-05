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
  LoginOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const statusColors = {
  active: 'green',
  inactive: 'orange',
  suspended: 'red',
};

const AffiliatesList = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const fetchAffiliates = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await superadminAxios.get('/affiliates', {params});
      setAffiliates(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch affiliates');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchAffiliates();
  }, [fetchAffiliates]);

  const handleStatusChange = async (id, action) => {
    try {
      await superadminAxios.patch(`/affiliates/${id}/${action}`);
      message.success(`Affiliate ${action}d`);
      fetchAffiliates(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || `Failed to ${action} affiliate`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await superadminAxios.delete(`/affiliates/${id}`);
      message.success('Affiliate deleted');
      fetchAffiliates(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleLoginAs = async (id) => {
    try {
      const res = await superadminAxios.post(`/affiliates/${id}/login-as`);
      const {access_token} = res.data;
      window.open(`/affiliate/auto-login?token=${access_token}`, '_blank');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to login as affiliate');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await superadminAxios.post('/affiliates/bulk-action', {
        ids: selectedRowKeys,
        action,
      });
      message.success(`${selectedRowKeys.length} affiliate(s) ${action}d`);
      setSelectedRowKeys([]);
      fetchAffiliates(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || `Failed to ${action}`);
    }
  };

  const bulkMenuItems = {
    items: [
      {key: 'activate', label: 'Activate'},
      {key: 'suspend', label: 'Suspend'},
      {type: 'divider'},
      {key: 'delete', label: 'Delete', danger: true},
    ],
    onClick: ({key}) => handleBulkAction(key),
  };

  const getStatusActions = (record) => {
    const items = [];
    if (record.status !== 'active') items.push({key: 'activate', label: 'Activate'});
    if (record.status !== 'suspended') items.push({key: 'suspend', label: 'Suspend'});
    return items;
  };

  const columns = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'Email', dataIndex: 'email', key: 'email'},
    {title: 'Company', dataIndex: 'company', key: 'company', render: (v) => v || '-'},
    {
      title: 'Commission Rate (%)',
      dataIndex: 'commission_rate',
      key: 'commission_rate',
      render: (v) => `${parseFloat(v).toFixed(2)}%`,
    },
    {title: 'Commissions', dataIndex: 'commissions_count', key: 'commissions_count'},
    {title: 'Coupons', dataIndex: 'coupons_count', key: 'coupons_count'},
    {
      title: 'Balance ($)',
      dataIndex: 'balance',
      key: 'balance',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={statusColors[s]}>{s}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<LoginOutlined />}
            size='small'
            type='primary'
            title='Login as Affiliate'
            onClick={() => handleLoginAs(record.id)}
          />
          <Button
            icon={<EyeOutlined />}
            size='small'
            onClick={() => navigate(`/superadmin/affiliates/${record.id}`)}
          />
          <Button
            icon={<EditOutlined />}
            size='small'
            onClick={() => navigate(`/superadmin/affiliates/${record.id}/edit`)}
          />
          <Dropdown
            menu={{
              items: getStatusActions(record),
              onClick: ({key}) => handleStatusChange(record.id, key),
            }}
          >
            <Button icon={<MoreOutlined />} size='small' />
          </Dropdown>
          <Popconfirm title='Delete this affiliate?' onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size='small' danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Title level={3} style={{margin: 0}}>Affiliates</Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => navigate('/superadmin/affiliates/create')}
        >
          Add Affiliate
        </Button>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Space wrap style={{flex: 1}}>
          <Input
            placeholder='Search by name/email...'
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
            style={{width: 140, minWidth: 100}}
            options={[
              {value: 'active', label: 'Active'},
              {value: 'inactive', label: 'Inactive'},
              {value: 'suspended', label: 'Suspended'},
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
        dataSource={affiliates}
        rowKey='id'
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchAffiliates(page, pageSize),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} affiliates`,
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default AffiliatesList;
