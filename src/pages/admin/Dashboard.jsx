import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ShoppingBag, Users, Package, AlertCircle, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useAdminStore } from '../../store/adminStore'
import { Link } from 'react-router-dom'

const COLORS = ['#C9A84C', '#FFD700', '#8B6914', '#5a4508']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-4 py-3 rounded-lg text-xs" style={{ background: '#F9FAFB', border: '1px solid rgba(184,146,42,0.3)' }}>
        <div className="font-medium mb-1" style={{ color: 'var(--gold)' }}>{label}</div>
        {payload.map(p => (
          <div key={p.name} style={{ color: p.color }}>
            {p.name}: {p.name === 'revenue' ? `₹${p.value.toLocaleString()}` : p.value}
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { orders, customers, revenueData, getTotalRevenue, getTotalOrders, getPendingOrders, getTotalCustomers, inventory } = useAdminStore()
  const totalRevenue = getTotalRevenue()
  const totalOrders = getTotalOrders()
  const pendingOrders = getPendingOrders()
  const totalCustomers = getTotalCustomers()

  const productSplit = [
    { name: 'Goli Bull Night', value: Math.round(totalOrders * 0.58) },
    { name: 'Majoon Moosli', value: Math.round(totalOrders * 0.42) },
  ]

  const recentOrders = orders.slice(0, 6)

  const statCards = [
    { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}K`, change: '+23%', positive: true, icon: TrendingUp, color: 'rgba(184,146,42,0.15)' },
    { label: 'Total Orders', value: totalOrders, change: '+18%', positive: true, icon: ShoppingBag, color: 'rgba(74,222,128,0.1)' },
    { label: 'Pending Orders', value: pendingOrders, change: pendingOrders > 5 ? 'Action needed' : 'On track', positive: pendingOrders <= 5, icon: AlertCircle, color: pendingOrders > 5 ? 'rgba(255,165,0,0.1)' : 'rgba(184,146,42,0.15)' },
    { label: 'Total Customers', value: totalCustomers, change: '+12%', positive: true, icon: Users, color: 'rgba(147,51,234,0.1)' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Welcome back! Here's what's happening with Nama Pharma.</p>
        </div>
        <div className="flex gap-3">
          <select className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(184,146,42,0.2)', color: 'var(--text-muted)', outline: 'none' }}>
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <Link to="/admin/orders" className="btn-gold py-2 px-5 text-xs">View All Orders</Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.color }}>
                <card.icon size={18} style={{ color: 'var(--gold)' }} />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${card.positive ? 'text-green-400' : 'text-orange-400'}`}
                style={{ background: card.positive ? 'rgba(74,222,128,0.08)' : 'rgba(255,165,0,0.08)' }}>
                {card.change}
              </span>
            </div>
            <div className="font-display text-3xl mb-1" style={{ color: 'var(--gold)' }}>{card.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium">Revenue Overview</h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>12 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(168,152,128,0.6)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(168,152,128,0.6)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="revenue" stroke="#C9A84C" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Product Split */}
        <div className="p-6 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}>
          <h3 className="font-medium mb-6">Product Sales Split</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={productSplit} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                {productSplit.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v} orders`, '']} contentStyle={{ background: '#F9FAFB', border: '1px solid rgba(184,146,42,0.3)', borderRadius: 8, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {productSplit.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span style={{ color: 'var(--text-muted)' }}>{p.name}</span>
                </div>
                <span style={{ color: 'var(--gold)' }}>{p.value} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(184,146,42,0.08)' }}>
            <h3 className="font-medium text-sm">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs" style={{ color: 'var(--gold)' }}>View all →</Link>
          </div>
          <table className="w-full admin-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td className="font-mono text-xs" style={{ color: 'var(--gold)' }}>{order.id}</td>
                  <td>{order.customer}</td>
                  <td style={{ color: 'var(--gold)' }}>₹{order.amount.toLocaleString()}</td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock + Quick Actions */}
        <div className="space-y-4">
          {/* Low Stock */}
          <div className="p-5 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(255,165,0,0.15)' }}>
            <h3 className="font-medium text-sm mb-4" style={{ color: '#ffa500' }}>⚠️ Inventory Alerts</h3>
            {inventory.filter(i => i.stock < i.reorderLevel).map(item => (
              <div key={item.id} className="flex items-center justify-between py-2 text-xs">
                <span>{item.product}</span>
                <div className="flex items-center gap-3">
                  <span style={{ color: '#ff6b6b' }}>{item.stock} units left</span>
                  <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(255,100,0,0.1)', color: '#ff8c00' }}>Reorder</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-5 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}>
            <h3 className="font-medium text-sm mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Add Product', href: '/admin/products' },
                { label: 'Process Orders', href: '/admin/orders' },
                { label: 'Create Coupon', href: '/admin/coupons' },
                { label: 'Update SEO', href: '/admin/seo' },
                { label: 'View Analytics', href: '/admin/analytics' },
                { label: 'Manage Reviews', href: '/admin/reviews' },
              ].map(({ label, href }) => (
                <Link key={href} to={href} className="p-3 rounded-xl text-xs font-medium text-center transition-all hover:scale-105"
                  style={{ background: 'rgba(184,146,42,0.06)', border: '1px solid rgba(184,146,42,0.15)', color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    pending: { bg: 'rgba(255,165,0,0.1)', color: '#ffa500', label: 'Pending' },
    confirmed: { bg: 'rgba(74,222,128,0.08)', color: 'var(--sage)', label: 'Confirmed' },
    processing: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', label: 'Processing' },
    shipped: { bg: 'rgba(147,51,234,0.1)', color: '#a855f7', label: 'Shipped' },
    delivered: { bg: 'rgba(74,222,128,0.12)', color: '#22c55e', label: 'Delivered' },
    cancelled: { bg: 'rgba(255,100,100,0.1)', color: '#ff6b6b', label: 'Cancelled' },
  }
  const s = map[status] || map.pending
  return (
    <span className="px-2 py-1 rounded-full text-[10px] font-medium" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}
