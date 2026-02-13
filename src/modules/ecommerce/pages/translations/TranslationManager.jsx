import {useState, useEffect} from 'react';
import {Card, Tabs, Input, Button, Table, Typography, message, Select, Space} from 'antd';
import {TranslationOutlined, SaveOutlined} from '@ant-design/icons';
import adminAxios from '../../services/adminAxios';

const {Title, Text} = Typography;
const {TextArea} = Input;

const TranslationManager = () => {
  const [locale, setLocale] = useState('bn');
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    adminAxios.get(`/translations/${locale}`).then(({data}) => setTranslations(data || {})).catch(() => message.error('Failed to load')).finally(() => setLoading(false));
  }, [locale]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAxios.put(`/translations/${locale}`, {translations});
      message.success('Translations saved');
    } catch { message.error('Failed to save'); } finally { setSaving(false); }
  };

  const entries = Object.entries(translations).filter(([key]) => !search || key.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    {title: 'Key', dataIndex: 'key', key: 'key', width: 250, render: (v) => <Text code>{v}</Text>},
    {
      title: 'Translation', dataIndex: 'value', key: 'value',
      render: (_, record) => (
        <Input value={record.value} onChange={(e) => setTranslations(prev => ({...prev, [record.key]: e.target.value}))} />
      ),
    },
  ];

  const dataSource = entries.map(([key, value]) => ({key, value}));

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <Title level={3} style={{margin: 0}}><TranslationOutlined style={{marginRight: 8}} />Translations</Title>
        <Button type='primary' icon={<SaveOutlined />} onClick={handleSave} loading={saving}>Save All</Button>
      </div>
      <Space style={{marginBottom: 16}} wrap>
        <Select value={locale} onChange={setLocale} style={{width: 150}} options={[{value: 'en', label: 'English'}, {value: 'bn', label: 'Bengali (বাংলা)'}]} />
        <Input placeholder='Search key...' value={search} onChange={(e) => setSearch(e.target.value)} style={{width: 220}} allowClear />
      </Space>
      <Card loading={loading}>
        <Table columns={columns} dataSource={dataSource} rowKey='key' pagination={{pageSize: 20, showSizeChanger: true}} size='small' />
      </Card>
    </div>
  );
};

export default TranslationManager;
