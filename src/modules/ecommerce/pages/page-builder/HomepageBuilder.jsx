import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  ColumnHeightOutlined,
  CopyOutlined,
  DeleteOutlined,
  DesktopOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  HolderOutlined,
  PlusOutlined,
  RedoOutlined,
  ReloadOutlined,
  RobotOutlined,
  SaveOutlined,
  SettingOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  closestCenter,
  rectIntersection,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, ColorPicker, Drawer, InputNumber, Modal, Radio, Space, Spin, Tag, Tooltip, Typography, message } from 'antd';
import { createElement, useCallback, useEffect, useRef, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminAxios from '../../services/adminAxios';
import {
  DEFAULT_HOMEPAGE_CONFIG,
  SECTION_TYPES,
  SECTION_TYPE_GROUPS,
  getSectionType,
  generateSectionId,
  generateColId,
} from './constants';
import SectionPreview from './SectionPreview';
import SectionSettings from './SectionSettings';
import ChatPanel from './ChatPanel';
import useHistory from './useHistory';

const { Title, Text } = Typography;

/* ════════════════════════════════════════════════════════════
   Sidebar — Element palette
   ════════════════════════════════════════════════════════════ */

function SidebarDraggableItem({ type: sectionType }) {
  const info = getSectionType(sectionType);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${sectionType}`,
    data: { fromSidebar: true, sectionType },
  });
  if (!info) return null;

  return (
    <div
      ref={setNodeRef} {...attributes} {...listeners}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, cursor: 'grab', border: '1px solid #eee', background: isDragging ? '#e6f7ff' : '#fff', opacity: isDragging ? 0.6 : 1, transition: 'background 0.15s', marginBottom: 6, userSelect: 'none' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f5ff'; e.currentTarget.style.borderColor = '#91caff'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = isDragging ? '#e6f7ff' : '#fff'; e.currentTarget.style.borderColor = '#eee'; }}
    >
      {createElement(info.icon, { style: { fontSize: 16, color: '#1890ff', flexShrink: 0 } })}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#333', lineHeight: 1.3 }}>{info.name}</div>
        <div style={{ fontSize: 10, color: '#999', lineHeight: 1.2 }}>{info.description}</div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid #e8e8e8', background: '#fafbfc', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 12px 8px', borderBottom: '1px solid #f0f0f0' }}>
        <Text strong style={{ fontSize: 13 }}>Elements</Text>
        <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>Drag onto canvas</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 10px' }}>
        {SECTION_TYPE_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, paddingLeft: 2 }}>{group.label}</div>
            {group.types.map((type) => <SidebarDraggableItem key={type} type={type} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Drop zone between sections
   ════════════════════════════════════════════════════════════ */

function DropZone({ id, isAnyDragging }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  if (!isAnyDragging) return <div style={{ height: 4 }} />;
  return (
    <div ref={setNodeRef} style={{ height: isOver ? 52 : 14, borderRadius: 8, border: `2px dashed ${isOver ? '#1890ff' : 'transparent'}`, background: isOver ? '#e6f7ff' : 'transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px 0' }}>
      {isOver && <span style={{ fontSize: 11, color: '#1890ff', fontWeight: 500 }}>Drop here</span>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Side Drop Zone — drop beside a resized section
   ════════════════════════════════════════════════════════════ */

function SideDropZone({ id, side, gapPercent }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        top: 6,
        bottom: 6,
        [side]: 2,
        width: `${Math.max(gapPercent - 1, 4)}%`,
        minWidth: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        border: `2px dashed ${isOver ? '#1890ff' : '#ccc'}`,
        background: isOver ? 'rgba(24,144,255,0.08)' : 'rgba(0,0,0,0.015)',
        transition: 'all 0.2s',
        zIndex: 5,
      }}
    >
      <div style={{ textAlign: 'center', color: isOver ? '#1890ff' : '#ccc', pointerEvents: 'none' }}>
        <PlusOutlined style={{ fontSize: isOver ? 18 : 14, display: 'block', marginBottom: isOver ? 3 : 0, transition: 'all 0.15s' }} />
        {isOver && <div style={{ fontSize: 10, fontWeight: 600 }}>Drop</div>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Quick Style Bar — inline controls on selected section
   ════════════════════════════════════════════════════════════ */

const QS_BAR = { position: 'absolute', bottom: -42, left: 0, right: 0, zIndex: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '6px 12px', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)', borderRadius: '0 0 10px 10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #e8e8e8', borderTop: 'none', flexWrap: 'wrap' };
const QS_LABEL = { fontSize: 10, color: '#999', fontWeight: 600, whiteSpace: 'nowrap' };

const RESIZE_CONFIG = {
  hero_slider:         { height: true,  width: true },
  featured_categories: { height: false, width: true },
  product_grid:        { height: false, width: true },
  features_banner:     { height: false, width: true },
  custom_banner:       { height: true,  width: true },
  text_block:          { height: false, width: true },
  image:               { height: false, width: true },
  video:               { height: false, width: true },
  button:              { height: false, width: true },
  spacer:              { height: true,  width: false },
  divider:             { height: false, width: false },
  newsletter:          { height: false, width: true },
  row:                 { height: false, width: true },
};

function QuickStyleBar({ section, onUpdate }) {
  const s = section.settings || {};
  const upd = (key, val) => onUpdate({ ...section, settings: { ...s, [key]: val } });

  const type = section.type;

  // Determine which controls to show
  const resizeCfg = RESIZE_CONFIG[type] || {};
  const showBgColor = ['custom_banner', 'text_block', 'newsletter', 'button'].includes(type);
  const showTextColor = ['text_block', 'button'].includes(type);
  const showAlign = ['custom_banner', 'text_block', 'button'].includes(type);
  const showHeight = ['hero_slider', 'custom_banner', 'spacer'].includes(type);
  const showPadding = type === 'text_block';
  const showDivider = type === 'divider';
  const showRadius = ['image', 'video'].includes(type);
  const showColumns = type === 'product_grid';
  const showMaxWidth = resizeCfg.width;

  const hasAny = showBgColor || showTextColor || showAlign || showHeight || showPadding || showDivider || showRadius || showColumns || showMaxWidth;
  if (!hasAny) return null;

  return (
    <div style={QS_BAR} onClick={(e) => e.stopPropagation()}>
      {showBgColor && (
        <>
          <span style={QS_LABEL}>BG</span>
          <ColorPicker size="small" value={s.bgColor || '#ffffff'} onChange={(_, hex) => upd('bgColor', hex)} />
        </>
      )}
      {showTextColor && (
        <>
          <span style={QS_LABEL}>Text</span>
          <ColorPicker size="small" value={s.textColor || '#333333'} onChange={(_, hex) => upd('textColor', hex)} />
        </>
      )}
      {showDivider && (
        <>
          <span style={QS_LABEL}>Color</span>
          <ColorPicker size="small" value={s.color || '#e8e8e8'} onChange={(_, hex) => upd('color', hex)} />
          <span style={QS_LABEL}>Thick</span>
          <InputNumber size="small" min={1} max={10} value={s.thickness || 1} onChange={(v) => upd('thickness', v)} style={{ width: 52 }} />
        </>
      )}
      {showAlign && (
        <Radio.Group size="small" value={s.textAlign || s.align || 'center'} onChange={(e) => upd(type === 'button' ? 'align' : 'textAlign', e.target.value)}>
          <Radio.Button value="left"><AlignLeftOutlined /></Radio.Button>
          <Radio.Button value="center"><AlignCenterOutlined /></Radio.Button>
          <Radio.Button value="right"><AlignRightOutlined /></Radio.Button>
        </Radio.Group>
      )}
      {showHeight && (
        <>
          <span style={QS_LABEL}><ColumnHeightOutlined /></span>
          <InputNumber size="small" min={30} max={800} step={10} value={s.height || (type === 'spacer' ? 40 : 200)} onChange={(v) => upd('height', v)} style={{ width: 64 }} />
        </>
      )}
      {showPadding && (
        <>
          <span style={QS_LABEL}>Pad</span>
          <InputNumber size="small" min={0} max={120} step={4} value={s.padding || 40} onChange={(v) => upd('padding', v)} style={{ width: 56 }} />
        </>
      )}
      {showRadius && (
        <>
          <span style={QS_LABEL}>Radius</span>
          <InputNumber size="small" min={0} max={50} value={s.borderRadius ?? 12} onChange={(v) => upd('borderRadius', v)} style={{ width: 56 }} />
        </>
      )}
      {showColumns && (
        <>
          <span style={QS_LABEL}>Cols</span>
          <InputNumber size="small" min={2} max={6} value={s.columns || 5} onChange={(v) => upd('columns', v)} style={{ width: 52 }} />
        </>
      )}
      {showMaxWidth && (
        <>
          <span style={QS_LABEL}>Width</span>
          <InputNumber size="small" min={20} max={100} value={s.maxWidth ?? 100} onChange={(v) => upd('maxWidth', v)} style={{ width: 56 }} />
          <span style={{ fontSize: 10, color: '#bbb' }}>%</span>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Resize Handles — drag edges & corners to resize
   ════════════════════════════════════════════════════════════ */

function ResizeHandles({ section, containerRef, onLiveResize, onCommit }) {
  const config = RESIZE_CONFIG[section.type] || {};
  const [activeHandle, setActiveHandle] = useState(null);
  const [liveSize, setLiveSize] = useState(null);

  if (!config.height && !config.width) return null;

  const getCursor = (handle) => {
    const isCorner = handle.includes('-');
    if (!isCorner) return (handle === 'top' || handle === 'bottom') ? 'ns-resize' : 'ew-resize';
    if (config.height && config.width) return (handle === 'top-left' || handle === 'bottom-right') ? 'nwse-resize' : 'nesw-resize';
    if (config.height) return 'ns-resize';
    return 'ew-resize';
  };

  const startResize = (handle, e) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    const parentWidth = containerRef.current?.parentElement?.offsetWidth || rect?.width || 700;
    const startX = e.clientX;
    const startY = e.clientY;
    const startHeight = section.settings?.height || rect?.height || 200;
    const startMaxWidth = section.settings?.maxWidth ?? 100;
    let currentH = startHeight;
    let currentW = startMaxWidth;
    setActiveHandle(handle);

    const onMove = (ev) => {
      const overrides = {};
      const deltaX = ev.clientX - startX;
      const deltaY = ev.clientY - startY;

      if (config.height) {
        const isBottom = handle === 'bottom' || handle === 'bottom-left' || handle === 'bottom-right';
        const isTop = handle === 'top' || handle === 'top-left' || handle === 'top-right';
        if (isBottom) { currentH = Math.max(30, Math.round(startHeight + deltaY)); overrides.height = currentH; }
        else if (isTop) { currentH = Math.max(30, Math.round(startHeight - deltaY)); overrides.height = currentH; }
      }

      if (config.width) {
        const isRight = handle === 'right' || handle === 'bottom-right' || handle === 'top-right';
        const isLeft = handle === 'left' || handle === 'bottom-left' || handle === 'top-left';
        if (isRight) { currentW = Math.max(20, Math.min(100, Math.round(startMaxWidth + (deltaX / parentWidth) * 200))); overrides.maxWidth = currentW; }
        else if (isLeft) { currentW = Math.max(20, Math.min(100, Math.round(startMaxWidth + (-deltaX / parentWidth) * 200))); overrides.maxWidth = currentW; }
      }

      setLiveSize({ height: currentH, maxWidth: currentW });
      onLiveResize(overrides);
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      const updates = { ...section.settings };
      if (config.height && currentH !== startHeight) updates.height = currentH;
      if (config.width && currentW !== startMaxWidth) updates.maxWidth = currentW;
      onCommit({ ...section, settings: updates });
      setActiveHandle(null);
      setLiveSize(null);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const isDragging = activeHandle !== null;
  const HANDLE = 8;

  const corners = [
    { key: 'top-left', top: -HANDLE / 2, left: -HANDLE / 2 },
    { key: 'top-right', top: -HANDLE / 2, right: -HANDLE / 2 },
    { key: 'bottom-left', bottom: -HANDLE / 2, left: -HANDLE / 2 },
    { key: 'bottom-right', bottom: -HANDLE / 2, right: -HANDLE / 2 },
  ];

  return (
    <>
      {/* ─ Corner handles ─ */}
      {corners.map(({ key, ...pos }) => (
        <div
          key={key}
          onMouseDown={(e) => startResize(key, e)}
          style={{ position: 'absolute', ...pos, width: HANDLE, height: HANDLE, background: '#1890ff', border: '1.5px solid #fff', borderRadius: 2, cursor: getCursor(key), zIndex: 23, boxShadow: '0 1px 4px rgba(0,0,0,0.18)' }}
        />
      ))}

      {/* ─ Bottom edge ─ */}
      {config.height && (
        <div
          onMouseDown={(e) => startResize('bottom', e)}
          style={{ position: 'absolute', bottom: -4, left: HANDLE, right: HANDLE, height: 8, cursor: 'ns-resize', zIndex: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={(e) => { if (!isDragging) e.currentTarget.firstChild.style.opacity = 1; }}
          onMouseLeave={(e) => { if (!isDragging) e.currentTarget.firstChild.style.opacity = 0; }}
        >
          <div style={{ width: 40, height: 3, borderRadius: 2, background: '#1890ff', opacity: activeHandle === 'bottom' ? 1 : 0, transition: 'opacity 0.15s' }} />
        </div>
      )}

      {/* ─ Top edge ─ */}
      {config.height && (
        <div
          onMouseDown={(e) => startResize('top', e)}
          style={{ position: 'absolute', top: -4, left: HANDLE, right: HANDLE, height: 8, cursor: 'ns-resize', zIndex: 19, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={(e) => { if (!isDragging) e.currentTarget.firstChild.style.opacity = 1; }}
          onMouseLeave={(e) => { if (!isDragging) e.currentTarget.firstChild.style.opacity = 0; }}
        >
          <div style={{ width: 40, height: 3, borderRadius: 2, background: '#1890ff', opacity: activeHandle === 'top' ? 1 : 0, transition: 'opacity 0.15s' }} />
        </div>
      )}

      {/* ─ Left edge ─ */}
      {config.width && (
        <div
          onMouseDown={(e) => startResize('left', e)}
          style={{ position: 'absolute', left: -4, top: HANDLE, bottom: HANDLE, width: 8, cursor: 'ew-resize', zIndex: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={(e) => { if (!isDragging) e.currentTarget.firstChild.style.opacity = 1; }}
          onMouseLeave={(e) => { if (!isDragging) e.currentTarget.firstChild.style.opacity = 0; }}
        >
          <div style={{ width: 3, height: 40, borderRadius: 2, background: '#1890ff', opacity: activeHandle === 'left' ? 1 : 0, transition: 'opacity 0.15s' }} />
        </div>
      )}

      {/* ─ Right edge ─ */}
      {config.width && (
        <div
          onMouseDown={(e) => startResize('right', e)}
          style={{ position: 'absolute', right: -4, top: HANDLE, bottom: HANDLE, width: 8, cursor: 'ew-resize', zIndex: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onMouseEnter={(e) => { if (!isDragging) e.currentTarget.firstChild.style.opacity = 1; }}
          onMouseLeave={(e) => { if (!isDragging) e.currentTarget.firstChild.style.opacity = 0; }}
        >
          <div style={{ width: 3, height: 40, borderRadius: 2, background: '#1890ff', opacity: activeHandle === 'right' ? 1 : 0, transition: 'opacity 0.15s' }} />
        </div>
      )}

      {/* ─ Live dimension labels ─ */}
      {isDragging && liveSize && (
        <>
          {config.height && (
            <div style={{ position: 'absolute', left: '100%', marginLeft: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(24,144,255,0.92)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, zIndex: 30, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
              {liveSize.height}px
            </div>
          )}
          {config.width && liveSize.maxWidth < 100 && (
            <div style={{ position: 'absolute', top: '100%', marginTop: 4, left: '50%', transform: 'translateX(-50%)', background: 'rgba(24,144,255,0.92)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, zIndex: 30, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
              {liveSize.maxWidth}%
            </div>
          )}
        </>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   Column Resize Overlay — drag dividers between row columns
   ════════════════════════════════════════════════════════════ */

function ColumnResizeOverlay({ section, containerRef, onUpdate }) {
  const columns = section.settings?.columns || [];
  const [dragIdx, setDragIdx] = useState(null);
  const liveColsRef = useRef(null);
  const [liveCols, setLiveCols] = useState(null);

  if (columns.length < 2) return null;

  // Calculate cumulative positions
  const displayCols = liveCols || columns;
  const positions = [];
  let acc = 0;
  for (let i = 0; i < displayCols.length - 1; i++) {
    acc += displayCols[i].width;
    positions.push({ idx: i, left: `${acc}%` });
  }

  const startColumnResize = (colIdx, e) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const containerW = containerRef.current?.offsetWidth || 700;
    const startCols = [...columns];
    setDragIdx(colIdx);

    const onMove = (ev) => {
      const deltaX = ev.clientX - startX;
      const deltaPct = (deltaX / containerW) * 100;
      const newCols = startCols.map((c) => ({ ...c }));
      const leftW = Math.max(15, Math.min(85, startCols[colIdx].width + deltaPct));
      const rightW = Math.max(15, Math.min(85, startCols[colIdx + 1].width - deltaPct));
      // Only update if both within bounds
      if (leftW >= 15 && rightW >= 15) {
        newCols[colIdx].width = Math.round(leftW);
        newCols[colIdx + 1].width = Math.round(rightW);
        liveColsRef.current = newCols;
        setLiveCols(newCols);
      }
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (liveColsRef.current) {
        onUpdate({ ...section, settings: { ...section.settings, columns: liveColsRef.current } });
      }
      setDragIdx(null);
      setLiveCols(null);
      liveColsRef.current = null;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 18, pointerEvents: 'none' }}>
      {positions.map((p) => (
        <div
          key={p.idx}
          onMouseDown={(e) => startColumnResize(p.idx, e)}
          style={{
            position: 'absolute',
            left: p.left,
            top: 0,
            bottom: 0,
            width: 14,
            marginLeft: -7,
            cursor: 'col-resize',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 19,
          }}
          onMouseEnter={(e) => { e.currentTarget.querySelector('.col-handle').style.background = '#1890ff'; }}
          onMouseLeave={(e) => { if (dragIdx !== p.idx) e.currentTarget.querySelector('.col-handle').style.background = '#bbb'; }}
        >
          <div className="col-handle" style={{ width: 4, height: 40, borderRadius: 2, background: dragIdx === p.idx ? '#1890ff' : '#bbb', transition: 'background 0.15s' }} />
        </div>
      ))}
      {/* Live width labels */}
      {liveCols && (
        <div style={{ position: 'absolute', top: -20, left: 0, right: 0, display: 'flex', pointerEvents: 'none' }}>
          {liveCols.map((c) => (
            <div key={c.id} style={{ flex: `0 0 ${c.width}%`, textAlign: 'center' }}>
              <span style={{ background: '#1890ff', color: '#fff', padding: '1px 6px', borderRadius: 3, fontSize: 10, fontWeight: 600 }}>{c.width}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Sortable visual section (with resize + quick style)
   ════════════════════════════════════════════════════════════ */

function SortableCanvasSection({ section, isSelected, onSelect, onToggle, onDelete, onEdit, onDuplicate, onMoveUp, onMoveDown, isFirst, isLast, onUpdate, isAnyDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id, data: { fromCanvas: true } });
  const containerRef = useRef(null);
  const [liveOverrides, setLiveOverrides] = useState(null);
  const typeInfo = getSectionType(section.type);

  const effectiveSettings = liveOverrides ? { ...(section.settings || {}), ...liveOverrides } : (section.settings || {});
  const effectiveSection = liveOverrides ? { ...section, settings: effectiveSettings } : section;
  const maxWidth = effectiveSettings.maxWidth ?? 100;
  const isResizing = liveOverrides !== null;

  const resizeConfig = RESIZE_CONFIG[section.type] || {};
  const hasResize = resizeConfig.height || resizeConfig.width;
  const isRow = section.type === 'row';
  const showSideZones = isAnyDragging && !isDragging && maxWidth < 90;
  const sideGap = (100 - maxWidth) / 2;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.25 : 1,
    position: 'relative',
    marginBottom: isSelected && !isResizing ? 48 : 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* ── Side drop zones (left / right of narrow sections) ── */}
      {showSideZones && (
        <>
          <SideDropZone id={`side-left-${section.id}`} side="left" gapPercent={sideGap} />
          <SideDropZone id={`side-right-${section.id}`} side="right" gapPercent={sideGap} />
        </>
      )}

      <div
        ref={containerRef}
        onClick={() => onSelect(section.id)}
        style={{
          maxWidth: `${maxWidth}%`,
          margin: '0 auto',
          position: 'relative',
          border: isSelected ? '2px solid #1890ff' : '2px solid transparent',
          borderRadius: 14,
          overflow: 'visible',
          cursor: 'pointer',
          transition: isResizing ? 'border-color 0.15s' : 'border-color 0.15s, box-shadow 0.15s, max-width 0.15s',
          boxShadow: isSelected ? '0 0 0 3px rgba(24,144,255,0.10)' : 'none',
          opacity: section.visible ? 1 : 0.35,
          filter: section.visible ? 'none' : 'grayscale(0.7)',
        }}
      >
        {/* ── Top toolbar overlay ── */}
        <div
          className="pb-section-toolbar"
          style={{ position: 'absolute', top: -1, left: -1, right: -1, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)', borderRadius: '14px 14px 0 0', opacity: isSelected ? 1 : 0, transition: 'opacity 0.12s' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span {...attributes} {...listeners} style={{ cursor: 'grab', color: '#fff', display: 'flex', padding: '2px 3px', borderRadius: 4, background: 'rgba(255,255,255,0.15)' }}>
              <HolderOutlined style={{ fontSize: 14 }} />
            </span>
            <Tag color="blue" style={{ margin: 0, fontSize: 10, border: 'none', borderRadius: 4, fontWeight: 600, lineHeight: '18px' }}>
              {typeInfo?.name || section.type}
            </Tag>
          </div>
          <Space size={0}>
            {!isFirst && <Tooltip title="Move up"><Button type="text" size="small" icon={<ArrowUpOutlined />} onClick={(e) => { e.stopPropagation(); onMoveUp(section.id); }} style={{ color: '#fff', fontSize: 12 }} /></Tooltip>}
            {!isLast && <Tooltip title="Move down"><Button type="text" size="small" icon={<ArrowDownOutlined />} onClick={(e) => { e.stopPropagation(); onMoveDown(section.id); }} style={{ color: '#fff', fontSize: 12 }} /></Tooltip>}
            <Tooltip title={section.visible ? 'Hide' : 'Show'}><Button type="text" size="small" icon={section.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />} onClick={(e) => { e.stopPropagation(); onToggle(section.id); }} style={{ color: '#fff' }} /></Tooltip>
            <Tooltip title="Settings"><Button type="text" size="small" icon={<SettingOutlined />} onClick={(e) => { e.stopPropagation(); onEdit(section.id); }} style={{ color: '#fff' }} /></Tooltip>
            <Tooltip title="Duplicate"><Button type="text" size="small" icon={<CopyOutlined />} onClick={(e) => { e.stopPropagation(); onDuplicate(section.id); }} style={{ color: '#fff' }} /></Tooltip>
            <Tooltip title="Delete"><Button type="text" size="small" icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); onDelete(section.id); }} style={{ color: '#ff7875' }} /></Tooltip>
          </Space>
        </div>

        {/* Hidden badge */}
        {!section.visible && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, background: 'rgba(0,0,0,0.65)', color: '#fff', padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <EyeInvisibleOutlined /> Hidden
          </div>
        )}

        {/* ── Live preview ── */}
        <div style={{ pointerEvents: 'none', borderRadius: 12, overflow: 'hidden' }}>
          <SectionPreview section={effectiveSection} />
        </div>

        {/* ── Resize handles (all edges + corners) ── */}
        {isSelected && hasResize && (
          <ResizeHandles
            section={section}
            containerRef={containerRef}
            onLiveResize={setLiveOverrides}
            onCommit={(updated) => { setLiveOverrides(null); onUpdate(updated); }}
          />
        )}

        {/* ── Column resize dividers (for rows) ── */}
        {isSelected && isRow && (
          <ColumnResizeOverlay section={effectiveSection} containerRef={containerRef} onUpdate={onUpdate} />
        )}

        {/* ── Quick style bar (below section) — hidden during resize ── */}
        {isSelected && !isResizing && <QuickStyleBar section={section} onUpdate={onUpdate} />}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Drag overlay
   ════════════════════════════════════════════════════════════ */

function DragOverlayContent({ active, sections }) {
  if (!active) return null;
  if (active.data?.current?.fromSidebar) {
    const info = getSectionType(active.data.current.sectionType);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#fff', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.18)', border: '2px solid #1890ff', minWidth: 160 }}>
        {info && createElement(info.icon, { style: { fontSize: 18, color: '#1890ff' } })}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{info?.name}</div>
          <div style={{ fontSize: 10, color: '#888' }}>{info?.description}</div>
        </div>
      </div>
    );
  }
  const section = sections.find((s) => s.id === active.id);
  if (!section) return null;
  const info = getSectionType(section.type);
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', border: '2px solid #1890ff', opacity: 0.92, transform: 'scale(0.96)', maxWidth: 700 }}>
      <div style={{ padding: '4px 10px', background: 'rgba(24,144,255,0.9)' }}>
        <Tag color="blue" style={{ margin: 0, fontSize: 10, border: 'none', fontWeight: 600 }}>{info?.name}</Tag>
      </div>
      <div style={{ pointerEvents: 'none' }}><SectionPreview section={section} /></div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Main Page Builder
   ════════════════════════════════════════════════════════════ */

export default function HomepageBuilder() {
  const { state: sections, set: setSections, undo, redo, canUndo, canRedo, reset } = useHistory(DEFAULT_HOMEPAGE_CONFIG.sections);
  const [selectedId, setSelectedId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const savedRef = useRef(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, sections]);

  useEffect(() => {
    adminAxios.get('/settings/page-builder')
      .then((res) => { const c = res.data?.sections || DEFAULT_HOMEPAGE_CONFIG.sections; reset(c); savedRef.current = JSON.stringify(c); })
      .catch(() => message.error('Failed to load page builder config'))
      .finally(() => setLoading(false));
  }, [reset]);

  useEffect(() => { if (savedRef.current !== null) setHasUnsaved(JSON.stringify(sections) !== savedRef.current); }, [sections]);

  /* ─── DnD ─── */
  const handleDragStart = useCallback((e) => setActiveItem(e.active), []);
  const handleDragCancel = useCallback(() => setActiveItem(null), []);
  const handleDragEnd = useCallback((event) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    /* ── Side drop → merge into a row layout ── */
    const sideMatch = typeof over.id === 'string' && over.id.match(/^side-(left|right)-(.+)$/);
    if (sideMatch) {
      const [, side, targetId] = sideMatch;
      const targetSection = sections.find((s) => s.id === targetId);
      if (!targetSection || active.id === targetId) return;

      // Build the new element column
      let newCol;
      if (active.data?.current?.fromSidebar) {
        const sType = active.data.current.sectionType;
        const tInfo = getSectionType(sType);
        if (!tInfo) return;
        newCol = { id: generateColId(), width: 0, type: sType, settings: JSON.parse(JSON.stringify(tInfo.defaultSettings)) };
      } else {
        const dragged = sections.find((s) => s.id === active.id);
        if (!dragged) return;
        const { maxWidth: _, ...cleanSettings } = dragged.settings || {};
        newCol = { id: generateColId(), width: 0, type: dragged.type, settings: cleanSettings };
      }

      // If target is a row → add column to it
      if (targetSection.type === 'row') {
        const existingCols = [...(targetSection.settings?.columns || [])];
        if (existingCols.length >= 4) return;
        const allCols = side === 'left' ? [newCol, ...existingCols] : [...existingCols, newCol];
        const perCol = Math.round(100 / allCols.length);
        allCols.forEach((c, i) => { c.width = i === allCols.length - 1 ? 100 - perCol * (allCols.length - 1) : perCol; });
        const updated = { ...targetSection, settings: { ...targetSection.settings, columns: allCols, maxWidth: undefined } };
        delete updated.settings.maxWidth;
        setSections((items) => {
          let result = items.map((s) => (s.id === targetId ? updated : s));
          if (!active.data?.current?.fromSidebar) result = result.filter((s) => s.id !== active.id);
          return result;
        });
        setSelectedId(updated.id);
        setDrawerOpen(true);
        return;
      }

      // Non-row target → create a new row
      const targetMW = targetSection.settings?.maxWidth ?? 50;
      const targetColW = Math.min(80, targetMW);
      const newColW = 100 - targetColW;
      newCol.width = newColW;
      const { maxWidth: _mw, ...cleanTargetSettings } = targetSection.settings || {};
      const targetCol = { id: generateColId(), width: targetColW, type: targetSection.type, settings: cleanTargetSettings };
      const rowSection = {
        id: generateSectionId('row'),
        type: 'row',
        visible: targetSection.visible,
        settings: { gap: 16, columns: side === 'left' ? [newCol, targetCol] : [targetCol, newCol] },
      };
      setSections((items) => {
        let result = items.map((s) => (s.id === targetId ? rowSection : s));
        if (!active.data?.current?.fromSidebar) result = result.filter((s) => s.id !== active.id);
        return result;
      });
      setSelectedId(rowSection.id);
      setDrawerOpen(true);
      return;
    }

    /* ── Regular drops ── */
    if (active.data?.current?.fromSidebar) {
      const sectionType = active.data.current.sectionType;
      const typeInfo = getSectionType(sectionType);
      if (!typeInfo) return;
      const newSection = { id: generateSectionId(sectionType), type: sectionType, visible: true, settings: JSON.parse(JSON.stringify(typeInfo.defaultSettings)) };
      if (over.id.startsWith('dropzone-')) {
        const idx = parseInt(over.id.split('-')[1], 10);
        setSections((items) => { const c = [...items]; c.splice(idx, 0, newSection); return c; });
      } else {
        const i = sections.findIndex((s) => s.id === over.id);
        setSections((items) => { const c = [...items]; c.splice(i + 1, 0, newSection); return c; });
      }
      setSelectedId(newSection.id);
      setDrawerOpen(true);
    } else {
      if (active.id === over.id) return;
      if (over.id.startsWith('dropzone-')) {
        const from = sections.findIndex((s) => s.id === active.id);
        let to = parseInt(over.id.split('-')[1], 10);
        if (from < to) to -= 1;
        if (from !== to) setSections((items) => arrayMove(items, from, to));
      } else {
        const o = sections.findIndex((s) => s.id === active.id);
        const n = sections.findIndex((s) => s.id === over.id);
        if (o !== n) setSections((items) => arrayMove(items, o, n));
      }
    }
  }, [sections, setSections]);

  /* ─── Section actions ─── */
  const toggleVisibility = useCallback((id) => setSections((items) => items.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))), [setSections]);
  const deleteSection = useCallback((id) => {
    Modal.confirm({ title: 'Delete Section', content: 'Remove this section?', okText: 'Delete', okType: 'danger', onOk: () => { setSections((items) => items.filter((s) => s.id !== id)); if (selectedId === id) { setSelectedId(null); setDrawerOpen(false); } } });
  }, [setSections, selectedId]);
  const duplicateSection = useCallback((id) => {
    setSections((items) => { const idx = items.findIndex((s) => s.id === id); if (idx < 0) return items; const cl = JSON.parse(JSON.stringify(items[idx])); cl.id = generateSectionId(cl.type); const r = [...items]; r.splice(idx + 1, 0, cl); return r; });
  }, [setSections]);
  const moveUp = useCallback((id) => setSections((items) => { const i = items.findIndex((s) => s.id === id); return i > 0 ? arrayMove(items, i, i - 1) : items; }), [setSections]);
  const moveDown = useCallback((id) => setSections((items) => { const i = items.findIndex((s) => s.id === id); return i < items.length - 1 ? arrayMove(items, i, i + 1) : items; }), [setSections]);
  const openSettings = useCallback((id) => { setSelectedId(id); setDrawerOpen(true); }, []);
  const updateSection = useCallback((upd) => setSections((items) => items.map((s) => (s.id === upd.id ? upd : s))), [setSections]);

  /* ─── Save / Restore ─── */
  const handleSave = async () => {
    setSaving(true);
    try { await adminAxios.put('/settings/page-builder', { sections }); savedRef.current = JSON.stringify(sections); setHasUnsaved(false); message.success('Homepage layout saved'); }
    catch { message.error('Failed to save layout'); }
    finally { setSaving(false); }
  };
  const handleRestore = () => {
    Modal.confirm({ title: 'Restore Default', content: 'Reset to default layout? Save afterward to persist.', okText: 'Restore', onOk: () => { setSections(JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_CONFIG.sections))); setSelectedId(null); setDrawerOpen(false); } });
  };

  const [previewMode, setPreviewMode] = useState(false);
  const iframeRef = useRef(null);
  const { user } = useAdminAuth();
  const storefrontBaseUrl = import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:3000';

  // Build preview URL with tenant subdomain so storefront resolves the correct store
  const storefrontUrl = (() => {
    const tenantDomain = user?.tenant?.domain;
    if (!tenantDomain) return storefrontBaseUrl;
    try {
      const url = new URL(storefrontBaseUrl);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return `${url.protocol}//${tenantDomain}.lvh.me${url.port ? ':' + url.port : ''}`;
      }
      return storefrontBaseUrl;
    } catch {
      return storefrontBaseUrl;
    }
  })();

  const refreshPreview = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }, []);

  const handleApplyAiLayout = useCallback(async ({ sections: newSections, settings }) => {
    setSections(newSections);
    setSelectedId(null);
    setDrawerOpen(false);
    // Save both sections AND store settings (theme, announcement) before refreshing
    try {
      const saves = [adminAxios.put('/settings/page-builder', { sections: newSections })];
      if (settings && Object.keys(settings).length > 0) {
        saves.push(adminAxios.put('/settings', settings));
      }
      await Promise.all(saves);
      savedRef.current = JSON.stringify(newSections);
      setHasUnsaved(false);
      // Refresh storefront preview after both saves complete
      setTimeout(refreshPreview, 500);
    } catch {
      message.warning('Layout applied locally. Click Save to persist.');
    }
  }, [setSections, refreshPreview]);

  const selectedSection = sections.find((s) => s.id === selectedId) || null;
  const selectedTypeInfo = selectedSection ? getSectionType(selectedSection.type) : null;
  const isDragging = !!activeItem;

  if (loading) return <div style={{ textAlign: 'center', padding: 100 }}><Spin size="large" /></div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Title level={4} style={{ margin: 0 }}>Page Builder</Title>
          {hasUnsaved && <Tag color="orange">Unsaved</Tag>}
        </div>
        <Space wrap>
          <Tooltip title="Undo (Ctrl+Z)"><Button icon={<UndoOutlined />} disabled={!canUndo} onClick={undo} /></Tooltip>
          <Tooltip title="Redo (Ctrl+Y)"><Button icon={<RedoOutlined />} disabled={!canRedo} onClick={redo} /></Tooltip>
          <Button icon={<RobotOutlined />} onClick={() => setChatOpen(true)}>AI Designer</Button>
          <Button
            icon={previewMode ? <EditOutlined /> : <DesktopOutlined />}
            onClick={() => { if (!previewMode) refreshPreview(); setPreviewMode(!previewMode); }}
            type={previewMode ? 'primary' : 'default'}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          {previewMode && <Tooltip title="Refresh preview"><Button icon={<ReloadOutlined />} onClick={refreshPreview} /></Tooltip>}
          <Button onClick={handleRestore}>Restore Default</Button>
          <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={handleSave}>Save</Button>
        </Space>
      </div>

      {/* Storefront live preview */}
      {previewMode && (
        <div style={{ border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden', background: '#fff', height: 'calc(100vh - 180px)', minHeight: 500 }}>
          <div style={{ background: '#f7f8fa', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #eee' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            <div style={{ flex: 1, textAlign: 'center', background: '#fff', borderRadius: 4, padding: '2px 0', fontSize: 11, color: '#aaa', marginLeft: 8 }}>{storefrontUrl}</div>
            <Button size="small" type="text" icon={<ReloadOutlined style={{ fontSize: 12 }} />} onClick={refreshPreview} />
          </div>
          <iframe
            ref={iframeRef}
            src={storefrontUrl}
            style={{ width: '100%', height: 'calc(100% - 34px)', border: 'none' }}
            title="Storefront Preview"
          />
        </div>
      )}

      {/* Main layout */}
      <div style={{ display: previewMode ? 'none' : 'flex', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden', background: '#fff', height: 'calc(100vh - 180px)', minHeight: 500 }}>
        <Sidebar />
        <div style={{ flex: 1, overflow: 'auto', background: '#f0f2f5', padding: 20 }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'visible' }}>
              {/* Browser bar */}
              <div style={{ background: '#f7f8fa', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #eee' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <div style={{ flex: 1, textAlign: 'center', background: '#fff', borderRadius: 4, padding: '2px 0', fontSize: 11, color: '#aaa', marginLeft: 8 }}>yourstore.com</div>
              </div>

              {/* Sections canvas */}
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column' }}>
                <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <DropZone id="dropzone-0" isAnyDragging={isDragging} />
                  {sections.map((section, idx) => (
                    <div key={section.id}>
                      <SortableCanvasSection
                        section={section}
                        isSelected={selectedId === section.id}
                        onSelect={setSelectedId}
                        onToggle={toggleVisibility}
                        onDelete={deleteSection}
                        onEdit={openSettings}
                        onDuplicate={duplicateSection}
                        onMoveUp={moveUp}
                        onMoveDown={moveDown}
                        isFirst={idx === 0}
                        isLast={idx === sections.length - 1}
                        onUpdate={updateSection}
                        isAnyDragging={isDragging}
                      />
                      <DropZone id={`dropzone-${idx + 1}`} isAnyDragging={isDragging} />
                    </div>
                  ))}
                </SortableContext>
                {sections.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#bbb' }}>
                    <PlusOutlined style={{ fontSize: 36, marginBottom: 8, display: 'block' }} />
                    <div style={{ fontSize: 14, marginBottom: 4 }}>No sections yet</div>
                    <div style={{ fontSize: 12 }}>Drag elements from the sidebar</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
        <DragOverlayContent active={activeItem} sections={sections} />
      </DragOverlay>

      <Drawer
        title={selectedTypeInfo ? <Space>{createElement(selectedTypeInfo.icon)}<span>{selectedTypeInfo.name} Settings</span></Space> : 'Section Settings'}
        placement="right" width={360} open={drawerOpen} onClose={() => setDrawerOpen(false)} mask={false} styles={{ body: { paddingTop: 8 } }}
      >
        <SectionSettings section={selectedSection} onChange={updateSection} />
      </Drawer>

      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        currentSections={sections}
        onApplyLayout={handleApplyAiLayout}
      />

      <style>{`
        .pb-section-toolbar { pointer-events: auto; }
        div:hover > div > .pb-section-toolbar { opacity: 1 !important; }
      `}</style>
    </DndContext>
  );
}
