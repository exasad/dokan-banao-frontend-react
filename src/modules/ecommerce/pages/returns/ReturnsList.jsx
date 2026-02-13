import {useState, useEffect, useCallback} from 'react';
import {Table, Button, Input, Select, Space, Tag, Typography, message, Modal, Descriptions, Image, InputNumber} from 'antd';
import {SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined, DollarOutlined, RollbackOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import adminAxios from '../../services/adminAxios';

const {Title, Text} = Typography;
const {TextArea} = Input;

const statusColors = {pending: 'orange', approved: 'blue', rejected: 'red', completed: 'green'};

const ReturnsList = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [search, setSearch] = useState('');
  const [detailModal, setDetailModal] = useState({open: false, data: null, loading: false});
  const [actionModal, setActionModal] = useState({open: false, type: null, returnId: null, notes: '', refundAmount: 0});

  const fetchReturns = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await adminAxios.get('/returns', {params});
      setReturns(res.data.data);
      setPagination({current: res.data.current_page, pageSize: res.data.per_page, total: res.data.total});
    } catch { message.error('Failed to fetch returns'); } finally { setLoading(false); }
  }, [statusFilter, search]);

  useEffect(() => { fetchReturns(); }, [fetchReturns]);

  const viewDetail = async (id) => {
    setDetailModal({open: true, data: null, loading: true});
    try {
      const res = await adminAxios.get(`/returns/${id}`);
      setDetailModal({open: true, data: res.data, loading: false});
    } catch { message.error('Failed to load details'); setDetailModal({open: false, data: null, loading: false}); }
  };

  const handleAction = async () => {
    const {type, returnId, notes, refundAmount} = actionModal;
    try {
      if (type === 'approve') await adminAxios.post(`/returns/${returnId}/approve`, {admin_notes: notes});
      else if (type === 'reject') await adminAxios.post(`/returns/${returnId}/reject`, {admin_notes: notes});
      else if (type === 'complete') await adminAxios.post(`/returns/${returnId}/complete`, {admin_notes: notes, refund_amount: refundAmount});
      message.success(`Return ${type}d`);
      setActionModal({open: false, type: null, returnId: null, notes: '', refundAmount: 0});
      fetchReturns(pagination.current, pagination.pageSize);
    } catch (err) { message.error(err.response?.data?.message || `Failed to ${type}`); }
  };

  const columns = [
    {title: 'ID', dataIndex: 'id', key: 'id', width: 60},
    {title: 'Order', key: 'order', width: 120, render: (_, r) => <Text strong>#{r.order?.order_number}</Text>},
    {title: 'Customer', key: 'customer', width: 140, render: (_, r) => r.customer?.name || r.customer?.phone || 'N/A', ellipsis: true},
    {title: 'Reason', dataIndex: 'reason', key: 'reason', width: 140, render: (v) => <Tag>{v?.replace(/_/g, ' ')}</Tag>},
    {title: 'Items', key: 'items', width: 60, render: (_, r) => r.items_count || r.items?.length || 0},
    {title: 'Status', dataIndex: 'status', key: 'status', width: 110, render: (v) => <Tag color={statusColors[v]}>{v?.charAt(0).toUpperCase() + v?.slice(1)}</Tag>},
    {title: 'Date', dataIndex: 'created_at', key: 'date', width: 120, render: (v) => dayjs(v).format('DD MMM YY')},
    {
      title: 'Actions', key: 'actions', width: 200,
      render: (_, r) => (
        <Space>
          <Button icon={<EyeOutlined />} size='small' onClick={() => viewDetail(r.id)} />
          {r.status === 'pending' && (
            <>
              <Button icon={<CheckOutlined />} size='small' type='primary' onClick={() => setActionModal({open: true, type: 'approve', returnId: r.id, notes: '', refundAmount: 0})} />
              <Button icon={<CloseOutlined />} size='small' danger onClick={() => setActionModal({open: true, type: 'reject', returnId: r.id, notes: '', refundAmount: 0})} />
            </>
          )}
          {r.status === 'approved' && (
            <Button icon={<DollarOutlined />} size='small' style={{color: 'green', borderColor: 'green'}} onClick={() => setActionModal({open: true, type: 'complete', returnId: r.id, notes: '', refundAmount: r.order?.total || 0})} />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}><RollbackOutlined style={{marginRight: 8}} />Return Requests</Title>
      </div>

      <Space wrap style={{marginBottom: 16}}>
        <Input placeholder='Search order #...' prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} style={{width: 200}} allowClear />
        <Select placeholder='Status' value={statusFilter} onChange={setStatusFilter} allowClear style={{width: 140}} options={[{value: 'pending', label: 'Pending'}, {value: 'approved', label: 'Approved'}, {value: 'rejected', label: 'Rejected'}, {value: 'completed', label: 'Completed'}]} />
      </Space>

      <Table columns={columns} dataSource={returns} rowKey='id' loading={loading}
        pagination={{...pagination, onChange: (page, pageSize) => fetchReturns(page, pageSize), showSizeChanger: true, showTotal: (total) => `Total ${total} returns`}}
        scroll={{x: 'max-content'}}
      />

      {/* Detail Modal */}
      <Modal title='Return Request Details' open={detailModal.open} onCancel={() => setDetailModal({open: false, data: null, loading: false})} footer={null} width={600}>
        {detailModal.loading ? <div style={{textAlign: 'center', padding: 40}}>Loading...</div> : detailModal.data && (
          <Descriptions bordered size='small' column={2}>
            <Descriptions.Item label='Order'>#{detailModal.data.order?.order_number}</Descriptions.Item>
            <Descriptions.Item label='Status'><Tag color={statusColors[detailModal.data.status]}>{detailModal.data.status}</Tag></Descriptions.Item>
            <Descriptions.Item label='Reason' span={2}>{detailModal.data.reason?.replace(/_/g, ' ')}</Descriptions.Item>
            <Descriptions.Item label='Description' span={2}>{detailModal.data.description || 'N/A'}</Descriptions.Item>
            {detailModal.data.admin_notes && <Descriptions.Item label='Admin Notes' span={2}>{detailModal.data.admin_notes}</Descriptions.Item>}
            {detailModal.data.refund_amount && <Descriptions.Item label='Refund Amount'>{detailModal.data.refund_amount} BDT</Descriptions.Item>}
          </Descriptions>
        )}
      </Modal>

      {/* Action Modal */}
      <Modal title={`${actionModal.type?.charAt(0).toUpperCase()}${actionModal.type?.slice(1) || ''} Return`} open={actionModal.open}
        onOk={handleAction} onCancel={() => setActionModal({open: false, type: null, returnId: null, notes: '', refundAmount: 0})}
        okText={actionModal.type?.charAt(0).toUpperCase() + (actionModal.type?.slice(1) || '')}
        okButtonProps={{danger: actionModal.type === 'reject'}}
      >
        <div style={{marginBottom: 16}}>
          <Text strong>Admin Notes:</Text>
          <TextArea rows={3} value={actionModal.notes} onChange={(e) => setActionModal(p => ({...p, notes: e.target.value}))} placeholder='Optional notes...' style={{marginTop: 8}} />
        </div>
        {actionModal.type === 'complete' && (
          <div>
            <Text strong>Refund Amount (BDT):</Text>
            <InputNumber value={actionModal.refundAmount} onChange={(v) => setActionModal(p => ({...p, refundAmount: v}))} min={0} style={{width: '100%', marginTop: 8}} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReturnsList;
