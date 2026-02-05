import {useState, useEffect} from 'react';
import {Typography, Row, Col} from 'antd';
import superadminAxios from '../../services/superadminAxios';
import StatsCards from './components/StatsCards';
import RevenueChart from './components/RevenueChart';
import PlanDistributionChart from './components/PlanDistributionChart';
import GrowthChart from './components/GrowthChart';

const {Title} = Typography;

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [planDist, setPlanDist] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, revenueRes, planDistRes, growthRes] = await Promise.all(
          [
            superadminAxios.get('/dashboard/stats'),
            superadminAxios.get('/dashboard/revenue'),
            superadminAxios.get('/dashboard/plan-distribution'),
            superadminAxios.get('/dashboard/growth'),
          ],
        );
        setStats(statsRes.data);
        setRevenue(revenueRes.data);
        setPlanDist(planDistRes.data);
        setGrowth(growthRes.data);
      } catch {
        // errors handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>
        Dashboard
      </Title>
      <StatsCards stats={stats} loading={loading} />
      <Row gutter={[16, 16]} style={{marginTop: 24}}>
        <Col xs={24} lg={16}>
          <RevenueChart data={revenue} loading={loading} />
        </Col>
        <Col xs={24} lg={8}>
          <PlanDistributionChart data={planDist} loading={loading} />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{marginTop: 16}}>
        <Col xs={24}>
          <GrowthChart data={growth} loading={loading} />
        </Col>
      </Row>
    </div>
  );
};

export default SuperAdminDashboard;
