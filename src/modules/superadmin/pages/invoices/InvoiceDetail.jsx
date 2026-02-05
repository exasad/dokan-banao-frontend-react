import {useState, useEffect} from 'react';
import {
  Card,
  Typography,
  Descriptions,
  Tag,
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Timeline,
  Spin,
} from 'antd';
import {
  ArrowLeftOutlined,
  DollarOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import {useParams, useNavigate} from 'react-router-dom';
import superadminAxios from '../../services/superadminAxios';
import RecordPaymentModal from './RecordPaymentModal';

const {Title} = Typography;

const statusColors = {
  paid: 'green',
  pending: 'gold',
  partial: 'blue',
  overdue: 'red',
  cancelled: 'default',
};

const InvoiceDetail = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(false);
  const {id} = useParams();
  const navigate = useNavigate();

  const fetchInvoice = async () => {
    try {
      const res = await superadminAxios.get(`/invoices/${id}`);
      setInvoice(res.data);
    } catch {
      message.error('Failed to fetch invoice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const handleCancel = async () => {
    try {
      await superadminAxios.patch(`/invoices/${id}/cancel`);
      message.success('Invoice cancelled');
      fetchInvoice();
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await superadminAxios.get(`/invoices/${id}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoice.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      message.error('Failed to download PDF');
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: 80}}><Spin size='large' /></div>;
  if (!invoice) return null;

  const canPay = !['paid', 'cancelled'].includes(invoice.status);
  const canCancel = invoice.status !== 'paid' && invoice.status !== 'cancelled';

  return (
    <div>
      <Space style={{marginBottom: 16}}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/superadmin/invoices')}>
          Back
        </Button>
      </Space>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
        <Title level={3} style={{margin: 0}}>
          Invoice {invoice.invoice_number}
        </Title>
        <Space>
          <Button icon={<FilePdfOutlined />} onClick={handleDownloadPdf}>
            Download PDF
          </Button>
          {canPay && (
            <Button
              type='primary'
              icon={<DollarOutlined />}
              onClick={() => setPaymentModal(true)}
            >
              Record Payment
            </Button>
          )}
          {canCancel && (
            <Popconfirm title='Cancel this invoice?' onConfirm={handleCancel}>
              <Button danger icon={<CloseCircleOutlined />}>
                Cancel Invoice
              </Button>
            </Popconfirm>
          )}
        </Space>
      </div>

      <Card
        style={{
          marginBottom: 24,
        }}
        title='Invoice Details'
      >
        <Descriptions column={{xs: 1, sm: 2}}>
          <Descriptions.Item label='Tenant'>{invoice.tenant?.name}</Descriptions.Item>
          <Descriptions.Item label='Tenant Email'>{invoice.tenant?.email}</Descriptions.Item>
          <Descriptions.Item label='Plan'>{invoice.tenant?.plan?.name}</Descriptions.Item>
          <Descriptions.Item label='Status'>
            <Tag color={statusColors[invoice.status]}>{invoice.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label='Amount'>${parseFloat(invoice.amount).toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label='Tax'>${parseFloat(invoice.tax).toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label='Discount'>${parseFloat(invoice.discount).toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label='Total'><strong>${parseFloat(invoice.total).toFixed(2)}</strong></Descriptions.Item>
          <Descriptions.Item label='Advance'>${parseFloat(invoice.advance_amount).toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label='Paid'>${parseFloat(invoice.paid_amount).toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label='Balance'>
            <strong style={{color: parseFloat(invoice.balance) > 0 ? '#faad14' : '#52c41a'}}>
              ${parseFloat(invoice.balance).toFixed(2)}
            </strong>
          </Descriptions.Item>
          <Descriptions.Item label='Due Date'>{invoice.due_date}</Descriptions.Item>
          {invoice.paid_at && (
            <Descriptions.Item label='Paid At'>
              {new Date(invoice.paid_at).toLocaleString()}
            </Descriptions.Item>
          )}
          {invoice.notes && (
            <Descriptions.Item label='Notes' span={2}>{invoice.notes}</Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card
        title='Payment History'
      >
        {invoice.payments?.length > 0 ? (
          <Timeline
            items={invoice.payments.map((p) => ({
              color: 'green',
              children: (
                <div>
                  <strong>${parseFloat(p.amount).toFixed(2)}</strong>
                  {' via '}
                  {p.payment_method.replace('_', ' ')}
                  {p.reference && ` (Ref: ${p.reference})`}
                  <br />
                  <span style={{fontSize: 12, opacity: 0.65}}>
                    {new Date(p.paid_at).toLocaleString()}
                  </span>
                  {p.notes && <div style={{fontSize: 12, opacity: 0.65}}>{p.notes}</div>}
                </div>
              ),
            }))}
          />
        ) : (
          <div style={{textAlign: 'center', padding: 24, opacity: 0.65}}>
            No payments recorded yet
          </div>
        )}
      </Card>

      <RecordPaymentModal
        open={paymentModal}
        invoice={invoice}
        onClose={() => setPaymentModal(false)}
        onSuccess={() => {
          setPaymentModal(false);
          fetchInvoice();
        }}
      />
    </div>
  );
};

export default InvoiceDetail;
