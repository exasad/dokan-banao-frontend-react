import {useState, useEffect} from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  Button,
  message,
} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';

const CategoryForm = ({open, onClose, onSuccess, editingCategory}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const isEdit = !!editingCategory;

  useEffect(() => {
    if (open) {
      const params = {};
      if (editingCategory) params.exclude = editingCategory.id;
      adminAxios
        .get('/categories/parent-options', {params})
        .then((res) => setParentOptions(res.data))
        .catch(() => {});

      if (editingCategory) {
        form.setFieldsValue({
          name: editingCategory.name,
          parent_id: editingCategory.parent_id || null,
          description: editingCategory.description,
          sort_order: editingCategory.sort_order,
          is_active: editingCategory.is_active,
        });
        setFileList([]);
      } else {
        form.resetFields();
        setFileList([]);
      }
    }
  }, [open, editingCategory, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      if (values.parent_id) formData.append('parent_id', values.parent_id);
      if (values.description) formData.append('description', values.description);
      formData.append('sort_order', values.sort_order ?? 0);
      formData.append('is_active', values.is_active ? '1' : '0');

      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      if (isEdit) {
        formData.append('_method', 'PUT');
        await adminAxios.post(`/categories/${editingCategory.id}`, formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });
        message.success('Category updated');
      } else {
        await adminAxios.post('/categories', formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });
        message.success('Category created');
      }
      onSuccess();
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to save category');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Category' : 'Add Category'}
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
        <Form.Item name='name' label='Name' rules={[{required: true, message: 'Please enter name'}]}>
          <Input placeholder='Category name' />
        </Form.Item>
        <Form.Item name='parent_id' label='Parent Category'>
          <Select
            placeholder='None (Root Category)'
            allowClear
            showSearch
            optionFilterProp='label'
            options={parentOptions.map((c) => ({value: c.id, label: c.name}))}
          />
        </Form.Item>
        <Form.Item name='description' label='Description'>
          <Input.TextArea rows={3} placeholder='Optional description' />
        </Form.Item>
        <Form.Item name='image' label='Image'>
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
          {isEdit && editingCategory?.image && fileList.length === 0 && (
            <img
              src={editingCategory.image}
              alt='Current'
              style={{marginTop: 8, maxHeight: 80, borderRadius: 4}}
            />
          )}
        </Form.Item>
        <Form.Item name='is_active' label='Active' valuePropName='checked'>
          <Switch />
        </Form.Item>
        <Form.Item name='sort_order' label='Sort Order'>
          <InputNumber min={0} style={{width: '100%'}} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm;
