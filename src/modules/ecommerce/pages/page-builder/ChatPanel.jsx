import { CheckOutlined, CloseOutlined, EyeInvisibleOutlined, PictureOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Input, Spin, Upload, message } from 'antd';
import { createElement, useCallback, useEffect, useRef, useState } from 'react';
import { getSectionType } from './constants';

const VALID_SECTION_TYPES = [
  'hero_slider', 'featured_categories', 'product_grid', 'features_banner',
  'custom_banner', 'text_block', 'spacer', 'newsletter', 'row', 'image',
  'video', 'button', 'divider',
];

const VALID_THEMES = [
  'default', 'gadget', 'fashion', 'grocery', 'luxury', 'kids', 'minimal', 'beauty', 'sports', 'purple', 'ocean',
];

function extractJsonResult(text) {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]);
    // Support both array format and { theme, sections, ... } object format
    let sections = null;
    let settings = {};
    if (Array.isArray(parsed)) {
      sections = parsed;
    } else if (parsed && Array.isArray(parsed.sections)) {
      sections = parsed.sections;
      if (parsed.theme && VALID_THEMES.includes(parsed.theme)) {
        settings.theme = parsed.theme;
      }
      if (typeof parsed.announcement_enabled === 'boolean') {
        settings.announcement_enabled = parsed.announcement_enabled;
      }
      if (typeof parsed.announcement_text === 'string') {
        settings.announcement_text = parsed.announcement_text;
      }
    }
    if (!sections) return null;
    const valid = sections.every(
      (s) => s.id && VALID_SECTION_TYPES.includes(s.type) && typeof s.visible === 'boolean' && typeof s.settings === 'object'
    );
    return valid ? { sections, settings } : null;
  } catch {
    return null;
  }
}

// Backward compatible: returns just sections array or null
function extractJsonSections(text) {
  const result = extractJsonResult(text);
  return result ? result.sections : null;
}

function renderMarkdown(text) {
  // Strip json code blocks — we render those as visual previews instead
  let display = text.replace(/```json\s*[\s\S]*?```/g, '');
  display = display
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:1px 4px;border-radius:3px;font-size:12px">$1</code>')
    .replace(/\n/g, '<br/>');
  return display.trim();
}

function getSectionLabel(section) {
  const s = section.settings || {};
  if (section.type === 'product_grid') return s.title || s.source || '';
  if (section.type === 'featured_categories') return s.title || '';
  if (section.type === 'text_block') return s.content ? s.content.replace(/<[^>]*>/g, '').slice(0, 40) : '';
  if (section.type === 'custom_banner') return s.title || '';
  if (section.type === 'button') return s.text || '';
  if (section.type === 'newsletter') return s.title || '';
  if (section.type === 'hero_slider') return s.autoplaySpeed ? `${s.autoplaySpeed}ms` : '';
  if (section.type === 'spacer') return s.height ? `${s.height}px` : '';
  if (section.type === 'row') return s.columns ? `${s.columns.length} cols` : '';
  if (section.type === 'video') return s.url ? 'Video embed' : '';
  if (section.type === 'image') return s.alt || (s.src ? 'Image' : '');
  return '';
}

const TYPE_COLORS = {
  hero_slider: '#722ed1', featured_categories: '#13c2c2', product_grid: '#52c41a',
  features_banner: '#fa8c16', custom_banner: '#eb2f96', text_block: '#2f54eb',
  spacer: '#8c8c8c', newsletter: '#f5222d', row: '#1890ff', image: '#fa541c',
  video: '#a0d911', button: '#1890ff', divider: '#bfbfbf',
};

