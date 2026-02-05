import {Card, Spin} from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const RevenueChart = ({data, loading}) => {
  if (loading) return <Card title='Revenue Overview'><div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div></Card>;

  return (
    <Card
      title='Revenue Overview'
    >
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data || []}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' />
          <YAxis />
          <Tooltip />
          <Line
            type='monotone'
            dataKey='revenue'
            stroke='#1668dc'
            strokeWidth={2}
            dot={{fill: '#1668dc'}}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart;
