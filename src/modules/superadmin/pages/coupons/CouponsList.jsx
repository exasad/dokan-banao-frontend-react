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
  DownOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const statusColors = {
  active: 'green',
  inactive: 'orange',
  expired: 'red',
};

const typeColors = {
  percentage: 'blue',
  fixed: 'purple',
};

const CouponsList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [typeFilter, setTypeFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const navigate = useNavigate();

  const fetchCoupons = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      const res = await superadminAxios.get('/coupons', {params});
      setCoupons(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleDelete = async (id) => {
    try {
      await superadminAxios.delete(`/coupons/${id}`);
      message.success('Coupon deleted');
      fetchCoupons(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await superadminAxios.post('/coupons/bulk-action', {
        ids: selectedRowKeys,
        action,
      });
      message.success(`${selectedRowKeys.length} coupon(s) ${action}d`);
      setSelectedRowKeys([]);
      fetchCoupons(pagination.current, pagination.pageSize);
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
    {title: 'Code', dataIndex: 'code', key: 'code'},
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (t) => <Tag color={typeColors[t]}>{t}</Tag>,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (v, record) => record.type === 'percentage' ? `${v}%` : `$${parseFloat(v).toFixed(2)}`,
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_, record) => `${record.usage_count || 0}/${record.usage_limit || '\u221E'}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={statusColors[s]}>{s}</Tag>,
    },
    {title: 'Affiliates', dataIndex: 'affiliates_count', key: 'affiliates_count'},
    {
      title: 'Created At',
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
            onClick={() => navigate(`/superadmin/coupons/${record.id}`)}
          />
          <Button
            icon={<EditOutlined />}
            size='small'
            onClick={() => navigate(`/superadmin/coupons/${record.id}/edit`)}
          />
          <Popconfirm title='Delete this coupon?' onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size='small' danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Coupons</Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => navigate('/superadmin/coupons/create')}
        >
          Add Coupon
        </Button>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Space>
          <Input
            placeholder='Search by code...'
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
              {value: 'inactive', label: 'Inactive'},
              {value: 'expired', label: 'Expired'},
            ]}
          />
          <Select
            placeholder='Type'
            value={typeFilter}
            onChange={setTypeFilter}
            allowClear
            style={{width: 140}}
            options={[
              {value: 'percentage', label: 'Percentage'},
              {value: 'fixed', label: 'Fixed'},
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
        dataSource={coupons}
        rowKey='id'
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchCoupons(page, pageSize),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} coupons`,
        }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default CouponsList;
