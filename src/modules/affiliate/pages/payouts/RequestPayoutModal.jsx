import {useState} from 'react';
import {Modal, Form, InputNumber, Select, Input, message} from 'antd';
import affiliateAxios from '../../services/affiliateAxios';

const RequestPayoutModal = ({open, onClose, onSuccess}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await affiliateAxios.post('/payouts/request', values);
      message.success('Payout request submitted');
      form.resetFields();
      onSuccess();
    } catch (err) {
      if (err.response) {
        message.error(err.response?.data?.message || 'Failed to submit payout request');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title='Request Payout'
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout='vertical' preserve={false}>
        <Form.Item
          name='amount'
          label='Amount'
          rules={[{required: true, message: 'Please enter the amount'}]}
        >
          <InputNumber
            min={0.01}
            step={0.01}
            prefix='$'
            style={{width: '100%'}}
            placeholder='Enter amount'
          />
        </Form.Item>
        <Form.Item
          name='payment_method'
          label='Payment Method'
          rules={[{required: true, message: 'Please select a payment method'}]}
        >
          <Select
            placeholder='Select method'
            options={[
              {value: 'bank_transfer', label: 'Bank Transfer'},
              {value: 'paypal', label: 'PayPal'},
              {value: 'crypto', label: 'Crypto'},
              {value: 'other', label: 'Other'},
            ]}
          />
        </Form.Item>
        <Form.Item name='notes' label='Notes'>
          <Input.TextArea rows={3} placeholder='Optional notes' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RequestPayoutModal;
