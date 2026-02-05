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
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import affiliateAxios from '../../services/affiliateAxios';

const {Title} = Typography;

const statusColors = {
  open: 'blue',
  in_progress: 'orange',
  resolved: 'green',
  closed: 'default',
};

const priorityColors = {
  low: 'default',
  medium: 'blue',
  high: 'orange',
  urgent: 'red',
};

const MyTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);

  const fetchTickets = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await affiliateAxios.get('/tickets', {params});
      setTickets(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const columns = [
    {title: 'Ticket #', dataIndex: 'ticket_number', key: 'ticket_number'},
    {title: 'Subject', dataIndex: 'subject', key: 'subject', ellipsis: true},
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={statusColors[s]}>{s.replace('_', ' ')}</Tag>,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (p) => <Tag color={priorityColors[p]}>{p}</Tag>,
    },
    {title: 'Replies', dataIndex: 'replies_count', key: 'replies_count'},
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          size='small'
          onClick={() => navigate(`/affiliate/tickets/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>My Tickets</Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => navigate('/affiliate/tickets/create')}
        >
          New Ticket
        </Button>
      </div>
      <div style={{marginBottom: 16}}>
        <Space>
          <Input
            placeholder='Search by ticket # or subject...'
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{width: 280}}
            allowClear
          />
          <Select
            placeholder='Status'
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{width: 140}}
            options={[
              {value: 'open', label: 'Open'},
              {value: 'in_progress', label: 'In Progress'},
              {value: 'resolved', label: 'Resolved'},
              {value: 'closed', label: 'Closed'},
            ]}
          />
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={tickets}
        rowKey='id'
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchTickets(page, pageSize),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} tickets`,
        }}
      />
    </div>
  );
};

export default MyTickets;
