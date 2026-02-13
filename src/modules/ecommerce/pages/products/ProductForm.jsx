import {useState, useEffect, useRef, useMemo} from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  Button,
  Card,
  Typography,
  message,
  Space,
  Divider,
  Row,
  Col,
  Image,
  Spin,
  Tabs,
} from 'antd';
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import JoditEditor from 'jodit-react';
import adminAxios from '../../services/adminAxios';

const {Title} = Typography;

const editorConfig = {
  readonly: false,
  height: 300,
  buttons: [
    'bold', 'italic', 'underline', 'strikethrough', '|',
    'ul', 'ol', '|',
    'font', 'fontsize', 'paragraph', '|',
    'link', 'image', '|',
    'align', '|',
    'undo', 'redo', '|',
    'hr', 'eraser', 'fullsize',
  ],
  uploader: {insertImageAsBase64URI: true},
  removeButtons: ['source'],
  showXPathInStatusbar: false,
  showCharsCounter: false,
  showWordsCounter: false,
};

const ProductForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);
  const [thumbnailList, setThumbnailList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removeImageIds, setRemoveImageIds] = useState([]);
  const [description, setDescription] = useState('');
  const [translations, setTranslations] = useState({});
  const [variants, setVariants] = useState([]);
  const [features, setFeatures] = useState([]);
  const descriptionRef = useRef(null);
  const navigate = useNavigate();
  const {id} = useParams();
  const isEdit = !!id;

  const featureEditorConfig = useMemo(() => ({
    ...editorConfig,
    height: 200,
  }), []);

  useEffect(() => {
    adminAxios.get('/categories/parent-options').then((r) => setCategories(r.data)).catch(() => {});
    adminAxios.get('/tags', {params: {per_page: 1000}}).then((r) => setTagsOptions(r.data.data || [])).catch(() => {});

    if (isEdit) {
      setFetching(true);
      adminAxios
        .get(`/products/${id}`)
        .then((res) => {
          const p = res.data;
          form.setFieldsValue({
            name: p.name,
            category_id: p.category_id || undefined,
            price: parseFloat(p.price),
            compare_price: p.compare_price ? parseFloat(p.compare_price) : undefined,
            sku: p.sku,
            stock: p.stock,
            is_active: p.is_active,
            sort_order: p.sort_order,
            tags: p.tags?.map((t) => t.id) || [],
          });
          setDescription(p.description || '');
          setExistingImages(p.images || []);
          setVariants(
            p.variants?.map((v) => ({
              id: v.id,
              name: v.name,
              sku: v.sku || '',
              price: parseFloat(v.price),
              stock: v.stock,
              is_active: v.is_active,
            })) || [],
          );
          setFeatures(
            p.features?.map((f) => ({
              id: f.id,
              title: f.title,
              description: f.description || '',
            })) || [],
          );

          // Fetch translations
          adminAxios
            .get(`/translations/content/product/${id}`)
            .then((tRes) => {
              if (tRes.data?.translations) {
                setTranslations(tRes.data.translations);
              }
            })
            .catch(() => {});
        })
        .catch(() => message.error('Failed to fetch product'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      if (values.category_id) formData.append('category_id', values.category_id);
      formData.append('description', description || '');
      formData.append('price', values.price);
      if (values.compare_price) formData.append('compare_price', values.compare_price);
      if (values.sku) formData.append('sku', values.sku);
      formData.append('stock', values.stock ?? 0);
      formData.append('is_active', values.is_active ? '1' : '0');
      formData.append('sort_order', values.sort_order ?? 0);

      // Thumbnail
      if (thumbnailList.length > 0) {
        formData.append('thumbnail', thumbnailList[0].originFileObj);
      }

      // Gallery
      galleryList.forEach((file) => {
        formData.append('gallery[]', file.originFileObj);
      });

      // Tags
      (values.tags || []).forEach((tagId) => {
        formData.append('tags[]', tagId);
      });

      // Remove images (edit only)
      removeImageIds.forEach((imgId) => {
        formData.append('remove_images[]', imgId);
      });

      // Variants as JSON fields
      variants.forEach((v, i) => {
        if (v.id) formData.append(`variants[${i}][id]`, v.id);
        formData.append(`variants[${i}][name]`, v.name);
        formData.append(`variants[${i}][sku]`, v.sku || '');
        formData.append(`variants[${i}][price]`, v.price);
        formData.append(`variants[${i}][stock]`, v.stock ?? 0);
        formData.append(`variants[${i}][is_active]`, v.is_active ? '1' : '0');
      });

      // Features
      features.forEach((f, i) => {
        if (f.id) formData.append(`features[${i}][id]`, f.id);
        formData.append(`features[${i}][title]`, f.title);
        formData.append(`features[${i}][description]`, f.description || '');
      });

      let productId = id;
      if (isEdit) {
        formData.append('_method', 'PUT');
        await adminAxios.post(`/products/${id}`, formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });
        message.success('Product updated');
      } else {
        const res = await adminAxios.post('/products', formData, {
          headers: {'Content-Type': 'multipart/form-data'},
        });
        productId = res.data?.id || res.data?.data?.id;
        message.success('Product created');
      }

      // Save translations
      if (productId && Object.keys(translations).length > 0) {
        try {
          await adminAxios.put(`/translations/content/product/${productId}`, {translations});
        } catch {
          message.warning('Product saved but translations failed to save');
        }
      }

      navigate('/products');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        message.error(Object.values(errors)[0]?.[0] || 'Validation failed');
      } else {
        message.error(err.response?.data?.message || 'Failed to save product');
      }
    } finally {
      setLoading(false);
    }
  };

  // Variant helpers
  const addVariant = () => setVariants([...variants, {name: '', sku: '', price: 0, stock: 0, is_active: true}]);
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));
  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index] = {...updated[index], [field]: value};
    setVariants(updated);
  };

  // Feature helpers
  const addFeature = () => setFeatures([...features, {title: '', description: ''}]);
  const removeFeature = (index) => setFeatures(features.filter((_, i) => i !== index));
  const updateFeature = (index, field, value) => {
    const updated = [...features];
    updated[index] = {...updated[index], [field]: value};
    setFeatures(updated);
  };

  // Gallery remove existing
  const removeExistingImage = (imgId) => {
    setRemoveImageIds([...removeImageIds, imgId]);
    setExistingImages(existingImages.filter((img) => img.id !== imgId));
  };

  if (fetching) {
    return (
      <div style={{textAlign: 'center', padding: 80}}>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24}}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')} />
        <Title level={3} style={{margin: 0}}>
          {isEdit ? 'Edit Product' : 'Create Product'}
        </Title>
      </div>

      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{is_active: true, sort_order: 0, stock: 0, price: 0}}
      >
        <Row gutter={24}>
          {/* Left column - Main info */}
          <Col xs={24} lg={16}>
            <Card title='Basic Information' style={{marginBottom: 24}}>
              <Form.Item name='name' label='Product Name' rules={[{required: true, message: 'Please enter product name'}]}>
                <Input placeholder='Product name' />
              </Form.Item>
              <Form.Item label='Description'>
                <JoditEditor
                  ref={descriptionRef}
                  value={description}
                  config={editorConfig}
                  onBlur={(content) => setDescription(content)}
                />
              </Form.Item>
            </Card>

            {/* Translations */}
            <Card title='Translations' style={{marginBottom: 24}}>
              <Tabs
                items={[
                  {
                    key: 'bn',
                    label: 'Bengali (বাংলা)',
                    children: (
                      <>
                        <Form.Item label='Name (বাংলা)'>
                          <Input
                            placeholder='পণ্যের নাম'
                            value={translations.bn?.name || ''}
                            onChange={(e) =>
                              setTranslations((prev) => ({
                                ...prev,
                                bn: {...(prev.bn || {}), name: e.target.value},
                              }))
                            }
                          />
                        </Form.Item>
                        <Form.Item label='Description (বাংলা)'>
                          <JoditEditor
                            value={translations.bn?.description || ''}
                            config={editorConfig}
                            onBlur={(content) =>
                              setTranslations((prev) => ({
                                ...prev,
                                bn: {...(prev.bn || {}), description: content},
                              }))
                            }
                          />
                        </Form.Item>
                      </>
                    ),
                  },
                ]}
              />
            </Card>

            {/* Images */}
            <Card title='Images' style={{marginBottom: 24}}>
              <Form.Item label='Thumbnail'>
                <Upload
                  beforeUpload={() => false}
                  fileList={thumbnailList}
                  onChange={({fileList}) => setThumbnailList(fileList.slice(-1))}
                  accept='image/*'
                  listType='picture-card'
                  maxCount={1}
                >
                  {thumbnailList.length === 0 && (
                    <div>
                      <PlusOutlined />
                      <div style={{marginTop: 8}}>Thumbnail</div>
                    </div>
                  )}
                </Upload>
                {isEdit && !thumbnailList.length && form.getFieldValue('thumbnail_url') && (
                  <Image src={form.getFieldValue('thumbnail_url')} width={100} style={{borderRadius: 4}} />
                )}
              </Form.Item>
              <Form.Item label='Gallery Images'>
                <Upload
                  beforeUpload={() => false}
                  fileList={galleryList}
                  onChange={({fileList}) => setGalleryList(fileList)}
                  accept='image/*'
                  listType='picture-card'
                  multiple
                >
                  <div>
                    <PlusOutlined />
                    <div style={{marginTop: 8}}>Upload</div>
                  </div>
                </Upload>
                {existingImages.length > 0 && (
                  <div style={{marginTop: 12}}>
                    <div style={{marginBottom: 8, fontWeight: 500}}>Current Gallery</div>
                    <Space wrap>
                      {existingImages.map((img) => (
                        <div key={img.id} style={{position: 'relative', display: 'inline-block'}}>
                          <Image src={img.image} width={100} height={100} style={{objectFit: 'cover', borderRadius: 4}} />
                          <Button
                            type='primary'
                            danger
                            size='small'
                            icon={<DeleteOutlined />}
                            onClick={() => removeExistingImage(img.id)}
                            style={{position: 'absolute', top: 4, right: 4}}
                          />
                        </div>
                      ))}
                    </Space>
                  </div>
                )}
              </Form.Item>
            </Card>

            {/* Variants */}
            <Card
              title='Variants'
              style={{marginBottom: 24}}
              extra={
                <Button type='dashed' icon={<PlusOutlined />} onClick={addVariant}>
                  Add Variant
                </Button>
              }
            >
              {variants.length === 0 && (
                <div style={{textAlign: 'center', color: '#999', padding: 16}}>
                  No variants. Click "Add Variant" to add product variations.
                </div>
              )}
              {variants.map((variant, index) => (
                <div key={index}>
                  {index > 0 && <Divider />}
                  <Row gutter={12} align='middle'>
                    <Col xs={24} sm={6}>
                      <Form.Item label={index === 0 ? 'Variant Name' : undefined} style={{marginBottom: 8}}>
                        <Input
                          placeholder='e.g. Red / Large'
                          value={variant.name}
                          onChange={(e) => updateVariant(index, 'name', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Form.Item label={index === 0 ? 'SKU' : undefined} style={{marginBottom: 8}}>
                        <Input
                          placeholder='SKU'
                          value={variant.sku}
                          onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Form.Item label={index === 0 ? 'Price' : undefined} style={{marginBottom: 8}}>
                        <InputNumber
                          min={0}
                          step={0.01}
                          value={variant.price}
                          onChange={(v) => updateVariant(index, 'price', v)}
                          style={{width: '100%'}}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={4}>
                      <Form.Item label={index === 0 ? 'Stock' : undefined} style={{marginBottom: 8}}>
                        <InputNumber
                          min={0}
                          value={variant.stock}
                          onChange={(v) => updateVariant(index, 'stock', v)}
                          style={{width: '100%'}}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={3}>
                      <Form.Item label={index === 0 ? 'Active' : undefined} style={{marginBottom: 8}}>
                        <Switch
                          checked={variant.is_active}
                          onChange={(v) => updateVariant(index, 'is_active', v)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={3}>
                      <Form.Item label={index === 0 ? ' ' : undefined} style={{marginBottom: 8}}>
                        <Button danger icon={<DeleteOutlined />} onClick={() => removeVariant(index)} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card>

            {/* Features */}
            <Card
              title='Features'
              style={{marginBottom: 24}}
              extra={
                <Button type='dashed' icon={<PlusOutlined />} onClick={addFeature}>
                  Add Feature
                </Button>
              }
            >
              {features.length === 0 && (
                <div style={{textAlign: 'center', color: '#999', padding: 16}}>
                  No features. Click "Add Feature" to add product features.
                </div>
              )}
              {features.map((feature, index) => (
                <div key={index}>
                  {index > 0 && <Divider />}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
                    <strong>Feature {index + 1}</strong>
                    <Button danger size='small' icon={<DeleteOutlined />} onClick={() => removeFeature(index)} />
                  </div>
                  <Form.Item label='Feature Title' style={{marginBottom: 8}}>
                    <Input
                      placeholder='Feature title'
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label='Feature Description' style={{marginBottom: 8}}>
                    <JoditEditor
                      value={feature.description}
                      config={featureEditorConfig}
                      onBlur={(content) => updateFeature(index, 'description', content)}
                    />
                  </Form.Item>
                </div>
              ))}
            </Card>
          </Col>

          {/* Right column - Sidebar */}
          <Col xs={24} lg={8}>
            <Card title='Pricing & Stock' style={{marginBottom: 24}}>
              <Form.Item name='price' label='Price' rules={[{required: true, message: 'Please enter price'}]}>
                <InputNumber min={0} step={0.01} prefix='৳' style={{width: '100%'}} />
              </Form.Item>
              <Form.Item name='compare_price' label='Compare at Price'>
                <InputNumber min={0} step={0.01} prefix='৳' style={{width: '100%'}} />
              </Form.Item>
              <Form.Item name='sku' label='SKU'>
                <Input placeholder='Stock Keeping Unit' />
              </Form.Item>
              <Form.Item name='stock' label='Stock Quantity'>
                <InputNumber min={0} style={{width: '100%'}} />
              </Form.Item>
            </Card>

            <Card title='Organization' style={{marginBottom: 24}}>
              <Form.Item name='category_id' label='Category'>
                <Select
                  placeholder='Select category'
                  allowClear
                  showSearch
                  optionFilterProp='label'
                  options={categories.map((c) => ({value: c.id, label: c.name}))}
                />
              </Form.Item>
              <Form.Item name='tags' label='Tags'>
                <Select
                  mode='multiple'
                  placeholder='Select tags'
                  allowClear
                  showSearch
                  optionFilterProp='label'
                  options={tagsOptions.map((t) => ({value: t.id, label: t.name}))}
                />
              </Form.Item>
              <Form.Item name='sort_order' label='Sort Order'>
                <InputNumber min={0} style={{width: '100%'}} />
              </Form.Item>
              <Form.Item name='is_active' label='Active' valuePropName='checked'>
                <Switch />
              </Form.Item>
            </Card>

            <Card>
              <Space style={{width: '100%'}} direction='vertical'>
                <Button type='primary' htmlType='submit' loading={loading} block size='large'>
                  {isEdit ? 'Update Product' : 'Create Product'}
                </Button>
                <Button block onClick={() => navigate('/products')}>
                  Cancel
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ProductForm;
