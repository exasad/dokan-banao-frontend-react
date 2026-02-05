import {useState, useEffect} from 'react';
import {
  Card,
  Typography,
  Descriptions,
  Tag,
  Table,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  message,
  Spin,
  InputNumber,
  Divider,
} from 'antd';
import {ArrowLeftOutlined, ExperimentOutlined} from '@ant-design/icons';
import {useParams, useNavigate} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';

const {Title} = Typography;

const statusColors = {
  active: 'green',
  suspended: 'orange',
  inactive: 'red',
  expired: 'default',
};

const invoiceStatusColors = {
  paid: 'green',
  pending: 'gold',
  partial: 'blue',
  overdue: 'red',
  cancelled: 'default',
};

const TenantDetail = () => {
  const [tenant, setTenant] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slidersCount, setSlidersCount] = useState(3);
  const [categoriesCount, setCategoriesCount] = useState(5);
  const [productsCount, setProductsCount] = useState(20);
  const [generating, setGenerating] = useState(false);
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tenantRes, statsRes] = await Promise.all([
          superadminAxios.get(`/tenants/${id}`),
          superadminAxios.get(`/tenants/${id}/stats`),
        ]);
        setTenant(tenantRes.data);
        setStats(statsRes.data);
      } catch {
        message.error('Failed to fetch tenant details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;
  if (!tenant) return null;

  const invoiceColumns = [
    {title: 'Invoice #', dataIndex: 'invoice_number', key: 'invoice_number'},
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (v) => `$${parseFloat(v).toFixed(2)}`,
    },
    {
      title: 'Paid',
      dataIndex: 'paid_amount',
      key: 'paid_amount',
      render: (v) => `$${parseFloat(v).toFixed(2)}`,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (v) => `$${parseFloat(v).toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={invoiceStatusColors[s]}>{s}</Tag>,
    },
    {title: 'Due Date', dataIndex: 'due_date', key: 'due_date'},
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          size='small'
          onClick={() => navigate(`/superadmin/invoices/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space style={{marginBottom: 16}}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/superadmin/tenants')}
        >
          Back
        </Button>
      </Space>
      <Title level={3} style={{marginBottom: 24}}>
        {tenant.name}
      </Title>

      {stats && (
        <Row gutter={[16, 16]} style={{marginBottom: 24}}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic title='Total Invoices' value={stats.total_invoices} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic title='Total Revenue' value={stats.total_revenue} prefix='$' precision={2} valueStyle={{color: '#52c41a'}} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic title='Pending Amount' value={stats.pending_amount} prefix='$' precision={2} valueStyle={{color: '#faad14'}} />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic title='Overdue Invoices' value={stats.overdue_invoices} valueStyle={{color: '#ff4d4f'}} />
            </Card>
          </Col>
        </Row>
      )}

      <Card
        style={{
          marginBottom: 24,
        }}
        title='Tenant Details'
      >
        <Descriptions column={{xs: 1, sm: 2}}>
          <Descriptions.Item label='Email'>{tenant.email}</Descriptions.Item>
          <Descriptions.Item label='Domain'>{tenant.domain || '-'}</Descriptions.Item>
          <Descriptions.Item label='Plan'>{tenant.plan?.name}</Descriptions.Item>
          <Descriptions.Item label='Status'>
            <Tag color={statusColors[tenant.status]}>{tenant.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Trial Ends'>
            {tenant.trial_ends_at ? new Date(tenant.trial_ends_at).toLocaleDateString() : '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Subscription Start'>
            {tenant.subscription_starts_at ? new Date(tenant.subscription_starts_at).toLocaleDateString() : '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Subscription End'>
            {tenant.subscription_ends_at ? new Date(tenant.subscription_ends_at).toLocaleDateString() : '-'}
          </Descriptions.Item>
          <Descriptions.Item label='Created'>
            {new Date(tenant.created_at).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={<><ExperimentOutlined /> Generate Dummy Data</>}
        style={{marginBottom: 24}}
      >
        <p style={{color: '#666', marginBottom: 16}}>
          Generate dummy sliders, categories and products for this tenant to test the storefront.
        </p>
        <Row gutter={16} align='middle'>
          <Col>
            <span style={{marginRight: 8}}>Sliders:</span>
            <InputNumber
              min={0}
              max={10}
              value={slidersCount}
              onChange={(v) => setSlidersCount(v)}
              style={{width: 100}}
            />
          </Col>
          <Col>
            <span style={{marginRight: 8}}>Categories:</span>
            <InputNumber
              min={0}
              max={50}
              value={categoriesCount}
              onChange={(v) => setCategoriesCount(v)}
              style={{width: 100}}
            />
          </Col>
          <Col>
            <span style={{marginRight: 8}}>Products:</span>
            <InputNumber
              min={0}
              max={200}
              value={productsCount}
              onChange={(v) => setProductsCount(v)}
              style={{width: 100}}
            />
          </Col>
          <Col>
            <Button
              type='primary'
              loading={generating}
              onClick={async () => {
                setGenerating(true);
                try {
                  const {data} = await superadminAxios.post(`/tenants/${id}/generate-dummy-data`, {
                    sliders_count: slidersCount,
                    categories_count: categoriesCount,
                    products_count: productsCount,
                  });
                  message.success(data.message);
                } catch (err) {
                  message.error(err.response?.data?.message || 'Failed to generate dummy data');
                } finally {
                  setGenerating(false);
                }
              }}
            >
              Generate
            </Button>
          </Col>
        </Row>
      </Card>

      <Card
        title='Invoice History'
      >
        <Table
          columns={invoiceColumns}
          dataSource={tenant.invoices || []}
          rowKey='id'
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default TenantDetail;
