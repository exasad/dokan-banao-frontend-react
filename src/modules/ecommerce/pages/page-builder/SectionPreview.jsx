import {
  AppstoreOutlined,
  ColumnWidthOutlined,
  LinkOutlined,
  MailOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';

/* ══════════════════ Visual preview blocks ══════════════════ */

function HeroSliderPreview({ settings }) {
  return (
    <div style={{ height: settings.height || 200, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: 20, top: 10, opacity: 0.12, fontSize: 100 }}><PictureOutlined /></div>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Hero Slider</div>
        <div style={{ opacity: 0.8, fontSize: 12 }}>Autoplay: {settings.autoplaySpeed || 5000}ms</div>
        <div style={{ marginTop: 10, display: 'inline-block', background: '#fff', color: '#764ba2', padding: '5px 18px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>Shop Now</div>
      </div>
    </div>
  );
}

function FeaturedCategoriesPreview({ settings }) {
  const isVertical = settings.layout === 'vertical';

  if (isVertical) {
    const count = 6;
    return (
      <div style={{ padding: '8px 0' }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: '#1a1a2e' }}>{settings.title || 'Shop by Category'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, background: i === 0 ? '#e6f7ff' : 'transparent' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `hsl(${i * 40 + 200}, 55%, 91%)`, border: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AppstoreOutlined style={{ fontSize: 11, color: `hsl(${i * 40 + 200}, 45%, 45%)` }} />
              </div>
              <div style={{ fontSize: 11, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Category {i + 1}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const count = Math.min(settings.itemsPerView || 6, 8);
  return (
    <div style={{ padding: '12px 0' }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: '#1a1a2e' }}>{settings.title || 'Shop by Category'}</div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'hidden' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: `hsl(${i * 40 + 200}, 55%, 91%)`, border: '2px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px' }}>
              <AppstoreOutlined style={{ fontSize: 16, color: `hsl(${i * 40 + 200}, 45%, 45%)` }} />
            </div>
            <div style={{ fontSize: 10, color: '#888', width: 48, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Cat {i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductGridPreview({ settings }) {
  const cols = Math.min(settings.columns || 5, 6);
  const rows = Math.ceil(Math.min(settings.limit || 8, 8) / cols);
  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>{settings.title || 'Latest Products'}</div>
      {settings.subtitle && <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>{settings.subtitle}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8, marginTop: 8 }}>
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div key={i} style={{ background: '#f5f5f5', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ aspectRatio: '1', background: `linear-gradient(135deg, hsl(${i * 30 + 180}, 25%, 93%) 0%, hsl(${i * 30 + 180}, 25%, 87%) 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingOutlined style={{ fontSize: 18, color: '#bbb' }} />
            </div>
            <div style={{ padding: '6px 4px' }}>
              <div style={{ height: 6, width: '70%', background: '#e0e0e0', borderRadius: 3, marginBottom: 3 }} />
              <div style={{ height: 6, width: '40%', background: '#d0d0d0', borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesBannerPreview() {
  const items = ['📦 Free Shipping', '🔒 Secure', '🔄 Returns', '🎧 Support'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
      {items.map((t) => (
        <div key={t} style={{ background: '#f8f9fb', borderRadius: 8, padding: '12px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>{t}</div>
          <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>Description</div>
        </div>
      ))}
    </div>
  );
}

function CustomBannerPreview({ settings }) {
  return (
    <div style={{ height: settings.height || 180, background: settings.imageUrl ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${settings.imageUrl}) center/cover` : (settings.bgColor || '#1a1a2e'), borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: settings.textAlign === 'left' ? 'flex-start' : settings.textAlign === 'right' ? 'flex-end' : 'center', padding: '0 32px', color: '#fff' }}>
      <div style={{ textAlign: settings.textAlign || 'center' }}>
        {settings.title ? <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 3 }}>{settings.title}</div> : <div style={{ opacity: 0.6, fontSize: 14 }}>Custom Banner</div>}
        {settings.subtitle && <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>{settings.subtitle}</div>}
        {settings.linkText && <span style={{ display: 'inline-block', background: '#fff', color: settings.bgColor || '#1a1a2e', padding: '4px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{settings.linkText}</span>}
      </div>
    </div>
  );
}

function TextBlockPreview({ settings }) {
  return (
    <div style={{ backgroundColor: settings.bgColor || '#ffffff', color: settings.textColor || '#333', padding: settings.padding || 40, borderRadius: 12, textAlign: settings.textAlign || 'center', border: '1px solid #eee', minHeight: 60 }}>
      {settings.content ? <div dangerouslySetInnerHTML={{ __html: settings.content }} /> : <div style={{ opacity: 0.35, fontSize: 13 }}>Text Block — add content in settings</div>}
    </div>
  );
}

function ImagePreview({ settings }) {
  return (
    <div style={{ textAlign: 'center' }}>
      {settings.src ? (
        <img src={settings.src} alt={settings.alt || ''} style={{ maxWidth: `${settings.maxWidth || 100}%`, borderRadius: settings.borderRadius || 12, boxShadow: settings.shadow ? '0 4px 20px rgba(0,0,0,0.12)' : 'none' }} />
      ) : (
        <div style={{ height: 160, background: '#f0f2f5', borderRadius: settings.borderRadius || 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>
          <div style={{ textAlign: 'center' }}><PictureOutlined style={{ fontSize: 32, display: 'block', marginBottom: 4 }} /><span style={{ fontSize: 12 }}>Add image URL in settings</span></div>
        </div>
      )}
    </div>
  );
}

function VideoPreview({ settings }) {
  const id = extractVideoId(settings.url);
  return (
    <div style={{ borderRadius: settings.borderRadius || 12, overflow: 'hidden', background: '#000', aspectRatio: settings.aspectRatio || '16/9' }}>
      {id ? (
        <iframe src={`https://www.youtube.com/embed/${id}`} style={{ width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope" allowFullScreen />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', background: '#1a1a2e' }}>
          <div style={{ textAlign: 'center' }}><PlayCircleOutlined style={{ fontSize: 40, display: 'block', marginBottom: 6, color: '#fff' }} /><span style={{ fontSize: 12, color: '#aaa' }}>Paste a YouTube URL in settings</span></div>
        </div>
      )}
    </div>
  );
}

function ButtonPreview({ settings }) {
  return (
    <div style={{ textAlign: settings.align || 'center', padding: '12px 0' }}>
      <span style={{ display: settings.fullWidth ? 'block' : 'inline-block', background: settings.bgColor || '#1890ff', color: settings.textColor || '#fff', padding: settings.size === 'small' ? '6px 16px' : settings.size === 'large' ? '12px 32px' : '8px 24px', borderRadius: settings.borderRadius || 8, fontSize: settings.size === 'small' ? 12 : settings.size === 'large' ? 16 : 14, fontWeight: 600, textAlign: 'center' }}>
        {settings.text || 'Button'}
      </span>
    </div>
  );
}

function SpacerPreview({ settings }) {
  const h = settings.height || 40;
  return (
    <div style={{ height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px dashed #d9d9d9', borderBottom: '1px dashed #d9d9d9', color: '#bbb', fontSize: 11 }}>
      Spacer &middot; {h}px
    </div>
  );
}

function DividerPreview({ settings }) {
  return (
    <div style={{ padding: `${settings.marginY || 10}px 0`, display: 'flex', justifyContent: 'center' }}>
      <hr style={{ width: `${settings.width || 100}%`, border: 'none', borderTop: `${settings.thickness || 1}px ${settings.style || 'solid'} ${settings.color || '#e8e8e8'}`, margin: 0 }} />
    </div>
  );
}

function NewsletterPreview({ settings }) {
  return (
    <div style={{ backgroundColor: settings.bgColor || '#f8f9fa', borderRadius: 12, padding: '24px 20px', textAlign: 'center' }}>
      <MailOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 6, display: 'block' }} />
      <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', marginBottom: 3 }}>{settings.title || 'Newsletter'}</div>
      <div style={{ fontSize: 11, color: '#888', marginBottom: 12 }}>{settings.subtitle || 'Get updates'}</div>
      <div style={{ display: 'flex', gap: 6, maxWidth: 300, margin: '0 auto' }}>
        <div style={{ flex: 1, height: 30, background: '#fff', border: '1px solid #ddd', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 11, color: '#bbb' }}>email@example.com</div>
        <div style={{ height: 30, background: '#1890ff', color: '#fff', borderRadius: 6, padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 600 }}>Subscribe</div>
      </div>
    </div>
  );
}

/* ══════════════════ Row (columns) preview ══════════════════ */

export function ColumnContentPreview({ column }) {
  if (!column.type) {
    return (
      <div style={{ height: 80, border: '2px dashed #d9d9d9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 12, background: '#fafafa' }}>
        <div style={{ textAlign: 'center' }}>
          <ColumnWidthOutlined style={{ fontSize: 18, display: 'block', marginBottom: 2 }} />
          Empty
        </div>
      </div>
    );
  }
  return <SectionPreview section={{ type: column.type, settings: column.settings || {} }} />;
}

function RowPreview({ settings }) {
  const columns = settings.columns || [];
  const gap = settings.gap || 16;
  return (
    <div style={{ display: 'flex', gap, minHeight: 80 }}>
      {columns.map((col) => (
        <div key={col.id} style={{ flex: `0 0 ${col.width}%`, maxWidth: `${col.width}%`, minWidth: 0 }}>
          <ColumnContentPreview column={col} />
        </div>
      ))}
    </div>
  );
}

/* ══════════════════ Main export ══════════════════ */

export default function SectionPreview({ section }) {
  const s = section.settings || {};
  switch (section.type) {
    case 'hero_slider': return <HeroSliderPreview settings={s} />;
    case 'featured_categories': return <FeaturedCategoriesPreview settings={s} />;
    case 'product_grid': return <ProductGridPreview settings={s} />;
    case 'features_banner': return <FeaturesBannerPreview />;
    case 'custom_banner': return <CustomBannerPreview settings={s} />;
    case 'text_block': return <TextBlockPreview settings={s} />;
    case 'image': return <ImagePreview settings={s} />;
    case 'video': return <VideoPreview settings={s} />;
    case 'button': return <ButtonPreview settings={s} />;
    case 'spacer': return <SpacerPreview settings={s} />;
    case 'divider': return <DividerPreview settings={s} />;
    case 'newsletter': return <NewsletterPreview settings={s} />;
    case 'row': return <RowPreview settings={s} />;
    default: return <div style={{ padding: 16, textAlign: 'center', color: '#999', background: '#fafafa', borderRadius: 8 }}>Unknown: {section.type}</div>;
  }
}

function extractVideoId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}
