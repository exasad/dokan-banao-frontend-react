import {useState} from 'react';
import {Modal, Form, InputNumber, Select, Input, DatePicker, message} from 'antd';
import superadminAxios from '../../services/superadminAxios';

const RecordPaymentModal = ({open, invoice, onClose, onSuccess}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const data = {
        ...values,
        paid_at: values.paid_at?.format('YYYY-MM-DD HH:mm:ss') || undefined,
      };
      await superadminAxios.post(`/invoices/${invoice.id}/payment`, data);
      message.success('Payment recorded');
      form.resetFields();
      onSuccess();
    } catch (err) {
      if (err.response) {
        message.error(err.response?.data?.message || 'Failed to record payment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title='Record Payment'
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout='vertical' preserve={false}>
        <Form.Item
          name='amount'
          label={`Amount (Balance: $${parseFloat(invoice?.balance || 0).toFixed(2)})`}
          rules={[{required: true}]}
        >
          <InputNumber
            min={0.01}
            max={parseFloat(invoice?.balance || 0)}
            step={0.01}
            prefix='$'
            style={{width: '100%'}}
          />
        </Form.Item>
        <Form.Item
          name='payment_method'
          label='Payment Method'
          rules={[{required: true}]}
        >
          <Select
            placeholder='Select method'
            options={[
              {value: 'bank_transfer', label: 'Bank Transfer'},
              {value: 'credit_card', label: 'Credit Card'},
              {value: 'cash', label: 'Cash'},
              {value: 'cheque', label: 'Cheque'},
              {value: 'other', label: 'Other'},
            ]}
          />
        </Form.Item>
        <Form.Item name='reference' label='Reference'>
          <Input placeholder='Transaction reference' />
        </Form.Item>
        <Form.Item name='paid_at' label='Payment Date'>
          <DatePicker showTime style={{width: '100%'}} />
        </Form.Item>
        <Form.Item name='notes' label='Notes'>
          <Input.TextArea rows={2} placeholder='Optional notes' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RecordPaymentModal;
