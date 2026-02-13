import {useState, useEffect, useCallback} from 'react';
import {Table, Button, Input, Select, Space, Tag, Typography, message, Popconfirm, Image} from 'antd';
import {PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FileTextOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import adminAxios from '../../services/adminAxios';
import {useNavigate} from 'react-router-dom';

const {Title, Text} = Typography;

const BlogList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(undefined);

  const fetchPosts = useCallback(async (page = 1, perPage = 10) => {
    setLoading(true);
    try {
      const params = {page, per_page: perPage};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await adminAxios.get('/blog-posts', {params});
      setPosts(res.data.data);
      setPagination({current: res.data.current_page, pageSize: res.data.per_page, total: res.data.total});
    } catch { message.error('Failed to fetch posts'); } finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async (id) => {
    try { await adminAxios.delete(`/blog-posts/${id}`); message.success('Post deleted'); fetchPosts(pagination.current, pagination.pageSize); }
    catch { message.error('Failed'); }
  };

  const columns = [
    {title: 'Image', key: 'image', width: 70, render: (_, r) => r.featured_image ? <Image src={r.featured_image} width={50} height={40} style={{objectFit: 'cover', borderRadius: 4}} preview={false} /> : '-'},
    {title: 'Title', dataIndex: 'title', key: 'title', ellipsis: true},
    {title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (v) => v === 'published' ? <Tag color='green'>Published</Tag> : <Tag color='orange'>Draft</Tag>},
    {title: 'Featured', dataIndex: 'is_featured', key: 'featured', width: 80, render: (v) => v ? <Tag color='blue'>Yes</Tag> : 'No'},
    {title: 'Published', dataIndex: 'published_at', key: 'date', width: 120, render: (v) => v ? dayjs(v).format('DD MMM YY') : '-'},
    {
      title: 'Actions', key: 'actions', width: 120,
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size='small' onClick={() => navigate(`/blog/${r.id}/edit`)} />
          <Popconfirm title='Delete?' onConfirm={() => handleDelete(r.id)}><Button icon={<DeleteOutlined />} size='small' danger /></Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}><FileTextOutlined style={{marginRight: 8}} />Blog Posts</Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => navigate('/blog/create')}>New Post</Button>
      </div>
      <Space wrap style={{marginBottom: 16}}>
        <Input placeholder='Search...' prefix={<SearchOutlined />} value={search} onChange={(e) => setSearch(e.target.value)} style={{width: 220}} allowClear />
        <Select placeholder='Status' value={statusFilter} onChange={setStatusFilter} allowClear style={{width: 130}} options={[{value: 'published', label: 'Published'}, {value: 'draft', label: 'Draft'}]} />
      </Space>
      <Table columns={columns} dataSource={posts} rowKey='id' loading={loading}
        pagination={{...pagination, onChange: (p, ps) => fetchPosts(p, ps), showSizeChanger: true, showTotal: (t) => `Total ${t} posts`}}
        scroll={{x: 'max-content'}}
      />
    </div>
  );
};

export default BlogList;
