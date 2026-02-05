import {
  ClockCircleOutlined, ShoppingCartOutlined, CarOutlined, CheckCircleOutlined, CloseCircleOutlined,
} from '@ant-design/icons';
import {createElement} from 'react';

export const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
export const paymentMethods = ['bKash', 'Nagad', 'Rocket', 'Cash on Delivery', 'Bank Transfer', 'Card'];
export const couriers = ['Pathao Courier', 'Steadfast', 'RedX', 'Sundorban Courier', 'SA Paribahan', 'Paperfly'];

export const statusConfig = {
  pending: {color: 'gold', icon: createElement(ClockCircleOutlined)},
  confirmed: {color: 'blue', icon: createElement(CheckCircleOutlined)},
  processing: {color: 'cyan', icon: createElement(ShoppingCartOutlined)},
  shipped: {color: 'purple', icon: createElement(CarOutlined)},
  delivered: {color: 'green', icon: createElement(CheckCircleOutlined)},
  cancelled: {color: 'red', icon: createElement(CloseCircleOutlined)},
  returned: {color: 'orange', icon: createElement(CloseCircleOutlined)},
};

export const paymentStatusConfig = {
  pending: {color: 'red'}, paid: {color: 'green'}, failed: {color: 'orange'}, refunded: {color: 'volcano'},
};

const bdNames = [
  'Rahim Uddin', 'Karim Hossain', 'Fatema Begum', 'Ayesha Akter', 'Mohammad Ali',
  'Nasreen Sultana', 'Jamal Ahmed', 'Salma Khatun', 'Rafiq Islam', 'Nusrat Jahan',
  'Habibur Rahman', 'Taslima Akter', 'Shahidul Islam', 'Momena Begum', 'Fazlul Haque',
  'Roksana Parvin', 'Aminul Haq', 'Jesmin Akter', 'Mizanur Rahman', 'Rehana Begum',
  'Shafiqul Islam', 'Farida Yasmin', 'Abul Kalam', 'Monira Khatun', 'Nurul Amin',
  'Shirin Akter', 'Kamrul Hasan', 'Lovely Begum', 'Zahidul Islam', 'Sufia Khatun',
  'Anisur Rahman', 'Bilkis Begum', 'Delwar Hossain', 'Halima Akter', 'Imran Ahmed',
  'Jharna Begum', 'Khairul Islam', 'Luna Akter', 'Masud Rana', 'Nurjahan Begum',
];

const bdAreas = [
  'Mirpur-10, Dhaka', 'Dhanmondi-27, Dhaka', 'Uttara Sector-7, Dhaka', 'Gulshan-2, Dhaka',
  'Banani-11, Dhaka', 'Mohammadpur, Dhaka', 'Bashundhara R/A, Dhaka', 'Motijheel, Dhaka',
  'Gazipur Sadar, Gazipur', 'Tongi, Gazipur', 'Agrabad, Chattogram', 'Nasirabad, Chattogram',
  'Halishahar, Chattogram', 'Kazir Dewri, Chattogram', 'Sonadanga, Khulna',
  'Boyra, Khulna', 'Shaheb Bazar, Rajshahi', 'Uposhohor, Rajshahi',
  'Zinda Bazar, Sylhet', 'Ambarkhana, Sylhet', 'Sagordi, Barishal', 'Band Road, Barishal',
  'Alekanda, Barishal', 'Shankipara, Mymensingh', 'Ganginarpar, Mymensingh',
  'Jatrabari, Dhaka', 'Khilgaon, Dhaka', 'Badda, Dhaka', 'Rampura, Dhaka', 'Shantinagar, Dhaka',
];

