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
  Image,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DownOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';
import SliderForm from './SliderForm';

const {Title} = Typography;

const SlidersList = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [trashedFilter, setTrashedFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);

  const isTrashed = trashedFilter === 'only';

  const fetchSliders = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter !== undefined) params.is_active = statusFilter;
      if (trashedFilter) params.trashed = trashedFilter;
      const res = await adminAxios.get('/sliders', {params});
      setSliders(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch sliders');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, trashedFilter]);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  const handleDelete = async (id) => {
    try {
      await adminAxios.delete(`/sliders/${id}`);
      message.success('Slider deleted');
      fetchSliders(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleRestore = async (id) => {
    try {
      await adminAxios.post(`/sliders/${id}/restore`);
      message.success('Slider restored');
      fetchSliders(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to restore');
    }
  };

  const handleForceDelete = async (id) => {
    try {
      await adminAxios.delete(`/sliders/${id}/force-delete`);
      message.success('Slider permanently deleted');
      fetchSliders(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await adminAxios.post('/sliders/bulk-action', {ids: selectedRowKeys, action});
      message.success(`${selectedRowKeys.length} slider(s) updated`);
      setSelectedRowKeys([]);
      fetchSliders(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed');
    }
  };

  const bulkMenuItems = {
    items: isTrashed
      ? [
          {key: 'restore', label: 'Restore'},
          {type: 'divider'},
          {key: 'force_delete', label: 'Delete Permanently', danger: true},
        ]
      : [
          {key: 'activate', label: 'Activate'},
          {key: 'deactivate', label: 'Deactivate'},
          {type: 'divider'},
          {key: 'delete', label: 'Delete', danger: true},
        ],
    onClick: ({key}) => handleBulkAction(key),
  };

  const openAdd = () => { setEditingSlider(null); setFormOpen(true); };
  const openEdit = (record) => { setEditingSlider(record); setFormOpen(true); };
  const handleFormSuccess = () => { setFormOpen(false); setEditingSlider(null); fetchSliders(pagination.current, pagination.pageSize); };

  const columns = [
    {
      title: 'Image', dataIndex: 'image', key: 'image', width: 80,
      render: (src) => (
        <Image src={src} width={60} height={40} style={{objectFit: 'cover', borderRadius: 4}}
          fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' />
      ),
    },
    {title: 'Title', dataIndex: 'title', key: 'title'},
    {
      title: 'Status', dataIndex: 'is_active', key: 'is_active',
      render: (active) => <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Schedule', key: 'schedule',
      render: (_, record) => {
        if (!record.starts_at && !record.ends_at) return 'Always';
        const start = record.starts_at ? new Date(record.starts_at).toLocaleDateString() : '...';
        const end = record.ends_at ? new Date(record.ends_at).toLocaleDateString() : '...';
        return `${start} - ${end}`;
      },
    },
    {title: 'Sort Order', dataIndex: 'sort_order', key: 'sort_order', width: 100},
    {
      title: 'Actions', key: 'actions', width: 150,
      render: (_, record) => (
        <Space>
          {isTrashed ? (
            <>
              <Popconfirm title='Restore this slider?' onConfirm={() => handleRestore(record.id)}>
                <Button icon={<UndoOutlined />} size='small' type='primary' />
              </Popconfirm>
              <Popconfirm title='Permanently delete?' onConfirm={() => handleForceDelete(record.id)}>
                <Button icon={<DeleteOutlined />} size='small' danger />
              </Popconfirm>
            </>
          ) : (
            <>
              <Button icon={<EditOutlined />} size='small' onClick={() => openEdit(record)} />
              <Popconfirm title='Delete this slider?' onConfirm={() => handleDelete(record.id)}>
                <Button icon={<DeleteOutlined />} size='small' danger />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Sliders {isTrashed && <Tag color='red'>Trash</Tag>}</Title>
        {!isTrashed && (
          <Button type='primary' icon={<PlusOutlined />} onClick={openAdd}>Add Slider</Button>
        )}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Space>
          <Input placeholder='Search by title...' prefix={<SearchOutlined />} value={search}
            onChange={(e) => setSearch(e.target.value)} style={{width: 250}} allowClear />
          <Select placeholder='Status' value={statusFilter} onChange={setStatusFilter} allowClear style={{width: 140}}
            options={[{value: '1', label: 'Active'}, {value: '0', label: 'Inactive'}]} />
          <Select placeholder='Show' value={trashedFilter} onChange={(v) => { setTrashedFilter(v); setSelectedRowKeys([]); }}
            allowClear style={{width: 140}}
            options={[{value: 'only', label: 'Trashed'}]} />
        </Space>
        {selectedRowKeys.length > 0 && (
          <Dropdown menu={bulkMenuItems}>
            <Button>Bulk Actions ({selectedRowKeys.length}) <DownOutlined /></Button>
          </Dropdown>
        )}
      </div>
      <Table rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}} columns={columns}
        dataSource={sliders} rowKey='id' loading={loading}
        pagination={{...pagination, onChange: (page, pageSize) => fetchSliders(page, pageSize),
          showSizeChanger: true, showTotal: (total) => `Total ${total} sliders`}}
        scroll={{ x: 'max-content' }} />
      <SliderForm open={formOpen} onClose={() => { setFormOpen(false); setEditingSlider(null); }}
        onSuccess={handleFormSuccess} editingSlider={editingSlider} />
    </div>
  );
};

export default SlidersList;
