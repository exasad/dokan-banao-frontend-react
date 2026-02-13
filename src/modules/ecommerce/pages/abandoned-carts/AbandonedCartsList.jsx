import {useState, useEffect, useCallback} from 'react';
import {Table, Card, Row, Col, Statistic, Typography, message, Tag} from 'antd';
import {ShoppingCartOutlined, MailOutlined, CheckCircleOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import adminAxios from '../../services/adminAxios';

const {Title, Text} = Typography;

const AbandonedCartsList = () => {
  const [carts, setCarts] = useState([]);
  const [stats, setStats] = useState({total: 0, notified: 0, recovered: 0});
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});

  const fetchCarts = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const res = await adminAxios.get('/abandoned-carts', {params: {page, per_page: perPage}});
      setCarts(res.data.data);
      setPagination({current: res.data.current_page, pageSize: res.data.per_page, total: res.data.total});
    } catch { message.error('Failed to fetch'); } finally { setLoading(false); }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await adminAxios.get('/abandoned-carts/stats');
      setStats(res.data);
    } catch {}
  }, []);

  useEffect(() => { fetchCarts(); fetchStats(); }, [fetchCarts, fetchStats]);

  const columns = [
    {title: 'Customer', key: 'customer', render: (_, r) => r.customer?.name || r.email || r.phone || 'Guest', ellipsis: true},
    {title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true},
    {title: 'Type', dataIndex: 'notification_type', key: 'type', width: 80, render: (v) => <Tag>{v}</Tag>},
    {title: 'Sent', dataIndex: 'sent_at', key: 'sent', width: 140, render: (v) => v ? dayjs(v).format('DD MMM YY, h:mm A') : '-'},
    {title: 'Recovered', dataIndex: 'recovered_at', key: 'recovered', width: 140, render: (v) => v ? <Tag color='green'>{dayjs(v).format('DD MMM YY')}</Tag> : '-'},
    {title: 'Created', dataIndex: 'created_at', key: 'created', width: 120, render: (v) => dayjs(v).format('DD MMM YY')},
  ];

  return (
    <div>
      <Title level={3} style={{marginBottom: 16}}><ShoppingCartOutlined style={{marginRight: 8}} />Abandoned Carts</Title>
      <Row gutter={16} style={{marginBottom: 24}}>
        <Col span={8}><Card><Statistic title='Total Abandoned' value={stats.total} prefix={<ShoppingCartOutlined />} /></Card></Col>
        <Col span={8}><Card><Statistic title='Notified' value={stats.notified} prefix={<MailOutlined />} /></Card></Col>
        <Col span={8}><Card><Statistic title='Recovered' value={stats.recovered} prefix={<CheckCircleOutlined />} valueStyle={{color: '#3f8600'}} /></Card></Col>
      </Row>
      <Table columns={columns} dataSource={carts} rowKey='id' loading={loading}
        pagination={{...pagination, onChange: (p, ps) => fetchCarts(p, ps), showSizeChanger: true, showTotal: (t) => `Total ${t}`}}
      />
    </div>
  );
};

export default AbandonedCartsList;
