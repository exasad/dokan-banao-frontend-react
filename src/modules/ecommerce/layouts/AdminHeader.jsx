import {Layout, Avatar, Dropdown, Space, Button} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import {useAdminAuth} from '../context/AdminAuthContext';
import {useNavigate} from 'react-router-dom';

const {Header} = Layout;

const AdminHeader = ({collapsed, setCollapsed}) => {
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
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Button
        type='text'
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{fontSize: 16}}
      />
      <Dropdown menu={dropdownItems} placement='bottomRight'>
        <Space style={{cursor: 'pointer'}}>
          <Avatar src={user?.avatar} icon={!user?.avatar && <UserOutlined />} />
          <span>{user?.name}</span>
        </Space>
      </Dropdown>
    </Header>
  );
};

export default AdminHeader;
