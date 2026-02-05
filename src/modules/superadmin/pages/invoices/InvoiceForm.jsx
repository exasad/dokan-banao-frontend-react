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
  DatePicker,
} from 'antd';
import {useNavigate} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const InvoiceForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);
  const navigate = useNavigate();

  const amount = Form.useWatch('amount', form) || 0;
  const tax = Form.useWatch('tax', form) || 0;
  const discount = Form.useWatch('discount', form) || 0;
  const advanceAmount = Form.useWatch('advance_amount', form) || 0;
  const total = amount + tax - discount;
  const balance = total - advanceAmount;

  useEffect(() => {
    superadminAxios
      .get('/tenants', {params: {per_page: 100}})
      .then((res) => setTenants(res.data.data))
      .catch(() => {});
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        due_date: values.due_date?.format('YYYY-MM-DD'),
      };
      await superadminAxios.post('/invoices', data);
      message.success('Invoice created');
      navigate('/superadmin/invoices');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to create invoice');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>
        Create Invoice
      </Title>
      <Card
        style={{
          maxWidth: 700,
        }}
      >
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Form.Item name='tenant_id' label='Tenant' rules={[{required: true}]}>
            <Select
              placeholder='Select tenant'
              showSearch
              optionFilterProp='label'
              options={tenants.map((t) => ({value: t.id, label: `${t.name} (${t.email})`}))}
            />
          </Form.Item>
          <Space size={16} style={{width: '100%'}}>
            <Form.Item name='amount' label='Amount' rules={[{required: true}]}>
              <InputNumber min={0} step={0.01} prefix='$' style={{width: 200}} />
            </Form.Item>
            <Form.Item name='tax' label='Tax' initialValue={0}>
              <InputNumber min={0} step={0.01} prefix='$' style={{width: 200}} />
            </Form.Item>
            <Form.Item name='discount' label='Discount' initialValue={0}>
              <InputNumber min={0} step={0.01} prefix='$' style={{width: 200}} />
            </Form.Item>
          </Space>
          <Form.Item name='advance_amount' label='Advance Amount' initialValue={0}>
            <InputNumber min={0} step={0.01} prefix='$' style={{width: 200}} />
          </Form.Item>

          <Card
            size='small'
            style={{
              marginBottom: 24,
            }}
          >
            <Space size={32}>
              <span>Total: <strong>${total.toFixed(2)}</strong></span>
              <span>Balance: <strong>${balance.toFixed(2)}</strong></span>
            </Space>
          </Card>

          <Form.Item
            name='due_date'
            label='Due Date'
            rules={[{required: true}]}
          >
            <DatePicker style={{width: 200}} />
          </Form.Item>
          <Form.Item name='notes' label='Notes'>
            <Input.TextArea rows={3} placeholder='Optional notes' />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit' loading={loading}>
                Create Invoice
              </Button>
              <Button onClick={() => navigate('/superadmin/invoices')}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default InvoiceForm;
