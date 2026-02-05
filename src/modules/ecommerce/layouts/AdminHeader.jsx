import {Layout, Avatar, Dropdown, Space, Button} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import {useAdminAuth} from '../context/AdminAuthContext';
import {useNavigate} from 'react-router-dom';

const {Header} = Layout;

const AdminHeader = ({collapsed, setCollapsed, isMobile, onMobileMenuClick}) => {
  const {user, logout} = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const dropdownItems = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'My Profile',
        onClick: () => navigate('/profile'),
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
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
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
        <span style={{fontWeight: 600, fontSize: 16}}>Admin Panel</span>
      )}

      <Dropdown menu={dropdownItems} placement='bottomRight'>
        <Space style={{cursor: 'pointer'}}>
          <Avatar src={user?.avatar} icon={!user?.avatar && <UserOutlined />} size={isMobile ? 'small' : 'default'} />
          {!isMobile && <span>{user?.name}</span>}
        </Space>
      </Dropdown>
    </Header>
  );
};

export default AdminHeader;
