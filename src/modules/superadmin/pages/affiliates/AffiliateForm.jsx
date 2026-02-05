import {useState, useEffect} from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Typography,
  message,
  Space,
  Spin,
} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const AffiliateForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      superadminAxios
        .get(`/affiliates/${id}`)
        .then((res) => {
          form.setFieldsValue(res.data);
        })
        .catch(() => message.error('Failed to fetch affiliate'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {...values};
      if (isEdit && !data.password) {
        delete data.password;
      }
      if (isEdit) {
        await superadminAxios.put(`/affiliates/${id}`, data);
        message.success('Affiliate updated');
      } else {
        await superadminAxios.post('/affiliates', data);
        message.success('Affiliate created');
      }
      navigate('/superadmin/affiliates');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0]?.[0];
        message.error(firstError || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to save affiliate');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;

  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>
        {isEdit ? 'Edit Affiliate' : 'Create Affiliate'}
      </Title>
      <Card style={{maxWidth: 700}}>
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Form.Item name='name' label='Name' rules={[{required: true}]}>
            <Input placeholder='Affiliate name' />
          </Form.Item>
          <Form.Item
            name='email'
            label='Email'
            rules={[{required: true}, {type: 'email'}]}
          >
            <Input placeholder='Affiliate email' />
          </Form.Item>
          <Form.Item
            name='password'
            label='Password'
            rules={isEdit ? [] : [{required: true}]}
          >
            <Input.Password placeholder={isEdit ? 'Leave blank to keep current' : 'Password'} />
          </Form.Item>
          <Form.Item name='phone' label='Phone'>
            <Input placeholder='Phone number' />
          </Form.Item>
          <Form.Item name='company' label='Company'>
            <Input placeholder='Company name' />
          </Form.Item>
          <Form.Item name='website' label='Website'>
            <Input placeholder='https://example.com' />
          </Form.Item>
          <Form.Item
            name='commission_rate'
            label='Commission Rate (%)'
            rules={[{required: true}]}
          >
            <InputNumber min={0} max={100} step={0.01} suffix='%' style={{width: 200}} />
          </Form.Item>
          <Form.Item name='status' label='Status' initialValue='active'>
            <Select
              options={[
                {value: 'active', label: 'Active'},
                {value: 'inactive', label: 'Inactive'},
                {value: 'suspended', label: 'Suspended'},
              ]}
            />
          </Form.Item>
          <Form.Item name='notes' label='Notes'>
            <Input.TextArea rows={3} placeholder='Additional notes' />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit' loading={loading}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => navigate('/superadmin/affiliates')}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AffiliateForm;
