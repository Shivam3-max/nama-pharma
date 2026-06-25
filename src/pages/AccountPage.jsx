import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Package, Heart, LogOut, Edit2, Save, X, ChevronRight, MapPin, Phone, Mail, RefreshCw, Pause, XCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useOrdersStore } from '../store/ordersStore'
import { useSubscriptionsStore } from '../store/subscriptionsStore'
import { useAdminStore } from '../store/adminStore'

const TABS = [
  { key: 'orders',        label: 'My Orders',     icon: Package },
  { key: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { key: 'profile',       label: 'Profile',       icon: User },
  { key: 'addresses',     label: 'Addresses',     icon: MapPin },
  { key: 'wishlist',      label: 'Wishlist',      icon: Heart },
]

const STATUS_STYLES = {
  confirmed:  { bg: 'rgba(184,146,42,0.1)',  color: 'var(--gold)' },
  processing: { bg: 'rgba(0,0,0,0.06)',       color: 'var(--text-muted)' },
  shipped:    { bg: 'rgba(74,103,65,0.12)',   color: 'var(--sage)' },
  delivered:  { bg: 'rgba(74,103,65,0.1)',    color: 'var(--sage)' },
  cancelled:  { bg: 'rgba(220,38,38,0.08)',   color: '#DC2626' },
}

export default function AccountPage() {
  const { user, logout, updateProfile, loading } = useAuthStore()
  const { orders, fetchOrders, loading: ordersLoading } = useOrdersStore()
  const { subscriptions, fetchSubscriptions, updateStatus } = useSubscriptionsStore()
  const { products } = useAdminStore()

  const [tab, setTab] = useState('orders')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const meta = user?.user_metadata || {}
  const [profileForm, setProfileForm] = useState({ name: meta.name || '', phone: meta.phone || '' })
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    if (user) { fetchOrders(); fetchSubscriptions() }
  }, [user?.id])

  // Show loading while session is being restored
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--gold)' }} />
    </div>
  )

  if (!user) return <Navigate to="/login" state={{ from: '/account' }} replace />

  const displayName = meta.name || user.email?.split('@')[0] || 'User'

  async function saveProfile() {
    setSaving(true)
    const result = await updateProfile(profileForm)
    setSaving(false)
    if (result?.error) { setSaveMsg('Failed to save: ' + result.error); return }
    setEditing(false)
    setSaveMsg('Saved!')
    setTimeout(() => setSaveMsg(''), 2500)
  }

  const wishlistProducts = products.slice(0, 2)

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <section className="py-12" style={{ background: 'linear-gradient(160deg, var(--sage-pale) 0%, var(--cream) 70%)' }}>
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-5 flex-wrap">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-display font-medium"
              style={{ background: 'linear-gradient(135deg, var(--gold-pale), var(--cream-deep))', border: '2px solid rgba(184,146,42,0.25)', color: 'var(--gold)' }}>
              {displayName[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-display font-light text-2xl" style={{ color: 'var(--ink)' }}>Hello, {displayName.split(' ')[0]}</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
            </div>
            <button onClick={logout}
              className="ml-auto flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5"
              style={{ border: '1.5px solid rgba(220,38,38,0.2)', color: '#DC2626', background: 'rgba(220,38,38,0.05)' }}>
              <LogOut size={12} /> Sign Out
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-56 flex-shrink-0">
              <nav className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}>
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setTab(key)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-all text-left"
                    style={tab === key
                      ? { background: 'var(--sage-pale)', color: 'var(--sage)', borderLeft: '2px solid var(--sage)' }
                      : { color: 'var(--text-muted)', borderLeft: '2px solid transparent' }}>
                    <Icon size={15} /> {label}
                    <ChevronRight size={12} className="ml-auto opacity-40" />
                  </button>
                ))}
                <button onClick={logout}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-left border-t transition-all hover:bg-red-50"
                  style={{ color: '#DC2626', borderColor: 'rgba(0,0,0,0.05)', borderLeft: '2px solid transparent' }}>
                  <LogOut size={15} /> Sign Out
                </button>
              </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0">

              {/* Orders */}
              {tab === 'orders' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display font-light text-xl mb-5" style={{ color: 'var(--ink)' }}>My Orders</h2>
                  {ordersLoading ? (
                    <div className="text-center py-12"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--gold)' }} /></div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}>
                      <Package size={40} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>No orders yet</p>
                      <Link to="/shop" className="btn-gold py-2.5 px-6 text-xs inline-flex items-center gap-1.5">Shop Now</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className="text-xs font-mono font-medium" style={{ color: 'var(--gold)' }}>#{order.order_number}</span>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <span className="text-[11px] px-2.5 py-1 rounded-full font-medium capitalize"
                              style={{ background: STATUS_STYLES[order.status]?.bg, color: STATUS_STYLES[order.status]?.color }}>
                              {order.status}
                            </span>
                          </div>
                          <div className="space-y-1.5 mb-3">
                            {(order.items || []).map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span style={{ color: 'var(--ink-soft)' }}>{item.name} × {item.qty}</span>
                                <span style={{ color: 'var(--ink)' }}>₹{(item.price * item.qty).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                            <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Total: ₹{order.total?.toLocaleString()}</span>
                            <span className="text-xs px-3 py-1.5 rounded-lg capitalize" style={{ background: 'var(--cream)', color: 'var(--text-muted)' }}>
                              {order.payment_method || 'Online'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Profile */}
              {tab === 'profile' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display font-light text-xl" style={{ color: 'var(--ink)' }}>Profile Details</h2>
                    {saveMsg && <span className="text-xs" style={{ color: 'var(--sage)' }}>{saveMsg}</span>}
                    {!editing
                      ? <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                          style={{ background: 'var(--gold-pale)', color: 'var(--gold)', border: '1px solid rgba(184,146,42,0.25)' }}>
                          <Edit2 size={11} /> Edit
                        </button>
                      : <div className="flex gap-2">
                          <button onClick={saveProfile} disabled={saving}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg btn-sage"
                            style={{ opacity: saving ? 0.7 : 1 }}>
                            {saving ? '…' : <><Save size={11} /> Save</>}
                          </button>
                          <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                            style={{ background: 'var(--cream-deep)', color: 'var(--text-muted)' }}>
                            <X size={11} /> Cancel
                          </button>
                        </div>
                    }
                  </div>
                  <div className="rounded-2xl p-6 space-y-5" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}>
                    {[
                      { label: 'Full Name', icon: User,  value: meta.name || '—',  key: 'name',  editable: true },
                      { label: 'Email',     icon: Mail,  value: user.email,          editable: false },
                      { label: 'Phone',     icon: Phone, value: meta.phone || '—',  key: 'phone', editable: true },
                    ].map(({ label, icon: Icon, value, key, editable }) => (
                      <div key={label} className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-pale)' }}>
                          <Icon size={14} style={{ color: 'var(--gold)' }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] mb-1" style={{ color: 'var(--text-light)', letterSpacing: '0.06em' }}>{label}</p>
                          {editing && editable
                            ? <input className="input-light w-full text-sm" value={profileForm[key] || ''}
                                onChange={e => setProfileForm({ ...profileForm, [key]: e.target.value })} />
                            : <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{value}</p>
                          }
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                        Member since {new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Subscriptions */}
              {tab === 'subscriptions' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display font-light text-xl mb-5" style={{ color: 'var(--ink)' }}>My Subscriptions</h2>
                  {subscriptions.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl" style={{ background: '#fff', border: '1.5px dashed rgba(184,146,42,0.25)' }}>
                      <RefreshCw size={36} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>No active subscriptions</p>
                      <p className="text-xs mb-5" style={{ color: 'var(--text-light)' }}>Subscribe to a product for automatic monthly delivery and save up to 20%</p>
                      <Link to="/shop" className="btn-gold py-2.5 px-6 text-xs inline-flex items-center gap-1.5">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {subscriptions.map(sub => {
                        const statusStyle = {
                          active:    { bg: 'rgba(74,103,65,0.1)',  color: 'var(--sage)' },
                          paused:    { bg: 'rgba(184,146,42,0.1)', color: 'var(--gold)' },
                          cancelled: { bg: 'rgba(220,38,38,0.08)', color: '#DC2626' },
                        }[sub.status] || {}
                        return (
                          <div key={sub.id} className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}>
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-medium text-sm" style={{ color: 'var(--ink)' }}>{sub.product_name}</p>
                                {sub.variant && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub.variant}</p>}
                              </div>
                              <span className="text-[11px] px-2.5 py-1 rounded-full font-medium capitalize"
                                style={{ background: statusStyle.bg, color: statusStyle.color }}>
                                {sub.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              {[
                                ['Frequency', sub.frequency === 'monthly' ? 'Every Month' : sub.frequency === 'bimonthly' ? 'Every 2 Months' : 'Every 3 Months'],
                                ['Qty', sub.quantity],
                                ['Price', `₹${sub.price?.toLocaleString()}`],
                              ].map(([l, v]) => (
                                <div key={l} className="p-2.5 rounded-xl text-center" style={{ background: 'var(--cream)' }}>
                                  <p className="text-[10px] mb-0.5" style={{ color: 'var(--text-light)' }}>{l}</p>
                                  <p className="text-xs font-medium" style={{ color: 'var(--ink)' }}>{v}</p>
                                </div>
                              ))}
                            </div>
                            {sub.next_delivery && sub.status === 'active' && (
                              <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                                Next delivery: <strong style={{ color: 'var(--sage)' }}>{sub.next_delivery}</strong>
                              </p>
                            )}
                            {sub.status !== 'cancelled' && (
                              <div className="flex gap-2">
                                {sub.status === 'active' && (
                                  <button onClick={() => updateStatus(sub.id, 'paused')}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                                    style={{ background: 'rgba(184,146,42,0.1)', color: 'var(--gold)' }}>
                                    <Pause size={11} /> Pause
                                  </button>
                                )}
                                {sub.status === 'paused' && (
                                  <button onClick={() => updateStatus(sub.id, 'active')}
                                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all btn-sage"
                                    style={{ padding: '6px 12px' }}>
                                    <RefreshCw size={11} /> Resume
                                  </button>
                                )}
                                <button onClick={() => { if (window.confirm('Cancel this subscription?')) updateStatus(sub.id, 'cancelled') }}
                                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                                  style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626' }}>
                                  <XCircle size={11} /> Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Addresses */}
              {tab === 'addresses' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display font-light text-xl mb-5" style={{ color: 'var(--ink)' }}>Saved Addresses</h2>
                  <div className="text-center py-14 rounded-2xl" style={{ background: '#fff', border: '1.5px dashed rgba(184,146,42,0.25)' }}>
                    <MapPin size={36} className="mx-auto mb-3" style={{ color: 'rgba(184,146,42,0.35)' }} />
                    <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>No saved addresses yet</p>
                    <button className="btn-gold py-2.5 px-6 text-xs inline-flex items-center gap-1.5">+ Add Address</button>
                  </div>
                </motion.div>
              )}

              {/* Wishlist */}
              {tab === 'wishlist' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display font-light text-xl mb-5" style={{ color: 'var(--ink)' }}>Wishlist</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistProducts.map(p => (
                      <div key={p.id} className="rounded-2xl p-5 flex gap-4 items-center" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}>
                        <div className="w-16 h-16 rounded-xl img-placeholder flex-shrink-0" style={{ background: 'var(--gold-pale)', fontSize: 28 }}>🌿</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>{p.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--gold)' }}>₹{p.price?.toLocaleString()}</p>
                        </div>
                        <Link to={`/product/${p.slug}`} className="btn-gold py-2 px-3 text-[11px]">Buy</Link>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}
