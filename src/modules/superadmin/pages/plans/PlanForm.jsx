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
  Tag,
  Spin,
} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const PlanForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState('');
  const navigate = useNavigate();
  const {id} = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      superadminAxios
        .get(`/plans/${id}`)
        .then((res) => {
          form.setFieldsValue(res.data);
          setFeatures(res.data.features || []);
        })
        .catch(() => message.error('Failed to fetch plan'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, form]);

  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (feature) => {
    setFeatures(features.filter((f) => f !== feature));
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {...values, features};
      if (isEdit) {
        await superadminAxios.put(`/plans/${id}`, data);
        message.success('Plan updated');
      } else {
        await superadminAxios.post('/plans', data);
        message.success('Plan created');
      }
      navigate('/superadmin/plans');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to save plan');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;

  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>
        {isEdit ? 'Edit Plan' : 'Create Plan'}
      </Title>
      <Card
        style={{
          maxWidth: 700,
        }}
      >
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Form.Item name='name' label='Name' rules={[{required: true}]}>
            <Input placeholder='Plan name' />
          </Form.Item>
          <Form.Item name='description' label='Description'>
            <Input.TextArea rows={3} placeholder='Plan description' />
          </Form.Item>
          <Space size={16} style={{width: '100%'}}>
            <Form.Item name='price' label='Price' rules={[{required: true}]}>
              <InputNumber min={0} step={0.01} prefix='$' style={{width: 200}} />
            </Form.Item>
            <Form.Item
              name='duration_days'
              label='Duration (days)'
              rules={[{required: true}]}
            >
              <InputNumber min={1} style={{width: 200}} />
            </Form.Item>
            <Form.Item name='trial_days' label='Trial (days)' initialValue={0}>
              <InputNumber min={0} style={{width: 200}} />
            </Form.Item>
          </Space>
          <Space size={16} style={{width: '100%'}}>
            <Form.Item name='max_products' label='Max Products' rules={[{required: true}]}>
              <InputNumber min={-1} style={{width: 200}} />
            </Form.Item>
            <Form.Item name='max_orders' label='Max Orders' rules={[{required: true}]}>
              <InputNumber min={-1} style={{width: 200}} />
            </Form.Item>
            <Form.Item name='max_users' label='Max Users' rules={[{required: true}]}>
              <InputNumber min={-1} style={{width: 200}} />
            </Form.Item>
          </Space>
          <Form.Item label='Features'>
            <Space>
              <Input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onPressEnter={handleAddFeature}
                placeholder='Add feature'
                style={{width: 250}}
              />
              <Button onClick={handleAddFeature}>Add</Button>
            </Space>
            <div style={{marginTop: 8}}>
              {features.map((f) => (
                <Tag
                  key={f}
                  closable
                  onClose={() => handleRemoveFeature(f)}
                  style={{marginBottom: 4}}
                >
                  {f}
                </Tag>
              ))}
            </div>
          </Form.Item>
          <Form.Item name='status' label='Status' initialValue='active'>
            <Select
              options={[
                {value: 'active', label: 'Active'},
                {value: 'inactive', label: 'Inactive'},
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit' loading={loading}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => navigate('/superadmin/plans')}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PlanForm;
