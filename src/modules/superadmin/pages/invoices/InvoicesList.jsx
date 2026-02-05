import {useState, useEffect, useCallback} from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Typography,
  message,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  DownOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
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

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState(null);
  const navigate = useNavigate();

  const fetchInvoices = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await superadminAxios.get('/invoices', {params});
      setInvoices(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) return;
    try {
      await superadminAxios.post('/invoices/bulk-action', {
        ids: selectedRowKeys,
        action,
      });
      message.success(`${selectedRowKeys.length} invoice(s) ${action}led`);
      setSelectedRowKeys([]);
      fetchInvoices(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err.response?.data?.message || `Failed to ${action}`);
    }
  };

  const openPaymentModal = (invoice) => {
    setPaymentInvoice(invoice);
    setPaymentModal(true);
  };

  const bulkMenuItems = {
    items: [
      {key: 'cancel', label: 'Cancel'},
      {type: 'divider'},
      {key: 'delete', label: 'Delete', danger: true},
    ],
    onClick: ({key}) => handleBulkAction(key),
  };

  const columns = [
    {title: 'Invoice #', dataIndex: 'invoice_number', key: 'invoice_number'},
    {title: 'Tenant', dataIndex: ['tenant', 'name'], key: 'tenant'},
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
      render: (v) => {
        const bal = parseFloat(v);
        return (
          <span style={{color: bal > 0 ? '#faad14' : '#52c41a', fontWeight: 500}}>
            ${bal.toFixed(2)}
          </span>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={statusColors[s]}>{s}</Tag>,
    },
    {title: 'Due Date', dataIndex: 'due_date', key: 'due_date'},
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size='small'
            onClick={() => navigate(`/superadmin/invoices/${record.id}`)}
          >
            View
          </Button>
          {!['paid', 'cancelled'].includes(record.status) && (
            <Button
              icon={<DollarOutlined />}
              size='small'
              type='primary'
              ghost
              onClick={() => openPaymentModal(record)}
            >
              Pay
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>Invoices</Title>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => navigate('/superadmin/invoices/create')}
        >
          Create Invoice
        </Button>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Space>
          <Input
            placeholder='Search invoices...'
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{width: 250}}
            allowClear
          />
          <Select
            placeholder='Status'
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            style={{width: 140}}
            options={[
              {value: 'pending', label: 'Pending'},
              {value: 'paid', label: 'Paid'},
              {value: 'partial', label: 'Partial'},
              {value: 'overdue', label: 'Overdue'},
              {value: 'cancelled', label: 'Cancelled'},
            ]}
          />
        </Space>
        {selectedRowKeys.length > 0 && (
          <Dropdown menu={bulkMenuItems}>
            <Button>
              Bulk Actions ({selectedRowKeys.length}) <DownOutlined />
            </Button>
          </Dropdown>
        )}
      </div>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={invoices}
        rowKey='id'
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchInvoices(page, pageSize),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} invoices`,
        }}
      />

      <RecordPaymentModal
        open={paymentModal}
        invoice={paymentInvoice}
        onClose={() => {
          setPaymentModal(false);
          setPaymentInvoice(null);
        }}
        onSuccess={() => {
          setPaymentModal(false);
          setPaymentInvoice(null);
          fetchInvoices(pagination.current, pagination.pageSize);
        }}
      />
    </div>
  );
};

export default InvoicesList;
