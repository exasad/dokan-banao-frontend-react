import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, ColorPicker, Divider, Form, Input, InputNumber, Radio, Select, Slider, Space, Typography } from 'antd';
import { COLUMN_PRESETS, SECTION_TYPES, generateColId, getSectionType } from './constants';

const { TextArea } = Input;
const { Text } = Typography;

/* ─── Hero Slider ─── */
function HeroSliderSettings({ settings, onChange }) {
  return (
    <>
      <Form.Item label="Autoplay Speed (ms)">
        <InputNumber min={1000} max={15000} step={500} value={settings.autoplaySpeed || 5000} onChange={(v) => onChange({ ...settings, autoplaySpeed: v })} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Height (px)">
        <InputNumber min={200} max={800} value={settings.height || null} onChange={(v) => onChange({ ...settings, height: v })} placeholder="Auto" style={{ width: '100%' }} />
      </Form.Item>
    </>
  );
}

/* ─── Featured Categories ─── */
function FeaturedCategoriesSettings({ settings, onChange }) {
  return (
    <>
      <Form.Item label="Title">
        <Input value={settings.title || ''} onChange={(e) => onChange({ ...settings, title: e.target.value })} />
      </Form.Item>
      <Form.Item label="Items Per View">
        <InputNumber min={3} max={15} value={settings.itemsPerView || 10} onChange={(v) => onChange({ ...settings, itemsPerView: v })} style={{ width: '100%' }} />
      </Form.Item>
    </>
  );
}

/* ─── Product Grid ─── */
function ProductGridSettings({ settings, onChange }) {
  return (
    <>
      <Form.Item label="Title">
        <Input value={settings.title || ''} onChange={(e) => onChange({ ...settings, title: e.target.value })} />
      </Form.Item>
      <Form.Item label="Subtitle">
        <Input value={settings.subtitle || ''} onChange={(e) => onChange({ ...settings, subtitle: e.target.value })} />
      </Form.Item>
      <Form.Item label="Source">
        <Select value={settings.source || 'latest'} onChange={(v) => onChange({ ...settings, source: v })} options={[
          { label: 'Latest Products', value: 'latest' },
          { label: 'Featured Products', value: 'featured' },
          { label: 'Sale Products', value: 'sale' },
        ]} />
      </Form.Item>
      <Form.Item label="Limit">
        <InputNumber min={4} max={50} value={settings.limit || 12} onChange={(v) => onChange({ ...settings, limit: v })} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Columns">
        <InputNumber min={2} max={6} value={settings.columns || 5} onChange={(v) => onChange({ ...settings, columns: v })} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Card Style">
        <Radio.Group value={settings.cardStyle || 'default'} onChange={(e) => onChange({ ...settings, cardStyle: e.target.value })}>
          <Radio.Button value="default">Default</Radio.Button>
          <Radio.Button value="compact">Compact</Radio.Button>
          <Radio.Button value="minimal">Minimal</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </>
  );
}

/* ─── Features Banner ─── */
function FeaturesBannerSettings() {
  return <Text type="secondary">Feature cards are configured in Settings &rarr; General (Feature 1–4).</Text>;
}

/* ─── Custom Banner ─── */
function CustomBannerSettings({ settings, onChange }) {
  return (
    <>
      <Form.Item label="Image URL">
        <Input value={settings.imageUrl || ''} onChange={(e) => onChange({ ...settings, imageUrl: e.target.value })} placeholder="https://..." />
      </Form.Item>
      <Form.Item label="Title">
        <Input value={settings.title || ''} onChange={(e) => onChange({ ...settings, title: e.target.value })} />
      </Form.Item>
      <Form.Item label="Subtitle">
        <Input value={settings.subtitle || ''} onChange={(e) => onChange({ ...settings, subtitle: e.target.value })} />
      </Form.Item>
      <Form.Item label="Link URL">
        <Input value={settings.linkUrl || ''} onChange={(e) => onChange({ ...settings, linkUrl: e.target.value })} placeholder="/products" />
      </Form.Item>
      <Form.Item label="Link Text">
        <Input value={settings.linkText || ''} onChange={(e) => onChange({ ...settings, linkText: e.target.value })} placeholder="Shop Now" />
      </Form.Item>
      <Form.Item label="Height (px)">
        <InputNumber min={100} max={800} value={settings.height || 300} onChange={(v) => onChange({ ...settings, height: v })} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Background Color">
        <ColorPicker value={settings.bgColor || '#1a1a2e'} onChange={(_, hex) => onChange({ ...settings, bgColor: hex })} />
      </Form.Item>
      <Form.Item label="Text Align">
        <Radio.Group value={settings.textAlign || 'center'} onChange={(e) => onChange({ ...settings, textAlign: e.target.value })}>
          <Radio.Button value="left">Left</Radio.Button>
          <Radio.Button value="center">Center</Radio.Button>
          <Radio.Button value="right">Right</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </>
  );
}