const bdPhones = () => {
  const prefixes = ['017', '018', '019', '016', '015', '013'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  let num = '';
  for (let i = 0; i < 8; i++) num += Math.floor(Math.random() * 10);
  return prefix + num;
};

export const bdProducts = [
  {id: 1, name: 'Premium Basmati Rice 5kg', price: 850, sku: 'RICE-001'},
  {id: 2, name: 'Panjabi - Cotton White', price: 1250, sku: 'PNJ-001'},
  {id: 3, name: 'Jamdani Saree - Red Gold', price: 4500, sku: 'SAR-001'},
  {id: 4, name: 'Hilsha Fish Pickle 500g', price: 380, sku: 'PKL-001'},
  {id: 5, name: 'Nakshi Kantha - Handmade', price: 2800, sku: 'KNT-001'},
  {id: 6, name: 'Muslin Dupatta', price: 950, sku: 'DPT-001'},
  {id: 7, name: 'Organic Mustard Oil 1L', price: 320, sku: 'OIL-001'},
  {id: 8, name: 'Clay Tea Cup Set (6pcs)', price: 450, sku: 'CUP-001'},
  {id: 9, name: 'Leather Sandal - Mens', price: 1100, sku: 'SND-001'},
  {id: 10, name: 'Brass Decorative Plate', price: 1650, sku: 'DEC-001'},
  {id: 11, name: 'Cotton Lungi - Checked', price: 550, sku: 'LNG-001'},
  {id: 12, name: 'Ghee - Pure Desi 500g', price: 680, sku: 'GHE-001'},
  {id: 13, name: 'Kacchi Biryani Spice Mix', price: 180, sku: 'SPC-001'},
  {id: 14, name: 'Silk Scarf - Rajshahi', price: 1350, sku: 'SCR-001'},
  {id: 15, name: 'Bamboo Basket - Large', price: 290, sku: 'BSK-001'},
  {id: 16, name: 'Turmeric Powder 1kg', price: 260, sku: 'TRM-001'},
  {id: 17, name: 'Jute Bag - Designer', price: 420, sku: 'BAG-001'},
  {id: 18, name: 'Wooden Showpiece - Boat', price: 780, sku: 'SHP-001'},
  {id: 19, name: 'Handloom Bed Cover', price: 2200, sku: 'BED-001'},
  {id: 20, name: 'Mishti Doi Set (4 cups)', price: 320, sku: 'DOI-001'},
  {id: 21, name: 'Rose Water - 200ml', price: 150, sku: 'RSW-001'},
  {id: 22, name: 'Tangail Saree - Blue', price: 3200, sku: 'SAR-002'},
  {id: 23, name: 'Leather Wallet - Genuine', price: 890, sku: 'WLT-001'},
  {id: 24, name: 'Coconut Oil - Virgin 500ml', price: 350, sku: 'COL-001'},
  {id: 25, name: 'Shital Pati Mat', price: 1800, sku: 'MAT-001'},
  {id: 26, name: 'Chanachur - Special Mix 500g', price: 120, sku: 'CHN-001'},
  {id: 27, name: 'Mango Pickle - Homemade', price: 250, sku: 'PKL-002'},
  {id: 28, name: 'Cotton Fatua - Men', price: 750, sku: 'FTA-001'},
  {id: 29, name: 'Silver Nose Pin', price: 480, sku: 'JWL-001'},
  {id: 30, name: 'Date Molasses (Khejur Gur) 1kg', price: 550, sku: 'GUR-001'},
];

const generateOrders = () => {
  const orders = [];
  const baseDate = new Date(2026, 0, 1);

  for (let i = 1; i <= 100; i++) {
    const orderDate = new Date(baseDate.getTime() + Math.random() * 34 * 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items = [];
    const usedIndices = new Set();

    for (let j = 0; j < itemCount; j++) {
      let idx;
      do { idx = Math.floor(Math.random() * bdProducts.length); } while (usedIndices.has(idx));
      usedIndices.add(idx);
      const qty = Math.floor(Math.random() * 3) + 1;
      items.push({...bdProducts[idx], quantity: qty, total: bdProducts[idx].price * qty});
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const shipping = [60, 80, 100, 120, 150][Math.floor(Math.random() * 5)];
    const discount = Math.random() > 0.6 ? Math.floor(subtotal * (Math.random() * 0.15 + 0.05)) : 0;
    const total = subtotal + shipping - discount;
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const isPaid = status === 'delivered' ? 'paid'
      : status === 'cancelled' ? (Math.random() > 0.5 ? 'refunded' : 'unpaid')
      : status === 'returned' ? 'refunded'
      : paymentMethod === 'Cash on Delivery' ? 'unpaid'
      : Math.random() > 0.3 ? 'paid' : 'unpaid';

    const customerName = bdNames[Math.floor(Math.random() * bdNames.length)];
    const customerEmail = customerName.toLowerCase().replace(/\s+/g, '.') + Math.floor(Math.random() * 100) + '@gmail.com';
    const area = bdAreas[Math.floor(Math.random() * bdAreas.length)];
    const city = area.split(', ')[1] || 'Dhaka';
    const district = city;

    orders.push({
      id: i,
      order_no: `BD-${String(2026).slice(2)}${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(4, '0')}`,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: bdPhones(),
      customer_alt_phone: Math.random() > 0.6 ? bdPhones() : null,
      customer_address: `House ${Math.floor(Math.random() * 200) + 1}, Road ${Math.floor(Math.random() * 30) + 1}, ${area}`,
      customer_city: city,
      customer_district: district,
      customer_zip: String(1000 + Math.floor(Math.random() * 9000)),
      status,
      payment_method: paymentMethod,
      payment_status: isPaid,
      courier: (status === 'shipped' || status === 'delivered') ? couriers[Math.floor(Math.random() * couriers.length)] : null,
      tracking_id: (status === 'shipped' || status === 'delivered') ? `TRK${String(Math.floor(Math.random() * 900000) + 100000)}` : null,
      items,
      subtotal,
      shipping,
      discount,
      total,
      note: Math.random() > 0.7 ? ['Please call before delivery', 'Gift wrap please', 'Deliver after 5pm', 'Handle with care', 'Leave at gate if not home'][Math.floor(Math.random() * 5)] : null,
      admin_note: Math.random() > 0.8 ? ['VIP customer - priority', 'Repeat buyer', 'Check address before dispatch', 'Fragile items'][Math.floor(Math.random() * 4)] : null,
      is_gift: Math.random() > 0.85,
      gift_message: null,
      requires_shipping: true,
      is_fragile: Math.random() > 0.8,
      call_before_delivery: Math.random() > 0.6,
      sms_notification: Math.random() > 0.3,
      email_notification: Math.random() > 0.5,
      invoice_printed: Math.random() > 0.5,
      created_at: orderDate.toISOString(),
      updated_at: new Date(orderDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
      timeline: buildOrderTimeline(status, orderDate, couriers[Math.floor(Math.random() * couriers.length)]),
    });
  }

  return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

function buildOrderTimeline(status, orderDate, courier) {
  const timeline = [];
  const addHours = (date, h) => new Date(date.getTime() + h * 60 * 60 * 1000);

  timeline.push({
    action: 'Order Placed',
    description: 'Customer placed the order',
    date: orderDate.toISOString(),
    user: 'Customer',
  });

  if (status === 'cancelled') {
    timeline.push({
      action: 'Order Cancelled',
      description: 'Order was cancelled',
      date: addHours(orderDate, 2 + Math.random() * 10).toISOString(),
      user: Math.random() > 0.5 ? 'Customer' : 'Admin',
    });
    return timeline;
  }

  if (status === 'returned') {
    timeline.push(
      {action: 'Order Confirmed', description: 'Order confirmed by admin', date: addHours(orderDate, 1).toISOString(), user: 'Admin'},
      {action: 'Order Shipped', description: `Shipped via ${courier}`, date: addHours(orderDate, 12).toISOString(), user: 'Admin'},
      {action: 'Order Delivered', description: 'Package delivered', date: addHours(orderDate, 36).toISOString(), user: 'Courier'},
      {action: 'Return Requested', description: 'Customer requested return', date: addHours(orderDate, 60).toISOString(), user: 'Customer'},
      {action: 'Return Approved', description: 'Return request approved', date: addHours(orderDate, 72).toISOString(), user: 'Admin'},
    );
    return timeline;
  }

  const flow = ['confirmed', 'processing', 'shipped', 'delivered'];
  const idx = flow.indexOf(status);
  const hours = [1, 6, 12, 36];

  for (let i = 0; i <= Math.max(idx, -1); i++) {
    const labels = {
      confirmed: {action: 'Order Confirmed', desc: 'Order confirmed by admin', user: 'Admin'},
      processing: {action: 'Processing Started', desc: 'Order is being prepared', user: 'Admin'},
      shipped: {action: 'Order Shipped', desc: `Shipped via ${courier}`, user: 'Admin'},
      delivered: {action: 'Order Delivered', desc: 'Package delivered to customer', user: 'Courier'},
    };
    const s = flow[i];
    timeline.push({
      action: labels[s].action,
      description: labels[s].desc,
      date: addHours(orderDate, hours[i] + Math.random() * 2).toISOString(),
      user: labels[s].user,
    });
  }

  return timeline;
}

let ordersStore = generateOrders();

export const getOrders = () => ordersStore;

export const getOrderById = (id) => ordersStore.find((o) => o.id === Number(id));

export const updateOrder = (id, data) => {
  ordersStore = ordersStore.map((o) => {
    if (o.id === Number(id)) {
      const updated = {...o, ...data, updated_at: new Date().toISOString()};
      // recalculate totals
      if (data.items) {
        updated.subtotal = data.items.reduce((s, item) => s + item.total, 0);
        updated.total = updated.subtotal + (updated.shipping || 0) - (updated.discount || 0);
      }
      return updated;
    }
    return o;
  });
  return getOrderById(id);
};
