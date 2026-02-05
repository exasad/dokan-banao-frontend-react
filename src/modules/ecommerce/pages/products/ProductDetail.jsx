import {useState, useEffect} from 'react';
import {
  Typography,
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Spin,
  Row,
  Col,
  Image,
  Table,
  Divider,
  Tabs,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {useNavigate, useParams} from 'react-router-dom';
import adminAxios from '../../services/adminAxios';

const {Title, Text} = Typography;

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {id} = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await adminAxios.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: 80}}>
        <Spin size='large' />
      </div>
    );
  }

  if (!product) return null;

  const variantColumns = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'SKU', dataIndex: 'sku', key: 'sku', render: (v) => v || '-'},
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (v) => `৳${parseFloat(v).toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (v) => (
        <Tag color={v > 0 ? 'green' : 'red'}>{v > 0 ? v : 'Out of stock'}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'gallery',
      label: `Gallery (${product.images?.length || 0})`,
      children: (
        <div>
          {product.images?.length > 0 ? (
            <Image.PreviewGroup>
              <Space wrap size={12}>
                {product.images.map((img) => (
                  <Image
                    key={img.id}
                    src={img.image}
                    width={150}
                    height={150}
                    style={{objectFit: 'cover', borderRadius: 8}}
                  />
                ))}
              </Space>
            </Image.PreviewGroup>
          ) : (
            <Text type='secondary'>No gallery images</Text>
          )}
        </div>
      ),
    },
    {
      key: 'variants',
      label: `Variants (${product.variants?.length || 0})`,
      children: (
        <div>
          {product.variants?.length > 0 ? (
            <Table
              columns={variantColumns}
              dataSource={product.variants}
              rowKey='id'
              pagination={false}
              size='small'
            />
          ) : (
            <Text type='secondary'>No variants</Text>
          )}
        </div>
      ),
    },
    {
      key: 'features',
      label: `Features (${product.features?.length || 0})`,
      children: (
        <div>
          {product.features?.length > 0 ? (
            product.features.map((feature, index) => (
              <div key={feature.id}>
                {index > 0 && <Divider />}
                <Title level={5} style={{marginBottom: 8}}>{feature.title}</Title>
                {feature.description ? (
                  <div dangerouslySetInnerHTML={{__html: feature.description}} />
                ) : (
                  <Text type='secondary'>No description</Text>
                )}
              </div>
            ))
          ) : (
            <Text type='secondary'>No features</Text>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')} />
          <Title level={3} style={{margin: 0}}>{product.name}</Title>
          <Tag color={product.is_active ? 'green' : 'red'}>
            {product.is_active ? 'Active' : 'Inactive'}
          </Tag>
        </Space>
        <Button
          type='primary'
          icon={<EditOutlined />}
          onClick={() => navigate(`/products/${product.id}/edit`)}
        >
          Edit Product
        </Button>
      </div>

      <Row gutter={24}>
        {/* Left column */}
        <Col xs={24} lg={16}>
          {/* Thumbnail & basic info */}
          <Card style={{marginBottom: 24}}>
            <Row gutter={24}>
              <Col xs={24} sm={8}>
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    width='100%'
                    style={{borderRadius: 8, maxHeight: 250, objectFit: 'cover'}}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: 200,
                      background: '#f5f5f5',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text type='secondary'>No thumbnail</Text>
                  </div>
                )}
              </Col>
              <Col xs={24} sm={16}>
                <Descriptions column={2} size='small'>
                  <Descriptions.Item label='Price'>
                    <Text strong style={{fontSize: 18}}>৳{parseFloat(product.price).toFixed(2)}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label='Compare Price'>
                    {product.compare_price ? (
                      <Text delete type='secondary'>৳{parseFloat(product.compare_price).toFixed(2)}</Text>
                    ) : '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label='SKU'>{product.sku || '-'}</Descriptions.Item>
                  <Descriptions.Item label='Stock'>
                    <Tag color={product.stock > 0 ? 'green' : 'red'}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label='Category'>
                    {product.category?.name || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label='Sort Order'>{product.sort_order}</Descriptions.Item>
                  <Descriptions.Item label='Slug'>{product.slug}</Descriptions.Item>
                  <Descriptions.Item label='Created'>
                    {new Date(product.created_at).toLocaleDateString()}
                  </Descriptions.Item>
                </Descriptions>
                {product.tags?.length > 0 && (
                  <div style={{marginTop: 12}}>
                    <Text type='secondary' style={{marginRight: 8}}>Tags:</Text>
                    {product.tags.map((tag) => (
                      <Tag key={tag.id} color='blue'>{tag.name}</Tag>
                    ))}
                  </div>
                )}
              </Col>
            </Row>
          </Card>

          {/* Description */}
          <Card title='Description' style={{marginBottom: 24}}>
            {product.description ? (
              <div dangerouslySetInnerHTML={{__html: product.description}} />
            ) : (
              <Text type='secondary'>No description</Text>
            )}
          </Card>

          {/* Tabs: Gallery, Variants, Features */}
          <Card>
            <Tabs items={tabItems} />
          </Card>
        </Col>

        {/* Right column - Stock summary */}
        <Col xs={24} lg={8}>
          <Card title='Stock Summary' style={{marginBottom: 24}}>
            <Descriptions column={1} size='small'>
              <Descriptions.Item label='Product Stock'>
                <Tag color={product.stock > 0 ? 'green' : 'red'}>{product.stock}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label='Total Variants'>
                {product.variants?.length || 0}
              </Descriptions.Item>
              <Descriptions.Item label='Total Variant Stock'>
                {product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0}
              </Descriptions.Item>
              <Descriptions.Item label='Gallery Images'>
                {product.images?.length || 0}
              </Descriptions.Item>
              <Descriptions.Item label='Features'>
                {product.features?.length || 0}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {product.variants?.length > 0 && (
            <Card title='Variant Stock Breakdown'>
              {product.variants.map((v) => (
                <div
                  key={v.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <Text>{v.name}</Text>
                  <Tag color={v.stock > 0 ? 'green' : 'red'}>{v.stock}</Tag>
                </div>
              ))}
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
