import {useState, useEffect} from 'react';
import {Card, DatePicker, Typography, Table, Spin, Row, Col, Statistic} from 'antd';
import {DollarOutlined} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;
const {RangePicker} = DatePicker;

const PayoutReport = () => {
  const [data, setData] = useState({status_breakdown: [], top_affiliates: [], monthly: [], summary: {}});
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
      const res = await superadminAxios.get('/reports/payouts', {params});
      setData(res.data);
    } catch {
      setData({status_breakdown: [], top_affiliates: [], monthly: [], summary: {}});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const affiliateColumns = [
    {title: 'Affiliate', dataIndex: ['affiliate', 'name'], key: 'name'},
    {title: 'Email', dataIndex: ['affiliate', 'email'], key: 'email'},
    {title: 'Count', dataIndex: 'count', key: 'count'},
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
  ];

  const statusColumns = [
    {title: 'Status', dataIndex: 'status', key: 'status'},
    {title: 'Count', dataIndex: 'count', key: 'count'},
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
  ];

  const summary = data.summary || {};

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Payout Report</Title>
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
              <Card><Statistic title='Total Payouts' value={summary.total_payouts || 0} prefix={<DollarOutlined />} precision={2} /></Card>
            </Col>
            <Col span={6}>
              <Card><Statistic title='Processed' value={summary.processed_payouts || 0} prefix={<DollarOutlined />} precision={2} /></Card>
            </Col>
            <Col span={6}>
              <Card><Statistic title='Pending' value={summary.pending_payouts || 0} prefix={<DollarOutlined />} precision={2} /></Card>
            </Col>
            <Col span={6}>
              <Card><Statistic title='Total Count' value={summary.total_count || 0} /></Card>
            </Col>
          </Row>

          <Card title='Monthly Trend' style={{marginBottom: 16}}>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={(data.monthly || []).map((m) => ({...m, total: parseFloat(m.total || 0)}))}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Line type='monotone' dataKey='total' stroke='#1668dc' strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Row gutter={16}>
            <Col span={12}>
              <Card title='Status Breakdown'>
                <Table
                  columns={statusColumns}
                  dataSource={data.status_breakdown || []}
                  rowKey='status'
                  pagination={false}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title='Top Affiliates'>
                <Table
                  columns={affiliateColumns}
                  dataSource={data.top_affiliates || []}
                  rowKey='affiliate_id'
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default PayoutReport;
