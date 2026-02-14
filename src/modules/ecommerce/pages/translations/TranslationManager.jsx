import {useState, useEffect} from 'react';
import {Card, Input, Button, Table, Typography, message, Select, Space, Tag} from 'antd';
import {TranslationOutlined, SaveOutlined} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';

const {Title, Text} = Typography;

const TranslationManager = () => {
  const [locale, setLocale] = useState('bn');
  const [defaults, setDefaults] = useState({});
  const [custom, setCustom] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    adminAxios.get(`/translations/${locale}`)
      .then(({data}) => {
        // defaults is a flat {key: value} from lang file
        const d = data.defaults || {};
        setDefaults(d);

        // custom is grouped: {storefront: {key: value}} — flatten it
        const c = data.custom || {};
        const flat = {};
        Object.values(c).forEach((group) => {
          if (group && typeof group === 'object') {
            Object.entries(group).forEach(([k, v]) => {
              flat[k] = typeof v === 'string' ? v : '';
            });
          }
        });
        setCustom(flat);
      })
      .catch(() => message.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [locale]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAxios.put(`/translations/${locale}`, {translations: custom});
      message.success('Translations saved');
    } catch { message.error('Failed to save'); } finally { setSaving(false); }
  };

  // Merge defaults with custom overrides for display
  const allKeys = [...new Set([...Object.keys(defaults), ...Object.keys(custom)])];
  const filtered = allKeys.filter((key) => !search || key.toLowerCase().includes(search.toLowerCase()));

  const dataSource = filtered.map((key) => ({
    key,
    default: typeof defaults[key] === 'string' ? defaults[key] : '',
    value: custom[key] !== undefined ? custom[key] : '',
    isCustom: custom[key] !== undefined,
  }));

  const columns = [
    {
      title: 'Key', dataIndex: 'key', key: 'key', width: 250,
      render: (v) => <Text code>{v}</Text>,
    },
    {
      title: 'Default', dataIndex: 'default', key: 'default', width: 250,
      render: (v) => <Text type='secondary'>{v || '—'}</Text>,
    },
    {
      title: 'Translation', dataIndex: 'value', key: 'value',
      render: (_, record) => (
        <Input
          value={record.value}
          placeholder={record.default || 'Enter translation...'}
          onChange={(e) => setCustom((prev) => ({...prev, [record.key]: e.target.value}))}
        />
      ),
    },
    {
      title: 'Status', key: 'status', width: 100, align: 'center',
      render: (_, record) => record.isCustom ? <Tag color='green'>Custom</Tag> : <Tag>Default</Tag>,
    },
  ];

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}><TranslationOutlined style={{marginRight: 8}} />Translations</Title>
        <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving}>Save All</Button>
      </div>
      <Space style={{marginBottom: 16}} wrap>
        <Select value={locale} onChange={setLocale} style={{width: 150}} options={[{value: 'en', label: 'English'}, {value: 'bn', label: 'Bengali'}]} />
        <Input placeholder='Search key...' value={search} onChange={(e) => setSearch(e.target.value)} style={{width: 220}} allowClear />
        <Text type='secondary'>{dataSource.length} keys</Text>
      </Space>
      <Card loading={loading}>
        <Table columns={columns} dataSource={dataSource} rowKey='key' pagination={{pageSize: 20, showSizeChanger: true}} size='small' />
      </Card>
    </div>
  );
};

export default TranslationManager;
