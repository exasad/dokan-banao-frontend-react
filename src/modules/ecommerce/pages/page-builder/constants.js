import {
  AppstoreOutlined,
  ColumnHeightOutlined,
  ColumnWidthOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FontSizeOutlined,
  LinkOutlined,
  LineOutlined,
  MailOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  SafetyCertificateOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';

export const DEFAULT_HOMEPAGE_CONFIG = {
  sections: [
    {
      id: 'hero_slider_1',
      type: 'hero_slider',
      visible: true,
      settings: { fullWidth: true, autoplaySpeed: 5000 },
    },
    {
      id: 'featured_categories_1',
      type: 'featured_categories',
      visible: true,
      settings: { title: 'Shop by Category', itemsPerView: 10 },
    },
    {
      id: 'product_grid_1',
      type: 'product_grid',
      visible: true,
      settings: {
        title: 'Latest Products',
        subtitle: 'Discover our newest arrivals',
        source: 'latest',
        limit: 12,
        columns: 5,
      },
    },
    {
      id: 'features_banner_1',
      type: 'features_banner',
      visible: true,
      settings: {},
    },
  ],
};

export const SECTION_TYPE_GROUPS = [
  {
    label: 'Layout',
    types: ['row', 'spacer', 'divider'],
  },
  {
    label: 'Store',
    types: ['hero_slider', 'featured_categories', 'product_grid', 'features_banner'],
  },
  {
    label: 'Content',
    types: ['text_block', 'custom_banner', 'image', 'video', 'button'],
  },
  {
    label: 'Marketing',
    types: ['newsletter'],
  },
];

export const SECTION_TYPES = [
  // Layout
  {
    type: 'row',
    name: 'Columns',
    icon: ColumnWidthOutlined,
    description: 'Side-by-side columns layout',
    defaultSettings: {
      gap: 16,
      columns: [
        { id: 'col_1', width: 50, type: null, settings: {} },
        { id: 'col_2', width: 50, type: null, settings: {} },
      ],
    },
  },
  {
    type: 'spacer',
    name: 'Spacer',
    icon: ColumnHeightOutlined,
    description: 'Empty space divider',
    defaultSettings: { height: 40 },
  },
  {
    type: 'divider',
    name: 'Divider',
    icon: LineOutlined,
    description: 'Horizontal line separator',
    defaultSettings: { color: '#e8e8e8', thickness: 1, style: 'solid', width: 100, marginY: 10 },
  },
  // Store
  {
    type: 'hero_slider',
    name: 'Hero Slider',
    icon: PictureOutlined,
    description: 'Image slider carousel',
    defaultSettings: { fullWidth: true, autoplaySpeed: 5000 },
  },
  {
    type: 'featured_categories',
    name: 'Categories',
    icon: AppstoreOutlined,
    description: 'Scrollable category carousel',
    defaultSettings: { title: 'Shop by Category', itemsPerView: 10, layout: 'horizontal' },
  },
  {
    type: 'product_grid',
    name: 'Product Grid',
    icon: ShoppingOutlined,
    description: 'Grid of products',
    defaultSettings: {
      title: 'Latest Products',
      subtitle: 'Discover our newest arrivals',
      source: 'latest',
      limit: 12,
      columns: 5,
      cardStyle: 'default',
    },
  },
  {
    type: 'features_banner',
    name: 'Features',
    icon: SafetyCertificateOutlined,
    description: 'Feature cards row',
    defaultSettings: {},
  },
  // Content
  {
    type: 'text_block',
    name: 'Text Block',
    icon: FontSizeOutlined,
    description: 'Rich text / HTML content',
    defaultSettings: {
      content: '',
      bgColor: '#ffffff',
      textColor: '#333333',
      padding: 40,
      textAlign: 'center',
    },
  },
  {
    type: 'custom_banner',
    name: 'Banner',
    icon: FileImageOutlined,
    description: 'Image with text overlay',
    defaultSettings: {
      imageUrl: '',
      title: '',
      subtitle: '',
      linkUrl: '',
      linkText: '',
      height: 300,
      bgColor: '#1a1a2e',
      textAlign: 'center',
    },
  },
  {
    type: 'image',
    name: 'Image',
    icon: FileImageOutlined,
    description: 'Single image with link',
    defaultSettings: {
      src: '',
      alt: '',
      linkUrl: '',
      borderRadius: 12,
      shadow: false,
      maxWidth: 100,
    },
  },
  {
    type: 'video',
    name: 'Video',
    icon: PlayCircleOutlined,
    description: 'YouTube / Vimeo embed',
    defaultSettings: {
      url: '',
      aspectRatio: '16/9',
      borderRadius: 12,
    },
  },
  {
    type: 'button',
    name: 'Button',
    icon: LinkOutlined,
    description: 'Call-to-action button',
    defaultSettings: {
      text: 'Shop Now',
      linkUrl: '/products',
      bgColor: '#1890ff',
      textColor: '#ffffff',
      size: 'large',
      align: 'center',
      borderRadius: 8,
      fullWidth: false,
    },
  },
  // Marketing
  {
    type: 'newsletter',
    name: 'Newsletter',
    icon: MailOutlined,
    description: 'Email signup block',
    defaultSettings: {
      title: 'Subscribe to our Newsletter',
      subtitle: 'Get the latest updates and offers',
      bgColor: '#f8f9fa',
    },
  },
];

export function getSectionType(type) {
  return SECTION_TYPES.find((t) => t.type === type);
}

export function generateSectionId(type) {
  return `${type}_${Math.random().toString(36).substring(2, 8)}`;
}

export function generateColId() {
  return `col_${Math.random().toString(36).substring(2, 8)}`;
}

export const COLUMN_PRESETS = [
  { label: '50 / 50', widths: [50, 50] },
  { label: '33 / 66', widths: [33, 67] },
  { label: '66 / 33', widths: [67, 33] },
  { label: '33 / 33 / 33', widths: [33, 34, 33] },
  { label: '25 / 50 / 25', widths: [25, 50, 25] },
  { label: '25 / 25 / 25 / 25', widths: [25, 25, 25, 25] },
];
