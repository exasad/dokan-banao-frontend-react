import {useState, useEffect, useCallback} from 'react';
import {
  Table, Button, Input, Select, Space, Tag, Typography, message, Popconfirm, Dropdown,
  Card, Row, Col, Statistic, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownOutlined,
  UndoOutlined, GiftOutlined, PercentageOutlined, DollarOutlined,
  ClockCircleOutlined, StopOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import adminAxios from '../../services/adminAxios';
import CouponForm from './CouponForm';

const {Title, Text} = Typography;

const CouponsList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [discountTypeFilter, setDiscountTypeFilter] = useState(undefined);
  const [couponStatus, setCouponStatus] = useState(undefined);
  const [trashedFilter, setTrashedFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const isTrashed = trashedFilter === 'only';

  const fetchCoupons = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter !== undefined) params.is_active = statusFilter;
      if (discountTypeFilter) params.discount_type = discountTypeFilter;
      if (couponStatus) params.status = couponStatus;
      if (trashedFilter) params.trashed = trashedFilter;
      const res = await adminAxios.get('/coupons', {params});
      setCoupons(res.data.data);
      setPagination({current: res.data.current_page, pageSize: res.data.per_page, total: res.data.total});
    } catch {
      message.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, discountTypeFilter, couponStatus, trashedFilter]);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const handleDelete = async (id) => {
    try { await adminAxios.delete(`/coupons/${id}`); message.success('Coupon deleted'); fetchCoupons(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed to delete'); }
  };
  const handleRestore = async (id) => {
    try { await adminAxios.post(`/coupons/${id}/restore`); message.success('Coupon restored'); fetchCoupons(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed to restore'); }
  };
  const handleForceDelete = async (id) => {
    try { await adminAxios.delete(`/coupons/${id}/force-delete`); message.success('Coupon permanently deleted'); fetchCoupons(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed to delete'); }
  };
  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try { await adminAxios.post('/coupons/bulk-action', {ids: selectedRowKeys, action}); message.success(`${selectedRowKeys.length} coupon(s) updated`); setSelectedRowKeys([]); fetchCoupons(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed'); }
  };

  const bulkMenuItems = {
    items: isTrashed
      ? [{key: 'restore', label: 'Restore'}, {type: 'divider'}, {key: 'force_delete', label: 'Delete Permanently', danger: true}]
      : [{key: 'activate', label: 'Activate'}, {key: 'deactivate', label: 'Deactivate'}, {type: 'divider'}, {key: 'delete', label: 'Delete', danger: true}],
    onClick: ({key}) => handleBulkAction(key),
  };

  const openAdd = () => { setEditingCoupon(null); setFormOpen(true); };
  const openEdit = (record) => { setEditingCoupon(record); setFormOpen(true); };
  const handleFormSuccess = () => { setFormOpen(false); setEditingCoupon(null); fetchCoupons(pagination.current, pagination.pageSize); };

  const getCouponStatusTag = (record) => {
    if (!record.is_active) return <Tag color='red'>Inactive</Tag>;
    if (record.expires_at && dayjs(record.expires_at).isBefore(dayjs())) return <Tag icon={<StopOutlined />} color='volcano'>Expired</Tag>;
    if (record.starts_at && dayjs(record.starts_at).isAfter(dayjs())) return <Tag icon={<ClockCircleOutlined />} color='blue'>Scheduled</Tag>;
    if (record.usage_limit && record.used_count >= record.usage_limit) return <Tag color='orange'>Used Up</Tag>;
    return <Tag icon={<CheckCircleOutlined />} color='green'>Active</Tag>;
  };

  const columns = [
    {
      title: 'Code', dataIndex: 'code', key: 'code',
      render: (code) => <Text strong copyable style={{fontFamily: 'monospace'}}>{code}</Text>,
    },
    {title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true},
    {
      title: 'Discount', key: 'discount',
      render: (_, record) => (
        <Space>
          {record.discount_type === 'percentage'
            ? <Tag icon={<PercentageOutlined />} color='purple'>{record.discount_value}%</Tag>
            : <Tag icon={<DollarOutlined />} color='cyan'>{record.discount_value} BDT</Tag>
          }
          {record.free_shipping && <Tag color='green'>Free Shipping</Tag>}
        </Space>
      ),
    },
    {
      title: 'Usage', key: 'usage',
      render: (_, record) => (
        <Text>{record.used_count}{record.usage_limit ? ` / ${record.usage_limit}` : ' / Unlimited'}</Text>
      ),
    },
    {
      title: 'Status', key: 'status',
      render: (_, record) => getCouponStatusTag(record),
    },
    {
      title: 'Schedule', key: 'schedule', width: 180,
      render: (_, record) => {
        if (!record.starts_at && !record.expires_at) return <Text type='secondary'>Always</Text>;
        return (
          <Space direction='vertical' size={0}>
            {record.starts_at && <Text style={{fontSize: 12}}>{dayjs(record.starts_at).format('DD MMM YY, h:mm A')}</Text>}
            {record.expires_at && <Text style={{fontSize: 12}} type={dayjs(record.expires_at).isBefore(dayjs()) ? 'danger' : 'secondary'}>{dayjs(record.expires_at).format('DD MMM YY, h:mm A')}</Text>}
          </Space>
        );
      },
    },
    {
      title: 'Actions', key: 'actions', width: 150,
      render: (_, record) => (
        <Space>
          {isTrashed ? (
            <>
              <Popconfirm title='Restore?' onConfirm={() => handleRestore(record.id)}><Button icon={<UndoOutlined />} size='small' type='primary' /></Popconfirm>
              <Popconfirm title='Permanently delete?' onConfirm={() => handleForceDelete(record.id)}><Button icon={<DeleteOutlined />} size='small' danger /></Popconfirm>
            </>
          ) : (
            <>
              <Button icon={<EditOutlined />} size='small' onClick={() => openEdit(record)} />
              <Popconfirm title='Delete this coupon?' onConfirm={() => handleDelete(record.id)}><Button icon={<DeleteOutlined />} size='small' danger /></Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Title level={3} style={{margin: 0}}>
          <GiftOutlined style={{marginRight: 8}} />
          Coupons {isTrashed && <Tag color='red'>Trash</Tag>}
        </Title>
        {!isTrashed && <Button type='primary' icon={<PlusOutlined />} onClick={openAdd}>Add Coupon</Button>}
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Space wrap style={{flex: 1}}>
          <Input placeholder='Search code or name...' prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} style={{width: 220, minWidth: 150, maxWidth: '100%'}} allowClear />
          <Select placeholder='Status' value={statusFilter} onChange={setStatusFilter} allowClear style={{width: 130, minWidth: 100}} options={[{value: '1', label: 'Active'}, {value: '0', label: 'Inactive'}]} />
          <Select placeholder='Discount Type' value={discountTypeFilter} onChange={setDiscountTypeFilter} allowClear style={{width: 150, minWidth: 100}} options={[{value: 'fixed', label: 'Fixed'}, {value: 'percentage', label: 'Percentage'}]} />
          <Select placeholder='Coupon Status' value={couponStatus} onChange={setCouponStatus} allowClear style={{width: 140, minWidth: 100}} options={[{value: 'active', label: 'Valid'}, {value: 'expired', label: 'Expired'}, {value: 'scheduled', label: 'Scheduled'}, {value: 'used_up', label: 'Used Up'}]} />
          <Select placeholder='Show' value={trashedFilter} onChange={(v) => { setTrashedFilter(v); setSelectedRowKeys([]); }} allowClear style={{width: 130, minWidth: 100}} options={[{value: 'only', label: 'Trashed'}]} />
        </Space>
        {selectedRowKeys.length > 0 && <Dropdown menu={bulkMenuItems}><Button>Bulk Actions ({selectedRowKeys.length}) <DownOutlined /></Button></Dropdown>}
      </div>

      <Table
        rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}}
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

      <CouponForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingCoupon(null); }}
        onSuccess={handleFormSuccess}
        editingCoupon={editingCoupon}
      />
    </div>
  );
};

export default CouponsList;
