import {useState, useEffect} from 'react';
import {Modal, Form, Input, InputNumber, Switch, message} from 'antd';
import adminAxios from '../../services/adminAxios';

const DeliveryChargeForm = ({open, onClose, onSuccess, editingCharge}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!editingCharge;

  useEffect(() => {
    if (open) {
      if (editingCharge) {
        form.setFieldsValue({
          name: editingCharge.name,
          charge: parseFloat(editingCharge.charge),
          is_active: editingCharge.is_active,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingCharge, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = {
        name: values.name,
        charge: values.charge,
        is_active: values.is_active,
      };

      if (isEdit) {
        await adminAxios.put(`/delivery-charges/${editingCharge.id}`, data);
        message.success('Delivery charge updated');
      } else {
        await adminAxios.post('/delivery-charges', data);
        message.success('Delivery charge created');
      }
      onSuccess();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to save delivery charge');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Delivery Charge' : 'Add Delivery Charge'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{is_active: true, charge: 0}}
      >
        <Form.Item name='name' label='Delivery Charge Name' rules={[{required: true, message: 'Please enter delivery charge name'}]}>
          <Input placeholder='e.g. Inside Dhaka, Outside Dhaka' />
        </Form.Item>
        <Form.Item name='charge' label='Charge Amount (৳)' rules={[{required: true, message: 'Please enter charge amount'}]}>
          <InputNumber min={0} step={10} prefix='৳' style={{width: '100%'}} placeholder='0.00' />
        </Form.Item>
        <Form.Item name='is_active' label='Active' valuePropName='checked'>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeliveryChargeForm;
