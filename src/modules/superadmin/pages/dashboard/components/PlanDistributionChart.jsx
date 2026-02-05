import {Card, Spin} from 'antd';
import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend} from 'recharts';

const COLORS = ['#1668dc', '#52c41a', '#722ed1', '#faad14', '#eb2f96'];

const PlanDistributionChart = ({data, loading}) => {
  if (loading) return <Card title='Plan Distribution'><div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div></Card>;

  return (
    <Card
      title='Plan Distribution'
    >
      <ResponsiveContainer width='100%' height={300}>
        <PieChart>
          <Pie
            data={data || []}
            cx='50%'
            cy='50%'
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey='value'
          >
            {(data || []).map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PlanDistributionChart;
