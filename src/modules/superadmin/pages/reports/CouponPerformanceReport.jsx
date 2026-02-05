import {useState, useEffect} from 'react';
import {Card, DatePicker, Typography, Table, Spin, Tag} from 'antd';
import dayjs from 'dayjs';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;
const {RangePicker} = DatePicker;

const CouponPerformanceReport = () => {
  const [coupons, setCoupons] = useState([]);
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
      const res = await superadminAxios.get('/reports/coupon-performance', {params});
      setCoupons(res.data.coupons || []);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const columns = [
    {title: 'Rank', key: 'rank', render: (_, __, i) => i + 1},
    {title: 'Code', dataIndex: 'code', key: 'code'},
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (t) => <Tag color={t === 'percentage' ? 'blue' : 'purple'}>{t}</Tag>,
    },
    {
      title: 'Value',
      key: 'value',
      render: (_, r) => r.type === 'percentage' ? `${r.value}%` : `$${parseFloat(r.value || 0).toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={s === 'active' ? 'green' : 'default'}>{s}</Tag>,
    },
    {title: 'Usage Count', dataIndex: 'usage_count', key: 'usage_count'},
    {
      title: 'Revenue',
      dataIndex: 'total_revenue',
      key: 'total_revenue',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
    {
      title: 'Total Discount',
      dataIndex: 'total_discount',
      key: 'total_discount',
      render: (v) => `$${parseFloat(v || 0).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Coupon Performance</Title>
        <RangePicker
          value={dateRange}
          onChange={setDateRange}
          format='YYYY-MM-DD'
        />
      </div>

      {loading ? (
        <Spin size='large' style={{display: 'block', margin: '100px auto'}} />
      ) : (
        <Card title='Top Coupons'>
          <Table
            columns={columns}
            dataSource={coupons}
            rowKey='id'
            pagination={false}
          />
        </Card>
      )}
    </div>
  );
};

export default CouponPerformanceReport;
