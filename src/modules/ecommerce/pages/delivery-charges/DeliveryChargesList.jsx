import {useState, useEffect, useCallback} from 'react';
import {
  Table, Button, Input, Select, Space, Tag, Typography, message, Popconfirm, Dropdown,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownOutlined, UndoOutlined,
} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';
import DeliveryChargeForm from './DeliveryChargeForm';

const {Title} = Typography;

const DeliveryChargesList = () => {
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [trashedFilter, setTrashedFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCharge, setEditingCharge] = useState(null);

  const isTrashed = trashedFilter === 'only';

  const fetchCharges = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter !== undefined) params.is_active = statusFilter;
      if (trashedFilter) params.trashed = trashedFilter;
      const res = await adminAxios.get('/delivery-charges', {params});
      setCharges(res.data.data);
      setPagination({current: res.data.current_page, pageSize: res.data.per_page, total: res.data.total});
    } catch { message.error('Failed to fetch delivery charges'); } finally { setLoading(false); }
  }, [search, statusFilter, trashedFilter]);

  useEffect(() => { fetchCharges(); }, [fetchCharges]);

  const handleDelete = async (id) => {
    try { await adminAxios.delete(`/delivery-charges/${id}`); message.success('Delivery charge deleted'); fetchCharges(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed to delete'); }
  };
  const handleRestore = async (id) => {
    try { await adminAxios.post(`/delivery-charges/${id}/restore`); message.success('Delivery charge restored'); fetchCharges(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed to restore'); }
  };
  const handleForceDelete = async (id) => {
    try { await adminAxios.delete(`/delivery-charges/${id}/force-delete`); message.success('Delivery charge permanently deleted'); fetchCharges(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed to delete'); }
  };
  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try { await adminAxios.post('/delivery-charges/bulk-action', {ids: selectedRowKeys, action}); message.success(`${selectedRowKeys.length} delivery charge(s) updated`); setSelectedRowKeys([]); fetchCharges(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed'); }
  };

  const bulkMenuItems = {
    items: isTrashed
      ? [{key: 'restore', label: 'Restore'}, {type: 'divider'}, {key: 'force_delete', label: 'Delete Permanently', danger: true}]
      : [{key: 'activate', label: 'Activate'}, {key: 'deactivate', label: 'Deactivate'}, {type: 'divider'}, {key: 'delete', label: 'Delete', danger: true}],
    onClick: ({key}) => handleBulkAction(key),
  };

  const openAdd = () => { setEditingCharge(null); setFormOpen(true); };
  const openEdit = (record) => { setEditingCharge(record); setFormOpen(true); };
  const handleFormSuccess = () => { setFormOpen(false); setEditingCharge(null); fetchCharges(pagination.current, pagination.pageSize); };

  const columns = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'Charge', dataIndex: 'charge', key: 'charge', render: (v) => `৳${parseFloat(v).toFixed(2)}`},
    {title: 'Status', dataIndex: 'is_active', key: 'is_active', render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>},
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
              <Popconfirm title='Delete this delivery charge?' onConfirm={() => handleDelete(record.id)}><Button icon={<DeleteOutlined />} size='small' danger /></Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Delivery Charges {isTrashed && <Tag color='red'>Trash</Tag>}</Title>
        {!isTrashed && <Button type='primary' icon={<PlusOutlined />} onClick={openAdd}>Add Delivery Charge</Button>}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Space>
          <Input placeholder='Search by name...' prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} style={{width: 250}} allowClear />
          <Select placeholder='Status' value={statusFilter} onChange={setStatusFilter} allowClear style={{width: 140}} options={[{value: '1', label: 'Active'}, {value: '0', label: 'Inactive'}]} />
          <Select placeholder='Show' value={trashedFilter} onChange={(v) => { setTrashedFilter(v); setSelectedRowKeys([]); }} allowClear style={{width: 140}} options={[{value: 'only', label: 'Trashed'}]} />
        </Space>
        {selectedRowKeys.length > 0 && <Dropdown menu={bulkMenuItems}><Button>Bulk Actions ({selectedRowKeys.length}) <DownOutlined /></Button></Dropdown>}
      </div>
      <Table rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}} columns={columns} dataSource={charges} rowKey='id' loading={loading}
        pagination={{...pagination, onChange: (page, pageSize) => fetchCharges(page, pageSize), showSizeChanger: true, showTotal: (total) => `Total ${total} delivery charges`}} />
      <DeliveryChargeForm open={formOpen} onClose={() => { setFormOpen(false); setEditingCharge(null); }} onSuccess={handleFormSuccess} editingCharge={editingCharge} />
    </div>
  );
};

export default DeliveryChargesList;
