import {useState, useEffect, useCallback} from 'react';
import {Table, Button, Input, Select, Space, Tag, Typography, message, Popconfirm, Modal, Rate, Dropdown} from 'antd';
import {SearchOutlined, CheckOutlined, DeleteOutlined, MessageOutlined, StarOutlined, DownOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import adminAxios from '../../services/adminAxios';

const {Title, Text} = Typography;
const {TextArea} = Input;

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [ratingFilter, setRatingFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [replyModal, setReplyModal] = useState({open: false, review: null, reply: ''});

  const fetchReviews = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter !== undefined) params.status = statusFilter;
      if (ratingFilter) params.rating = ratingFilter;
      const res = await adminAxios.get('/reviews', {params});
      setReviews(res.data.data);
      setPagination({current: res.data.current_page, pageSize: res.data.per_page, total: res.data.total});
    } catch {
      message.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, ratingFilter]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleApprove = async (id) => {
    try { await adminAxios.post(`/reviews/${id}/approve`); message.success('Review approved'); fetchReviews(pagination.current, pagination.pageSize); }
    catch { message.error('Failed to approve'); }
  };

  const handleDelete = async (id) => {
    try { await adminAxios.delete(`/reviews/${id}`); message.success('Review deleted'); fetchReviews(pagination.current, pagination.pageSize); }
    catch { message.error('Failed to delete'); }
  };

  const handleReply = async () => {
    try {
      await adminAxios.post(`/reviews/${replyModal.review.id}/reply`, {admin_reply: replyModal.reply});
      message.success('Reply sent');
      setReplyModal({open: false, review: null, reply: ''});
      fetchReviews(pagination.current, pagination.pageSize);
    } catch { message.error('Failed to send reply'); }
  };

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await adminAxios.post('/reviews/bulk-action', {ids: selectedRowKeys, action});
      message.success(`${selectedRowKeys.length} review(s) updated`);
      setSelectedRowKeys([]);
      fetchReviews(pagination.current, pagination.pageSize);
    } catch { message.error('Failed'); }
  };

  const bulkMenuItems = {
    items: [
      {key: 'approve', label: 'Approve'},
      {type: 'divider'},
      {key: 'delete', label: 'Delete', danger: true},
    ],
    onClick: ({key}) => handleBulkAction(key),
  };

  const columns = [
    {title: 'Product', dataIndex: ['product', 'name'], key: 'product', ellipsis: true, width: 200},
    {title: 'Customer', dataIndex: ['customer', 'name'], key: 'customer', ellipsis: true, width: 140, render: (name, r) => name || r.customer?.phone || 'N/A'},
    {title: 'Rating', dataIndex: 'rating', key: 'rating', width: 140, render: (v) => <Rate disabled defaultValue={v} style={{fontSize: 14}} />},
    {title: 'Title', dataIndex: 'title', key: 'title', ellipsis: true},
    {title: 'Comment', dataIndex: 'comment', key: 'comment', ellipsis: true, width: 200},
    {
      title: 'Status', key: 'status', width: 100,
      render: (_, r) => r.is_approved ? <Tag color='green'>Approved</Tag> : <Tag color='orange'>Pending</Tag>,
    },
    {title: 'Date', dataIndex: 'created_at', key: 'date', width: 120, render: (v) => dayjs(v).format('DD MMM YY')},
    {
      title: 'Actions', key: 'actions', width: 150,
      render: (_, r) => (
        <Space>
          {!r.is_approved && <Button icon={<CheckOutlined />} size='small' type='primary' onClick={() => handleApprove(r.id)} title='Approve' />}
          <Button icon={<MessageOutlined />} size='small' onClick={() => setReplyModal({open: true, review: r, reply: r.admin_reply || ''})} title='Reply' />
          <Popconfirm title='Delete this review?' onConfirm={() => handleDelete(r.id)}><Button icon={<DeleteOutlined />} size='small' danger /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Title level={3} style={{margin: 0}}><StarOutlined style={{marginRight: 8}} />Reviews</Title>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
        <Space wrap>
          <Input placeholder='Search product or customer...' prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} style={{width: 220}} allowClear />
          <Select placeholder='Status' value={statusFilter} onChange={setStatusFilter} allowClear style={{width: 130}} options={[{value: 'pending', label: 'Pending'}, {value: 'approved', label: 'Approved'}]} />
          <Select placeholder='Rating' value={ratingFilter} onChange={setRatingFilter} allowClear style={{width: 120}} options={[{value: 5, label: '5 Stars'}, {value: 4, label: '4 Stars'}, {value: 3, label: '3 Stars'}, {value: 2, label: '2 Stars'}, {value: 1, label: '1 Star'}]} />
        </Space>
        {selectedRowKeys.length > 0 && <Dropdown menu={bulkMenuItems}><Button>Bulk Actions ({selectedRowKeys.length}) <DownOutlined /></Button></Dropdown>}
      </div>

      <Table
        rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}}
        columns={columns}
        dataSource={reviews}
        rowKey='id'
        loading={loading}
        pagination={{...pagination, onChange: (page, pageSize) => fetchReviews(page, pageSize), showSizeChanger: true, showTotal: (total) => `Total ${total} reviews`}}
        scroll={{x: 'max-content'}}
      />

      <Modal title='Reply to Review' open={replyModal.open} onOk={handleReply} onCancel={() => setReplyModal({open: false, review: null, reply: ''})} okText='Send Reply'>
        {replyModal.review && (
          <div style={{marginBottom: 16}}>
            <Rate disabled defaultValue={replyModal.review.rating} style={{fontSize: 14}} />
            <p style={{margin: '8px 0 0'}}>{replyModal.review.comment}</p>
          </div>
        )}
        <TextArea rows={4} value={replyModal.reply} onChange={(e) => setReplyModal(prev => ({...prev, reply: e.target.value}))} placeholder='Type your reply...' />
      </Modal>
    </div>
  );
};

export default ReviewsList;
