import {useState, useEffect, useCallback} from 'react';
import {Table, Button, Input, Space, Tag, Typography, message, Popconfirm} from 'antd';
import {PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ThunderboltOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import adminAxios from '../../services/adminAxios';
import {useNavigate} from 'react-router-dom';

const {Title} = Typography;

const FlashSalesList = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');

  const fetchSales = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      const res = await adminAxios.get('/flash-sales', {params});
      setSales(res.data.data);
      setPagination({current: res.data.current_page, pageSize: res.data.per_page, total: res.data.total});
    } catch { message.error('Failed to fetch flash sales'); } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  const handleDelete = async (id) => {
    try { await adminAxios.delete(`/flash-sales/${id}`); message.success('Deleted'); fetchSales(pagination.current, pagination.pageSize); }
    catch { message.error('Failed to delete'); }
  };

  const getStatusTag = (record) => {
    if (!record.is_active) return <Tag color='red'>Inactive</Tag>;
    const now = dayjs();
    if (dayjs(record.starts_at).isAfter(now)) return <Tag color='blue'>Upcoming</Tag>;
    if (dayjs(record.ends_at).isBefore(now)) return <Tag color='default'>Ended</Tag>;
    return <Tag color='green'>Running</Tag>;
  };

  const columns = [
    {title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true},
    {title: 'Products', key: 'products', width: 80, render: (_, r) => r.products_count || r.products?.length || 0},
    {title: 'Discount', key: 'discount', width: 120, render: (_, r) => r.discount_type === 'percentage' ? <Tag color='purple'>{r.discount_value}%</Tag> : <Tag color='cyan'>{r.discount_value} BDT</Tag>},
    {title: 'Status', key: 'status', width: 100, render: (_, r) => getStatusTag(r)},
    {title: 'Start', dataIndex: 'starts_at', key: 'start', width: 150, render: (v) => dayjs(v).format('DD MMM YY, h:mm A')},
    {title: 'End', dataIndex: 'ends_at', key: 'end', width: 150, render: (v) => dayjs(v).format('DD MMM YY, h:mm A')},
    {
      title: 'Actions', key: 'actions', width: 120,
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size='small' onClick={() => navigate(`/flash-sales/${r.id}/edit`)} />
          <Popconfirm title='Delete?' onConfirm={() => handleDelete(r.id)}><Button icon={<DeleteOutlined />} size='small' danger /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}><ThunderboltOutlined style={{marginRight: 8}} />Flash Sales</Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => navigate('/flash-sales/create')}>Create Flash Sale</Button>
      </div>
      <Input placeholder='Search...' prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} style={{width: 220, marginBottom: 16}} allowClear />
      <Table columns={columns} dataSource={sales} rowKey='id' loading={loading}
        pagination={{...pagination, onChange: (p, ps) => fetchSales(p, ps), showSizeChanger: true, showTotal: (t) => `Total ${t}`}}
        scroll={{x: 'max-content'}}
      />
    </div>
  );
};

export default FlashSalesList;
