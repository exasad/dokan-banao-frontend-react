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
  Row,
  Col,
  Switch,
  InputNumber,
  Alert,
  Collapse,
} from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  SettingOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  CrownOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';
import dayjs from 'dayjs';

const {Title, Text} = Typography;
const {TextArea} = Input;

const THEMES = [
  {id: 'default', name: 'Default', color: '#4f46e5'},
  {id: 'gadget', name: 'Gadget', color: '#00d4ff'},
  {id: 'fashion', name: 'Fashion', color: '#be185d'},
  {id: 'grocery', name: 'Grocery', color: '#16a34a'},
  {id: 'luxury', name: 'Luxury', color: '#d4af37'},
  {id: 'kids', name: 'Kids', color: '#f97316'},
  {id: 'minimal', name: 'Minimal', color: '#171717'},
  {id: 'beauty', name: 'Beauty', color: '#ec4899'},
  {id: 'sports', name: 'Sports', color: '#dc2626'},
  {id: 'ocean', name: 'Ocean', color: '#0891b2'},
];

const TenantForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [plans, setPlans] = useState([]);
  const [generateDummy, setGenerateDummy] = useState(false);
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
    } else {
      // Set defaults for new tenant
      form.setFieldsValue({
        status: 'active',
        theme: 'default',
        enable_guest_checkout: true,
      });
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

      let tenant;
      if (isEdit) {
        const res = await superadminAxios.put(`/tenants/${id}`, data);
        tenant = res.data;
        message.success('Tenant updated successfully');
      } else {
        const res = await superadminAxios.post('/tenants', data);
        tenant = res.data;
        message.success('Tenant created successfully');

        // Generate dummy data if requested
        if (generateDummy && tenant.id) {
          try {
            await superadminAxios.post(`/tenants/${tenant.id}/generate-dummy-data`, {
              categories_count: values.dummy_categories || 5,
              products_count: values.dummy_products || 20,
              sliders_count: values.dummy_sliders || 3,
            });
            message.success('Dummy data generated successfully');
          } catch {
            message.warning('Tenant created but failed to generate dummy data');
          }
        }
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
    <div style={{maxWidth: 1000, margin: '0 auto'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24}}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/superadmin/tenants')}>
          Back
        </Button>
        <Title level={3} style={{margin: 0}}>
          {isEdit ? 'Edit Tenant' : 'Create New Tenant'}
        </Title>
      </div>

      <Form form={form} layout='vertical' onFinish={onFinish} size='large'>
        <Row gutter={24}>
          {/* Left Column */}
          <Col xs={24} lg={14}>
            {/* Basic Information */}
            <Card
              title={<><ShopOutlined style={{marginRight: 8}} />Store Information</>}
              style={{marginBottom: 24}}
            >
              <Form.Item
                name='name'
                label='Store Name'
                rules={[{required: true, message: 'Store name is required'}]}
              >
                <Input placeholder='e.g. My Awesome Store' />
              </Form.Item>

              <Form.Item
                name='email'
                label='Store Email'
                rules={[{required: true}, {type: 'email', message: 'Enter a valid email'}]}
                extra='Used for billing and notifications'
              >
                <Input placeholder='store@example.com' />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='domain'
                    label='Subdomain'
                    extra='e.g. mystore.dokanbanao.com'
                  >
                    <Input
                      placeholder='mystore'
                      addonAfter='.dokanbanao.com'
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name='custom_domain'
                    label='Custom Domain (Optional)'
                    extra='e.g. shop.mybrand.com'
                  >
                    <Input placeholder='shop.mybrand.com' />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Subscription */}
            <Card
              title={<><CrownOutlined style={{marginRight: 8}} />Subscription</>}
              style={{marginBottom: 24}}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name='plan_id'
                    label='Plan'
                    rules={[{required: true, message: 'Please select a plan'}]}
                  >
                    <Select
                      placeholder='Select a plan'
                      options={plans.map((p) => ({
                        value: p.id,
                        label: (
                          <span>
                            {p.name} <Text type='secondary'>— ${p.price}/mo</Text>
                          </span>
                        ),
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name='status' label='Status'>
                    <Select
                      options={[
                        {value: 'active', label: '🟢 Active'},
                        {value: 'suspended', label: '🟡 Suspended'},
                        {value: 'inactive', label: '⚪ Inactive'},
                        {value: 'expired', label: '🔴 Expired'},
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name='trial_ends_at' label='Trial Ends'>
                    <DatePicker style={{width: '100%'}} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='subscription_starts_at' label='Subscription Start'>
                    <DatePicker style={{width: '100%'}} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='subscription_ends_at' label='Subscription End'>
                    <DatePicker style={{width: '100%'}} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Admin Account - Only for create */}
            {!isEdit && (
              <Card
                title={<><UserOutlined style={{marginRight: 8}} />Admin Account</>}
                style={{marginBottom: 24}}
              >
                <Alert
                  message='An admin account will be created with these credentials to manage the store.'
                  type='info'
                  showIcon
                  style={{marginBottom: 16}}
                />

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name='admin_name'
                      label='Admin Name'
                      rules={[{required: true, message: 'Admin name is required'}]}
                    >
                      <Input placeholder='John Doe' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='admin_phone'
                      label='Phone Number'
                    >
                      <Input placeholder='+880 1XXX-XXXXXX' />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name='admin_email'
                      label='Admin Email'
                      rules={[
                        {required: true, message: 'Admin email is required'},
                        {type: 'email', message: 'Enter a valid email'},
                      ]}
                    >
                      <Input placeholder='admin@example.com' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name='admin_password'
                      label='Password'
                      rules={[
                        {required: true, message: 'Password is required'},
                        {min: 6, message: 'Minimum 6 characters'},
                      ]}
                    >
                      <Input.Password placeholder='Min 6 characters' />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            )}
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={10}>
            {/* Storefront Settings */}
            <Card
              title={<><SettingOutlined style={{marginRight: 8}} />Storefront Settings</>}
              style={{marginBottom: 24}}
            >
              <Form.Item
                name='site_title'
                label='Site Title'
              >
                <Input placeholder='My Store — Best Products Online' />
              </Form.Item>

              <Form.Item
                name='site_description'
                label='Site Description'
              >
                <TextArea
                  rows={2}
                  placeholder='Short description for search engines'
                  showCount
                  maxLength={160}
                />
              </Form.Item>

              <Form.Item name='theme' label='Theme'>
                <Select placeholder='Select theme'>
                  {THEMES.map((t) => (
                    <Select.Option key={t.id} value={t.id}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 4,
                            backgroundColor: t.color,
                            display: 'inline-block',
                          }}
                        />
                        {t.name}
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name='enable_guest_checkout'
                label='Guest Checkout'
                valuePropName='checked'
              >
                <Switch checkedChildren='Enabled' unCheckedChildren='Disabled' />
              </Form.Item>
            </Card>

            {/* Dummy Data - Only for create */}
            {!isEdit && (
              <Card
                title={<><DatabaseOutlined style={{marginRight: 8}} />Initial Data</>}
                style={{marginBottom: 24}}
              >
                <Form.Item>
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div>
                      <Text strong>Generate Dummy Data</Text>
                      <br />
                      <Text type='secondary' style={{fontSize: 12}}>
                        Create sample categories, products & sliders
                      </Text>
                    </div>
                    <Switch
                      checked={generateDummy}
                      onChange={setGenerateDummy}
                      checkedChildren='Yes'
                      unCheckedChildren='No'
                    />
                  </div>
                </Form.Item>

                {generateDummy && (
                  <div style={{
                    padding: 16,
                    backgroundColor: '#fafafa',
                    borderRadius: 8,
                    marginTop: 8,
                  }}>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          name='dummy_sliders'
                          label='Sliders'
                          initialValue={3}
                        >
                          <InputNumber min={0} max={10} style={{width: '100%'}} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name='dummy_categories'
                          label='Categories'
                          initialValue={5}
                        >
                          <InputNumber min={0} max={20} style={{width: '100%'}} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name='dummy_products'
                          label='Products'
                          initialValue={20}
                        >
                          <InputNumber min={0} max={100} style={{width: '100%'}} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card>
            )}

            {/* Notes */}
            <Card title='Notes' style={{marginBottom: 24}}>
              <Form.Item name='notes'>
                <TextArea
                  rows={3}
                  placeholder='Internal notes about this tenant (not visible to tenant)'
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        {/* Submit */}
        <Card>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text type='secondary'>
              {isEdit ? 'Update the tenant information' : 'Create a new tenant with the above information'}
            </Text>
            <Space>
              <Button onClick={() => navigate('/superadmin/tenants')}>
                Cancel
              </Button>
              <Button type='primary' htmlType='submit' loading={loading} icon={<SaveOutlined />}>
                {isEdit ? 'Update Tenant' : 'Create Tenant'}
              </Button>
            </Space>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default TenantForm;
