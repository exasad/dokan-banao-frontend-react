import {useState, useEffect, useCallback} from 'react';
import {Table, Input, Tag, Typography, message, Space} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import affiliateAxios from '../../services/affiliateAxios';

const {Title} = Typography;

const statusColors = {
  active: 'green',
  inactive: 'red',
  expired: 'default',
};

const MyCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');

  const fetchCoupons = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      const res = await affiliateAxios.get('/coupons', {params});
      setCoupons(res.data.data);
      setPagination({
        current: res.data.current_page,
        pageSize: res.data.per_page,
        total: res.data.total,
      });
    } catch {
      message.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const columns = [
    {
      title: 'Code',
      dataIndex: ['coupon', 'code'],
      key: 'code',
      render: (code) => <strong>{code}</strong>,
    },
    {
      title: 'Type',
      dataIndex: ['coupon', 'type'],
      key: 'type',
      render: (type) => (type ? type.charAt(0).toUpperCase() + type.slice(1) : '-'),
    },
    {
      title: 'Value',
      dataIndex: ['coupon', 'value'],
      key: 'value',
      render: (value, record) => {
        const type = record?.coupon?.type;
        if (type === 'percentage') return `${value}%`;
        return `$${parseFloat(value || 0).toFixed(2)}`;
      },
    },
    {
      title: 'Status',
      dataIndex: ['coupon', 'status'],
      key: 'status',
      render: (s) => <Tag color={statusColors[s]}>{s}</Tag>,
    },
    {
      title: 'Commission Rate',
      key: 'commission_rate',
      render: (_, record) => {
        const rate = record.custom_commission_rate || record.default_commission_rate;
        if (!rate) return '-';
        return `${rate}%`;
      },
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}>My Coupons</Title>
      </div>
      <div style={{marginBottom: 16}}>
        <Space>
          <Input
            placeholder='Search by code...'
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{width: 250}}
            allowClear
          />
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={coupons}
        rowKey='id'
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => fetchCoupons(page, pageSize),
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} coupons`,
        }}
      />
    </div>
  );
};

export default MyCoupons;
