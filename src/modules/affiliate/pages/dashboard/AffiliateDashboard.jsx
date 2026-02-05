import {useState, useEffect} from 'react';
import {Typography} from 'antd';
import affiliateAxios from '../../services/affiliateAxios';
import AffiliateStatsCards from './components/AffiliateStatsCards';
import RecentCommissions from './components/RecentCommissions';

const {Title} = Typography;

const AffiliateDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentCommissions, setRecentCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await affiliateAxios.get('/dashboard/stats');
        setStats(res.data.stats || res.data);
        setRecentCommissions(res.data.recent_commissions || []);
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
      <AffiliateStatsCards stats={stats} loading={loading} />
      <div style={{marginTop: 24}}>
        <RecentCommissions data={recentCommissions} loading={loading} />
      </div>
    </div>
  );
};

export default AffiliateDashboard;
