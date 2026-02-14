import {useState, useEffect} from 'react';
import {Typography, Form, Input, InputNumber, Switch, DatePicker, Button, Card, Space, message} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import {useParams, useNavigate} from 'react-router-dom';
import adminAxios from '../../services/adminAxios';
import dayjs from 'dayjs';

const {Title} = Typography;

const GiftCardForm = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      adminAxios.get(`/gift-cards/${id}`).then(({data}) => {
        form.setFieldsValue({
          ...data,
          expires_at: data.expires_at ? dayjs(data.expires_at) : null,
        });
      }).catch(() => {
        message.error('Gift card not found');
        navigate('/gift-cards');
      });
    }
  }, [id]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        expires_at: values.expires_at ? values.expires_at.format('YYYY-MM-DD HH:mm:ss') : null,
      };

      if (isEdit) {
        await adminAxios.put(`/gift-cards/${id}`, data);
        message.success('Gift card updated');
      } else {
        await adminAxios.post('/gift-cards', data);
        message.success('Gift card created');
      }
      navigate('/gift-cards');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to save');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24}}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/gift-cards')} />
        <Title level={3} style={{margin: 0}}>{isEdit ? 'Edit Gift Card' : 'Create Gift Card'}</Title>
      </div>

      <Card style={{maxWidth: 600}}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{is_active: true}}
        >
          {!isEdit && (
            <Form.Item name="initial_balance" label="Balance Amount (৳)" rules={[{required: true, message: 'Enter amount'}]}>
              <InputNumber min={1} step={100} style={{width: '100%'}} placeholder="e.g. 500" />
            </Form.Item>
          )}

          <Form.Item name="recipient_name" label="Recipient Name">
            <Input placeholder="Recipient's name" />
          </Form.Item>

          <Form.Item name="recipient_email" label="Recipient Email">
            <Input type="email" placeholder="recipient@email.com" />
          </Form.Item>

          <Form.Item name="message" label="Message">
            <Input.TextArea rows={3} placeholder="Personal message (optional)" />
          </Form.Item>

          <Form.Item name="expires_at" label="Expiry Date">
            <DatePicker showTime style={{width: '100%'}} placeholder="Never expires" />
          </Form.Item>

          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? 'Update Gift Card' : 'Create Gift Card'}
            </Button>
            <Button onClick={() => navigate('/gift-cards')}>Cancel</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
};

export default GiftCardForm;
