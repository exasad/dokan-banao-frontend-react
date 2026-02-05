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
  EyeOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import adminAxios from '../../services/adminAxios';

const {Title} = Typography;

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [categoryFilter, setCategoryFilter] = useState(undefined);
  const [stockFilter, setStockFilter] = useState(undefined);
  const [trashedFilter, setTrashedFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const isTrashed = trashedFilter === 'only';

  useEffect(() => {
    adminAxios.get('/categories/parent-options').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter !== undefined) params.is_active = statusFilter;
      if (categoryFilter) params.category_id = categoryFilter;
      if (stockFilter) params.stock_status = stockFilter;
      if (trashedFilter) params.trashed = trashedFilter;
      const res = await adminAxios.get('/products', {params});
      setProducts(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, categoryFilter, stockFilter, trashedFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    try {
      await adminAxios.delete(`/products/${id}`);
      message.success('Product deleted');
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleRestore = async (id) => {
    try {
      await adminAxios.post(`/products/${id}/restore`);
      message.success('Product restored');
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to restore');
    }
  };

  const handleForceDelete = async (id) => {
    try {
      await adminAxios.delete(`/products/${id}/force-delete`);
      message.success('Product permanently deleted');
      fetchProducts(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await adminAxios.post('/products/bulk-action', {ids: selectedRowKeys, action});
      message.success(`${selectedRowKeys.length} product(s) updated`);
      setSelectedRowKeys([]);
      fetchProducts(pagination.current, pagination.pageSize);
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

  const columns = [
    {
      title: 'Image',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 80,
      render: (src) => (
        <Image
          src={src}
          width={50}
          height={50}
          style={{objectFit: 'cover', borderRadius: 4}}
          fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        />
      ),
    },
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'SKU', dataIndex: 'sku', key: 'sku', render: (v) => v || '-'},
    {
      title: 'Category',
      key: 'category',
      render: (_, record) => record.category?.name || '-',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (v) => `৳${parseFloat(v).toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (v) => (
        <Tag color={v > 0 ? 'green' : 'red'}>{v > 0 ? v : 'Out of stock'}</Tag>
      ),
    },
    {
      title: 'Variants',
      dataIndex: 'variants_count',
      key: 'variants_count',
      width: 80,
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          {isTrashed ? (
            <>
              <Popconfirm title='Restore this product?' onConfirm={() => handleRestore(record.id)}>
                <Button icon={<UndoOutlined />} size='small' type='primary' />
              </Popconfirm>
              <Popconfirm title='Permanently delete?' onConfirm={() => handleForceDelete(record.id)}>
                <Button icon={<DeleteOutlined />} size='small' danger />
              </Popconfirm>
            </>
          ) : (
            <>
              <Button
                icon={<EyeOutlined />}
                size='small'
                onClick={() => navigate(`/products/${record.id}`)}
              />
              <Button
                icon={<EditOutlined />}
                size='small'
                onClick={() => navigate(`/products/${record.id}/edit`)}
              />
              <Popconfirm title='Delete this product?' onConfirm={() => handleDelete(record.id)}>
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
        <Title level={3} style={{margin: 0}}>Products {isTrashed && <Tag color='red'>Trash</Tag>}</Title>
        {!isTrashed && (
          <Button type='primary' icon={<PlusOutlined />} onClick={() => navigate('/products/create')}>
            Add Product
          </Button>
        )}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8}}>
        <Space wrap>
          <Input
            placeholder='Search by name or SKU...'
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
            style={{width: 130}}
            options={[
              {value: '1', label: 'Active'},
              {value: '0', label: 'Inactive'},
            ]}
          />
          {!isTrashed && (
            <Select
              placeholder='Category'
              value={categoryFilter}
              onChange={setCategoryFilter}
              allowClear
              showSearch
              optionFilterProp='label'
              style={{width: 180}}
              options={categories.map((c) => ({value: String(c.id), label: c.name}))}
            />
          )}
          {!isTrashed && (
            <Select
              placeholder='Stock'
              value={stockFilter}
              onChange={setStockFilter}
              allowClear
              style={{width: 140}}
              options={[
                {value: 'in_stock', label: 'In Stock'},
                {value: 'out_of_stock', label: 'Out of Stock'},
              ]}
            />
          )}
          <Select
            placeholder='Show'
            value={trashedFilter}
            onChange={(v) => { setTrashedFilter(v); setSelectedRowKeys([]); }}
            allowClear
            style={{width: 140}}
            options={[{value: 'only', label: 'Trashed'}]}
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
        rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}}
        columns={columns}
        dataSource={products}
        rowKey='id'
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchProducts(page, pageSize),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} products`,
        }}
      />
    </div>
  );
};

export default ProductsList;
