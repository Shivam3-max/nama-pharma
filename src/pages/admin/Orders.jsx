import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, ChevronDown, Eye } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore'

const statusOptions = ['All', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const statusMap = {
  pending: { bg: 'rgba(255,165,0,0.1)', color: '#ffa500' },
  confirmed: { bg: 'rgba(74,222,128,0.08)', color: 'var(--sage)' },
  processing: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa' },
  shipped: { bg: 'rgba(147,51,234,0.1)', color: '#a855f7' },
  delivered: { bg: 'rgba(74,222,128,0.12)', color: '#22c55e' },
  cancelled: { bg: 'rgba(255,100,100,0.1)', color: '#ff6b6b' },
}

export default function Orders() {
  const { orders, updateOrderStatus } = useAdminStore()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = orders.filter(o => {
    const matchSearch = o.id.includes(search.toUpperCase()) || o.customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = status === 'All' || o.status === status
    return matchSearch && matchStatus
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl">Orders</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{orders.length} total orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs" style={{ background: 'rgba(184,146,42,0.08)', border: '1px solid rgba(184,146,42,0.2)', color: 'var(--gold)' }}>
          <Download size={12} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input className="pl-8 pr-4 py-2.5 text-xs rounded-xl w-full" placeholder="Search by order ID or customer..."
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(184,146,42,0.12)', color: 'var(--text-primary)', outline: 'none' }}
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize"
              style={{
                background: status === s ? 'rgba(184,146,42,0.15)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${status === s ? 'rgba(184,146,42,0.4)' : 'rgba(0,0,0,0.06)'}`,
                color: status === s ? 'var(--gold)' : 'var(--text-muted)',
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}>
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>City</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="cursor-pointer" onClick={() => setSelected(order)}>
                  <td className="font-mono text-xs" style={{ color: 'var(--gold)' }}>{order.id}</td>
                  <td>{order.customer}</td>
                  <td className="text-xs">{order.product}</td>
                  <td style={{ color: 'var(--gold)' }}>₹{order.amount.toLocaleString()}</td>
                  <td>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: order.paymentMethod === 'COD' ? 'rgba(255,165,0,0.1)' : 'rgba(74,222,128,0.08)', color: order.paymentMethod === 'COD' ? '#ffa500' : 'var(--sage)' }}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="text-xs">{order.city}</td>
                  <td className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value)}
                      className="text-xs px-2 py-1 rounded-full capitalize"
                      style={{ background: statusMap[order.status]?.bg, color: statusMap[order.status]?.color, border: 'none', outline: 'none', cursor: 'pointer' }}
                    >
                      {statusOptions.slice(1).map(s => <option key={s} value={s} style={{ background: '#fff', color: '#fff' }}>{s}</option>)}
                    </select>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button onClick={() => setSelected(order)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
                      <Eye size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 text-xs" style={{ color: 'var(--text-muted)', borderTop: '1px solid rgba(184,146,42,0.06)' }}>
          Showing {filtered.length} of {orders.length} orders
        </div>
      </div>

      {/* Order Detail Sidebar */}
      {selected && (
        <div className="fixed inset-0 z-[200]" onClick={() => setSelected(null)}>
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto"
            style={{ background: '#fff', borderLeft: '1px solid rgba(184,146,42,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl">Order {selected.id}</h2>
                <button onClick={() => setSelected(null)} className="text-2xl" style={{ color: 'var(--text-muted)' }}>×</button>
              </div>
              <div className="space-y-4 text-sm">
                {[
                  { label: 'Customer', value: selected.customer },
                  { label: 'Phone', value: selected.phone },
                  { label: 'Email', value: selected.email },
                  { label: 'Product', value: `${selected.product} × ${selected.qty}` },
                  { label: 'Amount', value: `₹${selected.amount.toLocaleString()}`, gold: true },
                  { label: 'Payment', value: selected.paymentMethod },
                  { label: 'City', value: selected.city },
                  { label: 'Address', value: selected.address },
                  { label: 'Tracking', value: selected.trackingId || 'Not shipped yet' },
                ].map(({ label, value, gold }) => (
                  <div key={label} className="flex items-start gap-4">
                    <span className="text-xs w-24 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ color: gold ? 'var(--gold)' : 'inherit' }}>{value}</span>
                  </div>
                ))}
                <div className="mt-6">
                  <label className="text-xs block mb-2" style={{ color: 'var(--text-muted)' }}>Update Status</label>
                  <select value={selected.status} onChange={e => { updateOrderStatus(selected.id, e.target.value); setSelected({...selected, status: e.target.value}) }}
                    className="w-full p-3 rounded-xl text-sm"
                    style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(184,146,42,0.2)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    {statusOptions.slice(1).map(s => <option key={s} value={s} style={{ background: '#fff' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
