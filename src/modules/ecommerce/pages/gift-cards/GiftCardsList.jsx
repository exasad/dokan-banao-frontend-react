import {useState, useEffect, useCallback} from 'react';
import {Typography, Table, Card, Tag, Space, Button, message, Popconfirm, Input} from 'antd';
import {PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import adminAxios from '../../services/adminAxios';

const {Title, Text} = Typography;
const {Search} = Input;

const GiftCardsList = () => {
  const navigate = useNavigate();
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({current: 1, pageSize: 15, total: 0});
  const [search, setSearch] = useState('');

  const fetchGiftCards = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {page, per_page: 15};
      if (search) params.search = search;
      const {data} = await adminAxios.get('/gift-cards', {params});
      setGiftCards(data.data);
      setPagination({current: data.current_page, pageSize: data.per_page, total: data.total});
    } catch {
      message.error('Failed to load gift cards');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchGiftCards();
  }, [fetchGiftCards]);

  const handleDelete = async (id) => {
    try {
      await adminAxios.delete(`/gift-cards/${id}`);
      message.success('Gift card deleted');
      fetchGiftCards(pagination.current);
    } catch {
      message.error('Failed to delete');
    }
  };

  const formatCurrency = (v) => `৳${Number(v || 0).toLocaleString('en-BD')}`;

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code) => <Text copyable strong>{code}</Text>,
    },
    {
      title: 'Balance',
      key: 'balance',
      render: (_, r) => (
        <div>
          <Text strong style={{color: '#52c41a'}}>{formatCurrency(r.current_balance)}</Text>
          <div><Text type="secondary" style={{fontSize: 11}}>of {formatCurrency(r.initial_balance)}</Text></div>
        </div>
      ),
    },
    {
      title: 'Recipient',
      key: 'recipient',
      render: (_, r) => (
        <div>
          {r.recipient_name && <div><Text>{r.recipient_name}</Text></div>}
          {r.recipient_email && <div><Text type="secondary" style={{fontSize: 12}}>{r.recipient_email}</Text></div>}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, r) => {
        if (!r.is_active) return <Tag color="red">Inactive</Tag>;
        if (r.expires_at && new Date(r.expires_at) < new Date()) return <Tag color="orange">Expired</Tag>;
        if (Number(r.current_balance) <= 0) return <Tag color="default">Used</Tag>;
        return <Tag color="green">Active</Tag>;
      },
    },
    {
      title: 'Expires',
      dataIndex: 'expires_at',
      key: 'expires_at',
      render: (d) => d ? new Date(d).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}) : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => navigate(`/gift-cards/${r.id}/edit`)} />
          <Popconfirm title="Delete this gift card?" onConfirm={() => handleDelete(r.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
        <Title level={3} style={{margin: 0}}>Gift Cards</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/gift-cards/create')}>
          Create Gift Card
        </Button>
      </div>

      <Card>
        <div style={{marginBottom: 16}}>
          <Search
            placeholder="Search by code, email, or name..."
            allowClear
            onSearch={(v) => setSearch(v)}
            style={{maxWidth: 400}}
          />
        </div>
        <Table
          dataSource={giftCards}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page) => fetchGiftCards(page),
            showSizeChanger: false,
          }}
          scroll={{x: 'max-content'}}
        />
      </Card>
    </div>
  );
};

export default GiftCardsList;
