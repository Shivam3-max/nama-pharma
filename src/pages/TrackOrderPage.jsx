import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Package, CheckCircle, Truck, MapPin, ArrowRight } from 'lucide-react'
import { api } from '../lib/api'

const STEPS = [
  { key: 'confirmed',        label: 'Order Confirmed',    icon: CheckCircle, desc: 'Your order has been placed and confirmed.' },
  { key: 'processing',       label: 'Processing',         icon: Package,     desc: 'Your order is being packed at our warehouse.' },
  { key: 'shipped',          label: 'Shipped',            icon: Truck,       desc: 'Your order is on its way.' },
  { key: 'out_for_delivery', label: 'Out for Delivery',   icon: MapPin,      desc: 'Your package is out for delivery today.' },
  { key: 'delivered',        label: 'Delivered',          icon: CheckCircle, desc: 'Your order has been delivered. Enjoy!' },
]

export default function TrackOrderPage() {
  const [form, setForm]     = useState({ order_number: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError]   = useState('')

  async function handleTrack(e) {
    e.preventDefault()
    if (!form.order_number.trim() || !form.email.trim()) { setError('Both fields are required'); return }
    setLoading(true); setError(''); setResult(null)
    const { ok, data } = await api.post('/orders/track.php', form)
    setLoading(false)
    if (!ok) { setError(data.error || 'Order not found'); return }
    setResult(data)
  }

  const currentStep = result?.step ?? 0
  const order       = result?.order

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <section className="section-pad pb-12" style={{ background: 'linear-gradient(160deg, var(--sage-pale) 0%, var(--cream) 60%)' }}>
        <div className="container-wide text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-label">Order Tracking</span>
            <h1 className="font-display font-light mt-4 mb-4" style={{ fontSize: 'clamp(32px,5vw,52px)', color: 'var(--ink)' }}>
              Track Your <em className="gold-text-static not-italic">Order</em>
            </h1>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
              Enter your order number and the email used at checkout to see your delivery status.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-wide max-w-xl">
          {/* Search form */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl p-6 mb-8" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.15)', boxShadow: '0 4px 24px rgba(30,26,20,0.06)' }}>
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Order Number</label>
                <input className="input-light w-full text-sm font-mono" placeholder="NP-847261"
                  value={form.order_number} onChange={e => setForm({ ...form, order_number: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Email Used at Checkout</label>
                <input type="email" className="input-light w-full text-sm" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626' }}>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
              <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2" style={{ opacity: loading ? 0.7 : 1 }}>
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Tracking…</>
                  : <><Search size={14} /> Track Order</>}
              </button>
            </form>
          </motion.div>

          {/* Result */}
          <AnimatePresence>
            {result && order && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Order summary */}
                <div className="rounded-2xl p-5 mb-6" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.15)' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Order Number</p>
                      <p className="font-mono font-semibold text-sm mt-0.5" style={{ color: 'var(--gold)' }}>{order.order_number}</p>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-medium capitalize"
                      style={{ background: 'rgba(74,103,65,0.1)', color: 'var(--sage)' }}>
                      {order.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="space-y-1.5 pb-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    {(order.items || []).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span style={{ color: 'var(--ink-soft)' }}>{item.name} × {item.qty}</span>
                        <span style={{ color: 'var(--ink)' }}>₹{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 text-sm font-medium" style={{ color: 'var(--ink)' }}>
                    <span>Total</span><span>₹{order.total?.toLocaleString()}</span>
                  </div>
                </div>

                {/* Timeline */}
                {order.status !== 'cancelled' ? (
                  <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.15)' }}>
                    <h3 className="font-medium text-sm mb-6" style={{ color: 'var(--ink)' }}>Delivery Status</h3>
                    <div className="space-y-0">
                      {STEPS.map((step, i) => {
                        const done    = i < currentStep
                        const active  = i === currentStep - 1
                        const Icon    = step.icon
                        const isLast  = i === STEPS.length - 1
                        return (
                          <div key={step.key} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                                style={{
                                  background: done || active ? (active ? 'var(--gold)' : 'var(--sage)') : 'rgba(0,0,0,0.05)',
                                  border: `2px solid ${done || active ? (active ? 'var(--gold)' : 'var(--sage)') : 'rgba(0,0,0,0.1)'}`,
                                }}>
                                <Icon size={16} color={done || active ? '#fff' : 'rgba(0,0,0,0.25)'} />
                              </div>
                              {!isLast && <div className="w-0.5 flex-1 my-1 min-h-[32px]" style={{ background: done ? 'var(--sage)' : 'rgba(0,0,0,0.08)' }} />}
                            </div>
                            <div className={`pb-6 flex-1 ${isLast ? 'pb-0' : ''}`}>
                              <p className="text-sm font-medium" style={{ color: done || active ? 'var(--ink)' : 'var(--text-light)' }}>{step.label}</p>
                              {(done || active) && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}>
                    <p className="font-medium text-sm" style={{ color: '#DC2626' }}>This order was cancelled</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>If you need help, please contact our support team.</p>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <Link to="/shop" className="btn-outline-gold py-2.5 px-6 text-xs inline-flex items-center gap-1.5">
                    Continue Shopping <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Guest info */}
          {!result && (
            <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
              Have an account? <Link to="/login" className="font-medium" style={{ color: 'var(--gold)' }}>Sign in</Link> to see all your orders in one place.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
