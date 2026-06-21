import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { products as initialProducts } from '../data/products'

const generateOrders = () => {
  const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
  const names = ['Rajesh Kumar', 'Amit Sharma', 'Vikas Mehta', 'Suresh Patel', 'Pradeep Rao', 'Mahesh Tiwari', 'Kiran Bose', 'Arjun Singh', 'Dev Verma', 'Sanjay Gupta']
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow']
  return Array.from({ length: 47 }, (_, i) => ({
    id: `NP${String(1000 + i).padStart(5, '0')}`,
    customer: names[i % names.length],
    email: `customer${i}@gmail.com`,
    phone: `98${String(10000000 + i * 12345).slice(0,8)}`,
    product: i % 2 === 0 ? 'Goli Bull Night' : 'Majoon Moosli',
    variant: '1 Month Supply',
    qty: Math.floor(Math.random() * 3) + 1,
    amount: i % 2 === 0 ? (Math.floor(Math.random() * 3) + 1) * 1299 : (Math.floor(Math.random() * 3) + 1) * 999,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    paymentMethod: i % 3 === 0 ? 'COD' : i % 3 === 1 ? 'UPI' : 'Card',
    city: cities[i % cities.length],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    address: `${Math.floor(Math.random() * 500) + 1}, Sample Street, ${cities[i % cities.length]}`,
    trackingId: statuses[Math.floor(Math.random() * statuses.length)] === 'shipped' ? `DTDC${String(100000 + i).padStart(8, '0')}` : null,
  }))
}

