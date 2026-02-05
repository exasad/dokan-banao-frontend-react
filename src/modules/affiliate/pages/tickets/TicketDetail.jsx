import {useState, useEffect} from 'react';
import {
  Card,
  Typography,
  Tag,
  Button,
  Input,
  Spin,
  Divider,
  message,
} from 'antd';
import {ArrowLeftOutlined, SendOutlined} from '@ant-design/icons';
import {useParams, useNavigate} from 'react-router-dom';
import affiliateAxios from '../../services/affiliateAxios';

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

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const res = await affiliateAxios.get(`/tickets/${id}`);
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

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    setSending(true);
    try {
      await affiliateAxios.post(`/tickets/${id}/reply`, {message: replyMessage});
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
      await affiliateAxios.patch(`/tickets/${id}/close`);
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
        onClick={() => navigate('/affiliate/tickets')}
        style={{marginBottom: 16}}
      >
        Back to Tickets
      </Button>

      <Card style={{marginBottom: 16}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <Title level={4} style={{margin: 0}}>{ticket.ticket_number}: {ticket.subject}</Title>
            <Text type='secondary'>
              Created {new Date(ticket.created_at).toLocaleString()}
            </Text>
          </div>
          {ticket.status !== 'closed' && (
            <Button danger onClick={handleClose}>Close Ticket</Button>
          )}
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
                  {reply.sender_type === 'superadmin' ? 'Admin' : 'You'}
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
