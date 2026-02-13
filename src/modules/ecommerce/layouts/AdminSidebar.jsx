import {
  ApiOutlined,
  AppstoreOutlined,
  CarOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  FileTextOutlined,
  FileOutlined,
  GiftOutlined,
  GlobalOutlined,
  HeartOutlined,
  MailOutlined,
  FacebookOutlined,
  MessageOutlined,
  PictureOutlined,
  RollbackOutlined,
  SearchOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  StarOutlined,
  TagOutlined,
  ThunderboltOutlined,
  TranslationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const {Sider} = Layout;

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/sliders',
    icon: <PictureOutlined />,
    label: 'Sliders',
  },
  {
    key: '/categories',
    icon: <AppstoreOutlined />,
    label: 'Categories',
  },
  {
    key: '/tags',
    icon: <TagOutlined />,
    label: 'Tags',
  },
  {
    key: '/products',
    icon: <ShoppingOutlined />,
    label: 'Products',
  },
  {
    key: '/orders',
    icon: <ShoppingCartOutlined />,
    label: 'Orders',
  },
  {
    key: '/reviews',
    icon: <StarOutlined />,
    label: 'Reviews',
  },
  {
    key: '/returns',
    icon: <RollbackOutlined />,
    label: 'Returns',
  },
  {
    key: '/coupons',
    icon: <GiftOutlined />,
    label: 'Coupons',
  },
  {
    key: '/flash-sales',
    icon: <ThunderboltOutlined />,
    label: 'Flash Sales',
  },
  {
    key: '/delivery-charges',
    icon: <CarOutlined />,
    label: 'Delivery Charges',
  },
  {
    key: '/abandoned-carts',
    icon: <ShoppingCartOutlined />,
    label: 'Abandoned Carts',
  },
  {
    key: 'content-group',
    icon: <FileTextOutlined />,
    label: 'Content',
    children: [
      {
        key: '/blog',
        icon: <FileTextOutlined />,
        label: 'Blog Posts',
      },
      {
        key: '/blog/categories',
        icon: <AppstoreOutlined />,
        label: 'Blog Categories',
      },
      {
        key: '/pages',
        icon: <FileOutlined />,
        label: 'Pages',
      },
    ],
  },
  {
    key: '/translations',
    icon: <TranslationOutlined />,
    label: 'Translations',
  },
  {
    key: '/profile',
    icon: <UserOutlined />,
    label: 'Profile',
  },
  {
    key: 'settings-group',
    icon: <SettingOutlined />,
    label: 'Settings',
    children: [
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: 'General',
      },
      {
        key: '/settings/couriers',
        icon: <ApiOutlined />,
        label: 'Courier Integration',
      },
      {
        key: '/settings/payments',
        icon: <CreditCardOutlined />,
        label: 'Payment Gateways',
      },
      {
        key: '/settings/sms',
        icon: <MessageOutlined />,
        label: 'SMS Gateway',
      },
      {
        key: '/settings/seo',
        icon: <SearchOutlined />,
        label: 'SEO',
      },
      {
        key: '/settings/facebook',
        icon: <FacebookOutlined />,
        label: 'Facebook / Messenger',
      },
      {
        key: '/settings/smtp',
        icon: <MailOutlined />,
        label: 'SMTP / Email',
      },
      {
        key: '/settings/domains',
        icon: <GlobalOutlined />,
        label: 'Storefront Domain',
      },
      {
        key: '/settings/languages',
        icon: <GlobalOutlined />,
        label: 'Languages',
      },
    ],
  }
];

const AdminSidebar = ({collapsed, isMobile, onMenuClick}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const allKeys = menuItems.flatMap((item) =>
    item.children ? item.children.map((c) => c.key) : [item.key],
  );
  const selectedKey =
    allKeys.find((key) => location.pathname === key) ||
    allKeys.find((key) => location.pathname.startsWith(key)) ||
    '/dashboard';

  const openKeys = menuItems
    .filter((item) => item.children?.some((c) => location.pathname.startsWith(c.key)))
    .map((item) => item.key);

  const handleClick = ({key}) => {
    navigate(key);
    if (onMenuClick) onMenuClick();
  };

  // For mobile drawer, render without Sider wrapper
  if (isMobile) {
    return (
      <div style={{height: '100%', background: '#001529'}}>
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '0 16px',
          }}
        >
          <h2
            style={{
              color: '#fff',
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Admin Panel
          </h2>
        </div>
        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={handleClick}
          style={{borderRight: 0}}
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
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          {collapsed ? 'A' : 'Admin Panel'}
        </h2>
      </div>
      <Menu
        theme='dark'
        mode='inline'
        selectedKeys={[selectedKey]}
        defaultOpenKeys={openKeys}
        items={menuItems}
        onClick={handleClick}
      />
    </Sider>
  );
};

export default AdminSidebar;
