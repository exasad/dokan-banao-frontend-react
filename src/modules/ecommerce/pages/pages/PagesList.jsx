import {useState, useEffect, useCallback} from 'react';
import {Table, Button, Input, Space, Tag, Typography, message, Popconfirm} from 'antd';
import {PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FileOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import adminAxios from '../../services/adminAxios';
import {useNavigate} from 'react-router-dom';

const {Title} = Typography;

const PagesList = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});

  const fetchPages = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const res = await adminAxios.get('/pages', {params: {page, per_page: perPage}});
      setPages(res.data.data);
      setPagination({current: res.data.current_page, pageSize: res.data.per_page, total: res.data.total});
    } catch { message.error('Failed to fetch pages'); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const handleDelete = async (id) => {
    try { await adminAxios.delete(`/pages/${id}`); message.success('Page deleted'); fetchPages(pagination.current, pagination.pageSize); }
    catch { message.error('Failed'); }
  };

  const columns = [
    {title: 'Title', dataIndex: 'title', key: 'title', ellipsis: true},
    {title: 'Slug', dataIndex: 'slug', key: 'slug', width: 200},
    {title: 'Active', dataIndex: 'is_active', key: 'active', width: 80, render: (v) => v ? <Tag color='green'>Yes</Tag> : <Tag color='red'>No</Tag>},
    {title: 'Updated', dataIndex: 'updated_at', key: 'updated', width: 120, render: (v) => dayjs(v).format('DD MMM YY')},
    {
      title: 'Actions', key: 'actions', width: 120,
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size='small' onClick={() => navigate(`/pages/${r.id}/edit`)} />
          <Popconfirm title='Delete?' onConfirm={() => handleDelete(r.id)}><Button icon={<DeleteOutlined />} size='small' danger /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}><FileOutlined style={{marginRight: 8}} />Pages</Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => navigate('/pages/create')}>New Page</Button>
      </div>
      <Table columns={columns} dataSource={pages} rowKey='id' loading={loading}
        pagination={{...pagination, onChange: (p, ps) => fetchPages(p, ps), showSizeChanger: true, showTotal: (t) => `Total ${t}`}}
      />
    </div>
  );
};

export default PagesList;
