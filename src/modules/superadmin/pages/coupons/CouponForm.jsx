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
  Spin,
  Transfer,
} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';
import dayjs from 'dayjs';

const {Title} = Typography;

const CouponForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [affiliates, setAffiliates] = useState([]);
  const [selectedAffiliateKeys, setSelectedAffiliateKeys] = useState([]);
  const navigate = useNavigate();
  const {id} = useParams();
  const isEdit = !!id;

  useEffect(() => {
    superadminAxios
      .get('/affiliates', {params: {per_page: 1000, status: 'active'}})
      .then((res) => setAffiliates(res.data.data || []))
      .catch(() => {});

    if (isEdit) {
      setFetching(true);
      superadminAxios
        .get(`/coupons/${id}`)
        .then((res) => {
          const data = {...res.data};
          if (data.starts_at) data.starts_at = dayjs(data.starts_at);
          if (data.expires_at) data.expires_at = dayjs(data.expires_at);
          form.setFieldsValue(data);
          if (data.affiliates) {
            setSelectedAffiliateKeys(data.affiliates.map((a) => a.id));
          }
        })
        .catch(() => message.error('Failed to fetch coupon'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        code: values.code?.toUpperCase(),
        starts_at: values.starts_at?.format('YYYY-MM-DD') || null,
        expires_at: values.expires_at?.format('YYYY-MM-DD') || null,
      };
      if (isEdit) {
        await superadminAxios.put(`/coupons/${id}`, data);
        await superadminAxios.post(`/coupons/${id}/assign-affiliates`, {
          affiliate_ids: selectedAffiliateKeys,
        });
        message.success('Coupon updated');
      } else {
        const res = await superadminAxios.post('/coupons', data);
        if (selectedAffiliateKeys.length > 0) {
          await superadminAxios.post(`/coupons/${res.data.id}/assign-affiliates`, {
            affiliate_ids: selectedAffiliateKeys,
          });
        }
        message.success('Coupon created');
      }
      navigate('/superadmin/coupons');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0]?.[0];
        message.error(firstError || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to save coupon');
      }
    } finally {
      setLoading(false);
    }
  };

  const transferDataSource = affiliates.map((a) => ({
    key: a.id,
    title: `${a.name} (${a.email})`,
  }));

  if (fetching) return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;

  return (
    <div>
      <Title level={3} style={{marginBottom: 24}}>
        {isEdit ? 'Edit Coupon' : 'Create Coupon'}
      </Title>
      <Card style={{maxWidth: 800}}>
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Form.Item
            name='code'
            label='Code'
            rules={[{required: true}]}
            normalize={(v) => v?.toUpperCase()}
          >
            <Input placeholder='e.g. SAVE20' style={{textTransform: 'uppercase'}} />
          </Form.Item>
          <Space size={16} style={{width: '100%'}}>
            <Form.Item name='type' label='Type' rules={[{required: true}]}>
              <Select
                placeholder='Select type'
                style={{width: 200}}
                options={[
                  {value: 'percentage', label: 'Percentage'},
                  {value: 'fixed', label: 'Fixed'},
                ]}
              />
            </Form.Item>
            <Form.Item name='value' label='Value' rules={[{required: true}]}>
              <InputNumber min={0} step={0.01} style={{width: 200}} />
            </Form.Item>
          </Space>
          <Space size={16} style={{width: '100%'}}>
            <Form.Item name='min_order_amount' label='Min Order Amount'>
              <InputNumber min={0} step={0.01} prefix='$' style={{width: 200}} />
            </Form.Item>
            <Form.Item name='max_discount_amount' label='Max Discount Amount'>
              <InputNumber min={0} step={0.01} prefix='$' style={{width: 200}} />
            </Form.Item>
            <Form.Item name='usage_limit' label='Usage Limit'>
              <InputNumber min={0} style={{width: 200}} />
            </Form.Item>
          </Space>
          <Space size={16}>
            <Form.Item name='starts_at' label='Starts At'>
              <DatePicker />
            </Form.Item>
            <Form.Item name='expires_at' label='Expires At'>
              <DatePicker />
            </Form.Item>
          </Space>
          <Form.Item name='status' label='Status' initialValue='active'>
            <Select
              options={[
                {value: 'active', label: 'Active'},
                {value: 'inactive', label: 'Inactive'},
              ]}
            />
          </Form.Item>
          <Form.Item name='description' label='Description'>
            <Input.TextArea rows={3} placeholder='Coupon description' />
          </Form.Item>
          <Form.Item label='Assign Affiliates'>
            <Transfer
              dataSource={transferDataSource}
              targetKeys={selectedAffiliateKeys}
              onChange={setSelectedAffiliateKeys}
              render={(item) => item.title}
              showSearch
              listStyle={{width: 300, height: 300}}
              titles={['Available', 'Assigned']}
              filterOption={(input, item) =>
                item.title.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type='primary' htmlType='submit' loading={loading}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => navigate('/superadmin/coupons')}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CouponForm;
