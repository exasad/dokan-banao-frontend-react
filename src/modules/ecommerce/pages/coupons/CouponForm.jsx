import {useState, useEffect} from 'react';
import {
  Modal, Form, Input, InputNumber, Select, Switch, DatePicker, Row, Col,
  Divider, message,
} from 'antd';
import adminAxios from '../../services/adminAxios';
import dayjs from 'dayjs';

const CouponForm = ({open, onClose, onSuccess, editingCoupon}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!editingCoupon;

  const appliesTo = Form.useWatch('applies_to', form);

  useEffect(() => {
    if (open) {
      if (editingCoupon) {
        form.setFieldsValue({
          ...editingCoupon,
          starts_at: editingCoupon.starts_at ? dayjs(editingCoupon.starts_at) : null,
          expires_at: editingCoupon.expires_at ? dayjs(editingCoupon.expires_at) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingCoupon, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        code: (values.code || '').toUpperCase().trim(),
        starts_at: values.starts_at ? values.starts_at.format('YYYY-MM-DD HH:mm:ss') : null,
        expires_at: values.expires_at ? values.expires_at.format('YYYY-MM-DD HH:mm:ss') : null,
      };

      if (isEdit) {
        await adminAxios.put(`/coupons/${editingCoupon.id}`, data);
        message.success('Coupon updated');
      } else {
        await adminAxios.post('/coupons', data);
        message.success('Coupon created');
      }
      onSuccess();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to save coupon');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Coupon' : 'Add Coupon'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnHidden
      width={720}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{
          discount_type: 'fixed',
          applies_to: 'all',
          is_active: true,
          free_shipping: false,
          first_order_only: false,
        }}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name='code' label='Coupon Code' rules={[{required: true, message: 'Enter coupon code'}]}>
              <Input placeholder='e.g. SAVE20' style={{textTransform: 'uppercase'}} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name='name' label='Name' rules={[{required: true, message: 'Enter coupon name'}]}>
              <Input placeholder='e.g. Summer Sale 20% Off' />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name='description' label='Description'>
          <Input.TextArea rows={2} placeholder='Optional description...' />
        </Form.Item>

        <Divider orientation='left' style={{fontSize: 13}}>Discount</Divider>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item name='discount_type' label='Discount Type' rules={[{required: true}]}>
              <Select options={[
                {value: 'fixed', label: 'Fixed Amount'},
                {value: 'percentage', label: 'Percentage'},
              ]} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name='discount_value' label='Discount Value' rules={[{required: true, message: 'Enter value'}]}>
              <InputNumber min={0} style={{width: '100%'}} placeholder='0.00' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name='max_discount_amount' label='Max Discount Amount'>
              <InputNumber min={0} style={{width: '100%'}} placeholder='No limit' />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name='min_order_amount' label='Minimum Order Amount'>
          <InputNumber min={0} style={{width: '100%'}} placeholder='No minimum' />
        </Form.Item>

        <Divider orientation='left' style={{fontSize: 13}}>Usage Limits</Divider>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name='usage_limit' label='Total Usage Limit'>
              <InputNumber min={1} style={{width: '100%'}} placeholder='Unlimited' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name='usage_limit_per_user' label='Usage Limit Per User'>
              <InputNumber min={1} style={{width: '100%'}} placeholder='Unlimited' />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation='left' style={{fontSize: 13}}>Conditions</Divider>

        <Form.Item name='applies_to' label='Applies To'>
          <Select options={[
            {value: 'all', label: 'All Products'},
            {value: 'specific_products', label: 'Specific Products'},
            {value: 'specific_categories', label: 'Specific Categories'},
          ]} />
        </Form.Item>

        {appliesTo === 'specific_products' && (
          <Form.Item name='product_ids' label='Product IDs'>
            <Select mode='tags' placeholder='Enter product IDs...' tokenSeparators={[',']} />
          </Form.Item>
        )}

        {appliesTo === 'specific_categories' && (
          <Form.Item name='category_ids' label='Category IDs'>
            <Select mode='tags' placeholder='Enter category IDs...' tokenSeparators={[',']} />
          </Form.Item>
        )}

        <Form.Item name='excluded_product_ids' label='Excluded Product IDs'>
          <Select mode='tags' placeholder='Enter product IDs to exclude...' tokenSeparators={[',']} />
        </Form.Item>

        <Divider orientation='left' style={{fontSize: 13}}>Schedule</Divider>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name='starts_at' label='Start Date'>
              <DatePicker showTime style={{width: '100%'}} placeholder='Immediately' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name='expires_at' label='Expiry Date'>
              <DatePicker showTime style={{width: '100%'}} placeholder='Never expires' />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation='left' style={{fontSize: 13}}>Options</Divider>

        <Row gutter={16}>
          <Col xs={12} sm={6}>
            <Form.Item name='is_active' label='Active' valuePropName='checked'>
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item name='free_shipping' label='Free Shipping' valuePropName='checked'>
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item name='first_order_only' label='First Order Only' valuePropName='checked'>
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CouponForm;