function SectionsPreview({ sections, applied, theme }) {
  return (
    <div style={{ maxWidth: '94%', marginTop: 6 }}>
      <div style={{ background: '#fff', border: `1px solid ${applied ? '#b7eb8f' : '#e8e8e8'}`, borderRadius: 10, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: applied ? '#f6ffed' : '#f7f8fa', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5, borderBottom: `1px solid ${applied ? '#b7eb8f' : '#eee'}` }}>
          {applied && <CheckOutlined style={{ fontSize: 10, color: '#52c41a' }} />}
          <span style={{ fontSize: 10, fontWeight: 600, color: applied ? '#52c41a' : '#999' }}>
            {applied ? 'Layout Applied' : 'Preview'}
          </span>
          {theme && <span style={{ fontSize: 9, background: '#e6f7ff', color: '#1890ff', padding: '1px 6px', borderRadius: 4, fontWeight: 500 }}>Theme: {theme}</span>}
          <span style={{ fontSize: 9, color: '#bbb', marginLeft: 'auto' }}>{sections.length} section{sections.length !== 1 ? 's' : ''}</span>
        </div>
        {/* Section bars */}
        <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {sections.map((section) => {
            const typeInfo = getSectionType(section.type);
            const color = TYPE_COLORS[section.type] || '#8c8c8c';
            const label = getSectionLabel(section);
            const isRow = section.type === 'row';
            const cols = isRow ? (section.settings?.columns || []) : [];

            return (
              <div key={section.id} style={{ position: 'relative' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '5px 8px',
                    borderRadius: 6,
                    background: `${color}08`,
                    border: `1px solid ${color}30`,
                    opacity: section.visible === false ? 0.45 : 1,
                  }}
                >
                  {typeInfo && createElement(typeInfo.icon, { style: { fontSize: 11, color, flexShrink: 0 } })}
                  <span style={{ fontSize: 10, fontWeight: 600, color, whiteSpace: 'nowrap' }}>{typeInfo?.name || section.type}</span>
                  {label && <span style={{ fontSize: 9, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{label}</span>}
                  {section.visible === false && <EyeInvisibleOutlined style={{ fontSize: 9, color: '#bbb' }} />}
                </div>
                {isRow && cols.length > 0 && (
                  <div style={{ display: 'flex', gap: 2, margin: '2px 0 0 16px' }}>
                    {cols.map((col) => {
                      const colInfo = col.type ? getSectionType(col.type) : null;
                      const colColor = col.type ? (TYPE_COLORS[col.type] || '#8c8c8c') : '#d9d9d9';
                      return (
                        <div
                          key={col.id}
                          style={{
                            flex: `0 0 ${col.width}%`,
                            padding: '2px 5px',
                            borderRadius: 4,
                            background: `${colColor}10`,
                            border: `1px dashed ${colColor}40`,
                            fontSize: 9,
                            color: colColor,
                            textAlign: 'center',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {colInfo ? colInfo.name : 'Empty'} {col.width}%
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  const result = !isUser ? extractJsonResult(msg.content) : null;
  const sections = result?.sections || null;
  const theme = result?.settings?.theme || null;
  const markdownHtml = renderMarkdown(msg.content);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: '#999', marginBottom: 3, paddingLeft: isUser ? 0 : 4, paddingRight: isUser ? 4 : 0 }}>
        {isUser ? 'You' : 'AI Designer'}
      </div>
      {msg.imageUrl && (
        <img
          src={msg.imageUrl}
          alt="Uploaded"
          style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8, marginBottom: 6, objectFit: 'cover', border: '1px solid #eee' }}
        />
      )}
      {markdownHtml && (
        <div
          style={{
            maxWidth: '88%',
            padding: '10px 14px',
            borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
            background: isUser ? '#1890ff' : '#f5f5f5',
            color: isUser ? '#fff' : '#333',
            fontSize: 13,
            lineHeight: 1.5,
            wordBreak: 'break-word',
          }}
          dangerouslySetInnerHTML={{ __html: markdownHtml }}
        />
      )}
      {sections && <SectionsPreview sections={sections} applied theme={theme} />}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ padding: '10px 14px', borderRadius: '14px 14px 14px 4px', background: '#f5f5f5' }}>
        <Spin size="small" />
        <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>Thinking...</span>
      </div>
    </div>
  );
}

function StreamingMessage({ content }) {
  const markdownHtml = renderMarkdown(content);
  const result = extractJsonResult(content);
  const sections = result?.sections || null;
  // Check if JSON block is still being written (opened but not closed)
  const jsonInProgress = !sections && /```json\s*[\s\S]*$/.test(content) && !/```json\s*[\s\S]*?```/.test(content);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: '#999', marginBottom: 3, paddingLeft: 4 }}>AI Designer</div>
      {markdownHtml && (
        <div
          style={{
            maxWidth: '88%',
            padding: '10px 14px',
            borderRadius: '14px 14px 14px 4px',
            background: '#f5f5f5',
            color: '#333',
            fontSize: 13,
            lineHeight: 1.5,
            wordBreak: 'break-word',
          }}
          dangerouslySetInnerHTML={{ __html: markdownHtml }}
        />
      )}
      {jsonInProgress && (
        <div style={{ maxWidth: '94%', marginTop: 6 }}>
          <div style={{ background: '#fff', border: '1px dashed #1890ff', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Spin size="small" />
            <span style={{ fontSize: 12, color: '#1890ff', fontWeight: 500 }}>Building layout...</span>
          </div>
        </div>
      )}
      {sections && <SectionsPreview sections={sections} theme={result?.settings?.theme} />}
    </div>
  );
}

export default function ChatPanel({ open, onClose, currentSections, onApplyLayout }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMime, setImageMime] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const chatEndRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const buildHistory = useCallback(() => {
    return messages.slice(-20).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
  }, [messages]);

  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text, imageUrl: imagePreview || undefined };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    const sentBase64 = imageBase64;
    const sentMime = imageMime;
    const sentImageUrl = imageUrl;
    setImageUrl(null);
    setImageBase64(null);
    setImageMime(null);
    setImagePreview(null);
    setLoading(true);
    setStreamingContent('');

    const history = buildHistory();
    const token = localStorage.getItem('admin_token');
    const baseUrl = import.meta.env.VITE_API_URL;

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const response = await fetch(`${baseUrl}/admin/settings/page-builder/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          current_sections: currentSections,
          history,
          image_base64: sentBase64 || undefined,
          image_mime: sentMime || undefined,
          image_url: (!sentBase64 && sentImageUrl) ? sentImageUrl : undefined,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 429) {
          message.warning('Rate limit reached. Please wait a moment.');
        } else {
          message.error('Failed to get AI response.');
        }
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const data = JSON.parse(jsonStr);
            if (data.error) {
              message.error(data.error);
              continue;
            }
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              accumulated += text;
              setStreamingContent(accumulated);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      if (accumulated) {
        setMessages((prev) => [...prev, { role: 'assistant', content: accumulated }]);
        // Auto-apply if AI returned valid sections (and optionally store settings)
        const aiResult = extractJsonResult(accumulated);
        if (aiResult) {
          // Pass both sections AND settings to parent — it saves everything in one go
          onApplyLayout({ sections: aiResult.sections, settings: aiResult.settings || {} });
          const parts = [];
          if (aiResult.settings?.theme) parts.push(`"${aiResult.settings.theme}" theme`);
          if (aiResult.settings?.announcement_text) parts.push('announcement');
          if (parts.length) {
            message.success(`Layout, ${parts.join(' & ')} applied & saved!`, 4);
          } else {
            message.success('Layout applied & saved! Use Ctrl+Z to undo.');
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        message.error('Connection error. Please try again.');
      }
    } finally {
      setStreamingContent('');
      setLoading(false);
      abortRef.current = null;
    }
  }, [inputValue, loading, imageUrl, currentSections, buildHistory, onApplyLayout]);

  const readFileAsBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const commaIdx = dataUrl.indexOf(',');
        const base64 = dataUrl.substring(commaIdx + 1);
        const mime = dataUrl.substring(5, dataUrl.indexOf(';'));
        resolve({ base64, mime });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleUpload = useCallback(async (file) => {
    setUploading(true);
    try {
      const { base64, mime } = await readFileAsBase64(file);
      setImageBase64(base64);
      setImageMime(mime);
      setImageUrl(null);
      setImagePreview(URL.createObjectURL(file));
      message.success('Image attached');
    } catch {
      message.error('Failed to read image');
    } finally {
      setUploading(false);
    }
    return false;
  }, [readFileAsBase64]);

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleUpload(file);
        return;
      }
    }
    // Check for pasted image URL — send as image_url for backend to fetch
    const text = e.clipboardData?.getData('text/plain')?.trim();
    if (text && /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(text)) {
      e.preventDefault();
      setImageUrl(text);
      setImageBase64(null);
      setImageMime(null);
      setImagePreview(text);
      message.success('Image URL attached');
    }
  }, [handleUpload]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 400,
        background: '#fff',
        borderLeft: '1px solid #e8e8e8',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.08)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>AI Designer</div>
          <div style={{ fontSize: 11, color: '#999' }}>Describe your ideal homepage layout</div>
        </div>
        <Button type="text" icon={<CloseOutlined />} onClick={onClose} size="small" />
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 14px' }}>
        {messages.length === 0 && !streamingContent && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#bbb' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>&#129302;</div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Hi! I can help you design your homepage.</div>
            <div style={{ fontSize: 12 }}>Try: "Create a modern homepage with a hero slider, featured categories, and product grids"</div>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && streamingContent && (
          <StreamingMessage content={streamingContent} />
        )}
        {loading && !streamingContent && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div style={{ padding: '0 14px 8px', flexShrink: 0 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={imagePreview} alt="Upload preview" style={{ height: 60, borderRadius: 6, border: '1px solid #eee' }} />
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => { setImageUrl(null); setImageBase64(null); setImageMime(null); setImagePreview(null); }}
              style={{ position: 'absolute', top: -6, right: -6, background: '#fff', borderRadius: '50%', boxShadow: '0 1px 4px rgba(0,0,0,0.15)', width: 20, height: 20, minWidth: 20, padding: 0, fontSize: 10 }}
            />
          </div>
        </div>
      )}

      {/* Input area */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
        <Upload
          showUploadList={false}
          accept=".jpg,.jpeg,.png,.webp"
          beforeUpload={handleUpload}
          disabled={uploading}
        >
          <Button icon={<PictureOutlined />} loading={uploading} size="small" style={{ borderRadius: 6 }} />
        </Upload>
        <Input.TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Describe your layout... (paste images with Ctrl+V)"
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{ borderRadius: 8, resize: 'none' }}
          disabled={loading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          disabled={!inputValue.trim()}
          style={{ borderRadius: 8 }}
        />
      </div>
    </div>
  );
}