/* ─── Text Block ─── */
function TextBlockSettings({ settings, onChange }) {
  return (
    <>
      <Form.Item label="Content (HTML)">
        <TextArea rows={5} value={settings.content || ''} onChange={(e) => onChange({ ...settings, content: e.target.value })} placeholder="<h2>Title</h2><p>Your text here...</p>" />
      </Form.Item>
      <Form.Item label="Background Color">
        <ColorPicker value={settings.bgColor || '#ffffff'} onChange={(_, hex) => onChange({ ...settings, bgColor: hex })} />
      </Form.Item>
      <Form.Item label="Text Color">
        <ColorPicker value={settings.textColor || '#333333'} onChange={(_, hex) => onChange({ ...settings, textColor: hex })} />
      </Form.Item>
      <Form.Item label="Padding (px)">
        <InputNumber min={0} max={120} value={settings.padding || 40} onChange={(v) => onChange({ ...settings, padding: v })} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Text Align">
        <Radio.Group value={settings.textAlign || 'center'} onChange={(e) => onChange({ ...settings, textAlign: e.target.value })}>
          <Radio.Button value="left">Left</Radio.Button>
          <Radio.Button value="center">Center</Radio.Button>
          <Radio.Button value="right">Right</Radio.Button>
        </Radio.Group>
      </Form.Item>
    </>
  );
}

/* ─── Image ─── */
function ImageSettings({ settings, onChange }) {
  return (
    <>
      <Form.Item label="Image URL">
        <Input value={settings.src || ''} onChange={(e) => onChange({ ...settings, src: e.target.value })} placeholder="https://..." />
      </Form.Item>
      <Form.Item label="Alt Text">
        <Input value={settings.alt || ''} onChange={(e) => onChange({ ...settings, alt: e.target.value })} />
      </Form.Item>
      <Form.Item label="Link URL">
        <Input value={settings.linkUrl || ''} onChange={(e) => onChange({ ...settings, linkUrl: e.target.value })} placeholder="/products" />
      </Form.Item>
      <Form.Item label="Max Width (%)">
        <Slider min={20} max={100} value={settings.maxWidth || 100} onChange={(v) => onChange({ ...settings, maxWidth: v })} />
      </Form.Item>
      <Form.Item label="Border Radius (px)">
        <InputNumber min={0} max={50} value={settings.borderRadius ?? 12} onChange={(v) => onChange({ ...settings, borderRadius: v })} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Checkbox checked={!!settings.shadow} onChange={(e) => onChange({ ...settings, shadow: e.target.checked })}>Drop Shadow</Checkbox>
      </Form.Item>
    </>
  );
}

