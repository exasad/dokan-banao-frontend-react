import {Layout, Avatar, Dropdown, Space, Button} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import {useAffiliateAuth} from '../context/AffiliateAuthContext';
import {useNavigate} from 'react-router-dom';

const {Header} = Layout;

const AffiliateHeader = ({collapsed, setCollapsed}) => {
  const {user, logout} = useAffiliateAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/affiliate/login');
  };

  const dropdownItems = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
        onClick: () => navigate('/affiliate/profile'),
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
          <Avatar icon={<UserOutlined />} src={user?.avatar} />
          <span>{user?.name}</span>
        </Space>
      </Dropdown>
    </Header>
  );
};

export default AffiliateHeader;
