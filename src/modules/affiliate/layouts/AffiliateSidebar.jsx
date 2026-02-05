import {Layout, Menu} from 'antd';
import {
  DashboardOutlined,
  TagOutlined,
  DollarOutlined,
  WalletOutlined,
  UserOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import {useNavigate, useLocation} from 'react-router-dom';

const {Sider} = Layout;

const sidebarColor = '#00474f';

const menuItems = [
  {
    key: '/affiliate/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/affiliate/coupons',
    icon: <TagOutlined />,
    label: 'My Coupons',
  },
  {
    key: '/affiliate/commissions',
    icon: <DollarOutlined />,
    label: 'Commissions',
  },
  {
    key: '/affiliate/payouts',
    icon: <WalletOutlined />,
    label: 'Payouts',
  },
  {
    key: '/affiliate/tickets',
    icon: <CustomerServiceOutlined />,
    label: 'Support',
  },
  {
    key: '/affiliate/profile',
    icon: <UserOutlined />,
    label: 'Profile',
  },
];

const AffiliateSidebar = ({collapsed}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey =
    menuItems.find((item) => location.pathname.startsWith(item.key))?.key ||
    '/affiliate/dashboard';

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        background: sidebarColor,
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '0 12px',
        }}
      >
        <h2
          style={{
            color: '#fff',
            margin: 0,
            fontSize: collapsed ? 16 : 18,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {collapsed ? 'A' : 'Affiliate Portal'}
        </h2>
      </div>
      <Menu
        theme='dark'
        mode='inline'
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({key}) => navigate(key)}
        style={{background: sidebarColor}}
      />
    </Sider>
  );
};

export default AffiliateSidebar;
