import {Card, Spin} from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const GrowthChart = ({data, loading}) => {
  if (loading) return <Card title='Tenant Growth'><div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div></Card>;

  return (
    <Card
      title='Tenant Growth'
    >
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data || []}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='month' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='count' fill='#722ed1' radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default GrowthChart;
