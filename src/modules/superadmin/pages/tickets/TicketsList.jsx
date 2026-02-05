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
  Dropdown,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DownOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';

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

const TicketsList = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [priorityFilter, setPriorityFilter] = useState(undefined);
  const [affiliateFilter, setAffiliateFilter] = useState(undefined);
  const [affiliates, setAffiliates] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    superadminAxios
      .get('/affiliates', {params: {per_page: 1000}})
      .then((res) => setAffiliates(res.data.data || []))
      .catch(() => {});
  }, []);

  const fetchTickets = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (affiliateFilter) params.affiliate_id = affiliateFilter;
      const res = await superadminAxios.get('/tickets', {params});
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
  }, [search, statusFilter, priorityFilter, affiliateFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await superadminAxios.post('/tickets/bulk-action', {
        ids: selectedRowKeys,
        action,
      });
      message.success(`${selectedRowKeys.length} ticket(s) updated`);
      setSelectedRowKeys([]);
      fetchTickets(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to perform action');
    }
  };

  const bulkMenuItems = {
    items: [
      {key: 'in_progress', label: 'Mark In Progress'},
      {key: 'resolved', label: 'Mark Resolved'},
      {key: 'close', label: 'Close', danger: true},
    ],
    onClick: ({key}) => handleBulkAction(key),
  };

  const columns = [
    {title: 'Ticket #', dataIndex: 'ticket_number', key: 'ticket_number'},
    {title: 'Subject', dataIndex: 'subject', key: 'subject', ellipsis: true},
    {title: 'Affiliate', dataIndex: ['affiliate', 'name'], key: 'affiliate'},
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
          onClick={() => navigate(`/superadmin/tickets/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Support Tickets</Title>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
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
          <Select
            placeholder='Priority'
            value={priorityFilter}
            onChange={setPriorityFilter}
            allowClear
            style={{width: 140}}
            options={[
              {value: 'low', label: 'Low'},
              {value: 'medium', label: 'Medium'},
              {value: 'high', label: 'High'},
              {value: 'urgent', label: 'Urgent'},
            ]}
          />
          <Select
            placeholder='Affiliate'
            value={affiliateFilter}
            onChange={setAffiliateFilter}
            allowClear
            showSearch
            optionFilterProp='label'
            style={{width: 200}}
            options={affiliates.map((a) => ({value: a.id, label: a.name}))}
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
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
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
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default TicketsList;
