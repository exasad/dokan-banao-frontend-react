import {useState} from 'react';
import {Form, Input, Select, Button, Card, Typography, message} from 'antd';
import {ArrowLeftOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import affiliateAxios from '../../services/affiliateAxios';

const {Title} = Typography;
const {TextArea} = Input;

const CreateTicket = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await affiliateAxios.post('/tickets', values);
      message.success('Ticket created successfully');
      navigate('/affiliate/tickets');
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        form.setFields(
          Object.keys(errors).map((key) => ({name: key, errors: errors[key]})),
        );
      } else {
        message.error(err.response?.data?.message || 'Failed to create ticket');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/affiliate/tickets')}
        style={{marginBottom: 16}}
      >
        Back to Tickets
      </Button>
      <Card>
        <Title level={4}>Create New Ticket</Title>
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Form.Item
            name='subject'
            label='Subject'
            rules={[{required: true, message: 'Please enter a subject'}]}
          >
            <Input placeholder='Brief description of your issue' />
          </Form.Item>
          <Form.Item
            name='description'
            label='Description'
            rules={[{required: true, message: 'Please enter a description'}]}
          >
            <TextArea rows={5} placeholder='Describe your issue in detail...' />
          </Form.Item>
          <Form.Item name='priority' label='Priority' initialValue='medium'>
            <Select
              options={[
                {value: 'low', label: 'Low'},
                {value: 'medium', label: 'Medium'},
                {value: 'high', label: 'High'},
                {value: 'urgent', label: 'Urgent'},
              ]}
            />
          </Form.Item>
          <Form.Item name='category' label='Category'>
            <Input placeholder='e.g. Billing, Technical, General' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' loading={loading}>
              Submit Ticket
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTicket;
