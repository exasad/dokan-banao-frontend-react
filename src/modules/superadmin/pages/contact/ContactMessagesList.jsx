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
  Modal,
  Descriptions,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  DownOutlined,
} from '@ant-design/icons';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const statusColors = {
  new: 'blue',
  read: 'green',
  replied: 'default',
};

const ContactMessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 15, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [detailModal, setDetailModal] = useState({open: false, message: null, loading: false});

  const fetchMessages = useCallback(async (page = 1, perPage = 15) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await superadminAxios.get('/contact-messages', {params});
      setMessages(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch contact messages');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleView = async (id) => {
    setDetailModal({open: true, message: null, loading: true});
    try {
      const res = await superadminAxios.get(`/contact-messages/${id}`);
      setDetailModal({open: true, message: res.data, loading: false});
      // Refresh list to update status
      fetchMessages(pagination.current, pagination.pageSize);
    } catch {
      message.error('Failed to load message');
      setDetailModal({open: false, message: null, loading: false});
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete this message?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await superadminAxios.delete(`/contact-messages/${id}`);
          message.success('Message deleted');
          fetchMessages(pagination.current, pagination.pageSize);
        } catch {
          message.error('Failed to delete message');
        }
      },
    });
  };

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await superadminAxios.post('/contact-messages/bulk-action', {
        ids: selectedRowKeys,
        action,
      });
      message.success(`${selectedRowKeys.length} message(s) updated`);
      setSelectedRowKeys([]);
      fetchMessages(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to perform action');
    }
  };

  const bulkMenuItems = {
    items: [
      {key: 'mark_read', label: 'Mark as Read'},
      {key: 'delete', label: 'Delete', danger: true},
    ],
    onClick: ({key}) => handleBulkAction(key),
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <span style={{fontWeight: record.status === 'new' ? 600 : 400}}>{name}</span>
      ),
    },
    {title: 'Email', dataIndex: 'email', key: 'email'},
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
      render: (subject, record) => (
        <span style={{fontWeight: record.status === 'new' ? 600 : 400}}>{subject}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={statusColors[s]}>{s}</Tag>,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size='small'
            onClick={() => handleView(record.id)}
          >
            View
          </Button>
          <Button
            icon={<DeleteOutlined />}
            size='small'
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Title level={3} style={{margin: 0}}>Contact Messages</Title>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Space wrap style={{flex: 1}}>
          <Input
            placeholder='Search by name, email or subject...'
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{width: 280, minWidth: 150, maxWidth: '100%'}}
            allowClear
          />
          <Select
            placeholder='Status'
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{width: 140, minWidth: 100}}
            options={[
              {value: 'new', label: 'New'},
              {value: 'read', label: 'Read'},
              {value: 'replied', label: 'Replied'},
            ]}
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
        dataSource={messages}
        rowKey='id'
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchMessages(page, pageSize),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} messages`,
        }}
        scroll={{x: 'max-content'}}
      />

      <Modal
        title='Contact Message'
        open={detailModal.open}
        onCancel={() => setDetailModal({open: false, message: null, loading: false})}
        footer={[
          <Button key='close' onClick={() => setDetailModal({open: false, message: null, loading: false})}>
            Close
          </Button>,
        ]}
        width={640}
        loading={detailModal.loading}
      >
        {detailModal.message && (
          <Descriptions column={1} bordered size='small'>
            <Descriptions.Item label='Name'>{detailModal.message.name}</Descriptions.Item>
            <Descriptions.Item label='Email'>{detailModal.message.email}</Descriptions.Item>
            <Descriptions.Item label='Subject'>{detailModal.message.subject}</Descriptions.Item>
            <Descriptions.Item label='Status'>
              <Tag color={statusColors[detailModal.message.status]}>{detailModal.message.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label='Date'>
              {new Date(detailModal.message.created_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label='Message'>
              <div style={{whiteSpace: 'pre-wrap'}}>{detailModal.message.message}</div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ContactMessagesList;
