import {useState, useEffect} from 'react';
import {Card, DatePicker, Typography, Table, Spin, Row, Col} from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
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

const PIE_COLORS = ['#1668dc', '#52c41a', '#fa8c16', '#ff4d4f'];

const CommissionReport = () => {
  const [data, setData] = useState({status_breakdown: [], top_affiliates: [], monthly: []});
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
      const res = await superadminAxios.get('/reports/commissions', {params});
      setData(res.data);
    } catch {
      setData({status_breakdown: [], top_affiliates: [], monthly: []});
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

  const monthlyColumns = [
    {title: 'Month', dataIndex: 'month', key: 'month'},
    {title: 'Count', dataIndex: 'count', key: 'count'},
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Commission Report</Title>
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
            <Col span={12}>
              <Card title='Status Breakdown'>
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={(data.status_breakdown || []).map((s) => ({
                        name: s.status,
                        value: parseFloat(s.total || 0),
                      }))}
                      cx='50%'
                      cy='50%'
                      labelLine
                      label={({name, value}) => `${name}: $${value.toFixed(2)}`}
                      outerRadius={100}
                      dataKey='value'
                    >
                      {(data.status_breakdown || []).map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={12}>
              <Card title='Top Affiliates by Commission'>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={(data.top_affiliates || []).map((a) => ({
                    name: a.affiliate?.name || 'Unknown',
                    total: parseFloat(a.total || 0),
                  }))}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey='total' fill='#1668dc' />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Card title='Top Affiliates' style={{marginBottom: 16}}>
            <Table
              columns={affiliateColumns}
              dataSource={data.top_affiliates || []}
              rowKey='affiliate_id'
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </Card>

          <Card title='Monthly Trend'>
            <Table
              columns={monthlyColumns}
              dataSource={data.monthly || []}
              rowKey='month'
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default CommissionReport;
