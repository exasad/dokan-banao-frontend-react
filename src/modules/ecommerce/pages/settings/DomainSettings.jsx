import {useState, useEffect} from 'react';
import {
  Typography, Card, Form, Input, Button, message, Spin, Row, Col,
  Space, Alert, Table, Tag, Modal, Tooltip, Steps,
} from 'antd';
import {
  ArrowLeftOutlined, PlusOutlined, GlobalOutlined, CheckCircleOutlined,
  CloseCircleOutlined, LoadingOutlined, DeleteOutlined, StarOutlined,
  StarFilled, ReloadOutlined, CopyOutlined, CloudOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import adminAxios from '../../services/adminAxios';

const {Title, Text, Paragraph} = Typography;

const DomainSettings = () => {
  const [domains, setDomains] = useState([]);
  const [cnameTarget, setCnameTarget] = useState('');
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [verifying, setVerifying] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchDomains = async () => {
    try {
      const res = await adminAxios.get('/settings/domains');
      setDomains(res.data.domains || []);
      setCnameTarget(res.data.cname_target || '');
    } catch {
      message.error('Failed to load domains');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleAdd = async () => {
    const values = await form.validateFields();
    setAdding(true);
    try {
      await adminAxios.post('/settings/domains', values);
      message.success('Domain added successfully');
      form.resetFields();
      setAddModalOpen(false);
      fetchDomains();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.domain?.[0] || 'Failed to add domain';
      message.error(msg);
    } finally {
      setAdding(false);
    }
  };

  const handleVerify = async (id) => {
    setVerifying(id);
    try {
      const res = await adminAxios.post(`/settings/domains/${id}/verify`);
      message.success(res.data.message);
      fetchDomains();
    } catch (err) {
      message.error(err.response?.data?.message || 'Verification failed');
      fetchDomains();
    } finally {
      setVerifying(null);
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await adminAxios.post(`/settings/domains/${id}/primary`);
      message.success('Primary domain updated');
      fetchDomains();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update primary domain');
    }
  };

  const handleDelete = (id, domain, isPrimary) => {
    Modal.confirm({
      title: 'Delete Domain',
      content: isPrimary
        ? `Are you sure you want to remove "${domain}"? This is your primary domain. Another domain will be set as primary automatically, or your storefront will have no custom domain.`
        : `Are you sure you want to remove "${domain}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await adminAxios.delete(`/settings/domains/${id}`);
          message.success('Domain deleted');
          fetchDomains();
        } catch (err) {
          message.error(err.response?.data?.message || 'Failed to delete domain');
        }
      },
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard');
  };

  const columns = [
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
      render: (domain, record) => (
        <Space>
          <GlobalOutlined />
          <Text strong>{domain}</Text>
          {record.is_primary && <Tag color="gold"><StarFilled /> Primary</Tag>}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => {
        const config = {
          pending: {color: 'orange', icon: <LoadingOutlined />, text: 'Pending'},
          active: {color: 'green', icon: <CheckCircleOutlined />, text: 'Active'},
          failed: {color: 'red', icon: <CloseCircleOutlined />, text: 'Failed'},
        };
        const c = config[status] || config.pending;
        return (
          <Tooltip title={record.verification_error}>
            <Tag color={c.color} icon={c.icon}>{c.text}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'SSL',
      dataIndex: 'ssl_enabled',
      key: 'ssl',
      width: 80,
      render: (ssl) => ssl ? (
        <Tag color="green" icon={<SafetyCertificateOutlined />}>SSL</Tag>
      ) : (
        <Tag>No SSL</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          {record.status !== 'active' && (
            <Tooltip title="Verify DNS">
              <Button
                size="small"
                icon={verifying === record.id ? <LoadingOutlined /> : <ReloadOutlined />}
                onClick={() => handleVerify(record.id)}
                loading={verifying === record.id}
              >
                Verify
              </Button>
            </Tooltip>
          )}
          {record.status === 'active' && !record.is_primary && (
            <Tooltip title="Set as primary">
              <Button
                size="small"
                icon={<StarOutlined />}
                onClick={() => handleSetPrimary(record.id)}
              >
                Primary
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id, record.domain, record.is_primary)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (loading) {
    return <div style={{textAlign: 'center', padding: 80}}><Spin size="large" /></div>;
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12}}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/settings')} />
          <Title level={3} style={{margin: 0}}><GlobalOutlined style={{marginRight: 8}} />Storefront Domain</Title>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)} size="large">
          Add Domain
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Domain List */}
        <Col xs={24} lg={14}>
          <Card title="Your Domains" style={{marginBottom: 24}}>
            {domains.length === 0 ? (
              <Alert
                type="info"
                showIcon
                message="No custom domains configured"
                description="Add a custom domain to use your own branded URL for your storefront."
              />
            ) : (
              <Table
                dataSource={domains}
                columns={columns}
                rowKey="id"
                pagination={false}
                size="middle"
                scroll={{ x: 'max-content' }}
              />
            )}
          </Card>

          {/* DNS Configuration */}
          <Card title={<><CloudOutlined style={{marginRight: 8}} />DNS Configuration (CNAME)</>}>
            <Alert
              type="warning"
              showIcon
              style={{marginBottom: 16}}
              message="Important"
              description="After adding a domain, you must configure a CNAME record with your domain provider (Cloudflare recommended)."
            />

            <Paragraph>Add a CNAME record pointing to our platform:</Paragraph>

            <div style={{background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 16}}>
              <Text strong>CNAME Record Configuration</Text>
              <div style={{marginTop: 12}}>
                <table style={{width: '100%', fontSize: 13}}>
                  <tbody>
                    <tr>
                      <td style={{padding: '6px 0', width: 80}}><Text type="secondary">Type:</Text></td>
                      <td><Text code>CNAME</Text></td>
                    </tr>
                    <tr>
                      <td style={{padding: '6px 0'}}><Text type="secondary">Name:</Text></td>
                      <td><Text code>@</Text> <Text type="secondary">(for root domain)</Text></td>
                    </tr>
                    <tr>
                      <td style={{padding: '6px 0'}}><Text type="secondary">Target:</Text></td>
                      <td style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <Text code>{cnameTarget || 'platform.example.com'}</Text>
                        {cnameTarget && (
                          <Button size="small" icon={<CopyOutlined />} onClick={() => copyToClipboard(cnameTarget)}>
                            Copy
                          </Button>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td style={{padding: '6px 0'}}><Text type="secondary">Proxy:</Text></td>
                      <td><Tag color="orange">Proxied</Tag> <Text type="secondary">(orange cloud ON)</Text></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Alert
              type="info"
              showIcon
              message="Root Domain CNAME (CNAME Flattening)"
              description="Cloudflare supports CNAME records for root domains (@) through CNAME Flattening. This allows you to use your main domain (example.com) without a subdomain."
              style={{marginBottom: 0}}
            />
          </Card>
        </Col>

        {/* Right Column - Cloudflare Guide */}
        <Col xs={24} lg={10}>
          <Card
            title={<><img src="https://www.cloudflare.com/favicon.ico" alt="Cloudflare" style={{width: 16, height: 16, marginRight: 8}} />Cloudflare Setup Guide</>}
            style={{marginBottom: 24}}
          >
            <Steps
              direction="vertical"
              size="small"
              current={-1}
              items={[
                {
                  title: 'Log in to Cloudflare',
                  description: (
                    <Text type="secondary" style={{fontSize: 13}}>
                      Go to <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer">dash.cloudflare.com</a> and select your domain.
                    </Text>
                  ),
                },
                {
                  title: 'Go to DNS Settings',
                  description: (
                    <Text type="secondary" style={{fontSize: 13}}>
                      Click on "DNS" in the left sidebar to manage DNS records.
                    </Text>
                  ),
                },
                {
                  title: 'Add CNAME Record',
                  description: (
                    <div style={{fontSize: 13}}>
                      <Text type="secondary">Click "Add record" and configure:</Text>
                      <ul style={{margin: '4px 0', paddingLeft: 20, color: '#666'}}>
                        <li>Type: <Text code>CNAME</Text></li>
                        <li>Name: <Text code>@</Text> (root domain)</li>
                        <li>Target: <Text code>{cnameTarget || 'platform.example.com'}</Text></li>
                        <li>Proxy status: <Text code>Proxied</Text> (orange cloud)</li>
                      </ul>
                    </div>
                  ),
                },
                {
                  title: 'Enable SSL/TLS',
                  description: (
                    <div style={{fontSize: 13}}>
                      <Text type="secondary">Go to SSL/TLS settings and set mode to:</Text>
                      <ul style={{margin: '4px 0', paddingLeft: 20, color: '#666'}}>
                        <li><Text strong>Full</Text> - Recommended</li>
                        <li>Enable "Always Use HTTPS"</li>
                      </ul>
                    </div>
                  ),
                },
                {
                  title: 'Verify Domain',
                  description: (
                    <Text type="secondary" style={{fontSize: 13}}>
                      Wait 1-5 minutes for DNS propagation, then click "Verify" on your domain.
                    </Text>
                  ),
                },
              ]}
            />
          </Card>

          {/* SSL Benefits */}
          <Card title={<><SafetyCertificateOutlined style={{marginRight: 8}} />SSL Benefits</>} size="small" style={{marginBottom: 24}}>
            <Space direction="vertical" size={8} style={{width: '100%'}}>
              <Text style={{fontSize: 13}}><CheckCircleOutlined style={{marginRight: 6, color: '#52c41a'}} />Free SSL certificate via Cloudflare</Text>
              <Text style={{fontSize: 13}}><CheckCircleOutlined style={{marginRight: 6, color: '#52c41a'}} />Automatic HTTPS redirection</Text>
              <Text style={{fontSize: 13}}><CheckCircleOutlined style={{marginRight: 6, color: '#52c41a'}} />DDoS protection included</Text>
              <Text style={{fontSize: 13}}><CheckCircleOutlined style={{marginRight: 6, color: '#52c41a'}} />Improved SEO rankings</Text>
              <Text style={{fontSize: 13}}><CheckCircleOutlined style={{marginRight: 6, color: '#52c41a'}} />Customer trust & security</Text>
            </Space>
          </Card>

          {/* Troubleshooting */}
          <Card title="Troubleshooting" size="small">
            <Space direction="vertical" size={12} style={{width: '100%'}}>
              <div>
                <Tag color="red">Verification Failed</Tag>
                <Text style={{fontSize: 13, display: 'block', marginTop: 4}}>
                  DNS changes can take up to 48 hours to propagate. Try again later or check your CNAME settings.
                </Text>
              </div>
              <div>
                <Tag color="orange">SSL Error</Tag>
                <Text style={{fontSize: 13, display: 'block', marginTop: 4}}>
                  Ensure Cloudflare SSL mode is set to "Full". Avoid "Flexible" mode.
                </Text>
              </div>
              <div>
                <Tag color="blue">Too Many Redirects</Tag>
                <Text style={{fontSize: 13, display: 'block', marginTop: 4}}>
                  Disable "Always Use HTTPS" temporarily, or check for redirect loops in your app.
                </Text>
              </div>
              <div>
                <Tag color="purple">CNAME Not Found</Tag>
                <Text style={{fontSize: 13, display: 'block', marginTop: 4}}>
                  Make sure the CNAME record is set with Proxy status ON (orange cloud).
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Add Domain Modal */}
      <Modal
        title={<><GlobalOutlined style={{marginRight: 8}} />Add Custom Domain</>}
        open={addModalOpen}
        onCancel={() => {setAddModalOpen(false); form.resetFields();}}
        onOk={handleAdd}
        confirmLoading={adding}
        okText="Add Domain"
      >
        <Form form={form} layout="vertical" style={{marginTop: 16}}>
          <Form.Item
            name="domain"
            label="Domain Name"
            rules={[
              {required: true, message: 'Please enter a domain'},
              {pattern: /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, message: 'Enter a valid domain (e.g., example.com)'},
            ]}
            extra="Enter your domain without http:// or https://"
          >
            <Input
              prefix={<GlobalOutlined />}
              placeholder="example.com"
              size="large"
            />
          </Form.Item>
        </Form>

        <Alert
          type="info"
          showIcon
          message="After adding, configure a CNAME record in Cloudflare"
          style={{marginTop: 8}}
        />
      </Modal>
    </div>
  );
};

export default DomainSettings;
