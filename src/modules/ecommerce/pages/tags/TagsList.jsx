import {useState, useEffect, useCallback} from 'react';
import {
  Table, Button, Input, Select, Space, Tag, Typography, message, Popconfirm, Dropdown,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownOutlined, UndoOutlined,
} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';
import TagForm from './TagForm';

const {Title} = Typography;

const TagsList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [trashedFilter, setTrashedFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  const isTrashed = trashedFilter === 'only';

  const fetchTags = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter !== undefined) params.is_active = statusFilter;
      if (trashedFilter) params.trashed = trashedFilter;
      const res = await adminAxios.get('/tags', {params});
      setTags(res.data.data);
      setPagination({current: res.data.current_page, pageSize: res.data.per_page, total: res.data.total});
    } catch { message.error('Failed to fetch tags'); } finally { setLoading(false); }
  }, [search, statusFilter, trashedFilter]);

  useEffect(() => { fetchTags(); }, [fetchTags]);

  const handleDelete = async (id) => {
    try { await adminAxios.delete(`/tags/${id}`); message.success('Tag deleted'); fetchTags(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed to delete'); }
  };
  const handleRestore = async (id) => {
    try { await adminAxios.post(`/tags/${id}/restore`); message.success('Tag restored'); fetchTags(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed to restore'); }
  };
  const handleForceDelete = async (id) => {
    try { await adminAxios.delete(`/tags/${id}/force-delete`); message.success('Tag permanently deleted'); fetchTags(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed to delete'); }
  };
  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try { await adminAxios.post('/tags/bulk-action', {ids: selectedRowKeys, action}); message.success(`${selectedRowKeys.length} tag(s) updated`); setSelectedRowKeys([]); fetchTags(pagination.current, pagination.pageSize); }
    catch (err) { message.error(err.response?.data?.message || 'Failed'); }
  };

  const bulkMenuItems = {
    items: isTrashed
      ? [{key: 'restore', label: 'Restore'}, {type: 'divider'}, {key: 'force_delete', label: 'Delete Permanently', danger: true}]
      : [{key: 'activate', label: 'Activate'}, {key: 'deactivate', label: 'Deactivate'}, {type: 'divider'}, {key: 'delete', label: 'Delete', danger: true}],
    onClick: ({key}) => handleBulkAction(key),
  };

  const openAdd = () => { setEditingTag(null); setFormOpen(true); };
  const openEdit = (record) => { setEditingTag(record); setFormOpen(true); };
  const handleFormSuccess = () => { setFormOpen(false); setEditingTag(null); fetchTags(pagination.current, pagination.pageSize); };

  const columns = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'Slug', dataIndex: 'slug', key: 'slug'},
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
              <Popconfirm title='Delete this tag?' onConfirm={() => handleDelete(record.id)}><Button icon={<DeleteOutlined />} size='small' danger /></Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Title level={3} style={{margin: 0}}>Tags {isTrashed && <Tag color='red'>Trash</Tag>}</Title>
        {!isTrashed && <Button type='primary' icon={<PlusOutlined />} onClick={openAdd}>Add Tag</Button>}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Space wrap style={{flex: 1}}>
          <Input placeholder='Search by name...' prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} style={{width: 250, minWidth: 150, maxWidth: '100%'}} allowClear />
          <Select placeholder='Status' value={statusFilter} onChange={setStatusFilter} allowClear style={{width: 140, minWidth: 100}} options={[{value: '1', label: 'Active'}, {value: '0', label: 'Inactive'}]} />
          <Select placeholder='Show' value={trashedFilter} onChange={(v) => { setTrashedFilter(v); setSelectedRowKeys([]); }} allowClear style={{width: 140, minWidth: 100}} options={[{value: 'only', label: 'Trashed'}]} />
        </Space>
        {selectedRowKeys.length > 0 && <Dropdown menu={bulkMenuItems}><Button>Bulk Actions ({selectedRowKeys.length}) <DownOutlined /></Button></Dropdown>}
      </div>
      <Table rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}} columns={columns} dataSource={tags} rowKey='id' loading={loading}
        pagination={{...pagination, onChange: (page, pageSize) => fetchTags(page, pageSize), showSizeChanger: true, showTotal: (total) => `Total ${total} tags`}}
        scroll={{ x: 'max-content' }} />
      <TagForm open={formOpen} onClose={() => { setFormOpen(false); setEditingTag(null); }} onSuccess={handleFormSuccess} editingTag={editingTag} />
    </div>
  );
};

export default TagsList;
