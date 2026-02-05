import {useState, useEffect, useCallback} from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Typography,
  message,
  Popconfirm,
  Dropdown,
  Tabs,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DownOutlined,
} from '@ant-design/icons';
import superadminAxios from '../../services/superadminAxios';
import SeedDataForm from './SeedDataForm';

const {Title} = Typography;

export const SEED_DATA_TYPES = {
  categories: {
    label: 'Categories',
    fields: [
      {name: 'name', label: 'Name', type: 'string', required: true},
      {name: 'slug', label: 'Slug', type: 'string', required: false, auto: true},
      {name: 'description', label: 'Description', type: 'text', required: false},
      {name: 'icon', label: 'Icon', type: 'image', required: false},
    ],
    columns: [
      {
        title: 'Icon',
        dataIndex: ['data', 'icon'],
        key: 'icon',
        width: 60,
        render: (v) =>
          v ? <Avatar src={v} shape='square' size={32} /> : '-',
      },
      {title: 'Name', dataIndex: ['data', 'name'], key: 'name'},
      {title: 'Slug', dataIndex: ['data', 'slug'], key: 'slug', render: (v) => v || '-'},
      {title: 'Description', dataIndex: ['data', 'description'], key: 'description', render: (v) => v || '-', ellipsis: true},
    ],
  },
  tags: {
    label: 'Tags',
    fields: [
      {name: 'name', label: 'Name', type: 'string', required: true},
      {name: 'slug', label: 'Slug', type: 'string', required: false, auto: true},
      {name: 'color', label: 'Color', type: 'color', required: false},
    ],
    columns: [
      {title: 'Name', dataIndex: ['data', 'name'], key: 'name'},
      {title: 'Slug', dataIndex: ['data', 'slug'], key: 'slug', render: (v) => v || '-'},
      {
        title: 'Color',
        dataIndex: ['data', 'color'],
        key: 'color',
        render: (v) =>
          v ? (
            <Space>
              <span
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  backgroundColor: v,
                  borderRadius: 2,
                  border: '1px solid #d9d9d9',
                }}
              />
              {v}
            </Space>
          ) : (
            '-'
          ),
      },
    ],
  },
};

const SeedDataList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('categories');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const fetchData = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage, type: activeType};
      if (search) params.search = search;
      const res = await superadminAxios.get('/seed-data', {params});
      setData(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch seed data');
    } finally {
      setLoading(false);
    }
  }, [search, activeType]);

  useEffect(() => {
    setSelectedRowKeys([]);
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      await superadminAxios.delete(`/seed-data/${id}`);
      message.success('Item deleted');
      fetchData(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await superadminAxios.post('/seed-data/bulk-action', {
        ids: selectedRowKeys,
        action,
      });
      message.success(`${selectedRowKeys.length} item(s) ${action}d`);
      setSelectedRowKeys([]);
      fetchData(pagination.current, pagination.pageSize);
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

  const handleEdit = (record) => {
    setEditingItem(record);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchData(pagination.current, pagination.pageSize);
  };

  const typeConfig = SEED_DATA_TYPES[activeType];

  const columns = [
    ...typeConfig.columns,
    {title: 'Sort', dataIndex: 'sort_order', key: 'sort_order', width: 70},
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 90,
      render: (v) => <Tag color={v ? 'green' : 'red'}>{v ? 'Active' : 'Inactive'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} size='small' onClick={() => handleEdit(record)} />
          <Popconfirm title='Delete this item?' onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size='small' danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = Object.entries(SEED_DATA_TYPES).map(([key, config]) => ({
    key,
    label: config.label,
  }));

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Title level={3} style={{margin: 0}}>Seed Data</Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
          Add {typeConfig.label.slice(0, -1)}
        </Button>
      </div>
      <Tabs
        activeKey={activeType}
        onChange={(key) => {
          setActiveType(key);
          setSearch('');
          setSelectedRowKeys([]);
        }}
        items={tabItems}
      />
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Input
          placeholder={`Search ${typeConfig.label.toLowerCase()}...`}
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{width: 250, minWidth: 150, maxWidth: '100%'}}
          allowClear
        />
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
        dataSource={data}
        rowKey='id'
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchData(page, pageSize),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        scroll={{ x: 'max-content' }}
      />
      <SeedDataForm
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editingItem={editingItem}
        activeType={activeType}
        typeConfig={typeConfig}
      />
    </div>
  );
};

export default SeedDataList;