const generateCustomers = () => {
  const names = ['Rajesh Kumar', 'Amit Sharma', 'Vikas Mehta', 'Suresh Patel', 'Pradeep Rao', 'Mahesh Tiwari', 'Kiran Bose', 'Arjun Singh', 'Dev Verma', 'Sanjay Gupta', 'Rohit Jain', 'Deepak Nair', 'Ankit Dubey', 'Ramesh Yadav', 'Nitin Kapoor']
  return names.map((name, i) => ({
    id: `C${String(100 + i).padStart(4, '0')}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
    phone: `98${String(10000000 + i * 9876).slice(0,8)}`,
    orders: Math.floor(Math.random() * 5) + 1,
    totalSpent: (Math.floor(Math.random() * 8) + 1) * 1299,
    lastOrder: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai'][i % 5],
    loyalty: i % 3 === 0 ? 'Gold' : i % 3 === 1 ? 'Silver' : 'Bronze',
  }))
}

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  revenue: Math.floor(Math.random() * 150000) + 80000,
  orders: Math.floor(Math.random() * 120) + 60,
  customers: Math.floor(Math.random() * 80) + 40,
}))

export const useAdminStore = create(
  persist(
    (set, get) => ({
      products: initialProducts,
      orders: generateOrders(),
      customers: generateCustomers(),
      revenueData,
      coupons: [
        { id: 1, code: 'WELCOME10', type: 'percent', value: 10, uses: 234, maxUses: 500, active: true, expires: '2025-03-31' },
        { id: 2, code: 'BULL20', type: 'percent', value: 20, uses: 89, maxUses: 200, active: true, expires: '2025-02-28' },
        { id: 3, code: 'FIRST15', type: 'percent', value: 15, uses: 456, maxUses: null, active: true, expires: null },
        { id: 4, code: 'SAVE200', type: 'flat', value: 200, uses: 123, maxUses: 300, active: false, expires: '2024-12-31' },
      ],
      shippingZones: [
        { id: 1, name: 'Metro Cities', states: 'Mumbai, Delhi, Bangalore, Chennai, Kolkata', rate: 0, freeAbove: 499 },
        { id: 2, name: 'Tier 2 Cities', states: 'Pune, Ahmedabad, Jaipur, Surat, Lucknow', rate: 49, freeAbove: 799 },
        { id: 3, name: 'Rest of India', states: 'All Other Areas', rate: 79, freeAbove: 999 },
        { id: 4, name: 'North East', states: 'Assam, Meghalaya, Manipur, Tripura, Nagaland', rate: 129, freeAbove: 1499 },
      ],
      seoSettings: {
        siteName: 'Nama Pharma',
        siteTagline: 'Premium Ayurvedic Men\'s Wellness',
        metaDescription: 'Premium Ayurvedic supplements for men\'s vitality, strength and wellness. Goli Bull Night & Majoon Moosli.',
        ogImage: '',
        googleAnalytics: 'G-XXXXXXXXXX',
        facebookPixel: '',
        schemaOrg: true,
        canonicalUrl: 'https://namapharma.com',
      },
      inventory: [
        { id: 1, product: 'Goli Bull Night', sku: 'GBN-001', stock: 23, reorderLevel: 50, lastRestocked: '2024-11-01', supplier: 'Herbal Extracts Ltd.' },
        { id: 2, product: 'Majoon Moosli', sku: 'MM-001', stock: 47, reorderLevel: 50, lastRestocked: '2024-11-05', supplier: 'Ayur Herbs Co.' },
      ],
      reviews: [
        { id: 1, product: 'Goli Bull Night', customer: 'Rajesh K.', rating: 5, text: 'Excellent product quality.', status: 'published', date: '2024-11-15' },
        { id: 2, product: 'Majoon Moosli', customer: 'Pradeep R.', rating: 5, text: 'Traditional recipe with modern quality.', status: 'published', date: '2024-11-10' },
        { id: 3, product: 'Goli Bull Night', customer: 'Anonymous', rating: 2, text: 'Did not work for me.', status: 'pending', date: '2024-11-08' },
      ],
      blogs: [
        { id: 1, title: '5 Ayurvedic Herbs Every Man Should Know', slug: '5-ayurvedic-herbs', status: 'published', date: '2024-11-10', views: 2341 },
        { id: 2, title: 'How Ashwagandha Supports Men\'s Health', slug: 'ashwagandha-mens-health', status: 'published', date: '2024-10-28', views: 1876 },
        { id: 3, title: 'The Science Behind Safed Musli', slug: 'science-safed-musli', status: 'draft', date: '2024-11-20', views: 0 },
      ],

      returns: [
        { id:'RET-001', order:'NP-1847', customer:'Manish Patel', reason:'Wrong product received', amount:1299, requested:'2026-06-15', status:'pending' },
        { id:'RET-002', order:'NP-1791', customer:'Suresh Kumar', reason:'Product damaged in transit', amount:999,  requested:'2026-06-10', status:'approved' },
        { id:'RET-003', order:'NP-1654', customer:'Deepak Singh', reason:'Not satisfied with results', amount:1299, requested:'2026-06-05', status:'rejected' },
        { id:'RET-004', order:'NP-1623', customer:'Ankit Sharma', reason:'Changed mind', amount:999,  requested:'2026-06-02', status:'refunded' },
      ],

      updateOrderStatus: (id, status) =>
        set({ orders: get().orders.map(o => o.id === id ? { ...o, status } : o) }),

      updateProduct: (productData) =>
        set({ products: get().products.map(p => p.id === productData.id ? { ...p, ...productData } : p) }),

      addProduct: (product) =>
        set({ products: [...get().products, { ...product, id: Date.now(), rating: 4.5, reviewCount: 0, isLowStock: false }] }),

      deleteProduct: (id) =>
        set({ products: get().products.filter(p => p.id !== id) }),

      toggleCoupon: (id) =>
        set({ coupons: get().coupons.map(c => c.id === id ? { ...c, active: !c.active } : c) }),

      addCoupon: (coupon) =>
        set({ coupons: [...get().coupons, { ...coupon, id: Date.now(), uses: 0 }] }),

      deleteCoupon: (id) =>
        set({ coupons: get().coupons.filter(c => c.id !== id) }),

      updateSEO: (data) =>
        set({ seoSettings: { ...get().seoSettings, ...data } }),

      addShippingZone: (zone) =>
        set({ shippingZones: [...get().shippingZones, { ...zone, id: Date.now() }] }),

      updateShippingZone: (id, data) =>
        set({ shippingZones: get().shippingZones.map(z => z.id === id ? { ...z, ...data } : z) }),

      deleteShippingZone: (id) =>
        set({ shippingZones: get().shippingZones.filter(z => z.id !== id) }),

      addBlog: (post) =>
        set({ blogs: [...get().blogs, { ...post, id: Date.now(), views: 0, date: new Date().toISOString().slice(0,10) }] }),

      updateBlog: (id, data) =>
        set({ blogs: get().blogs.map(b => b.id === id ? { ...b, ...data } : b) }),

      deleteBlog: (id) =>
        set({ blogs: get().blogs.filter(b => b.id !== id) }),

      updateReturn: (id, status) =>
        set({ returns: get().returns.map(r => r.id === id ? { ...r, status } : r) }),

      getTotalRevenue: () => get().orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.amount, 0),
      getTotalOrders: () => get().orders.length,
      getPendingOrders: () => get().orders.filter(o => o.status === 'pending').length,
      getTotalCustomers: () => get().customers.length,
    }),
    { name: 'nama-pharma-admin', partialize: (s) => ({ seoSettings: s.seoSettings, coupons: s.coupons, blogs: s.blogs }) }
  )
)
