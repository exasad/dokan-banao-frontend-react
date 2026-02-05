import {useState, useEffect} from 'react';
import {Modal, Form, Input, InputNumber, Switch, message} from 'antd';
import adminAxios from '../../services/adminAxios';

const TagForm = ({open, onClose, onSuccess, editingTag}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEdit = !!editingTag;

  useEffect(() => {
    if (open) {
      if (editingTag) {
        form.setFieldsValue({
          name: editingTag.name,
          sort_order: editingTag.sort_order,
          is_active: editingTag.is_active,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingTag, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = {
        name: values.name,
        sort_order: values.sort_order ?? 0,
        is_active: values.is_active,
      };

      if (isEdit) {
        await adminAxios.put(`/tags/${editingTag.id}`, data);
        message.success('Tag updated');
      } else {
        await adminAxios.post('/tags', data);
        message.success('Tag created');
      }
      onSuccess();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to save tag');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Tag' : 'Add Tag'}
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
        initialValues={{is_active: true, sort_order: 0}}
      >
        <Form.Item name='name' label='Name' rules={[{required: true, message: 'Please enter tag name'}]}>
          <Input placeholder='Tag name' />
        </Form.Item>
        <Form.Item name='sort_order' label='Sort Order'>
          <InputNumber min={0} style={{width: '100%'}} />
        </Form.Item>
        <Form.Item name='is_active' label='Active' valuePropName='checked'>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TagForm;
