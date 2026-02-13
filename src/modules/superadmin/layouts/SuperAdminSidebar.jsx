import {Layout, Menu} from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  TagOutlined,
  DollarOutlined,
  WalletOutlined,
  CustomerServiceOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  MailOutlined,
} from '@ant-design/icons';
import {useNavigate, useLocation} from 'react-router-dom';
import {useSettings} from '../context/SettingsContext';

const {Sider} = Layout;

const menuItems = [
  {
    key: '/superadmin/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/superadmin/plans',
    icon: <AppstoreOutlined />,
    label: 'Plans',
  },
  {
    key: '/superadmin/tenants',
    icon: <TeamOutlined />,
    label: 'Tenants',
  },
  {
    key: '/superadmin/invoices',
    icon: <FileTextOutlined />,
    label: 'Invoices',
  },
  {
    key: '/superadmin/seed-data',
    icon: <DatabaseOutlined />,
    label: 'Seed Data',
  },
  {
    key: 'affiliates-group',
    icon: <UsergroupAddOutlined />,
    label: 'Affiliates',
    children: [
      {
        key: '/superadmin/affiliates',
        icon: <UsergroupAddOutlined />,
        label: 'Affiliates',
      },
      {
        key: '/superadmin/coupons',
        icon: <TagOutlined />,
        label: 'Coupons',
      },
      {
        key: '/superadmin/commissions',
        icon: <DollarOutlined />,
        label: 'Commissions',
      },
      {
        key: '/superadmin/payouts',
        icon: <WalletOutlined />,
        label: 'Payouts',
      },
    ],
  },
  {
    key: '/superadmin/contact-messages',
    icon: <MailOutlined />,
    label: 'Contact Messages',
  },
  {
    key: '/superadmin/tickets',
    icon: <CustomerServiceOutlined />,
    label: 'Support',
  },
  {
    key: 'reports-group',
    icon: <BarChartOutlined />,
    label: 'Reports',
    children: [
      {
        key: '/superadmin/reports/revenue',
        label: 'Revenue',
      },
      {
        key: '/superadmin/reports/commissions',
        label: 'Commissions',
      },
      {
        key: '/superadmin/reports/payouts',
        label: 'Payouts',
      },
      {
        key: '/superadmin/reports/affiliates',
        label: 'Affiliates',
      },
      {
        key: '/superadmin/reports/coupons',
        label: 'Coupons',
      },
    ],
  },
  {
    key: 'landing-group',
    icon: <GlobalOutlined />,
    label: 'Landing Page',
    children: [
      { key: '/superadmin/landing/hero', label: 'Hero Section' },
      { key: '/superadmin/landing/features', label: 'Features' },
      { key: '/superadmin/landing/stats', label: 'Stats' },
      { key: '/superadmin/landing/cta', label: 'CTA' },
      { key: '/superadmin/landing/footer', label: 'Footer' },
      { key: '/superadmin/landing/analytics', label: 'Analytics & SEO' },
    ],
  },
  {
    key: '/superadmin/settings',
    icon: <SettingOutlined />,
    label: 'Settings',
  },
];

const SuperAdminSidebar = ({collapsed, isDark, isMobile, onMenuClick}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {getSetting} = useSettings();

  const siteTitle = getSetting('branding', 'site_title', 'SuperAdmin');
  const siteLogo = getSetting('branding', 'site_logo', null);
  const sidebarColor = getSetting('appearance', 'sidebar_color', '#001529');

  const allKeys = menuItems.flatMap((item) =>
    item.children ? item.children.map((c) => c.key) : [item.key],
  );
  const selectedKey =
    allKeys.find((key) => location.pathname.startsWith(key)) ||
    '/superadmin/dashboard';

  const handleClick = ({key}) => {
    navigate(key);
    if (onMenuClick) onMenuClick();
  };

  // For mobile drawer, render without Sider wrapper
  if (isMobile) {
    return (
      <div style={{height: '100%', background: sidebarColor}}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '0 16px',
          }}
        >
          {siteLogo ? (
            <img
              src={siteLogo}
              alt='Logo'
              style={{
                height: 32,
                maxWidth: 140,
                objectFit: 'contain',
              }}
            />
          ) : (
            <h2
              style={{
                color: '#fff',
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {siteTitle}
            </h2>
          )}
        </div>
        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleClick}
          style={{background: sidebarColor, borderRight: 0}}
        />
      </div>
    );
  }

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
        {siteLogo ? (
          <img
            src={siteLogo}
            alt='Logo'
            style={{
              height: 32,
              width: collapsed ? 32 : 'auto',
              maxWidth: collapsed ? 32 : 140,
              objectFit: 'contain',
            }}
          />
        ) : (
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
            {collapsed ? siteTitle.charAt(0) : siteTitle}
          </h2>
        )}
      </div>
      <Menu
        theme='dark'
        mode='inline'
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleClick}
        style={{background: sidebarColor}}
      />
    </Sider>
  );
};

export default SuperAdminSidebar;
