import {useState, useEffect} from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Upload,
  Button,
  DatePicker,
  message,
} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';
import dayjs from 'dayjs';

const SliderForm = ({open, onClose, onSuccess, editingSlider}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const isEdit = !!editingSlider;

  useEffect(() => {
    if (open) {
      if (editingSlider) {
        form.setFieldsValue({
          title: editingSlider.title,
          description: editingSlider.description,
          link: editingSlider.link,
          sort_order: editingSlider.sort_order,
          is_active: editingSlider.is_active,
          starts_at: editingSlider.starts_at ? dayjs(editingSlider.starts_at) : null,
          ends_at: editingSlider.ends_at ? dayjs(editingSlider.ends_at) : null,
        });
        setFileList([]);
      } else {
        form.resetFields();
        setFileList([]);
      }
    }
  }, [open, editingSlider, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      if (values.description) formData.append('description', values.description);
      if (values.link) formData.append('link', values.link);
      formData.append('sort_order', values.sort_order ?? 0);
      formData.append('is_active', values.is_active ? '1' : '0');
      if (values.starts_at) formData.append('starts_at', values.starts_at.format('YYYY-MM-DD HH:mm:ss'));
      if (values.ends_at) formData.append('ends_at', values.ends_at.format('YYYY-MM-DD HH:mm:ss'));

      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      if (isEdit) {
        formData.append('_method', 'PUT');
        await adminAxios.post(`/sliders/${editingSlider.id}`, formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });
        message.success('Slider updated');
      } else {
        await adminAxios.post('/sliders', formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });
        message.success('Slider created');
      }
      onSuccess();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to save slider');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Slider' : 'Add Slider'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{is_active: true, sort_order: 0}}
      >
        <Form.Item name='title' label='Title' rules={[{required: true, message: 'Please enter title'}]}>
          <Input placeholder='Slider title' />
        </Form.Item>
        <Form.Item name='description' label='Description'>
          <Input.TextArea rows={3} placeholder='Optional description' />
        </Form.Item>
        <Form.Item
          name='image'
          label='Image'
          rules={isEdit ? [] : [{required: true, message: 'Please upload an image'}]}
        >
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({fileList: fl}) => setFileList(fl.slice(-1))}
            accept='image/*'
            listType='picture'
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
          {isEdit && editingSlider?.image && fileList.length === 0 && (
            <img
              src={editingSlider.image}
              alt='Current'
              style={{marginTop: 8, maxHeight: 80, borderRadius: 4}}
            />
          )}
        </Form.Item>
        <Form.Item name='link' label='Link'>
          <Input placeholder='https://example.com' />
        </Form.Item>
        <Form.Item name='sort_order' label='Sort Order'>
          <InputNumber min={0} style={{width: '100%'}} />
        </Form.Item>
        <Form.Item name='is_active' label='Active' valuePropName='checked'>
          <Switch />
        </Form.Item>
        <Form.Item name='starts_at' label='Starts At'>
          <DatePicker showTime style={{width: '100%'}} />
        </Form.Item>
        <Form.Item name='ends_at' label='Ends At'>
          <DatePicker showTime style={{width: '100%'}} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SliderForm;
