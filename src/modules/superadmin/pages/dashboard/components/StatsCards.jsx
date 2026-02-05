import {Card, Col, Row, Statistic, Spin} from 'antd';
import {
  TeamOutlined,
  DollarOutlined,
  FileTextOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
const StatsCards = ({stats, loading}) => {
  if (loading) return <div style={{textAlign: 'center', padding: 40}}><Spin size='large' /></div>;

  const cards = [
    {
      title: 'Total Tenants',
      value: stats?.total_tenants || 0,
      icon: <TeamOutlined />,
      color: '#1668dc',
      suffix: `(${stats?.active_tenants || 0} active)`,
    },
    {
      title: 'Total Revenue',
      value: stats?.total_revenue || 0,
      icon: <DollarOutlined />,
      color: '#52c41a',
      prefix: '$',
      precision: 2,
    },
    {
      title: 'Pending Invoices',
      value: stats?.pending_invoices || 0,
      icon: <FileTextOutlined />,
      color: '#faad14',
    },
    {
      title: 'Active Plans',
      value: stats?.total_plans || 0,
      icon: <AppstoreOutlined />,
      color: '#722ed1',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((card, idx) => (
        <Col xs={24} sm={12} lg={6} key={idx}>
          <Card>
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: `${card.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  color: card.color,
                }}
              >
                {card.icon}
              </div>
              <Statistic
                title={card.title}
                value={card.value}
                prefix={card.prefix}
                precision={card.precision}
                suffix={card.suffix ? <span style={{fontSize: 12}}>{card.suffix}</span> : null}
                valueStyle={{fontSize: 24}}
              />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsCards;
