import {Layout, Avatar, Dropdown, Space, Button} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {useSuperAdminAuth} from '../context/SuperAdminAuthContext';
import {useSettings} from '../context/SettingsContext';
import {useNavigate} from 'react-router-dom';

const {Header} = Layout;

const SuperAdminHeader = ({collapsed, setCollapsed, isDark, isMobile, onMobileMenuClick}) => {
  const {user, logout} = useSuperAdminAuth();
  const {getSetting} = useSettings();
  const navigate = useNavigate();

  const siteTitle = getSetting('branding', 'site_title', 'SuperAdmin');

  const handleLogout = async () => {
    await logout();
    navigate('/superadmin/login');
  };

  const dropdownItems = {
    items: [
      {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Settings',
        onClick: () => navigate('/superadmin/settings'),
      },
      {type: 'divider'},
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Logout',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Header
      style={{
        padding: isMobile ? '0 12px' : '0 24px',
        background: isDark ? '#141414' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: isDark
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid #f0f0f0',
        position: isMobile ? 'sticky' : 'relative',
        top: 0,
        zIndex: 99,
      }}
    >
      {isMobile ? (
        <Button
          type='text'
          icon={<MenuOutlined />}
          onClick={onMobileMenuClick}
          style={{fontSize: 18}}
        />
      ) : (
        <Button
          type='text'
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{fontSize: 16}}
        />
      )}

      {isMobile && (
        <span style={{fontWeight: 600, fontSize: 16}}>{siteTitle}</span>
      )}

      <Dropdown menu={dropdownItems} placement='bottomRight'>
        <Space style={{cursor: 'pointer'}}>
          <Avatar icon={<UserOutlined />} src={user?.avatar} size={isMobile ? 'small' : 'default'} />
          {!isMobile && <span>{user?.name}</span>}
        </Space>
      </Dropdown>
    </Header>
  );
};

export default SuperAdminHeader;
