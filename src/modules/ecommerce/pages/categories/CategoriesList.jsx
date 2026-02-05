import {useState, useEffect, useCallback} from 'react';
import {
  Table, Button, Input, Select, Space, Tag, Typography, message, Popconfirm, Dropdown, Avatar,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownOutlined, AppstoreOutlined, UndoOutlined,
} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';
import CategoryForm from './CategoryForm';

const {Title} = Typography;

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [parentFilter, setParentFilter] = useState(undefined);
  const [trashedFilter, setTrashedFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [parentOptions, setParentOptions] = useState([]);

  const isTrashed = trashedFilter === 'only';

  const fetchParentOptions = useCallback(async () => {
    try { const res = await adminAxios.get('/categories/parent-options'); setParentOptions(res.data); } catch {}
  }, []);

  const fetchCategories = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter !== undefined) params.is_active = statusFilter;
      if (parentFilter !== undefined) params.parent_id = parentFilter;
      if (trashedFilter) params.trashed = trashedFilter;
      const res = await adminAxios.get('/categories', {params});
      setCategories(res.data.data);
      setPagination({current: res.data.current_page, pageSize: res.data.per_page, total: res.data.total});
    } catch { message.error('Failed to fetch categories'); } finally { setLoading(false); }
  }, [search, statusFilter, parentFilter, trashedFilter]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchParentOptions(); }, [fetchParentOptions]);

  const handleDelete = async (id) => {
    try { await adminAxios.delete(`/categories/${id}`); message.success('Category deleted'); fetchCategories(pagination.current, pagination.pageSize); fetchParentOptions(); }
    catch (err) { message.error(err.response?.data?.message || 'Failed to delete'); }
  };
  const handleRestore = async (id) => {
    try { await adminAxios.post(`/categories/${id}/restore`); message.success('Category restored'); fetchCategories(pagination.current, pagination.pageSize); fetchParentOptions(); }
    catch (err) { message.error(err.response?.data?.message || 'Failed to restore'); }
  };
  const handleForceDelete = async (id) => {
    try { await adminAxios.delete(`/categories/${id}/force-delete`); message.success('Category permanently deleted'); fetchCategories(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed to delete'); }
  };
  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try { await adminAxios.post('/categories/bulk-action', {ids: selectedRowKeys, action}); message.success(`${selectedRowKeys.length} category(ies) updated`); setSelectedRowKeys([]); fetchCategories(pagination.current, pagination.pageSize); fetchParentOptions(); }
    catch (err) { message.error(err.response?.data?.message || 'Failed'); }
  };

  const bulkMenuItems = {
    items: isTrashed
      ? [{key: 'restore', label: 'Restore'}, {type: 'divider'}, {key: 'force_delete', label: 'Delete Permanently', danger: true}]
      : [{key: 'activate', label: 'Activate'}, {key: 'deactivate', label: 'Deactivate'}, {type: 'divider'}, {key: 'delete', label: 'Delete', danger: true}],
    onClick: ({key}) => handleBulkAction(key),
  };

  const openAdd = () => { setEditingCategory(null); setFormOpen(true); };
  const openEdit = (record) => { setEditingCategory(record); setFormOpen(true); };
  const handleFormSuccess = () => { setFormOpen(false); setEditingCategory(null); fetchCategories(pagination.current, pagination.pageSize); fetchParentOptions(); };

  const columns = [
    {title: 'Image', dataIndex: 'image', key: 'image', width: 60, render: (src) => <Avatar src={src} icon={<AppstoreOutlined />} shape='square' size={40} />},
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'Slug', dataIndex: 'slug', key: 'slug'},
    {title: 'Parent', key: 'parent', render: (_, record) => record.parent?.name || '-'},
    {title: 'Status', dataIndex: 'is_active', key: 'is_active', render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>},
    {title: 'Sort Order', dataIndex: 'sort_order', key: 'sort_order', width: 100},
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
              <Popconfirm title='Delete this category?' onConfirm={() => handleDelete(record.id)}><Button icon={<DeleteOutlined />} size='small' danger /></Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Title level={3} style={{margin: 0}}>Categories {isTrashed && <Tag color='red'>Trash</Tag>}</Title>
        {!isTrashed && <Button type='primary' icon={<PlusOutlined />} onClick={openAdd}>Add Category</Button>}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Space wrap style={{flex: 1}}>
          <Input placeholder='Search by name...' prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} style={{width: 250, minWidth: 150, maxWidth: '100%'}} allowClear />
          <Select placeholder='Status' value={statusFilter} onChange={setStatusFilter} allowClear style={{width: 140, minWidth: 100}} options={[{value: '1', label: 'Active'}, {value: '0', label: 'Inactive'}]} />
          {!isTrashed && <Select placeholder='Parent Category' value={parentFilter} onChange={setParentFilter} allowClear showSearch optionFilterProp='label' style={{width: 200, minWidth: 120}}
            options={[{value: 'root', label: 'Root Categories'}, ...parentOptions.map((c) => ({value: String(c.id), label: c.name}))]} />}
          <Select placeholder='Show' value={trashedFilter} onChange={(v) => { setTrashedFilter(v); setSelectedRowKeys([]); }} allowClear style={{width: 140, minWidth: 100}} options={[{value: 'only', label: 'Trashed'}]} />
        </Space>
        {selectedRowKeys.length > 0 && <Dropdown menu={bulkMenuItems}><Button>Bulk Actions ({selectedRowKeys.length}) <DownOutlined /></Button></Dropdown>}
      </div>
      <Table rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}} columns={columns} dataSource={categories} rowKey='id' loading={loading}
        pagination={{...pagination, onChange: (page, pageSize) => fetchCategories(page, pageSize), showSizeChanger: true, showTotal: (total) => `Total ${total} categories`}}
        scroll={{ x: 'max-content' }} />
      <CategoryForm open={formOpen} onClose={() => { setFormOpen(false); setEditingCategory(null); }} onSuccess={handleFormSuccess} editingCategory={editingCategory} />
    </div>
  );
};

export default CategoriesList;
