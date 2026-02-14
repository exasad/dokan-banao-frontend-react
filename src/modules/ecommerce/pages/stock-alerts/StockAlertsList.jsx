import {useState, useEffect, useCallback} from 'react';
import {Typography, Table, Card, Tag, Space, Button, message, Popconfirm, Select, Statistic, Row, Col} from 'antd';
import {DeleteOutlined, BellOutlined, ReloadOutlined} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';

const {Title, Text} = Typography;

const StockAlertsList = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({total: 0, pending: 0, notified: 0});
  const [pagination, setPagination] = useState({current: 1, pageSize: 15, total: 0});
  const [statusFilter, setStatusFilter] = useState(null);

  const fetchAlerts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {page, per_page: 15};
      if (statusFilter) params.status = statusFilter;
      const {data} = await adminAxios.get('/stock-alerts', {params});
      setAlerts(data.data);
      setPagination({current: data.current_page, pageSize: data.per_page, total: data.total});
    } catch {
      message.error('Failed to load stock alerts');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const fetchStats = async () => {
    try {
      const {data} = await adminAxios.get('/stock-alerts/stats');
      setStats(data);
    } catch {}
  };

  useEffect(() => {
    fetchAlerts();
    fetchStats();
  }, [fetchAlerts]);

  const handleDelete = async (id) => {
    try {
      await adminAxios.delete(`/stock-alerts/${id}`);
      message.success('Alert deleted');
      fetchAlerts(pagination.current);
      fetchStats();
    } catch {
      message.error('Failed to delete');
    }
  };

  const columns = [
    {
      title: 'Product',
      key: 'product',
      render: (_, r) => (
        <div>
          <Text strong>{r.product?.name || 'N/A'}</Text>
          {r.variant && <div><Text type="secondary" style={{fontSize: 12}}>{r.variant.name}</Text></div>}
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, r) => (
        <div>
          {r.email && <div><Text>{r.email}</Text></div>}
          {r.phone && <div><Text type="secondary">{r.phone}</Text></div>}
          {r.customer && <div><Tag color="blue">{r.customer.name}</Tag></div>}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, r) => (
        r.notified_at
          ? <Tag color="green">Notified</Tag>
          : <Tag color="orange">Pending</Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (d) => new Date(d).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'}),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, r) => (
        <Popconfirm title="Delete this alert?" onConfirm={() => handleDelete(r.id)}>
          <Button icon={<DeleteOutlined />} size="small" danger />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
        <Title level={3} style={{margin: 0}}>Stock Alerts</Title>
        <Button icon={<ReloadOutlined />} onClick={() => { fetchAlerts(); fetchStats(); }}>Refresh</Button>
      </div>

      <Row gutter={[16, 16]} style={{marginBottom: 24}}>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Total Alerts" value={stats.total} prefix={<BellOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Pending" value={stats.pending} valueStyle={{color: '#fa8c16'}} /></Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card><Statistic title="Notified" value={stats.notified} valueStyle={{color: '#52c41a'}} /></Card>
        </Col>
      </Row>

      <Card>
        <div style={{marginBottom: 16}}>
          <Select
            placeholder="Filter by status"
            allowClear
            style={{width: 200}}
            onChange={(v) => setStatusFilter(v)}
            options={[
              {value: 'pending', label: 'Pending'},
              {value: 'notified', label: 'Notified'},
            ]}
          />
        </div>
        <Table
          dataSource={alerts}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page) => fetchAlerts(page),
            showSizeChanger: false,
          }}
          scroll={{x: 'max-content'}}
        />
      </Card>
    </div>
  );
};

export default StockAlertsList;
