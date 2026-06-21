import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Package, Heart, Settings, LogOut, Edit2, Save, X, ChevronRight, MapPin, Phone, Mail } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useAdminStore } from '../store/adminStore'

const TABS = [
  { key: 'orders', label: 'My Orders', icon: Package },
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
]

const SAMPLE_ORDERS = [
  { id: 'NP-1847', date: '2026-06-15', status: 'delivered', items: [{ name: 'Goli Bull Night', qty: 2, price: 1299 }], total: 2598 },
  { id: 'NP-1791', date: '2026-06-02', status: 'shipped', items: [{ name: 'Majoon Moosli', qty: 1, price: 999 }], total: 999 },
  { id: 'NP-1654', date: '2026-05-20', status: 'delivered', items: [{ name: 'Goli Bull Night', qty: 1, price: 1299 }, { name: 'Majoon Moosli', qty: 1, price: 999 }], total: 2298 },
]

const STATUS_STYLES = {
  delivered: { bg: 'rgba(74,103,65,0.1)', color: 'var(--sage)' },
  shipped:   { bg: 'rgba(184,146,42,0.1)', color: 'var(--gold)' },
  processing:{ bg: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' },
  cancelled: { bg: 'rgba(220,38,38,0.08)', color: '#DC2626' },
}

export default function AccountPage() {
  const { user, logout, updateProfile } = useAuthStore()
  const { products } = useAdminStore()
  const [tab, setTab] = useState('orders')
  const [editing, setEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' })

  if (!user) return <Navigate to="/login" state={{ from: '/account' }} replace />

  function saveProfile() {
    updateProfile(profileForm)
    setEditing(false)
  }

  const wishlistProducts = products.slice(0, 2) // placeholder wishlist

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <section className="py-12" style={{ background: 'linear-gradient(160deg, var(--sage-pale) 0%, var(--cream) 70%)' }}>
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-display font-medium"
              style={{ background: 'linear-gradient(135deg, var(--gold-pale), var(--cream-deep))', border: '2px solid rgba(184,146,42,0.25)', color: 'var(--gold)' }}>
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="font-display font-light text-2xl" style={{ color: 'var(--ink)' }}>Hello, {user.name?.split(' ')[0]}</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
            </div>
            <button onClick={logout} className="ml-auto flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5"
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
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-left border-t transition-all"
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
                  {SAMPLE_ORDERS.length === 0 ? (
                    <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
                      <Package size={40} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No orders yet.</p>
                      <Link to="/shop" className="btn-gold py-2.5 px-6 text-xs mt-4 inline-flex items-center gap-1.5">Shop Now</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {SAMPLE_ORDERS.map(order => (
                        <div key={order.id} className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.1)' }}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className="text-xs font-mono font-medium" style={{ color: 'var(--gold)' }}>#{order.id}</span>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{order.date}</p>
                            </div>
                            <span className="text-[11px] px-2.5 py-1 rounded-full font-medium capitalize"
                              style={{ background: STATUS_STYLES[order.status]?.bg, color: STATUS_STYLES[order.status]?.color }}>
                              {order.status}
                            </span>
                          </div>
                          <div className="space-y-1.5 mb-3">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span style={{ color: 'var(--ink-soft)' }}>{item.name} × {item.qty}</span>
                                <span style={{ color: 'var(--ink)' }}>₹{(item.price * item.qty).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                            <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>Total: ₹{order.total.toLocaleString()}</span>
                            <button className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                              style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}>
                              {order.status === 'delivered' ? 'Reorder' : 'Track Order'}
                            </button>
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
                    {!editing
                      ? <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg"
                          style={{ background: 'var(--gold-pale)', color: 'var(--gold)', border: '1px solid rgba(184,146,42,0.25)' }}>
                          <Edit2 size={11} /> Edit
                        </button>
                      : <div className="flex gap-2">
                          <button onClick={saveProfile} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg btn-sage">
                            <Save size={11} /> Save
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
                      { label: 'Full Name', icon: User, value: profileForm.name, key: 'name', editable: true },
                      { label: 'Email Address', icon: Mail, value: user.email, editable: false },
                      { label: 'Phone Number', icon: Phone, value: profileForm.phone || 'Not set', key: 'phone', editable: true },
                    ].map(({ label, icon: Icon, value, key, editable }) => (
                      <div key={label} className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'var(--gold-pale)' }}>
                          <Icon size={14} style={{ color: 'var(--gold)' }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] mb-1" style={{ color: 'var(--text-light)', letterSpacing: '0.06em' }}>{label}</p>
                          {editing && editable
                            ? <input className="input-light w-full text-sm" value={profileForm[key] || ''} onChange={e => setProfileForm({ ...profileForm, [key]: e.target.value })} />
                            : <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{value}</p>
                          }
                        </div>
                      </div>
                    ))}
                    <div className="pt-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-light)' }}>Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Addresses */}
              {tab === 'addresses' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="font-display font-light text-xl mb-5" style={{ color: 'var(--ink)' }}>Saved Addresses</h2>
                  <div className="text-center py-14 rounded-2xl" style={{ background: '#fff', border: '1.5px dashed rgba(184,146,42,0.25)' }}>
                    <MapPin size={36} className="mx-auto mb-3" style={{ color: 'rgba(184,146,42,0.35)' }} />
                    <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>No saved addresses yet</p>
                    <button className="btn-gold py-2.5 px-6 text-xs inline-flex items-center gap-1.5">
                      + Add Address
                    </button>
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
                        <div className="w-16 h-16 rounded-xl img-placeholder flex-shrink-0 text-2xl" style={{ background: 'var(--gold-pale)' }}>🌿</div>
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
