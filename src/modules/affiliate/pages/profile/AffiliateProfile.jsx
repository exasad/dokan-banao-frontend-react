import {useState, useEffect} from 'react';
import {Card, Form, Input, Button, Typography, message, Row, Col} from 'antd';
import {useAffiliateAuth} from '../../context/AffiliateAuthContext';
import affiliateAxios from '../../services/affiliateAxios';

const {Title} = Typography;

const AffiliateProfile = () => {
  const {user} = useAffiliateAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        website: user.website,
      });
    }
  }, [user, profileForm]);

  const handleProfileUpdate = async (values) => {
    setProfileLoading(true);
    try {
      await affiliateAxios.put('/profile', values);
      message.success('Profile updated successfully');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setPasswordLoading(true);
    try {
      await affiliateAxios.put('/profile/password', values);
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>
        Profile
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title='Profile Information'>
            <Form
              form={profileForm}
              layout='vertical'
              onFinish={handleProfileUpdate}
            >
              <Form.Item
                name='name'
                label='Name'
                rules={[{required: true, message: 'Please enter your name'}]}
              >
                <Input placeholder='Full name' />
              </Form.Item>
              <Form.Item
                name='email'
                label='Email'
                rules={[
                  {required: true, message: 'Please enter your email'},
                  {type: 'email', message: 'Please enter a valid email'},
                ]}
              >
                <Input placeholder='Email address' />
              </Form.Item>
              <Form.Item name='phone' label='Phone'>
                <Input placeholder='Phone number' />
              </Form.Item>
              <Form.Item name='company' label='Company'>
                <Input placeholder='Company name' />
              </Form.Item>
              <Form.Item name='website' label='Website'>
                <Input placeholder='Website URL' />
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit' loading={profileLoading}>
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title='Change Password'>
            <Form
              form={passwordForm}
              layout='vertical'
              onFinish={handlePasswordChange}
            >
              <Form.Item
                name='current_password'
                label='Current Password'
                rules={[{required: true, message: 'Please enter your current password'}]}
              >
                <Input.Password placeholder='Current password' />
              </Form.Item>
              <Form.Item
                name='new_password'
                label='New Password'
                rules={[
                  {required: true, message: 'Please enter a new password'},
                  {min: 8, message: 'Password must be at least 8 characters'},
                ]}
              >
                <Input.Password placeholder='New password' />
              </Form.Item>
              <Form.Item
                name='new_password_confirmation'
                label='Confirm New Password'
                dependencies={['new_password']}
                rules={[
                  {required: true, message: 'Please confirm your new password'},
                  ({getFieldValue}) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('new_password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder='Confirm new password' />
              </Form.Item>
              <Form.Item>
                <Button type='primary' htmlType='submit' loading={passwordLoading}>
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AffiliateProfile;
