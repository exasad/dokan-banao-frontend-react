import {useState, useEffect} from 'react';
import {Modal, Form, Input, Switch, InputNumber, Upload, Button, message, Space, Avatar} from 'antd';
import {UploadOutlined, DeleteOutlined} from '@ant-design/icons';
import superadminAxios from '../../services/superadminAxios';

const SeedDataForm = ({open, onClose, onSuccess, editingItem, activeType, typeConfig}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const isEdit = !!editingItem;

  useEffect(() => {
    if (open) {
      setIconFile(null);
      if (editingItem) {
        form.setFieldsValue({
          ...editingItem.data,
          sort_order: editingItem.sort_order,
          is_active: editingItem.is_active,
        });
        setIconPreview(editingItem.data?.icon || null);
      } else {
        form.resetFields();
        form.setFieldsValue({is_active: true, sort_order: 0});
        setIconPreview(null);
      }
    }
  }, [open, editingItem, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const {sort_order, is_active, icon, ...fieldValues} = values;

      const formData = new FormData();
      formData.append('type', activeType);
      formData.append('sort_order', sort_order ?? 0);
      formData.append('is_active', is_active ? '1' : '0');

      Object.entries(fieldValues).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          formData.append(`data[${key}]`, val);
        }
      });

      // Preserve existing icon URL if no new file uploaded
      if (iconFile) {
        formData.append('icon', iconFile);
      } else if (iconPreview) {
        formData.append('data[icon]', iconPreview);
      }

      if (isEdit) {
        formData.append('_method', 'PUT');
        await superadminAxios.post(`/seed-data/${editingItem.id}`, formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });
        message.success(`${typeConfig.label.slice(0, -1)} updated`);
      } else {
        await superadminAxios.post('/seed-data', formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });
        message.success(`${typeConfig.label.slice(0, -1)} created`);
      }
      onSuccess();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0]?.[0];
        message.error(firstError || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to save');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIconUpload = (file) => {
    setIconFile(file);
    setIconPreview(URL.createObjectURL(file));
    return false;
  };

  const handleRemoveIcon = () => {
    setIconFile(null);
    setIconPreview(null);
  };

  const renderField = (field) => {
    if (field.auto) return null;

    const rules = field.required ? [{required: true, message: `${field.label} is required`}] : [];

    switch (field.type) {
      case 'text':
        return (
          <Form.Item key={field.name} name={field.name} label={field.label} rules={rules}>
            <Input.TextArea rows={3} placeholder={`Enter ${field.label.toLowerCase()}`} />
          </Form.Item>
        );
      case 'color':
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={[
              ...rules,
              {pattern: /^#[0-9A-Fa-f]{6}$/, message: 'Must be a valid hex color (e.g. #FF0000)'},
            ]}
          >
            <Input placeholder='#000000' style={{width: 200}} />
          </Form.Item>
        );
      case 'image':
        return (
          <Form.Item key={field.name} label={field.label}>
            <Space align='center'>
              {iconPreview && (
                <Avatar src={iconPreview} shape='square' size={48} />
              )}
              <Upload
                beforeUpload={handleIconUpload}
                showUploadList={false}
                accept='image/*'
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
              {iconPreview && (
                <Button icon={<DeleteOutlined />} size='small' danger onClick={handleRemoveIcon} />
              )}
            </Space>
          </Form.Item>
        );
      default:
        return (
          <Form.Item key={field.name} name={field.name} label={field.label} rules={rules}>
            <Input placeholder={`Enter ${field.label.toLowerCase()}`} />
          </Form.Item>
        );
    }
  };

  return (
    <Modal
      title={`${isEdit ? 'Edit' : 'Add'} ${typeConfig.label.slice(0, -1)}`}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form form={form} layout='vertical' onFinish={onFinish}>
        {typeConfig.fields.map(renderField)}
        <Form.Item name='sort_order' label='Sort Order'>
          <InputNumber min={0} style={{width: 120}} />
        </Form.Item>
        <Form.Item name='is_active' label='Active' valuePropName='checked'>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SeedDataForm;
