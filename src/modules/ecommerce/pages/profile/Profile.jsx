import {useState} from 'react';
import {
  Typography, Card, Form, Input, Button, message, Upload, Avatar, Row, Col,
  Divider, Space,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, SaveOutlined,
  CameraOutlined, DeleteOutlined,
} from '@ant-design/icons';
import {useAdminAuth} from '../../context/AdminAuthContext';
import adminAxios from '../../services/adminAxios';

const {Title, Text} = Typography;

const Profile = () => {
  const {user, setUser} = useAdminAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const handleProfileSave = async () => {
    const values = await profileForm.validateFields();
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      if (values.phone) formData.append('phone', values.phone);
      if (avatarFile) formData.append('avatar', avatarFile);
      if (removeAvatar) formData.append('remove_avatar', '1');

      const res = await adminAxios.post('/profile', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      setUser(res.data);
      setAvatarFile(null);
      setAvatarPreview(null);
      setRemoveAvatar(false);
      message.success('Profile updated successfully');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    const values = await passwordForm.validateFields();
    setSavingPassword(true);
    try {
      await adminAxios.post('/change-password', values);
      passwordForm.resetFields();
      message.success('Password changed successfully');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarChange = (info) => {
    const file = info.file;
    setAvatarFile(file);
    setRemoveAvatar(false);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
  };

  const displayAvatar = removeAvatar ? null : (avatarPreview || user?.avatar);

  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>
        <UserOutlined style={{marginRight: 8}} />My Profile
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title='Profile Information' style={{marginBottom: 24}}>
            <div style={{textAlign: 'center', marginBottom: 24}}>
              <Avatar
                size={100}
                src={displayAvatar}
                icon={!displayAvatar && <UserOutlined />}
                style={{marginBottom: 12}}
              />
              <div>
                <Space>
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    onChange={handleAvatarChange}
                    accept='image/*'
                  >
                    <Button icon={<CameraOutlined />} size='small'>Change Avatar</Button>
                  </Upload>
                  {(user?.avatar || avatarPreview) && !removeAvatar && (
                    <Button icon={<DeleteOutlined />} size='small' danger onClick={handleRemoveAvatar}>Remove</Button>
                  )}
                </Space>
              </div>
            </div>

            <Form
              form={profileForm}
              layout='vertical'
              initialValues={{
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
              }}
            >
              <Form.Item name='name' label='Full Name' rules={[{required: true, message: 'Enter your name'}]}>
                <Input prefix={<UserOutlined />} placeholder='Your name' />
              </Form.Item>

              <Form.Item name='email' label='Email Address' rules={[{required: true, message: 'Enter your email'}, {type: 'email', message: 'Invalid email'}]}>
                <Input prefix={<MailOutlined />} placeholder='your@email.com' />
              </Form.Item>

              <Form.Item name='phone' label='Phone Number'>
                <Input prefix={<PhoneOutlined />} placeholder='+880 1XXX-XXXXXX' />
              </Form.Item>

              <Button type='primary' icon={<SaveOutlined />} onClick={handleProfileSave} loading={savingProfile} size='large'>
                Save Profile
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title='Change Password' style={{marginBottom: 24}}>
            <Form form={passwordForm} layout='vertical'>
              <Form.Item name='current_password' label='Current Password' rules={[{required: true, message: 'Enter current password'}]}>
                <Input.Password prefix={<LockOutlined />} placeholder='Current password' />
              </Form.Item>

              <Form.Item name='password' label='New Password' rules={[{required: true, message: 'Enter new password'}, {min: 8, message: 'Minimum 8 characters'}]}>
                <Input.Password prefix={<LockOutlined />} placeholder='New password' />
              </Form.Item>

              <Form.Item
                name='password_confirmation'
                label='Confirm New Password'
                dependencies={['password']}
                rules={[
                  {required: true, message: 'Confirm your password'},
                  ({getFieldValue}) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) return Promise.resolve();
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder='Confirm new password' />
              </Form.Item>

              <Button type='primary' icon={<LockOutlined />} onClick={handlePasswordChange} loading={savingPassword} size='large'>
                Change Password
              </Button>
            </Form>
          </Card>

          <Card title='Account Information' size='small'>
            <Space direction='vertical' size={8} style={{width: '100%'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Text type='secondary'>Status</Text>
                <Text strong style={{color: user?.status === 'active' ? '#52c41a' : '#ff4d4f', textTransform: 'capitalize'}}>{user?.status}</Text>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Text type='secondary'>Tenant</Text>
                <Text strong>{user?.tenant?.name || '-'}</Text>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Text type='secondary'>Member Since</Text>
                <Text strong>{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}) : '-'}</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
