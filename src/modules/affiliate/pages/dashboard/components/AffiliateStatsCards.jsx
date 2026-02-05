import {Card, Col, Row, Statistic, Spin} from 'antd';
import {
  WalletOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const AffiliateStatsCards = ({stats, loading}) => {
  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: 40}}>
        <Spin size='large' />
      </div>
    );
  }

  const cards = [
    {
      title: 'Available Balance',
      value: stats?.available_balance || 0,
      icon: <WalletOutlined />,
      color: '#52c41a',
      prefix: '$',
      precision: 2,
    },
    {
      title: 'Total Earned',
      value: stats?.total_earned || 0,
      icon: <DollarOutlined />,
      color: '#1668dc',
      prefix: '$',
      precision: 2,
    },
    {
      title: 'Pending',
      value: stats?.pending || 0,
      icon: <ClockCircleOutlined />,
      color: '#faad14',
      prefix: '$',
      precision: 2,
    },
    {
      title: 'Total Paid',
      value: stats?.total_paid || 0,
      icon: <CheckCircleOutlined />,
      color: '#722ed1',
      prefix: '$',
      precision: 2,
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
                valueStyle={{fontSize: 24}}
              />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AffiliateStatsCards;
