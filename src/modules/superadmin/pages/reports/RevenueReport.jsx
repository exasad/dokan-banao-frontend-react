import {useState, useEffect} from 'react';
import {Card, DatePicker, Typography, Table, Spin, Row, Col, Statistic} from 'antd';
import {DollarOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;
const {RangePicker} = DatePicker;

const RevenueReport = () => {
  const [data, setData] = useState({monthly: [], summary: {}});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(12, 'month').startOf('month'),
    dayjs(),
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateRange?.[0]) params.start_date = dateRange[0].format('YYYY-MM-DD');
      if (dateRange?.[1]) params.end_date = dateRange[1].format('YYYY-MM-DD');
      const res = await superadminAxios.get('/reports/revenue', {params});
      setData(res.data);
    } catch {
      setData({monthly: [], summary: {}});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const columns = [
    {title: 'Month', dataIndex: 'month', key: 'month'},
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
    {
      title: 'Commissions',
      dataIndex: 'commissions',
      key: 'commissions',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
    {
      title: 'Payouts',
      dataIndex: 'payouts',
      key: 'payouts',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
  ];

  const summary = data.summary || {};

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Revenue Report</Title>
        <RangePicker
          value={dateRange}
          onChange={setDateRange}
          format='YYYY-MM-DD'
        />
      </div>

      {loading ? (
        <Spin size='large' style={{display: 'block', margin: '100px auto'}} />
      ) : (
        <>
          <Row gutter={16} style={{marginBottom: 16}}>
            <Col span={6}>
              <Card><Statistic title='Total Revenue' value={summary.total_revenue || 0} prefix={<DollarOutlined />} precision={2} /></Card>
            </Col>
            <Col span={6}>
              <Card><Statistic title='Total Commissions' value={summary.total_commissions || 0} prefix={<DollarOutlined />} precision={2} /></Card>
            </Col>
            <Col span={6}>
              <Card><Statistic title='Total Payouts' value={summary.total_payouts || 0} prefix={<DollarOutlined />} precision={2} /></Card>
            </Col>
            <Col span={6}>
              <Card><Statistic title='Total Orders' value={summary.total_orders || 0} prefix={<ShoppingCartOutlined />} /></Card>
            </Col>
          </Row>

          <Card title='Monthly Trend' style={{marginBottom: 16}}>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={data.monthly || []}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='revenue' stroke='#1668dc' strokeWidth={2} />
                <Line type='monotone' dataKey='commissions' stroke='#fa8c16' strokeWidth={2} />
                <Line type='monotone' dataKey='payouts' stroke='#52c41a' strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Table
            columns={columns}
            dataSource={data.monthly || []}
            rowKey='month'
            pagination={false}
          />
        </>
      )}
    </div>
  );
};

export default RevenueReport;
