import {useState, useEffect} from 'react';
import {Card, DatePicker, Typography, Table, Spin} from 'antd';
import dayjs from 'dayjs';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;
const {RangePicker} = DatePicker;

const AffiliatePerformanceReport = () => {
  const [affiliates, setAffiliates] = useState([]);
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
      const res = await superadminAxios.get('/reports/affiliate-performance', {params});
      setAffiliates(res.data.affiliates || []);
    } catch {
      setAffiliates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const columns = [
    {title: 'Rank', key: 'rank', render: (_, __, i) => i + 1},
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'Email', dataIndex: 'email', key: 'email'},
    {title: 'Company', dataIndex: 'company', key: 'company', render: (v) => v || '-'},
    {title: 'Conversions', dataIndex: 'total_conversions', key: 'total_conversions'},
    {
      title: 'Earnings',
      dataIndex: 'total_earnings',
      key: 'total_earnings',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
    {
      title: 'Revenue Generated',
      dataIndex: 'total_revenue',
      key: 'total_revenue',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
    {title: 'Coupon Uses', dataIndex: 'coupon_uses', key: 'coupon_uses'},
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Affiliate Performance</Title>
        <RangePicker
          value={dateRange}
          onChange={setDateRange}
          format='YYYY-MM-DD'
        />
      </div>

      {loading ? (
        <Spin size='large' style={{display: 'block', margin: '100px auto'}} />
      ) : (
        <Card title='Top Performers'>
          <Table
            columns={columns}
            dataSource={affiliates}
            rowKey='id'
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      )}
    </div>
  );
};

export default AffiliatePerformanceReport;
