import {useState, useEffect} from 'react';
import {
  Card,
  Typography,
  Tag,
  Select,
  Button,
  Input,
  Space,
  Spin,
  Divider,
  message,
} from 'antd';
import {ArrowLeftOutlined, SendOutlined} from '@ant-design/icons';
import {useParams, useNavigate} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';

const {Title, Text, Paragraph} = Typography;
const {TextArea} = Input;

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

const TicketDetail = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const res = await superadminAxios.get(`/tickets/${id}`);
      setTicket(res.data);
    } catch {
      message.error('Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      await superadminAxios.patch(`/tickets/${id}`, {status});
      message.success('Status updated');
      fetchTicket();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (priority) => {
    setUpdating(true);
    try {
      await superadminAxios.patch(`/tickets/${id}`, {priority});
      message.success('Priority updated');
      fetchTicket();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update priority');
    } finally {
      setUpdating(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    setSending(true);
    try {
      await superadminAxios.post(`/tickets/${id}/reply`, {message: replyMessage});
      message.success('Reply sent');
      setReplyMessage('');
      fetchTicket();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleClose = async () => {
    try {
      await superadminAxios.patch(`/tickets/${id}/close`);
      message.success('Ticket closed');
      fetchTicket();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to close ticket');
    }
  };

  if (loading) return <Spin size='large' style={{display: 'block', margin: '100px auto'}} />;
  if (!ticket) return <Text>Ticket not found</Text>;

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/superadmin/tickets')}
        style={{marginBottom: 16}}
      >
        Back to Tickets
      </Button>

      <Card style={{marginBottom: 16}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <Title level={4} style={{margin: 0}}>{ticket.ticket_number}: {ticket.subject}</Title>
            <Text type='secondary'>
              by {ticket.affiliate?.name} ({ticket.affiliate?.email}) &bull;{' '}
              {new Date(ticket.created_at).toLocaleString()}
            </Text>
          </div>
          <Space>
            <Select
              value={ticket.status}
              onChange={handleStatusChange}
              loading={updating}
              style={{width: 140}}
              options={[
                {value: 'open', label: 'Open'},
                {value: 'in_progress', label: 'In Progress'},
                {value: 'resolved', label: 'Resolved'},
                {value: 'closed', label: 'Closed'},
              ]}
            />
            <Select
              value={ticket.priority}
              onChange={handlePriorityChange}
              loading={updating}
              style={{width: 120}}
              options={[
                {value: 'low', label: 'Low'},
                {value: 'medium', label: 'Medium'},
                {value: 'high', label: 'High'},
                {value: 'urgent', label: 'Urgent'},
              ]}
            />
            {ticket.status !== 'closed' && (
              <Button danger onClick={handleClose}>Close Ticket</Button>
            )}
          </Space>
        </div>
        <Divider />
        <div style={{marginBottom: 8}}>
          <Tag color={statusColors[ticket.status]}>{ticket.status.replace('_', ' ')}</Tag>
          <Tag color={priorityColors[ticket.priority]}>{ticket.priority}</Tag>
          {ticket.category && <Tag>{ticket.category}</Tag>}
        </div>
        <Paragraph>{ticket.description}</Paragraph>
      </Card>

      <Card title={`Replies (${ticket.replies?.length || 0})`} style={{marginBottom: 16}}>
        {ticket.replies?.map((reply) => (
          <div
            key={reply.id}
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 8,
              background: reply.sender_type === 'superadmin' ? '#f0f5ff' : '#f6ffed',
              borderLeft: `4px solid ${reply.sender_type === 'superadmin' ? '#1677ff' : '#52c41a'}`,
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
              <Text strong>
                {reply.sender_name}
                <Tag
                  color={reply.sender_type === 'superadmin' ? 'blue' : 'green'}
                  style={{marginLeft: 8}}
                >
                  {reply.sender_type === 'superadmin' ? 'Admin' : 'Affiliate'}
                </Tag>
              </Text>
              <Text type='secondary'>{new Date(reply.created_at).toLocaleString()}</Text>
            </div>
            <Paragraph style={{margin: 0, whiteSpace: 'pre-wrap'}}>{reply.message}</Paragraph>
          </div>
        ))}

        {ticket.status !== 'closed' && (
          <>
            <Divider />
            <TextArea
              rows={3}
              placeholder='Type your reply...'
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              style={{marginBottom: 8}}
            />
            <Button
              type='primary'
              icon={<SendOutlined />}
              onClick={handleReply}
              loading={sending}
              disabled={!replyMessage.trim()}
            >
              Send Reply
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default TicketDetail;