/* ─── Video ─── */
function VideoSettings({ settings, onChange }) {
  return (
    <>
      <Form.Item label="YouTube / Vimeo URL">
        <Input value={settings.url || ''} onChange={(e) => onChange({ ...settings, url: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
      </Form.Item>
      <Form.Item label="Aspect Ratio">
        <Select value={settings.aspectRatio || '16/9'} onChange={(v) => onChange({ ...settings, aspectRatio: v })} options={[
          { label: '16:9 (Widescreen)', value: '16/9' },
          { label: '4:3 (Standard)', value: '4/3' },
          { label: '1:1 (Square)', value: '1/1' },
          { label: '21:9 (Cinematic)', value: '21/9' },
        ]} />
      </Form.Item>
      <Form.Item label="Border Radius (px)">
        <InputNumber min={0} max={50} value={settings.borderRadius ?? 12} onChange={(v) => onChange({ ...settings, borderRadius: v })} style={{ width: '100%' }} />
      </Form.Item>
    </>
  );
}

/* ─── Button ─── */
function ButtonSettings({ settings, onChange }) {
  return (
    <>
      <Form.Item label="Button Text">
        <Input value={settings.text || ''} onChange={(e) => onChange({ ...settings, text: e.target.value })} />
      </Form.Item>
      <Form.Item label="Link URL">
        <Input value={settings.linkUrl || ''} onChange={(e) => onChange({ ...settings, linkUrl: e.target.value })} placeholder="/products" />
      </Form.Item>
      <Form.Item label="Background Color">
        <ColorPicker value={settings.bgColor || '#1890ff'} onChange={(_, hex) => onChange({ ...settings, bgColor: hex })} />
      </Form.Item>
      <Form.Item label="Text Color">
        <ColorPicker value={settings.textColor || '#ffffff'} onChange={(_, hex) => onChange({ ...settings, textColor: hex })} />
      </Form.Item>
      <Form.Item label="Size">
        <Radio.Group value={settings.size || 'large'} onChange={(e) => onChange({ ...settings, size: e.target.value })}>
          <Radio.Button value="small">Small</Radio.Button>
          <Radio.Button value="medium">Medium</Radio.Button>
          <Radio.Button value="large">Large</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Align">
        <Radio.Group value={settings.align || 'center'} onChange={(e) => onChange({ ...settings, align: e.target.value })}>
          <Radio.Button value="left">Left</Radio.Button>
          <Radio.Button value="center">Center</Radio.Button>
          <Radio.Button value="right">Right</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Border Radius (px)">
        <InputNumber min={0} max={50} value={settings.borderRadius ?? 8} onChange={(v) => onChange({ ...settings, borderRadius: v })} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Checkbox checked={!!settings.fullWidth} onChange={(e) => onChange({ ...settings, fullWidth: e.target.checked })}>Full Width</Checkbox>
      </Form.Item>
    </>
  );
}

/* ─── Spacer ─── */
function SpacerSettings({ settings, onChange }) {
  return (
    <Form.Item label={`Height: ${settings.height || 40}px`}>
      <Slider min={10} max={200} value={settings.height || 40} onChange={(v) => onChange({ ...settings, height: v })} />
    </Form.Item>
  );
}

/* ─── Divider ─── */
function DividerSettings({ settings, onChange }) {
  return (
    <>
      <Form.Item label="Color">
        <ColorPicker value={settings.color || '#e8e8e8'} onChange={(_, hex) => onChange({ ...settings, color: hex })} />
      </Form.Item>
      <Form.Item label="Thickness (px)">
        <InputNumber min={1} max={10} value={settings.thickness || 1} onChange={(v) => onChange({ ...settings, thickness: v })} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item label="Style">
        <Select value={settings.style || 'solid'} onChange={(v) => onChange({ ...settings, style: v })} options={[
          { label: 'Solid', value: 'solid' },
          { label: 'Dashed', value: 'dashed' },
          { label: 'Dotted', value: 'dotted' },
        ]} />
      </Form.Item>
      <Form.Item label={`Width: ${settings.width || 100}%`}>
        <Slider min={10} max={100} value={settings.width || 100} onChange={(v) => onChange({ ...settings, width: v })} />
      </Form.Item>
      <Form.Item label="Vertical Margin (px)">
        <InputNumber min={0} max={60} value={settings.marginY ?? 10} onChange={(v) => onChange({ ...settings, marginY: v })} style={{ width: '100%' }} />
      </Form.Item>
    </>
  );
}

/* ─── Newsletter ─── */
function NewsletterSettings({ settings, onChange }) {
  return (
    <>
      <Form.Item label="Title">
        <Input value={settings.title || ''} onChange={(e) => onChange({ ...settings, title: e.target.value })} />
      </Form.Item>
      <Form.Item label="Subtitle">
        <Input value={settings.subtitle || ''} onChange={(e) => onChange({ ...settings, subtitle: e.target.value })} />
      </Form.Item>
      <Form.Item label="Background Color">
        <ColorPicker value={settings.bgColor || '#f8f9fa'} onChange={(_, hex) => onChange({ ...settings, bgColor: hex })} />
      </Form.Item>
    </>
  );
}

/* ─── Row / Columns ─── */
function RowSettings({ settings, onChange }) {
  const columns = settings.columns || [];

  const applyPreset = (widths) => {
    const newCols = widths.map((w, i) => {
      const existing = columns[i];
      return existing
        ? { ...existing, width: w }
        : { id: generateColId(), width: w, type: null, settings: {} };
    });
    onChange({ ...settings, columns: newCols });
  };

  const updateColumn = (colId, updates) => {
    onChange({
      ...settings,
      columns: columns.map((c) => (c.id === colId ? { ...c, ...updates } : c)),
    });
  };

  const removeColumn = (colId) => {
    if (columns.length <= 1) return;
    const remaining = columns.filter((c) => c.id !== colId);
    const perCol = Math.round(100 / remaining.length);
    onChange({ ...settings, columns: remaining.map((c, i) => ({ ...c, width: i === remaining.length - 1 ? 100 - perCol * (remaining.length - 1) : perCol })) });
  };

  const addColumn = () => {
    if (columns.length >= 4) return;
    const newCols = [...columns, { id: generateColId(), width: 25, type: null, settings: {} }];
    const perCol = Math.round(100 / newCols.length);
    onChange({ ...settings, columns: newCols.map((c, i) => ({ ...c, width: i === newCols.length - 1 ? 100 - perCol * (newCols.length - 1) : perCol })) });
  };

  // Collect section types that can be placed in a column (no row-in-row)
  const columnTypeOptions = SECTION_TYPES.filter((t) => t.type !== 'row').map((t) => ({ label: t.name, value: t.type }));

  return (
    <>
      <Form.Item label="Column Layout Presets">
        <Space wrap>
          {COLUMN_PRESETS.map((p) => (
            <Button key={p.label} size="small" type={columns.length === p.widths.length && columns.every((c, i) => c.width === p.widths[i]) ? 'primary' : 'default'} onClick={() => applyPreset(p.widths)}>
              {p.label}
            </Button>
          ))}
        </Space>
      </Form.Item>
      <Form.Item label="Gap (px)">
        <InputNumber min={0} max={40} value={settings.gap ?? 16} onChange={(v) => onChange({ ...settings, gap: v })} style={{ width: '100%' }} />
      </Form.Item>
      <Divider style={{ margin: '12px 0' }}>Columns</Divider>
      {columns.map((col, i) => (
        <div key={col.id} style={{ background: '#fafafa', borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text strong>Column {i + 1}</Text>
            {columns.length > 1 && <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => removeColumn(col.id)} />}
          </div>
          <Form.Item label="Width (%)" style={{ marginBottom: 8 }}>
            <InputNumber min={15} max={85} value={col.width} onChange={(v) => updateColumn(col.id, { width: v })} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Content Type" style={{ marginBottom: 8 }}>
            <Select
              value={col.type || undefined}
              placeholder="Select content..."
              allowClear
              onChange={(v) => {
                const typeInfo = SECTION_TYPES.find((t) => t.type === v);
                updateColumn(col.id, { type: v || null, settings: v ? { ...(typeInfo?.defaultSettings || {}) } : {} });
              }}
              options={columnTypeOptions}
              style={{ width: '100%' }}
            />
          </Form.Item>
          {col.type && col.type !== 'features_banner' && (
            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 11, marginBottom: 8, display: 'block' }}>Content Settings</Text>
              <SettingsForType type={col.type} settings={col.settings || {}} onChange={(newS) => updateColumn(col.id, { settings: newS })} />
            </div>
          )}
        </div>
      ))}
      {columns.length < 4 && (
        <Button icon={<PlusOutlined />} type="dashed" block size="small" onClick={addColumn}>Add Column</Button>
      )}
    </>
  );
}

/* ─── Dynamic settings by type (for column content) ─── */
function SettingsForType({ type, settings, onChange }) {
  const props = { settings, onChange };
  switch (type) {
    case 'hero_slider': return <HeroSliderSettings {...props} />;
    case 'featured_categories': return <FeaturedCategoriesSettings {...props} />;
    case 'product_grid': return <ProductGridSettings {...props} />;
    case 'features_banner': return <FeaturesBannerSettings />;
    case 'custom_banner': return <CustomBannerSettings {...props} />;
    case 'text_block': return <TextBlockSettings {...props} />;
    case 'image': return <ImageSettings {...props} />;
    case 'video': return <VideoSettings {...props} />;
    case 'button': return <ButtonSettings {...props} />;
    case 'spacer': return <SpacerSettings {...props} />;
    case 'divider': return <DividerSettings {...props} />;
    case 'newsletter': return <NewsletterSettings {...props} />;
    default: return null;
  }
}

/* ─── Sections with width resize support ─── */
const WIDTH_RESIZABLE = ['hero_slider', 'featured_categories', 'product_grid', 'features_banner', 'custom_banner', 'text_block', 'image', 'video', 'button', 'newsletter', 'row'];

/* ─── Main export ─── */
export default function SectionSettings({ section, onChange }) {
  if (!section) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#bbb' }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🎨</div>
        Click a section on the canvas to edit its settings
      </div>
    );
  }

  const handleSettingsChange = (newSettings) => {
    onChange({ ...section, settings: newSettings });
  };

  const settings = section.settings || {};
  const showMaxWidth = WIDTH_RESIZABLE.includes(section.type);

  return (
    <div>
      <Form layout="vertical" size="small">
        {showMaxWidth && (
          <Form.Item label={`Max Width: ${settings.maxWidth ?? 100}%`}>
            <Slider min={20} max={100} value={settings.maxWidth ?? 100} onChange={(v) => handleSettingsChange({ ...settings, maxWidth: v })} />
          </Form.Item>
        )}
        {section.type === 'row' ? (
          <RowSettings settings={settings} onChange={handleSettingsChange} />
        ) : (
          <SettingsForType type={section.type} settings={settings} onChange={handleSettingsChange} />
        )}
      </Form>
    </div>
  );
}
