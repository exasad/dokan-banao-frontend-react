import {useState, useEffect} from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  message,
  Space,
  DatePicker,
  Spin,
  Divider,
} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';
import dayjs from 'dayjs';

const {Title} = Typography;

const TenantForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();
  const {id} = useParams();
  const isEdit = !!id;

  useEffect(() => {
    superadminAxios
      .get('/plans', {params: {per_page: 100, status: 'active'}})
      .then((res) => setPlans(res.data.data))
      .catch(() => {});

    if (isEdit) {
      setFetching(true);
      superadminAxios
        .get(`/tenants/${id}`)
        .then((res) => {
          const data = {...res.data};
          if (data.trial_ends_at) data.trial_ends_at = dayjs(data.trial_ends_at);
          if (data.subscription_starts_at) data.subscription_starts_at = dayjs(data.subscription_starts_at);
          if (data.subscription_ends_at) data.subscription_ends_at = dayjs(data.subscription_ends_at);
          form.setFieldsValue(data);
        })
        .catch(() => message.error('Failed to fetch tenant'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        trial_ends_at: values.trial_ends_at?.format('YYYY-MM-DD') || null,
        subscription_starts_at: values.subscription_starts_at?.format('YYYY-MM-DD') || null,
        subscription_ends_at: values.subscription_ends_at?.format('YYYY-MM-DD') || null,
      };
      if (isEdit) {
        await superadminAxios.put(`/tenants/${id}`, data);
        message.success('Tenant updated');
      } else {
        await superadminAxios.post('/tenants', data);
        message.success('Tenant created');
      }
      navigate('/superadmin/tenants');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0]?.[0];
        message.error(firstError || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to save tenant');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;

  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>
        {isEdit ? 'Edit Tenant' : 'Create Tenant'}
      </Title>
      <Card
        style={{
          maxWidth: 700,
        }}
      >
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Form.Item name='name' label='Name' rules={[{required: true}]}>
            <Input placeholder='Tenant name' />
          </Form.Item>
          <Form.Item
            name='email'
            label='Email'
            rules={[{required: true}, {type: 'email'}]}
          >
            <Input placeholder='Tenant email' />
          </Form.Item>
          <Form.Item name='domain' label='Domain'>
            <Input placeholder='e.g. store.example.com' />
          </Form.Item>
          <Form.Item name='plan_id' label='Plan' rules={[{required: true}]}>
            <Select
              placeholder='Select a plan'
              options={plans.map((p) => ({value: p.id, label: `${p.name} ($${p.price}/mo)`}))}
            />
          </Form.Item>
          {isEdit && (
            <Form.Item name='status' label='Status'>
              <Select
                options={[
                  {value: 'active', label: 'Active'},
                  {value: 'suspended', label: 'Suspended'},
                  {value: 'inactive', label: 'Inactive'},
                  {value: 'expired', label: 'Expired'},
                ]}
              />
            </Form.Item>
          )}
          <Space size={16}>
            <Form.Item name='trial_ends_at' label='Trial Ends'>
              <DatePicker />
            </Form.Item>
            <Form.Item name='subscription_starts_at' label='Subscription Start'>
              <DatePicker />
            </Form.Item>
            <Form.Item name='subscription_ends_at' label='Subscription End'>
              <DatePicker />
            </Form.Item>
          </Space>
          {!isEdit && (
            <>
              <Divider orientation='left'>Admin Information</Divider>
              <Form.Item name='admin_name' label='Admin Name'>
                <Input placeholder='Admin full name' />
              </Form.Item>
              <Form.Item
                name='admin_email'
                label='Admin Email'
                rules={[{type: 'email', message: 'Enter a valid email'}]}
              >
                <Input placeholder='Admin email address' />
              </Form.Item>
              <Form.Item
                name='admin_password'
                label='Admin Password'
                rules={[{min: 6, message: 'Minimum 6 characters'}]}
              >
                <Input.Password placeholder='Admin password' />
              </Form.Item>
              <Form.Item name='admin_phone' label='Admin Phone'>
                <Input placeholder='Admin phone number' />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit' loading={loading}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => navigate('/superadmin/tenants')}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TenantForm;
