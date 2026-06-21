import { useState, useMemo, useRef } from 'react'
import {
  Search, Plus, Edit2, Trash2, Check, Save, Eye, EyeOff, Download, Upload,
  X, ChevronDown, ChevronUp, Copy, Send, Star, Zap, RefreshCw, AlertTriangle,
  TrendingUp, TrendingDown, Gift, MessageSquare, Filter, MoreVertical,
  Calendar, Clock, Tag, Truck, Package, Users, BarChart2, Mail, ArrowRight,
  CheckCircle, XCircle, Printer, ExternalLink, Bell, Shield, CreditCard,
  Smartphone, Globe, Archive, Award, Target, Activity, DollarSign, Percent
} from 'lucide-react'
import { useAdminStore } from '../../store/adminStore'

/* blank product template */
const BLANK_PRODUCT = { name:'', tagline:'', price:'', mrp:'', stock:100, badge:'New', shortDesc:'', discount:0, benefits:[], variants:[{id:'default',label:'1 Month Supply',price:''}], seo:{title:'',description:''} }
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis
} from 'recharts'
import toast from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'

/* ── shared helpers ── */
const CARD = { background: '#fff', border: '1px solid rgba(184,146,42,0.1)', borderRadius: 16 }
const TAG_GREEN  = { background: 'rgba(74,222,128,0.1)', color: '#16a34a' }
const TAG_GOLD   = { background: 'rgba(184,146,42,0.1)', color: 'var(--gold)' }
const TAG_RED    = { background: 'rgba(220,53,69,0.08)', color: '#dc3545' }
const TAG_ORANGE = { background: 'rgba(255,165,0,0.1)',  color: '#f59e0b' }
const TAG_BLUE   = { background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }

const Chip = ({ children, style }) => (
  <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={style}>{children}</span>
)

function PageHeader({ title, sub, action }) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <h1 className="font-display text-3xl" style={{ color: 'var(--ink)' }}>{title}</h1>
        {sub && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

function StatCard({ label, value, change, positive, icon: Icon, sub }) {
  return (
    <div className="p-5 rounded-2xl" style={CARD}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
        {Icon && <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--cream)' }}><Icon size={14} style={{ color: 'var(--gold)' }} /></div>}
      </div>
      <div className="font-display text-2xl mb-1" style={{ color: 'var(--ink)' }}>{value}</div>
      {(change || sub) && (
        <div className="flex items-center gap-1 text-xs">
          {change && (positive ? <TrendingUp size={10} style={{ color: '#16a34a' }} /> : <TrendingDown size={10} style={{ color: '#dc3545' }} />)}
          <span style={{ color: change ? (positive ? '#16a34a' : '#dc3545') : 'var(--text-muted)' }}>{change || sub}</span>
        </div>
      )}
    </div>
  )
}

const Toggle = ({ value, onChange }) => (
  <div onClick={onChange} className="w-10 h-5 rounded-full relative cursor-pointer transition-colors flex-shrink-0"
    style={{ background: value ? 'var(--sage)' : 'rgba(0,0,0,0.12)' }}>
    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: value ? 'calc(100% - 18px)' : '2px' }} />
  </div>
)

/* ════════════════════════════════════════════════════════
   PRODUCTS — full CRUD with modal editor
════════════════════════════════════════════════════════ */
export function Products() {
  const { products, updateProduct, addProduct, deleteProduct } = useAdminStore()
  const [editing, setEditing] = useState(null)   // product id being edited
  const [editData, setEditData] = useState(null)
  const [creating, setCreating] = useState(false)
  const [newData, setNewData] = useState({ ...BLANK_PRODUCT })
  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid')

  const open = (p) => { setEditing(p.id); setEditData({ ...p }) }
  const close = () => { setEditing(null); setEditData(null) }
  const save = () => {
    updateProduct(editData)
    toast.success('Product updated!')
    close()
  }
  const openCreate = () => { setNewData({ ...BLANK_PRODUCT }); setCreating(true) }
  const create = () => {
    if (!newData.name || !newData.price) return toast.error('Name and price are required')
    addProduct({ ...newData, price: Number(newData.price), mrp: Number(newData.mrp || newData.price), slug: newData.name.toLowerCase().replace(/\s+/g,'-') })
    toast.success('Product created!')
    setCreating(false)
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <PageHeader title="Products" sub={`${products.length} products`}
        action={<button onClick={openCreate} className="btn-gold py-2 px-5 text-xs flex items-center gap-1.5"><Plus size={12} /> Add Product</button>} />

      {/* toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input className="input-light pl-8 text-xs w-56" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(184,146,42,0.2)' }}>
          {['grid','list'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className="px-3 py-2 text-xs capitalize transition-colors"
              style={{ background: view === v ? 'var(--gold)' : '#fff', color: view === v ? '#fff' : 'var(--text-muted)' }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className={view === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-5' : 'space-y-3'}>
        {filtered.map(p => (
          <div key={p.id} className="p-5 rounded-2xl" style={CARD}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display text-lg">{p.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.tagline}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold" style={{ color: 'var(--gold)' }}>₹{p.price.toLocaleString()}</div>
                <div className="text-xs line-through" style={{ color: 'var(--text-light)' }}>₹{p.mrp.toLocaleString()}</div>
              </div>
            </div>

            {/* metric pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Chip style={TAG_GOLD}>⭐ {p.rating}</Chip>
              <Chip style={TAG_BLUE}>💬 {p.reviewCount}</Chip>
              <Chip style={p.stock < 20 ? TAG_ORANGE : TAG_GREEN}>📦 {p.stock} units</Chip>
              <Chip style={TAG_GOLD}>{p.discount}% OFF</Chip>
            </div>

            {/* stock bar */}
            <div className="scarcity-bar mb-3">
              <div className="scarcity-fill" style={{ width: `${Math.min((p.stock/100)*100, 100)}%`, background: p.stock < 20 ? 'linear-gradient(90deg,#ff6b6b,#ff8c00)' : undefined }} />
            </div>

            {/* variants */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {p.variants.map(v => (
                <div key={v.id} className="text-center p-2 rounded-lg" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.1)' }}>
                  <div className="text-[10px] mb-0.5" style={{ color: 'var(--text-muted)' }}>{v.label}</div>
                  <div className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>₹{v.price.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => open(p)} className="flex-1 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5" style={{ background: 'var(--gold)', color: '#fff' }}>
                <Edit2 size={11} /> Edit Product
              </button>
              <button className="px-3 py-2 rounded-xl" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.15)' }}>
                <Copy size={13} style={{ color: 'var(--text-muted)' }} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete this product?')) { deleteProduct(p.id); toast.success('Product deleted') } }} className="px-3 py-2 rounded-xl" style={{ background: 'rgba(220,53,69,0.06)', border: '1px solid rgba(220,53,69,0.1)' }}>
                <Trash2 size={13} style={{ color: '#dc3545' }} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Product Modal */}
      <AnimatePresence>
        {creating && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4" style={{ background: 'rgba(30,26,20,0.65)', backdropFilter: 'blur(12px)' }}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl overflow-hidden" style={{ background: '#fff', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 40px 100px rgba(30,26,20,0.2)' }}>
              <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b" style={{ background: '#fff', borderColor: 'rgba(0,0,0,0.06)' }}>
                <h2 className="font-display text-xl">Add New Product</h2>
                <button onClick={() => setCreating(false)}><X size={16} style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[['name','Product Name *'],['tagline','Tagline'],['price','Sale Price (₹) *'],['mrp','MRP (₹)']].map(([k,l]) => (
                    <div key={k}>
                      <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>{l}</label>
                      <input className="input-light w-full text-sm" value={newData[k] || ''} onChange={e => setNewData({...newData,[k]:e.target.value})} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>Stock Units</label>
                    <input type="number" className="input-light w-full text-sm" value={newData.stock} onChange={e => setNewData({...newData,stock:Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>Badge</label>
                    <input className="input-light w-full text-sm" value={newData.badge} onChange={e => setNewData({...newData,badge:e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>Short Description</label>
                  <textarea className="input-light w-full text-sm resize-none" rows={3} value={newData.shortDesc} onChange={e => setNewData({...newData,shortDesc:e.target.value})} />
                </div>
                <div>
                  <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>Benefits (one per line)</label>
                  <textarea className="input-light w-full text-sm resize-none" rows={3} placeholder="Boosts energy&#10;Improves stamina&#10;Reduces stress" onChange={e => setNewData({...newData,benefits:e.target.value.split('\n').filter(Boolean)})} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={create} className="btn-gold flex-1 py-3 text-sm flex items-center justify-center gap-1.5"><Plus size={13} /> Create Product</button>
                  <button onClick={() => setCreating(false)} className="btn-outline-gold px-6 py-3 text-sm">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && editData && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4" style={{ background: 'rgba(30,26,20,0.65)', backdropFilter: 'blur(12px)' }}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl overflow-hidden" style={{ background: '#fff', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 40px 100px rgba(30,26,20,0.2)' }}>
              <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b" style={{ background: '#fff', borderColor: 'rgba(0,0,0,0.06)' }}>
                <h2 className="font-display text-xl">Edit: {editData.name}</h2>
                <button onClick={close}><X size={16} style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[['name','Product Name'],['tagline','Tagline'],['price','Sale Price (₹)'],['mrp','MRP (₹)']].map(([k,l]) => (
                    <div key={k}>
                      <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>{l}</label>
                      <input className="input-light w-full text-sm" value={editData[k]} onChange={e => setEditData({...editData, [k]: e.target.value})} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>Stock Units</label>
                    <input type="number" className="input-light w-full text-sm" value={editData.stock} onChange={e => setEditData({...editData, stock: Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>Badge</label>
                    <input className="input-light w-full text-sm" value={editData.badge} onChange={e => setEditData({...editData, badge: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>Short Description</label>
                  <textarea className="input-light w-full text-sm resize-none" rows={3} value={editData.shortDesc} onChange={e => setEditData({...editData, shortDesc: e.target.value})} />
                </div>
                {/* SEO */}
                <div className="rounded-xl p-4" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.12)' }}>
                  <div className="text-xs font-medium tracking-wider uppercase mb-3" style={{ color: 'var(--gold)' }}>SEO Settings</div>
                  <div className="space-y-3">
                    {[['seo.title','Meta Title'],['seo.description','Meta Description']].map(([k,l]) => (
                      <div key={k}>
                        <label className="text-xs block mb-1" style={{ color: 'var(--text-muted)' }}>{l}</label>
                        <input className="input-light w-full text-xs" value={k.includes('.') ? editData.seo?.[k.split('.')[1]] || '' : editData[k]} onChange={e => {
                          if (k.includes('.')) setEditData({...editData, seo: {...editData.seo, [k.split('.')[1]]: e.target.value}})
                          else setEditData({...editData, [k]: e.target.value})
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={save} className="btn-gold flex-1 py-3 text-sm flex items-center justify-center gap-1.5"><Save size={13} /> Save Changes</button>
                  <button onClick={close} className="btn-outline-gold px-6 py-3 text-sm">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   CUSTOMERS — RFM segmentation, detail panel, LTV
════════════════════════════════════════════════════════ */
export function Customers() {
  const { customers } = useAdminStore()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [segment, setSegment] = useState('all')

  const segments = {
    all: c => true,
    champions: c => c.orders >= 3 && c.totalSpent > 3000,
    loyal: c => c.orders >= 2,
    atrisk: c => { const d = new Date(c.lastOrder); return (Date.now() - d.getTime()) > 60*24*60*60*1000 },
    new: c => c.orders === 1,
  }

  const filtered = customers.filter(c =>
    segments[segment](c) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search.toLowerCase()))
  )

  const getSegmentLabel = (c) => {
    if (c.orders >= 3 && c.totalSpent > 3000) return { label: 'Champion', style: TAG_GOLD }
    if (c.orders >= 2) return { label: 'Loyal', style: TAG_GREEN }
    const d = new Date(c.lastOrder)
    if ((Date.now() - d.getTime()) > 60*24*60*60*1000) return { label: 'At Risk', style: TAG_RED }
    return { label: 'New', style: TAG_BLUE }
  }

  const totalLTV = customers.reduce((s,c) => s + c.totalSpent, 0)

  return (
    <div>
      <PageHeader title="Customers" sub={`${customers.length} registered · ₹${(totalLTV/1000).toFixed(1)}K total LTV`}
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs" style={{ background: 'var(--sage-pale)', color: 'var(--sage)', border: '1px solid rgba(74,103,65,0.2)' }}>
              <Mail size={12} /> Email All
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.2)', color: 'var(--gold)' }}>
              <Download size={12} /> Export CSV
            </button>
          </div>
        } />

      {/* Segment chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          ['all', 'All Customers', TAG_GOLD],
          ['champions', '🏆 Champions', TAG_GOLD],
          ['loyal', '💚 Loyal', TAG_GREEN],
          ['atrisk', '⚠ At Risk', TAG_ORANGE],
          ['new', '✨ New', TAG_BLUE],
        ].map(([k,l,s]) => (
          <button key={k} onClick={() => setSegment(k)}
            className="px-3 py-1.5 rounded-xl text-xs transition-all"
            style={segment === k ? { background: 'var(--ink)', color: '#fff' } : { background: '#fff', border: '1px solid rgba(0,0,0,0.08)', color: 'var(--text-muted)' }}>
            {l} ({customers.filter(c => segments[k](c)).length})
          </button>
        ))}
      </div>

      <div className="relative mb-4">
        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input className="input-light pl-8 text-xs w-72" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="rounded-2xl overflow-hidden" style={CARD}>
        <table className="w-full admin-table">
          <thead><tr><th>Customer</th><th>Orders</th><th>LTV</th><th>Last Order</th><th>City</th><th>Segment</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(c => {
              const seg = getSegmentLabel(c)
              return (
                <tr key={c.id} className="cursor-pointer hover:bg-amber-50/30 transition-colors" onClick={() => setSelected(c)}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-display flex-shrink-0" style={{ background: 'var(--gold-pale)', color: 'var(--gold)', border: '1px solid rgba(184,146,42,0.2)' }}>{c.name[0]}</div>
                      <div>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ color: 'var(--gold)', fontWeight: 600 }}>{c.orders}</span></td>
                  <td style={{ color: 'var(--ink)', fontWeight: 600 }}>₹{c.totalSpent.toLocaleString()}</td>
                  <td className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(c.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                  <td className="text-xs">{c.city}</td>
                  <td><Chip style={seg.style}>{seg.label}</Chip></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg" style={{ background: 'var(--sage-pale)' }}><Mail size={11} style={{ color: 'var(--sage)' }} /></button>
                      <button className="p-1.5 rounded-lg" style={{ background: 'var(--cream)' }}><Eye size={11} style={{ color: 'var(--text-muted)' }} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Customer detail panel */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[600] flex items-center justify-end" style={{ background: 'rgba(30,26,20,0.4)', backdropFilter: 'blur(6px)' }} onClick={() => setSelected(null)}>
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: 'spring', damping: 26 }}
              className="h-full w-full max-w-md overflow-y-auto" style={{ background: '#fff', boxShadow: '-20px 0 60px rgba(30,26,20,0.12)' }}
              onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <h2 className="font-display text-xl">Customer Profile</h2>
                <button onClick={() => setSelected(null)}><X size={16} style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-display text-3xl" style={{ background: 'var(--gold-pale)', color: 'var(--gold)' }}>{selected.name[0]}</div>
                  <div>
                    <h3 className="font-display text-xl">{selected.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{selected.email}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{selected.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Total Orders', value: selected.orders },
                    { label: 'Lifetime Value', value: `₹${selected.totalSpent.toLocaleString()}` },
                    { label: 'City', value: selected.city },
                    { label: 'Loyalty Tier', value: selected.loyalty },
                  ].map((s,i) => (
                    <div key={i} className="p-3 rounded-xl" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.1)' }}>
                      <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
                {/* Avg order value */}
                <div className="p-4 rounded-xl mb-4" style={{ background: 'var(--gold-pale)', border: '1px solid rgba(184,146,42,0.2)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--gold)' }}>Avg. Order Value</div>
                  <div className="font-display text-2xl" style={{ color: 'var(--ink)' }}>₹{Math.round(selected.totalSpent / selected.orders).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 btn-gold py-3 text-xs flex items-center justify-center gap-1.5"><Mail size={12} /> Send Email</button>
                  <button className="flex-1 btn-sage py-3 text-xs flex items-center justify-center gap-1.5"><Gift size={12} /> Give Discount</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   ANALYTICS — rich multi-chart dashboard
════════════════════════════════════════════════════════ */
export function Analytics() {
  const { revenueData, orders } = useAdminStore()
  const [period, setPeriod] = useState('monthly')

  const totalRev  = orders.filter(o => o.status !== 'cancelled').reduce((s,o) => s+o.amount, 0)
  const avgOrder  = Math.round(totalRev / orders.length)
  const repeatRate = Math.round((orders.filter(o => o.status === 'delivered').length / orders.length) * 100)

  const funnelData = [
    { stage: 'Site Visitors', value: 18420, pct: 100 },
    { stage: 'Product View',  value: 5240,  pct: 28 },
    { stage: 'Add to Cart',   value: 1870,  pct: 10.2 },
    { stage: 'Checkout',      value: 980,   pct: 5.3 },
    { stage: 'Purchased',     value: 698,   pct: 3.8 },
  ]

  const sourceData = [
    { name: 'Organic',   value: 42 },
    { name: 'Instagram', value: 28 },
    { name: 'WhatsApp',  value: 18 },
    { name: 'Direct',    value: 12 },
  ]
  const COLORS = ['#B8922A','#4A6741','#D4A843','#6B8F63']

  const cohortData = [
    { month: 'Jan', m0: 100, m1: 42, m2: 31, m3: 26 },
    { month: 'Feb', m0: 100, m1: 45, m2: 34, m3: 28 },
    { month: 'Mar', m0: 100, m1: 48, m2: 36 },
    { month: 'Apr', m0: 100, m1: 51 },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="font-display text-3xl" style={{ color: 'var(--ink)' }}>Analytics</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Comprehensive performance overview</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.12)' }}>
          {['weekly','monthly','yearly'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-4 py-1.5 rounded-lg text-xs capitalize transition-all"
              style={{ background: period === p ? 'var(--gold)' : 'transparent', color: period === p ? '#fff' : 'var(--text-muted)' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Revenue" value={`₹${(totalRev/1000).toFixed(1)}K`} change="+23% vs last month" positive icon={TrendingUp} />
        <StatCard label="Avg Order Value" value={`₹${avgOrder.toLocaleString()}`} change="+8% vs last month" positive icon={DollarSign} />
        <StatCard label="Conversion Rate" value="3.8%" change="+0.4% vs last month" positive icon={Target} />
        <StatCard label="Repeat Customer" value={`${repeatRate}%`} change="+5% vs last month" positive icon={RefreshCw} />
      </div>

      {/* Revenue + Orders charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="p-5 rounded-2xl" style={CARD}>
          <h3 className="font-medium text-sm mb-4">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B8922A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#B8922A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(122,105,82,0.6)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(122,105,82,0.6)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: '#FDFAF6', border: '1px solid rgba(184,146,42,0.3)', borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" stroke="#B8922A" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="p-5 rounded-2xl" style={CARD}>
          <h3 className="font-medium text-sm mb-4">Orders Per Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(122,105,82,0.6)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(122,105,82,0.6)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#FDFAF6', border: '1px solid rgba(184,146,42,0.3)', borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="orders" fill="#4A6741" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Funnel + Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Conversion funnel */}
        <div className="p-5 rounded-2xl" style={CARD}>
          <h3 className="font-medium text-sm mb-5">Conversion Funnel</h3>
          <div className="space-y-3">
            {funnelData.map((f, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: 'var(--ink)' }}>{f.stage}</span>
                  <span style={{ color: 'var(--gold)' }}>{f.value.toLocaleString()} ({f.pct}%)</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.05)' }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${f.pct}%` }} viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full" style={{ background: `linear-gradient(90deg, var(--gold), var(--sage))` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="p-5 rounded-2xl" style={CARD}>
          <h3 className="font-medium text-sm mb-4">Traffic Sources</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5 flex-1">
              {sourceData.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span style={{ color: 'var(--ink)' }}>{s.name}</span>
                  </div>
                  <span className="font-semibold" style={{ color: COLORS[i] }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cohort retention */}
      <div className="p-5 rounded-2xl" style={CARD}>
        <h3 className="font-medium text-sm mb-5">Customer Retention Cohort</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left py-2 pr-4" style={{ color: 'var(--text-muted)' }}>Cohort</th>
                {['Month 0','Month 1','Month 2','Month 3'].map(h => (
                  <th key={h} className="text-center py-2 px-3" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortData.map((row, ri) => (
                <tr key={ri}>
                  <td className="py-2 pr-4 font-medium" style={{ color: 'var(--ink)' }}>{row.month}</td>
                  {[row.m0, row.m1, row.m2, row.m3].map((v, ci) => v !== undefined && (
                    <td key={ci} className="text-center py-2 px-3">
                      <div className="inline-block px-3 py-1 rounded-lg font-semibold" style={{
                        background: `rgba(184,146,42,${v/200})`,
                        color: v > 80 ? 'var(--gold)' : v > 40 ? '#B8922A' : 'var(--text-muted)'
                      }}>{v}%</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   SEO MANAGER
════════════════════════════════════════════════════════ */
export function SEOManager() {
  const { seoSettings, updateSEO } = useAdminStore()
  const [form, setForm] = useState(seoSettings)
  const [tab, setTab] = useState('global')
  const handleSave = () => { updateSEO(form); toast.success('SEO settings saved!') }

  const seoScore = Math.min(100, [
    form.metaDescription?.length >= 50 && form.metaDescription?.length <= 160 ? 25 : 0,
    form.siteName?.length > 3 ? 25 : 0,
    form.googleAnalytics?.length > 3 ? 25 : 0,
    form.schemaOrg ? 25 : 0,
  ].reduce((a,b) => a+b, 0))

  return (
    <div>
      <PageHeader title="SEO Manager" sub="Optimize your search rankings"
        action={<button onClick={handleSave} className="btn-gold py-2 px-5 text-xs flex items-center gap-1.5"><Save size={12} /> Save All</button>} />

      {/* SEO score */}
      <div className="p-5 rounded-2xl mb-6 flex items-center gap-5" style={CARD}>
        <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center flex-shrink-0" style={{ background: seoScore >= 75 ? 'var(--sage-pale)' : 'var(--gold-pale)', border: `3px solid ${seoScore >= 75 ? 'var(--sage)' : 'var(--gold)'}` }}>
          <div className="font-display text-2xl" style={{ color: seoScore >= 75 ? 'var(--sage)' : 'var(--gold)' }}>{seoScore}</div>
          <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>SEO Score</div>
        </div>
        <div className="flex-1">
          <div className="font-medium mb-2">{seoScore >= 75 ? '✅ Good SEO health' : '⚠️ Needs improvement'}</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ['Meta Description', form.metaDescription?.length >= 50 && form.metaDescription?.length <= 160],
              ['Site Name', form.siteName?.length > 3],
              ['Analytics Tracking', form.googleAnalytics?.length > 3],
              ['Schema Markup', form.schemaOrg],
            ].map(([l, ok]) => (
              <div key={l} className="flex items-center gap-1.5" style={{ color: ok ? 'var(--sage)' : 'var(--text-muted)' }}>
                {ok ? <CheckCircle size={10} /> : <XCircle size={10} />} {l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.12)' }}>
        {['global','pages','tracking'].map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-1.5 rounded-lg text-xs capitalize transition-all"
            style={{ background: tab === t ? 'var(--gold)' : 'transparent', color: tab === t ? '#fff' : 'var(--text-muted)' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'global' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[['siteName','Site Name'],['siteTagline','Site Tagline'],['canonicalUrl','Canonical URL']].map(([k,l]) => (
              <div key={k}>
                <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>{l}</label>
                <input className="input-light w-full text-sm" value={form[k] || ''} onChange={e => setForm({...form,[k]:e.target.value})} />
              </div>
            ))}
            <div>
              <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>Meta Description</label>
              <textarea className="input-light w-full text-sm resize-none" rows={3} value={form.metaDescription || ''} onChange={e => setForm({...form,metaDescription:e.target.value})} />
              <div className="flex justify-between mt-1 text-[10px]" style={{ color: (form.metaDescription?.length || 0) > 160 ? '#dc3545' : 'var(--text-muted)' }}>
                <span>{(form.metaDescription?.length || 0) < 50 ? 'Add more content' : (form.metaDescription?.length || 0) > 160 ? 'Too long!' : '✓ Good length'}</span>
                <span>{form.metaDescription?.length || 0}/160</span>
              </div>
            </div>
          </div>
          <div>
            <div className="p-5 rounded-xl mb-4" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="text-xs font-medium mb-3" style={{ color: 'var(--gold)' }}>Google Preview</div>
              <div className="text-blue-500 text-sm mb-1">{form.siteName} — {form.siteTagline}</div>
              <div className="text-green-600 text-xs mb-1">{form.canonicalUrl}</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{form.metaDescription?.slice(0,160)}</div>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-medium" style={{ color: 'var(--gold)' }}>Schema.org Markup</div>
                <Toggle value={form.schemaOrg} onChange={() => setForm({...form, schemaOrg: !form.schemaOrg})} />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium" style={{ color: 'var(--gold)' }}>Auto Sitemap</div>
                <Toggle value={true} onChange={() => {}} />
              </div>
              <button className="mt-3 w-full py-2 rounded-xl text-xs" style={{ background: 'var(--cream)', color: 'var(--text-muted)', border: '1px solid rgba(0,0,0,0.08)' }}>
                📄 Download sitemap.xml
              </button>
            </div>
          </div>
        </div>
      )}
      {tab === 'tracking' && (
        <div className="space-y-4 max-w-lg">
          {[['googleAnalytics','Google Analytics ID','UA-XXXXXX-X'],['facebookPixel','Facebook Pixel ID','1234567890'],['clarityId','Microsoft Clarity ID','xxxxxxxx'],['gtmId','Google Tag Manager ID','GTM-XXXXXX']].map(([k,l,ph]) => (
            <div key={k}>
              <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>{l}</label>
              <input className="input-light w-full text-sm font-mono" placeholder={ph} value={form[k] || ''} onChange={e => setForm({...form,[k]:e.target.value})} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   COUPONS — with analytics
════════════════════════════════════════════════════════ */
export function Coupons() {
  const { coupons, toggleCoupon, addCoupon } = useAdminStore()
  const [form, setForm] = useState({ code:'', type:'percent', value:10, maxUses:'', expires:'' })
  const [adding, setAdding] = useState(false)

  const handleAdd = () => {
    if (!form.code) return
    addCoupon({ ...form, active: true })
    setForm({ code:'', type:'percent', value:10, maxUses:'', expires:'' })
    setAdding(false)
    toast.success('Coupon created!')
  }

  const totalSavings = coupons.reduce((s, c) => s + (c.uses || 0) * (c.type === 'flat' ? c.value : c.value * 10), 0)

  return (
    <div>
      <PageHeader title="Coupons & Discounts" sub={`${coupons.length} active codes · ₹${totalSavings.toLocaleString()} total savings given`}
        action={<button onClick={() => setAdding(true)} className="btn-gold py-2 px-5 text-xs flex items-center gap-1.5"><Plus size={12} /> Create Coupon</button>} />

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Active Coupons" value={coupons.filter(c=>c.active).length} icon={Tag} />
        <StatCard label="Total Uses" value={coupons.reduce((s,c)=>s+(c.uses||0),0)} icon={Activity} />
        <StatCard label="Avg Discount" value={`${Math.round(coupons.filter(c=>c.type==='percent').reduce((s,c)=>s+c.value,0)/Math.max(coupons.filter(c=>c.type==='percent').length,1))}%`} icon={Percent} />
      </div>

      {adding && (
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="p-6 rounded-2xl mb-5" style={{ background:'#fff', border:'1.5px solid rgba(184,146,42,0.25)' }}>
          <h3 className="font-medium mb-4">New Coupon</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { l:'Code *', k:'code', type:'text', ph:'SUMMER20', upper:true },
              { l:'Type', k:'type', type:'select', options:[['percent','Percentage'],['flat','Flat Amount']] },
              { l:'Value', k:'value', type:'number' },
              { l:'Max Uses', k:'maxUses', type:'number', ph:'Unlimited' },
            ].map(f => (
              <div key={f.k}>
                <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>{f.l}</label>
                {f.type === 'select'
                  ? <select className="input-light w-full text-sm" value={form[f.k]} onChange={e => setForm({...form,[f.k]:e.target.value})}>
                      {f.options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  : <input type={f.type} className="input-light w-full text-sm" placeholder={f.ph} value={form[f.k]}
                      onChange={e => setForm({...form,[f.k]:f.upper ? e.target.value.toUpperCase() : e.target.value})} />
                }
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Expiry Date</label>
              <input type="date" className="input-light w-full text-sm" value={form.expires} onChange={e => setForm({...form,expires:e.target.value})} />
            </div>
            <div>
              <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Min Order Value (₹)</label>
              <input type="number" className="input-light w-full text-sm" placeholder="0" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="btn-gold py-2 px-6 text-xs">Create Coupon</button>
            <button onClick={() => setAdding(false)} className="btn-outline-gold py-2 px-6 text-xs">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="rounded-2xl overflow-hidden" style={CARD}>
        <table className="w-full admin-table">
          <thead><tr><th>Code</th><th>Discount</th><th>Uses</th><th>Revenue Saved</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id}>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm" style={{ color:'var(--gold)' }}>{c.code}</span>
                    <button onClick={() => { navigator.clipboard.writeText(c.code); toast.success('Copied!') }}>
                      <Copy size={11} style={{ color:'var(--text-muted)' }} />
                    </button>
                  </div>
                </td>
                <td><Chip style={TAG_GREEN}>{c.type==='percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}</Chip></td>
                <td>
                  <div>{c.uses || 0}{c.maxUses ? `/${c.maxUses}` : ''}</div>
                  {c.maxUses && <div className="scarcity-bar mt-1 w-16"><div className="scarcity-fill" style={{ width:`${Math.min(((c.uses||0)/c.maxUses)*100,100)}%` }}/></div>}
                </td>
                <td style={{ color:'var(--gold)' }}>₹{((c.uses||0) * (c.type==='flat' ? c.value : c.value*10)).toLocaleString()}</td>
                <td className="text-xs" style={{ color:'var(--text-muted)' }}>{c.expires || '∞ Never'}</td>
                <td><Chip style={c.active ? TAG_GREEN : TAG_RED}>{c.active ? 'Active' : 'Paused'}</Chip></td>
                <td>
                  <div className="flex gap-1">
                    <button onClick={() => toggleCoupon(c.id)} className="p-1.5 rounded-lg" style={{ background:'var(--cream)' }}>
                      {c.active ? <EyeOff size={11} style={{color:'var(--text-muted)'}} /> : <Eye size={11} style={{color:'var(--sage)'}} />}
                    </button>
                    <button className="p-1.5 rounded-lg" style={{ background:'rgba(220,53,69,0.06)' }}><Trash2 size={11} style={{color:'#dc3545'}} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   SHIPPING ZONES
════════════════════════════════════════════════════════ */
export function ShippingZones() {
  const { shippingZones, addShippingZone, deleteShippingZone } = useAdminStore()
  const [adding, setAdding] = useState(false)
  const [zoneForm, setZoneForm] = useState({ name:'', states:'', rate:49, freeAbove:999, cod:true, eta:'3-5 days' })

  const handleAddZone = () => {
    if (!zoneForm.name) return toast.error('Zone name is required')
    addShippingZone({ ...zoneForm, rate: Number(zoneForm.rate), freeAbove: Number(zoneForm.freeAbove) })
    setAdding(false)
    toast.success('Shipping zone added!')
  }

  return (
    <div>
      <PageHeader title="Shipping Zones" sub="Configure delivery rates by region"
        action={<button onClick={() => setAdding(true)} className="btn-gold py-2 px-5 text-xs flex items-center gap-1.5"><Plus size={12} /> Add Zone</button>} />

      {/* quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Active Zones" value={shippingZones.length} icon={Globe} />
        <StatCard label="Free Shipping Threshold" value="₹999" icon={Gift} />
        <StatCard label="COD Available" value="Pan India" icon={CreditCard} />
      </div>

      {adding && (
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          className="p-6 rounded-2xl mb-5" style={{ background:'#fff', border:'1.5px solid rgba(184,146,42,0.25)' }}>
          <h3 className="font-medium mb-4">Add Shipping Zone</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Zone Name *</label>
              <input className="input-light w-full text-sm" placeholder="South India" value={zoneForm.name} onChange={e => setZoneForm({...zoneForm,name:e.target.value})} /></div>
            <div><label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>States Covered</label>
              <input className="input-light w-full text-sm" placeholder="Tamil Nadu, Kerala, Karnataka" value={zoneForm.states} onChange={e => setZoneForm({...zoneForm,states:e.target.value})} /></div>
            <div><label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Shipping Rate (₹)</label>
              <input type="number" className="input-light w-full text-sm" value={zoneForm.rate} onChange={e => setZoneForm({...zoneForm,rate:e.target.value})} /></div>
            <div><label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Free Shipping Above (₹)</label>
              <input type="number" className="input-light w-full text-sm" value={zoneForm.freeAbove} onChange={e => setZoneForm({...zoneForm,freeAbove:e.target.value})} /></div>
            <div><label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Delivery ETA</label>
              <input className="input-light w-full text-sm" placeholder="3-5 days" value={zoneForm.eta} onChange={e => setZoneForm({...zoneForm,eta:e.target.value})} /></div>
            <div className="flex items-center gap-3 mt-5">
              <label className="text-xs" style={{ color:'var(--text-muted)' }}>COD Available:</label>
              <Toggle value={zoneForm.cod} onChange={() => setZoneForm({...zoneForm,cod:!zoneForm.cod})} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAddZone} className="btn-gold py-2 px-6 text-xs">Add Zone</button>
            <button onClick={() => setAdding(false)} className="btn-outline-gold py-2 px-6 text-xs">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {shippingZones.map(zone => (
          <div key={zone.id} className="p-5 rounded-2xl" style={CARD}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium">{zone.name}</h3>
                <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{zone.states}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg" style={{ background:'var(--cream)' }}><Edit2 size={13} style={{color:'var(--gold)'}} /></button>
                <button onClick={() => { if(window.confirm('Delete this zone?')) { deleteShippingZone(zone.id); toast.success('Zone deleted') } }} className="p-2 rounded-lg" style={{ background:'rgba(220,53,69,0.06)' }}><Trash2 size={13} style={{color:'#dc3545'}} /></button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { l:'Shipping Rate', v: zone.rate===0 ? 'FREE' : `₹${zone.rate}`, c: zone.rate===0 ? 'var(--sage)' : 'var(--gold)' },
                { l:'Free Above',   v:`₹${zone.freeAbove}`,                       c:'var(--gold)' },
                { l:'COD',          v: zone.cod ? 'Yes' : 'No',                  c: zone.cod ? 'var(--sage)' : '#dc3545' },
                { l:'ETA',          v: zone.eta || '3-5 days',                   c:'var(--ink)' },
              ].map((s,i) => (
                <div key={i} className="p-3 rounded-xl text-center" style={{ background:'var(--cream)', border:'1px solid rgba(184,146,42,0.1)' }}>
                  <div className="text-[10px] mb-1" style={{ color:'var(--text-muted)' }}>{s.l}</div>
                  <div className="font-semibold text-sm" style={{ color:s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   INVENTORY — with reorder alerts
════════════════════════════════════════════════════════ */
export function Inventory() {
  const { inventory } = useAdminStore()
  const [adjusting, setAdjusting] = useState(null)
  const [adjustQty, setAdjustQty] = useState('')

  const alerts = inventory.filter(i => i.stock < i.reorderLevel)

  return (
    <div>
      <PageHeader title="Inventory" sub={`${inventory.length} SKUs tracked`}
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs" style={{ background:'var(--cream)', border:'1px solid rgba(184,146,42,0.2)', color:'var(--gold)' }}>
              <Download size={12} /> Export
            </button>
            <button className="btn-gold py-2 px-5 text-xs flex items-center gap-1.5"><Upload size={12} /> Bulk Update</button>
          </div>
        } />

      {alerts.length > 0 && (
        <div className="p-4 rounded-2xl mb-5 flex items-center gap-3" style={{ background:'rgba(255,165,0,0.08)', border:'1.5px solid rgba(255,165,0,0.25)' }}>
          <AlertTriangle size={16} style={{ color:'#f59e0b', flexShrink:0 }} />
          <div>
            <div className="font-medium text-sm" style={{ color:'#b45309' }}>⚠ Low Stock Alert — {alerts.length} SKU{alerts.length>1?'s':''} below reorder level</div>
            <div className="text-xs mt-0.5" style={{ color:'#92400e' }}>{alerts.map(a=>a.product).join(', ')}</div>
          </div>
          <button className="ml-auto btn-gold py-2 px-4 text-xs">Reorder Now</button>
        </div>
      )}

      <div className="space-y-4">
        {inventory.map(item => (
          <div key={item.id} className="p-5 rounded-2xl" style={{ ...CARD, borderColor: item.stock < item.reorderLevel ? 'rgba(255,165,0,0.3)' : 'rgba(184,146,42,0.1)' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium">{item.product}</h3>
                <div className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>SKU: <span className="font-mono">{item.sku}</span> · Supplier: {item.supplier}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl" style={{ color: item.stock < item.reorderLevel ? '#f59e0b' : 'var(--sage)' }}>{item.stock}</div>
                <div className="text-[10px]" style={{ color:'var(--text-muted)' }}>units</div>
              </div>
            </div>

            <div className="scarcity-bar mb-2">
              <div className="scarcity-fill" style={{
                width:`${Math.min((item.stock/(item.reorderLevel*3))*100,100)}%`,
                background: item.stock < item.reorderLevel ? 'linear-gradient(90deg,#ff6b6b,#ff8c00)' : undefined
              }} />
            </div>

            <div className="flex items-center justify-between text-xs mb-4" style={{ color:'var(--text-muted)' }}>
              <span>Reorder at: <strong>{item.reorderLevel}</strong> units</span>
              <span>Last restocked: {item.lastRestocked}</span>
              {item.stock < item.reorderLevel && <span style={{ color:'#f59e0b' }}>⚠ Reorder Required</span>}
            </div>

            <div className="flex gap-2">
              {adjusting === item.id ? (
                <div className="flex gap-2 flex-1">
                  <input type="number" className="input-light flex-1 text-sm" placeholder="Qty to add" value={adjustQty} onChange={e=>setAdjustQty(e.target.value)} />
                  <button onClick={() => { toast.success(`Added ${adjustQty} units`); setAdjusting(null); setAdjustQty('') }} className="btn-sage py-2 px-4 text-xs">Confirm</button>
                  <button onClick={() => setAdjusting(null)} className="btn-outline-gold py-2 px-3 text-xs">✕</button>
                </div>
              ) : (
                <>
                  <button onClick={() => setAdjusting(item.id)} className="flex-1 py-2 rounded-xl text-xs font-medium" style={{ background:'var(--sage-pale)', color:'var(--sage)', border:'1px solid rgba(74,103,65,0.2)' }}>
                    + Adjust Stock
                  </button>
                  <button className="px-4 py-2 rounded-xl text-xs" style={{ background:'var(--cream)', color:'var(--text-muted)', border:'1px solid rgba(0,0,0,0.08)' }}>View History</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   REVIEWS — approve, reply, sentiment
════════════════════════════════════════════════════════ */
export function ReviewManager() {
  const { reviews } = useAdminStore()
  const [filter, setFilter] = useState('all')
  const [replying, setReplying] = useState(null)
  const [replyText, setReplyText] = useState('')

  const filtered = reviews.filter(r => filter === 'all' ? true : r.status === filter)
  const avgRating = (reviews.reduce((s,r)=>s+r.rating,0)/Math.max(reviews.length,1)).toFixed(1)
  const pending = reviews.filter(r=>r.status==='pending').length

  const sentiment = (rating) => {
    if (rating >= 5) return { label:'Positive', style:TAG_GREEN }
    if (rating >= 3) return { label:'Neutral',  style:TAG_GOLD  }
    return { label:'Negative', style:TAG_RED }
  }

  return (
    <div>
      <PageHeader title="Reviews" sub={`${reviews.length} reviews · ${pending} pending approval`}
        action={pending > 0 && <button onClick={() => toast.success('All reviews approved!')} className="btn-sage py-2 px-5 text-xs">Approve All Pending</button>} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Average Rating" value={`⭐ ${avgRating}/5`} icon={Star} />
        <StatCard label="Published" value={reviews.filter(r=>r.status==='published').length} icon={CheckCircle} />
        <StatCard label="Pending" value={pending} icon={Clock} />
      </div>

      <div className="flex gap-2 mb-5">
        {[['all','All'],['pending','Pending'],['published','Published']].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)} className="px-4 py-1.5 rounded-xl text-xs transition-all"
            style={filter===k ? {background:'var(--ink)',color:'#fff'} : {background:'#fff',border:'1px solid rgba(0,0,0,0.08)',color:'var(--text-muted)'}}>
            {l} ({reviews.filter(r=>k==='all'||r.status===k).length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(r => {
          const s = sentiment(r.rating)
          return (
            <div key={r.id} className="p-5 rounded-2xl" style={{ ...CARD, borderColor: r.status==='pending' ? 'rgba(255,165,0,0.25)' : 'rgba(184,146,42,0.1)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-display" style={{ background:'var(--gold-pale)', color:'var(--gold)' }}>{r.customer[0]}</div>
                  <div>
                    <div className="font-medium text-sm">{r.customer}</div>
                    <div className="text-[10px]" style={{ color:'var(--text-muted)' }}>{r.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Chip style={s.style}>{s.label}</Chip>
                  <Chip style={TAG_GOLD}>{r.product}</Chip>
                  <Chip style={r.status==='published' ? TAG_GREEN : TAG_ORANGE}>{r.status}</Chip>
                </div>
              </div>

              <div className="text-yellow-500 text-sm mb-2">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
              <p className="text-sm italic mb-3" style={{ color:'var(--ink-soft)' }}>"{r.text}"</p>

              {/* Reply */}
              {replying === r.id ? (
                <div className="mt-3 space-y-2">
                  <textarea className="input-light w-full text-sm resize-none" rows={3} value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Write your reply…" />
                  <div className="flex gap-2">
                    <button onClick={() => { toast.success('Reply sent!'); setReplying(null); setReplyText('') }} className="btn-gold py-2 px-4 text-xs flex items-center gap-1.5"><Send size={11}/> Send Reply</button>
                    <button onClick={() => setReplying(null)} className="btn-outline-gold py-2 px-4 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  {r.status === 'pending' && <button onClick={() => toast.success('Review published!')} className="py-2 px-3 rounded-xl text-xs flex items-center gap-1" style={{ background:'var(--sage-pale)', color:'var(--sage)' }}><Check size={11}/> Approve</button>}
                  <button onClick={() => setReplying(r.id)} className="py-2 px-3 rounded-xl text-xs flex items-center gap-1" style={{ background:'var(--cream)', color:'var(--text-muted)', border:'1px solid rgba(0,0,0,0.08)' }}><MessageSquare size={11}/> Reply</button>
                  <button className="py-2 px-3 rounded-xl text-xs flex items-center gap-1" style={{ background:'rgba(220,53,69,0.06)', color:'#dc3545' }}><Trash2 size={11}/> Delete</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   BLOG — with SEO score per post
════════════════════════════════════════════════════════ */
const BLOG_SCORES = {}
export function Blog() {
  const { blogs, addBlog, updateBlog, deleteBlog } = useAdminStore()
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState(null)    // null | 'new' | blog object
  const [form, setForm] = useState({ title:'', slug:'', content:'', excerpt:'', status:'draft', category:'Wellness' })

  const filtered = blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()))
  const seoScore = (b) => { if (!BLOG_SCORES[b.id]) BLOG_SCORES[b.id] = Math.round(Math.random() * 40 + 60); return BLOG_SCORES[b.id] }

  const openNew = () => { setForm({ title:'', slug:'', content:'', excerpt:'', status:'draft', category:'Wellness' }); setEditor('new') }
  const openEdit = (b) => { setForm({ ...b }); setEditor(b) }
  const closeEditor = () => setEditor(null)

  const savePost = () => {
    if (!form.title) return toast.error('Title is required')
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')
    if (editor === 'new') {
      addBlog({ ...form, slug })
      toast.success('Post created!')
    } else {
      updateBlog(editor.id, { ...form, slug })
      toast.success('Post updated!')
    }
    closeEditor()
  }

  const toggleStatus = (b) => {
    updateBlog(b.id, { status: b.status === 'published' ? 'draft' : 'published' })
    toast.success(b.status === 'published' ? 'Post unpublished' : 'Post published!')
  }

  return (
    <div>
      <PageHeader title="Blog Manager" sub={`${blogs.length} posts · ${blogs.filter(b=>b.status==='published').length} published`}
        action={<button onClick={openNew} className="btn-gold py-2 px-5 text-xs flex items-center gap-1.5"><Plus size={12} /> New Post</button>} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Posts" value={blogs.length} icon={Archive} />
        <StatCard label="Total Views" value={`${(blogs.reduce((s,b)=>s+b.views,0)/1000).toFixed(1)}K`} icon={Eye} />
        <StatCard label="Avg SEO Score" value="74/100" icon={Target} />
      </div>

      <div className="relative mb-5">
        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }} />
        <input className="input-light pl-8 text-xs w-72" placeholder="Search posts…" value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map(b => {
          const score = seoScore(b)
          return (
            <div key={b.id} className="p-5 rounded-2xl flex items-center gap-4" style={CARD}>
              {/* SEO ring */}
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: score>75 ? 'var(--sage-pale)' : 'var(--gold-pale)', border: `2px solid ${score>75 ? 'var(--sage)' : 'var(--gold)'}` }}>
                <span className="text-xs font-bold" style={{ color: score>75 ? 'var(--sage)' : 'var(--gold)' }}>{score}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-sm">{b.title}</h3>
                  <Chip style={b.status==='published' ? TAG_GREEN : TAG_ORANGE}>{b.status}</Chip>
                </div>
                <div className="text-xs" style={{ color:'var(--text-muted)' }}>/{b.slug} · {b.date} · {b.views.toLocaleString()} views</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => toggleStatus(b)} className="p-2 rounded-xl" title={b.status==='published'?'Unpublish':'Publish'} style={{ background: b.status==='published' ? 'var(--sage-pale)' : 'var(--cream)' }}>
                  {b.status==='published' ? <EyeOff size={13} style={{ color:'var(--sage)' }} /> : <Eye size={13} style={{ color:'var(--text-muted)' }} />}
                </button>
                <button onClick={() => openEdit(b)} className="p-2 rounded-xl" style={{ background:'var(--gold-pale)' }}><Edit2 size={13} style={{ color:'var(--gold)' }} /></button>
                <button onClick={() => { if(window.confirm('Delete post?')) { deleteBlog(b.id); toast.success('Deleted') } }} className="p-2 rounded-xl" style={{ background:'rgba(220,53,69,0.06)' }}><Trash2 size={13} style={{ color:'#dc3545' }} /></button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Blog Editor Modal */}
      <AnimatePresence>
        {editor !== null && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4" style={{ background:'rgba(30,26,20,0.65)', backdropFilter:'blur(12px)' }}>
            <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.92, opacity:0 }}
              className="w-full max-w-3xl rounded-3xl overflow-hidden" style={{ background:'#fff', maxHeight:'92vh', overflowY:'auto', boxShadow:'0 40px 100px rgba(30,26,20,0.2)' }}>
              <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b" style={{ background:'#fff', borderColor:'rgba(0,0,0,0.06)' }}>
                <h2 className="font-display text-xl">{editor === 'new' ? 'New Blog Post' : `Edit: ${editor.title}`}</h2>
                <button onClick={closeEditor}><X size={16} style={{ color:'var(--text-muted)' }} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Post Title *</label>
                  <input className="input-light w-full text-sm" placeholder="5 Ayurvedic Herbs Every Man Should Know" value={form.title}
                    onChange={e => setForm({...form, title:e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-')})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>URL Slug</label>
                    <input className="input-light w-full text-sm font-mono" value={form.slug} onChange={e => setForm({...form,slug:e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Category</label>
                    <select className="input-light w-full text-sm" value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                      {['Wellness','Ayurveda','Men\'s Health','Herbs','Recipes','Lifestyle'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Excerpt (shown on listing page)</label>
                  <textarea className="input-light w-full text-sm resize-none" rows={2} value={form.excerpt || ''} onChange={e => setForm({...form,excerpt:e.target.value})} placeholder="A short summary of the post…" />
                </div>
                <div>
                  <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Content</label>
                  <textarea className="input-light w-full text-sm resize-none font-mono" rows={12} value={form.content || ''} onChange={e => setForm({...form,content:e.target.value})} placeholder="Write your post content here…" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs" style={{ color:'var(--text-muted)' }}>Status:</label>
                  <select className="input-light text-sm" value={form.status} onChange={e => setForm({...form,status:e.target.value})}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={savePost} className="btn-gold flex-1 py-3 text-sm flex items-center justify-center gap-1.5"><Save size={13}/> {editor==='new'?'Publish Post':'Save Changes'}</button>
                  <button onClick={closeEditor} className="btn-outline-gold px-6 py-3 text-sm">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   EMAIL CAMPAIGNS — with segment targeting
════════════════════════════════════════════════════════ */
export function EmailCampaigns() {
  const [tab, setTab] = useState('campaigns')
  const [creating, setCreating] = useState(false)
  const [campaignForm, setCampaignForm] = useState({ name:'', subject:'', type:'Campaign', segment:'all', body:'' })
  const [localCampaigns, setLocalCampaigns] = useState([])

  const campaigns = [
    { name:'Welcome Series', status:'Active', sent:2847, opens:'34%', type:'Automated', clicks:'8.1%' },
    { name:'Diwali Sale 2024', status:'Sent', sent:2100, opens:'41%', type:'Campaign', clicks:'12.3%' },
    { name:'Re-Engagement Flow', status:'Draft', sent:0, opens:'—', type:'Automated', clicks:'—' },
    { name:'Cart Abandonment', status:'Active', sent:1240, opens:'28%', type:'Automated', clicks:'9.7%' },
    { name:'Post-Purchase Follow-up', status:'Active', sent:698, opens:'52%', type:'Automated', clicks:'15.2%' },
  ]

  const templates = [
    { name:'Welcome', preview:'Welcome to Nama Pharma…', category:'Onboarding' },
    { name:'Flash Sale', preview:'Limited time offer…', category:'Promotional' },
    { name:'Review Request', preview:'How was your experience?', category:'Retention' },
    { name:'Win-Back', preview:'We miss you…', category:'Re-engagement' },
  ]

  return (
    <div>
      <PageHeader title="Email Campaigns" sub="2,847 subscribers"
        action={<button onClick={() => { setCampaignForm({name:'',subject:'',type:'Campaign',segment:'all',body:''}); setCreating(true) }} className="btn-gold py-2 px-5 text-xs flex items-center gap-1.5"><Plus size={12} /> New Campaign</button>} />

      {/* New Campaign Modal */}
      <AnimatePresence>
        {creating && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4" style={{ background:'rgba(30,26,20,0.65)', backdropFilter:'blur(12px)' }}>
            <motion.div initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.92, opacity:0 }}
              className="w-full max-w-2xl rounded-3xl overflow-hidden" style={{ background:'#fff', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 40px 100px rgba(30,26,20,0.2)' }}>
              <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b" style={{ background:'#fff', borderColor:'rgba(0,0,0,0.06)' }}>
                <h2 className="font-display text-xl">New Email Campaign</h2>
                <button onClick={() => setCreating(false)}><X size={16} style={{ color:'var(--text-muted)' }} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Campaign Name *</label>
                    <input className="input-light w-full text-sm" placeholder="Diwali Mega Sale" value={campaignForm.name} onChange={e => setCampaignForm({...campaignForm,name:e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Type</label>
                    <select className="input-light w-full text-sm" value={campaignForm.type} onChange={e => setCampaignForm({...campaignForm,type:e.target.value})}>
                      <option>Campaign</option><option>Automated</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Email Subject Line *</label>
                  <input className="input-light w-full text-sm" placeholder="🎉 Special offer for you!" value={campaignForm.subject} onChange={e => setCampaignForm({...campaignForm,subject:e.target.value})} />
                </div>
                <div>
                  <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Target Segment</label>
                  <select className="input-light w-full text-sm" value={campaignForm.segment} onChange={e => setCampaignForm({...campaignForm,segment:e.target.value})}>
                    <option value="all">All Subscribers</option>
                    <option value="champions">Champions Only</option>
                    <option value="atrisk">At Risk Customers</option>
                    <option value="new">New Customers</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Email Body</label>
                  <textarea className="input-light w-full text-sm resize-none" rows={6} placeholder="Hi {{name}}, here's an exclusive offer for you…" value={campaignForm.body} onChange={e => setCampaignForm({...campaignForm,body:e.target.value})} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => {
                    if (!campaignForm.name || !campaignForm.subject) return toast.error('Name and subject are required')
                    setLocalCampaigns(prev => [...prev, { ...campaignForm, sent:0, opens:'—', clicks:'—', status:'Draft' }])
                    setCreating(false)
                    toast.success('Campaign created as draft!')
                  }} className="btn-gold flex-1 py-3 text-sm flex items-center justify-center gap-1.5"><Save size={13}/> Save as Draft</button>
                  <button onClick={() => {
                    if (!campaignForm.name || !campaignForm.subject) return toast.error('Name and subject are required')
                    setLocalCampaigns(prev => [...prev, { ...campaignForm, sent:0, opens:'—', clicks:'—', status:'Scheduled' }])
                    setCreating(false)
                    toast.success('Campaign scheduled!')
                  }} className="btn-sage flex-1 py-3 text-sm flex items-center justify-center gap-1.5"><Send size={13}/> Schedule</button>
                  <button onClick={() => setCreating(false)} className="btn-outline-gold px-4 py-3 text-sm">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Subscribers" value="2,847" change="+124 this month" positive icon={Users} />
        <StatCard label="Avg Open Rate" value="34.2%" change="+3.1% vs industry" positive icon={Mail} />
        <StatCard label="Click Rate" value="8.7%" change="+1.2% vs last month" positive icon={Activity} />
      </div>

      <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background:'var(--cream)', border:'1px solid rgba(184,146,42,0.12)' }}>
        {['campaigns','automation','templates','subscribers'].map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-1.5 rounded-lg text-xs capitalize transition-all"
            style={tab===t ? {background:'var(--gold)',color:'#fff'} : {background:'transparent',color:'var(--text-muted)'}}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'campaigns' && (
        <div className="rounded-2xl overflow-hidden" style={CARD}>
          <table className="w-full admin-table">
            <thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Sent</th><th>Open Rate</th><th>Click Rate</th><th>Actions</th></tr></thead>
            <tbody>
              {[...campaigns, ...localCampaigns].map((c,i) => (
                <tr key={i}>
                  <td className="font-medium text-sm">{c.name}</td>
                  <td><Chip style={c.type==='Automated' ? TAG_BLUE : TAG_GOLD}>{c.type}</Chip></td>
                  <td><Chip style={c.status==='Active' ? TAG_GREEN : c.status==='Sent' ? TAG_GOLD : {background:'rgba(0,0,0,0.05)',color:'var(--text-muted)'}}>{c.status}</Chip></td>
                  <td className="text-sm">{c.sent.toLocaleString()}</td>
                  <td style={{ color:'var(--sage)', fontWeight:600 }}>{c.opens}</td>
                  <td style={{ color:'var(--gold)', fontWeight:600 }}>{c.clicks}</td>
                  <td>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg" style={{ background:'var(--cream)' }}><BarChart2 size={11} style={{color:'var(--gold)'}}/></button>
                      <button className="p-1.5 rounded-lg" style={{ background:'var(--cream)' }}><Edit2 size={11} style={{color:'var(--text-muted)'}}/></button>
                      {c.status==='Draft' && <button className="p-1.5 rounded-lg" style={{ background:'var(--sage-pale)' }}><Send size={11} style={{color:'var(--sage)'}}/></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'templates' && (
        <div className="grid grid-cols-2 gap-4">
          {templates.map((t,i) => (
            <div key={i} className="p-5 rounded-2xl" style={CARD}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium">{t.name}</h3>
                  <Chip style={TAG_BLUE}>{t.category}</Chip>
                </div>
                <button className="btn-gold py-1.5 px-3 text-[10px]">Use Template</button>
              </div>
              <div className="p-3 rounded-xl text-sm italic" style={{ background:'var(--cream)', color:'var(--text-muted)', border:'1px dashed rgba(184,146,42,0.2)' }}>
                {t.preview}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'subscribers' && (
        <div className="p-5 rounded-2xl" style={CARD}>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[['Subscribed','2,847'],['Unsubscribed','234'],['Bounced','12']].map(([l,v])=>(
              <div key={l} className="text-center p-4 rounded-xl" style={{ background:'var(--cream)' }}>
                <div className="font-display text-2xl mb-1" style={{ color:'var(--gold)' }}>{v}</div>
                <div className="text-xs" style={{ color:'var(--text-muted)' }}>{l}</div>
              </div>
            ))}
          </div>
          <button className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2" style={{ background:'var(--cream)', border:'2px dashed rgba(184,146,42,0.3)', color:'var(--gold)' }}>
            <Upload size={14}/> Import Subscribers (CSV)
          </button>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   SETTINGS — tabbed, comprehensive
════════════════════════════════════════════════════════ */
export function AdminSettings() {
  const [tab, setTab] = useState('store')
  const [notifs, setNotifs] = useState({ newOrder:true, lowStock:true, newReview:true, shipment:false, referral:true })

  // Payments state
  const [paymentStatuses, setPaymentStatuses] = useState({ Razorpay:'Connected', 'Cash on Delivery':'Enabled', 'EMI / BNPL':'Disabled', 'International Payments':'Disabled' })
  const [configuringPayment, setConfiguringPayment] = useState(null)
  const [rzpForm, setRzpForm] = useState({ keyId:'rzp_live_xxxxxxxxxxxxx', secret:'', webhook:'' })
  const [codForm, setCodForm] = useState({ maxOrder:'5000', fee:'0' })
  const [emiForm, setEmiForm] = useState({ tenures:'3,6,12', minOrder:'3000' })
  const [intlForm, setIntlForm] = useState({ stripeKey:'', currency:'USD,EUR' })

  // Team state
  const [teamMembers, setTeamMembers] = useState([
    { id:1, name:'Admin User', email:'admin@namapharma.com', role:'Super Admin', status:'Active', login:'Today' },
    { id:2, name:'Support Team', email:'support@namapharma.com', role:'Support', status:'Active', login:'2 hours ago' },
  ])
  const [inviting, setInviting] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [inviteForm, setInviteForm] = useState({ name:'', email:'', role:'Support' })
  const [memberForm, setMemberForm] = useState({ name:'', email:'', role:'Support', status:'Active' })

  // Integrations state
  const [integrations, setIntegrations] = useState([
    { id:1, name:'Shiprocket', category:'Logistics', status:'Connected', icon:'🚚', fields:[['API Key',''],['API Secret','']] },
    { id:2, name:'Delhivery', category:'Logistics', status:'Disconnected', icon:'📦', fields:[['API Token','']] },
    { id:3, name:'Mailchimp', category:'Email', status:'Connected', icon:'📧', fields:[['API Key',''],['Audience ID','']] },
    { id:4, name:'WhatsApp Business', category:'Messaging', status:'Connected', icon:'💬', fields:[['Phone Number ID',''],['Access Token','']] },
    { id:5, name:'Google Sheets', category:'Analytics', status:'Disconnected', icon:'📊', fields:[['Sheet ID',''],['Service Account JSON','']] },
    { id:6, name:'Webhooks', category:'Developer', status:'Configured', icon:'🔗', fields:[['Endpoint URL',''],['Secret Key','']] },
  ])
  const [connectingTo, setConnectingTo] = useState(null)
  const [igFormData, setIgFormData] = useState({})

  const tabs = [['store','Store'],['payments','Payments'],['notifications','Alerts'],['team','Team'],['integrations','Integrations']]

  const PAYMENT_CONFIGS = {
    Razorpay: { title:'Configure Razorpay', fields: [
      { key:'keyId', label:'Key ID', placeholder:'rzp_live_xxxxx', type:'text' },
      { key:'secret', label:'Key Secret', placeholder:'Enter secret key', type:'password' },
      { key:'webhook', label:'Webhook Secret', placeholder:'Enter webhook secret', type:'password' },
    ], form: rzpForm, setForm: setRzpForm },
    'Cash on Delivery': { title:'Configure COD', fields: [
      { key:'maxOrder', label:'Max Order Value (₹)', placeholder:'5000', type:'number' },
      { key:'fee', label:'COD Fee (₹)', placeholder:'0', type:'number' },
    ], form: codForm, setForm: setCodForm },
    'EMI / BNPL': { title:'Configure EMI', fields: [
      { key:'tenures', label:'Available Tenures (months, comma-separated)', placeholder:'3,6,12', type:'text' },
      { key:'minOrder', label:'Minimum Order for EMI (₹)', placeholder:'3000', type:'number' },
    ], form: emiForm, setForm: setEmiForm },
    'International Payments': { title:'Configure International', fields: [
      { key:'stripeKey', label:'Stripe Publishable Key', placeholder:'pk_live_xxxxx', type:'text' },
      { key:'currency', label:'Accepted Currencies', placeholder:'USD,EUR,GBP', type:'text' },
    ], form: intlForm, setForm: setIntlForm },
  }

  function togglePayment(name) {
    const cur = paymentStatuses[name]
    const next = (cur === 'Disabled') ? (name === 'Razorpay' ? 'Connected' : 'Enabled') : 'Disabled'
    setPaymentStatuses({ ...paymentStatuses, [name]: next })
    toast.success(`${name} ${next === 'Disabled' ? 'disabled' : 'enabled'}`)
  }

  function savePaymentConfig() {
    toast.success(`${configuringPayment} configuration saved`)
    setConfiguringPayment(null)
  }

  function openInvite() { setInviteForm({ name:'', email:'', role:'Support' }); setInviting(true) }
  function sendInvite() {
    if (!inviteForm.email) return toast.error('Email is required')
    setTeamMembers([...teamMembers, { id:Date.now(), name:inviteForm.name||inviteForm.email.split('@')[0], email:inviteForm.email, role:inviteForm.role, status:'Invited', login:'Never' }])
    setInviting(false)
    toast.success(`Invitation sent to ${inviteForm.email}`)
  }

  function openEditMember(m) { setMemberForm({ name:m.name, email:m.email, role:m.role, status:m.status }); setEditingMember(m.id) }
  function saveMember() {
    setTeamMembers(teamMembers.map(m => m.id === editingMember ? { ...m, ...memberForm } : m))
    setEditingMember(null)
    toast.success('Member updated')
  }
  function removeMember(id) {
    if (!window.confirm('Remove this team member?')) return
    setTeamMembers(teamMembers.filter(m => m.id !== id))
    toast.success('Member removed')
  }

  function openConnect(ig) {
    const formInit = {}
    ig.fields.forEach(([label]) => { formInit[label] = '' })
    setIgFormData(formInit)
    setConnectingTo(ig)
  }
  function saveIntegration() {
    setIntegrations(integrations.map(ig => ig.id === connectingTo.id ? { ...ig, status: ig.status === 'Disconnected' ? 'Connected' : ig.status } : ig))
    toast.success(`${connectingTo.name} ${connectingTo.status === 'Disconnected' ? 'connected' : 'settings saved'}`)
    setConnectingTo(null)
  }
  function disconnectIntegration(id) {
    setIntegrations(integrations.map(ig => ig.id === id ? { ...ig, status:'Disconnected' } : ig))
    toast.success('Integration disconnected')
  }

  return (
    <div>
      <PageHeader title="Settings" sub="Configure your store" />

      <div className="flex flex-wrap gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background:'var(--cream)', border:'1px solid rgba(184,146,42,0.12)' }}>
        {tabs.map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} className="px-4 py-1.5 rounded-lg text-xs transition-all"
            style={tab===k ? {background:'var(--gold)',color:'#fff'} : {background:'transparent',color:'var(--text-muted)'}}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'store' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { title:'Store Information', fields:[['Store Name','Nama Pharma'],['Support Email','care@namapharma.com'],['Phone','+91 98765 43210'],['WhatsApp','+91 98765 43210'],['Address','Mumbai, India'],['GST Number','27XXXXX']] },
            { title:'Order Settings', fields:[['Free Shipping Above (₹)','999'],['Default Shipping Fee (₹)','79'],['COD Fee (₹)','0'],['Max COD Order (₹)','5000'],['Return Window (days)','7'],['Min Order Value (₹)','0']] },
          ].map((s,i) => (
            <div key={i} className="p-6 rounded-2xl" style={CARD}>
              <h3 className="font-medium mb-5">{s.title}</h3>
              <div className="space-y-3">
                {s.fields.map(([l,v]) => (
                  <div key={l}>
                    <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>{l}</label>
                    <input className="input-light w-full text-sm" defaultValue={v} />
                  </div>
                ))}
              </div>
              <button onClick={() => toast.success('Settings saved!')} className="btn-gold w-full mt-5 py-3 text-xs flex items-center justify-center gap-1.5"><Save size={12}/> Save</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'payments' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[
              { name:'Razorpay', icon:'💳', desc:'UPI, Cards, Netbanking, Wallets' },
              { name:'Cash on Delivery', icon:'💵', desc:'Available on orders up to ₹5,000' },
              { name:'EMI / BNPL', icon:'📅', desc:'Enable 3-12 month EMI options' },
              { name:'International Payments', icon:'🌍', desc:'Accept USD, EUR via Stripe' },
            ].map((p,i) => {
              const status = paymentStatuses[p.name]
              const isActive = status !== 'Disabled'
              return (
                <div key={i} className="p-5 rounded-2xl flex items-center gap-4" style={CARD}>
                  <div className="text-3xl">{p.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{p.desc}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Chip style={isActive ? TAG_GREEN : TAG_RED}>{status}</Chip>
                    <div className="flex gap-1.5">
                      {isActive && (
                        <button onClick={() => setConfiguringPayment(p.name)}
                          className="text-[10px] px-2 py-1 rounded-lg" style={{ background:'var(--cream)', color:'var(--gold)', border:'1px solid rgba(184,146,42,0.2)' }}>
                          Configure
                        </button>
                      )}
                      <button onClick={() => togglePayment(p.name)}
                        className="text-[10px] px-2 py-1 rounded-lg"
                        style={{ background: isActive ? 'rgba(220,38,38,0.08)' : 'rgba(74,103,65,0.1)', color: isActive ? '#DC2626' : 'var(--sage)', border:'1px solid transparent' }}>
                        {isActive ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Payment configure modal */}
          {configuringPayment && (() => {
            const cfg = PAYMENT_CONFIGS[configuringPayment]
            return (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(30,26,20,0.5)', backdropFilter:'blur(6px)' }}>
                <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
                  className="w-full max-w-md rounded-2xl p-6" style={{ background:'#fff' }}>
                  <h3 className="font-medium mb-5">{cfg.title}</h3>
                  <div className="space-y-4 mb-5">
                    {cfg.fields.map(f => (
                      <div key={f.key}>
                        <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>{f.label}</label>
                        <input type={f.type} className="input-light w-full text-sm" placeholder={f.placeholder}
                          value={cfg.form[f.key]} onChange={e => cfg.setForm({ ...cfg.form, [f.key]: e.target.value })} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={savePaymentConfig} className="btn-gold flex-1 py-2.5 text-xs flex items-center justify-center gap-1.5"><Save size={12}/> Save</button>
                    <button onClick={() => setConfiguringPayment(null)} className="btn-outline-gold flex-1 py-2.5 text-xs">Cancel</button>
                  </div>
                </motion.div>
              </div>
            )
          })()}
        </>
      )}

      {tab === 'notifications' && (
        <div className="max-w-lg space-y-3">
          {[
            ['newOrder','New Order Received','Alert when a new order is placed'],
            ['lowStock','Low Stock Alert','Alert when stock falls below reorder level'],
            ['newReview','New Review Submitted','Alert when a customer submits a review'],
            ['shipment','Shipment Delivered','Alert when an order is marked delivered'],
            ['referral','Referral Converted','Alert when a referral earns a reward'],
          ].map(([k,l,d]) => (
            <div key={k} className="p-4 rounded-2xl flex items-center justify-between" style={CARD}>
              <div>
                <div className="font-medium text-sm">{l}</div>
                <div className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{d}</div>
              </div>
              <Toggle value={notifs[k]} onChange={() => setNotifs({...notifs,[k]:!notifs[k]})} />
            </div>
          ))}
        </div>
      )}

      {tab === 'team' && (
        <div className="max-w-2xl">
          <div className="admin-table-wrap rounded-2xl overflow-hidden mb-5" style={CARD}>
            <table className="w-full admin-table">
              <thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
              <tbody>
                {teamMembers.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-display" style={{ background:'var(--gold-pale)', color:'var(--gold)' }}>{m.name[0]}</div>
                        <div>
                          <div className="text-sm font-medium">{m.name}</div>
                          <div className="text-[10px]" style={{ color:'var(--text-muted)' }}>{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><Chip style={m.role==='Super Admin' ? TAG_GOLD : TAG_BLUE}>{m.role}</Chip></td>
                    <td><Chip style={m.status==='Active' ? TAG_GREEN : TAG_ORANGE}>{m.status}</Chip></td>
                    <td className="text-xs" style={{ color:'var(--text-muted)' }}>{m.login}</td>
                    <td>
                      <div className="flex gap-1.5">
                        <button onClick={() => openEditMember(m)} className="p-1.5 rounded-lg" style={{ background:'var(--cream)' }}><Edit2 size={11} style={{color:'var(--gold)'}}/></button>
                        {m.role !== 'Super Admin' && (
                          <button onClick={() => removeMember(m.id)} className="p-1.5 rounded-lg" style={{ background:'rgba(220,38,38,0.08)' }}><Trash2 size={11} style={{color:'#DC2626'}}/></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={openInvite} className="btn-gold py-2.5 px-6 text-xs flex items-center gap-1.5"><Plus size={12}/> Invite Team Member</button>

          {/* Invite modal */}
          {inviting && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(30,26,20,0.5)', backdropFilter:'blur(6px)' }}>
              <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
                className="w-full max-w-md rounded-2xl p-6" style={{ background:'#fff' }}>
                <h3 className="font-medium mb-5">Invite Team Member</h3>
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Name</label>
                    <input className="input-light w-full text-sm" placeholder="Jane Doe" value={inviteForm.name} onChange={e => setInviteForm({...inviteForm,name:e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Email *</label>
                    <input type="email" className="input-light w-full text-sm" placeholder="jane@namapharma.com" value={inviteForm.email} onChange={e => setInviteForm({...inviteForm,email:e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Role</label>
                    <select className="input-light w-full text-sm" value={inviteForm.role} onChange={e => setInviteForm({...inviteForm,role:e.target.value})}>
                      {['Support','Editor','Analyst','Logistics','Super Admin'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={sendInvite} className="btn-gold flex-1 py-2.5 text-xs flex items-center justify-center gap-1.5"><Plus size={12}/> Send Invite</button>
                  <button onClick={() => setInviting(false)} className="btn-outline-gold flex-1 py-2.5 text-xs">Cancel</button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Edit member modal */}
          {editingMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(30,26,20,0.5)', backdropFilter:'blur(6px)' }}>
              <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
                className="w-full max-w-md rounded-2xl p-6" style={{ background:'#fff' }}>
                <h3 className="font-medium mb-5">Edit Team Member</h3>
                <div className="space-y-4 mb-5">
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Name</label>
                    <input className="input-light w-full text-sm" value={memberForm.name} onChange={e => setMemberForm({...memberForm,name:e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Email</label>
                    <input type="email" className="input-light w-full text-sm" value={memberForm.email} onChange={e => setMemberForm({...memberForm,email:e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Role</label>
                    <select className="input-light w-full text-sm" value={memberForm.role} onChange={e => setMemberForm({...memberForm,role:e.target.value})}>
                      {['Support','Editor','Analyst','Logistics','Super Admin'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Status</label>
                    <select className="input-light w-full text-sm" value={memberForm.status} onChange={e => setMemberForm({...memberForm,status:e.target.value})}>
                      {['Active','Inactive','Invited'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveMember} className="btn-gold flex-1 py-2.5 text-xs flex items-center justify-center gap-1.5"><Save size={12}/> Save Changes</button>
                  <button onClick={() => setEditingMember(null)} className="btn-outline-gold flex-1 py-2.5 text-xs">Cancel</button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {tab === 'integrations' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {integrations.map((ig) => {
              const isActive = ig.status !== 'Disconnected'
              return (
                <div key={ig.id} className="p-4 rounded-2xl flex items-center gap-4" style={CARD}>
                  <div className="text-3xl">{ig.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{ig.name}</div>
                    <div className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{ig.category}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Chip style={isActive ? TAG_GREEN : {background:'rgba(0,0,0,0.05)',color:'var(--text-muted)'}}>{ig.status}</Chip>
                    <div className="flex gap-1.5">
                      <button onClick={() => openConnect(ig)}
                        className="text-[10px] px-2 py-1 rounded-lg" style={{ background:'var(--cream)', color:'var(--gold)', border:'1px solid rgba(184,146,42,0.2)' }}>
                        {ig.status === 'Disconnected' ? 'Connect' : 'Settings'}
                      </button>
                      {isActive && (
                        <button onClick={() => disconnectIntegration(ig.id)}
                          className="text-[10px] px-2 py-1 rounded-lg" style={{ background:'rgba(220,38,38,0.08)', color:'#DC2626' }}>
                          Disconnect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Integration connect/settings modal */}
          {connectingTo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:'rgba(30,26,20,0.5)', backdropFilter:'blur(6px)' }}>
              <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
                className="w-full max-w-md rounded-2xl p-6" style={{ background:'#fff' }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="text-3xl">{connectingTo.icon}</div>
                  <div>
                    <h3 className="font-medium">{connectingTo.status === 'Disconnected' ? `Connect ${connectingTo.name}` : `${connectingTo.name} Settings`}</h3>
                    <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{connectingTo.category}</p>
                  </div>
                </div>
                <div className="space-y-4 mb-5">
                  {connectingTo.fields.map(([label]) => (
                    <div key={label}>
                      <label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>{label}</label>
                      <input className="input-light w-full text-sm" placeholder={`Enter ${label.toLowerCase()}`}
                        value={igFormData[label] || ''} onChange={e => setIgFormData({ ...igFormData, [label]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={saveIntegration} className="btn-gold flex-1 py-2.5 text-xs flex items-center justify-center gap-1.5">
                    <Save size={12}/> {connectingTo.status === 'Disconnected' ? 'Connect' : 'Save'}
                  </button>
                  <button onClick={() => setConnectingTo(null)} className="btn-outline-gold flex-1 py-2.5 text-xs">Cancel</button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   FLASH SALE MANAGER (new)
════════════════════════════════════════════════════════ */
export function FlashSales() {
  const [sales, setSales] = useState([
    { id:1, name:'Weekend Warriors Sale', discount:30, starts:'2026-06-21 18:00', ends:'2026-06-22 23:59', products:['Goli Bull Night','Majoon Moosli'], status:'scheduled', revenue:0 },
    { id:2, name:'Diwali Mega Sale', discount:40, starts:'2026-10-20 00:00', ends:'2026-10-22 23:59', products:['Goli Bull Night'], status:'draft', revenue:0 },
    { id:3, name:'Independence Day Flash', discount:25, starts:'2026-08-15 09:00', ends:'2026-08-15 21:00', products:['Majoon Moosli'], status:'ended', revenue:68400 },
  ])
  const [creating, setCreating] = useState(false)
  const [saleForm, setSaleForm] = useState({ name:'', discount:20, starts:'', ends:'' })

  return (
    <div>
      <PageHeader title="Flash Sale Manager" sub="Schedule and manage time-limited promotions"
        action={<button onClick={() => { setSaleForm({name:'',discount:20,starts:'',ends:''}); setCreating(true) }} className="btn-gold py-2 px-5 text-xs flex items-center gap-1.5"><Zap size={12}/> Create Flash Sale</button>} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Active Sales" value={sales.filter(s=>s.status==='scheduled').length} icon={Zap} />
        <StatCard label="Draft" value={sales.filter(s=>s.status==='draft').length} icon={Clock} />
        <StatCard label="Total Revenue from Sales" value={`₹${sales.reduce((s,sa)=>s+sa.revenue,0).toLocaleString()}`} icon={TrendingUp} />
      </div>

      {creating && (
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          className="p-6 rounded-2xl mb-5" style={{ background:'#fff', border:'1.5px solid rgba(184,146,42,0.25)' }}>
          <h3 className="font-medium mb-4">New Flash Sale</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Sale Name *</label>
              <input className="input-light w-full text-sm" placeholder="Weekend Flash Sale" value={saleForm.name} onChange={e => setSaleForm({...saleForm,name:e.target.value})} /></div>
            <div><label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Discount (%)</label>
              <input type="number" className="input-light w-full text-sm" value={saleForm.discount} onChange={e => setSaleForm({...saleForm,discount:Number(e.target.value)})} /></div>
            <div><label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>Start Date & Time</label>
              <input type="datetime-local" className="input-light w-full text-sm" value={saleForm.starts} onChange={e => setSaleForm({...saleForm,starts:e.target.value})} /></div>
            <div><label className="text-xs block mb-1.5" style={{ color:'var(--text-muted)' }}>End Date & Time</label>
              <input type="datetime-local" className="input-light w-full text-sm" value={saleForm.ends} onChange={e => setSaleForm({...saleForm,ends:e.target.value})} /></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => {
              if (!saleForm.name) return toast.error('Sale name is required')
              setSales([...sales,{id:Date.now(),name:saleForm.name,discount:saleForm.discount,starts:saleForm.starts,ends:saleForm.ends,products:['Goli Bull Night'],status:'draft',revenue:0}])
              setCreating(false)
              toast.success('Flash sale created!')
            }} className="btn-gold py-2 px-6 text-xs">Create Sale</button>
            <button onClick={() => setCreating(false)} className="btn-outline-gold py-2 px-6 text-xs">Cancel</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {sales.map(sale => (
          <div key={sale.id} className="p-5 rounded-2xl" style={{ ...CARD, borderColor: sale.status==='scheduled' ? 'rgba(184,146,42,0.3)' : 'rgba(184,146,42,0.1)' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{sale.name}</h3>
                  <Chip style={sale.status==='scheduled' ? TAG_GREEN : sale.status==='draft' ? {background:'rgba(0,0,0,0.05)',color:'var(--text-muted)'} : TAG_ORANGE}>
                    {sale.status}
                  </Chip>
                </div>
                <div className="text-xs" style={{ color:'var(--text-muted)' }}>Products: {sale.products.join(', ')}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl" style={{ color:'var(--gold)' }}>{sale.discount}% OFF</div>
                {sale.revenue > 0 && <div className="text-xs" style={{ color:'var(--sage)' }}>₹{sale.revenue.toLocaleString()} earned</div>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-xl" style={{ background:'var(--cream)' }}>
                <div className="text-[10px] mb-1" style={{ color:'var(--text-muted)' }}>Starts</div>
                <div className="text-xs font-medium">{sale.starts || 'Not set'}</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background:'var(--cream)' }}>
                <div className="text-[10px] mb-1" style={{ color:'var(--text-muted)' }}>Ends</div>
                <div className="text-xs font-medium">{sale.ends || 'Not set'}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="py-2 px-4 rounded-xl text-xs" style={{ background:'var(--cream)', color:'var(--gold)', border:'1px solid rgba(184,146,42,0.2)' }}><Edit2 size={11} className="inline mr-1"/>Edit</button>
              {sale.status==='draft' && <button onClick={() => { setSales(sales.map(s=>s.id===sale.id?{...s,status:'scheduled'}:s)); toast.success('Sale scheduled!') }} className="py-2 px-4 rounded-xl text-xs btn-sage">Schedule</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   REFERRALS (new)
════════════════════════════════════════════════════════ */
export function Referrals() {
  const referrals = [
    { code:'NAMA-RJSHK2', customer:'Rajesh Kumar', uses:3, earned:600, status:'active', joined:'2026-05-10' },
    { code:'NAMA-AMTS7K', customer:'Amit Singh',   uses:1, earned:200, status:'active', joined:'2026-05-18' },
    { code:'NAMA-VKS3M9', customer:'Vikas Mehta',  uses:5, earned:1000, status:'active', joined:'2026-04-22' },
    { code:'NAMA-PRDK4L', customer:'Pradeep Rao',  uses:0, earned:0,   status:'inactive', joined:'2026-06-01' },
  ]

  return (
    <div>
      <PageHeader title="Referral Program" sub="Track and manage the Refer & Earn program" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Codes" value={referrals.filter(r=>r.status==='active').length} icon={Gift} />
        <StatCard label="Total Referrals" value={referrals.reduce((s,r)=>s+r.uses,0)} icon={Users} />
        <StatCard label="Rewards Paid Out" value={`₹${referrals.reduce((s,r)=>s+r.earned,0).toLocaleString()}`} icon={DollarSign} />
        <StatCard label="Conversion Rate" value="68%" change="+4% vs last month" positive icon={Target} />
      </div>

      <div className="rounded-2xl overflow-hidden" style={CARD}>
        <table className="w-full admin-table">
          <thead><tr><th>Code</th><th>Customer</th><th>Uses</th><th>Rewards Earned</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {referrals.map((r,i) => (
              <tr key={i}>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs" style={{ color:'var(--gold)' }}>{r.code}</span>
                    <button onClick={() => { navigator.clipboard.writeText(r.code); toast.success('Copied!') }}><Copy size={10} style={{color:'var(--text-muted)'}}/></button>
                  </div>
                </td>
                <td className="text-sm font-medium">{r.customer}</td>
                <td><span style={{ color:'var(--gold)', fontWeight:600 }}>{r.uses}</span> referrals</td>
                <td style={{ color:'var(--sage)', fontWeight:600 }}>₹{r.earned.toLocaleString()}</td>
                <td className="text-xs" style={{ color:'var(--text-muted)' }}>{r.joined}</td>
                <td><Chip style={r.status==='active' ? TAG_GREEN : TAG_RED}>{r.status}</Chip></td>
                <td>
                  <button className="p-1.5 rounded-lg" style={{ background:'var(--cream)' }}><Eye size={11} style={{color:'var(--text-muted)'}}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   SUBSCRIPTIONS (new)
════════════════════════════════════════════════════════ */
export function Subscriptions() {
  const subs = [
    { id:'SUB-001', customer:'Rajesh K.', product:'Goli Bull Night', plan:'Monthly', price:1039, nextRenewal:'2026-07-18', status:'active' },
    { id:'SUB-002', customer:'Amit S.',   product:'Majoon Moosli',  plan:'Quarterly', price:2247, nextRenewal:'2026-09-01', status:'active' },
    { id:'SUB-003', customer:'Vikas M.',  product:'Goli Bull Night', plan:'Monthly', price:1039, nextRenewal:'2026-07-22', status:'paused' },
    { id:'SUB-004', customer:'Pradeep R.',product:'Majoon Moosli',  plan:'Monthly', price:799,  nextRenewal:'2026-07-10', status:'cancelled' },
  ]
  const mrr = subs.filter(s=>s.status==='active').reduce((sum,s)=>sum+(s.plan==='Quarterly'?s.price/3:s.price),0)

  return (
    <div>
      <PageHeader title="Subscriptions" sub="Manage recurring orders" />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Subscribers" value={subs.filter(s=>s.status==='active').length} icon={RefreshCw} />
        <StatCard label="MRR" value={`₹${Math.round(mrr).toLocaleString()}`} change="+12% this month" positive icon={TrendingUp} />
        <StatCard label="Paused" value={subs.filter(s=>s.status==='paused').length} icon={Clock} />
        <StatCard label="Churn Rate" value="4.2%" change="-1.1% vs last month" positive icon={Activity} />
      </div>

      <div className="rounded-2xl overflow-hidden" style={CARD}>
        <table className="w-full admin-table">
          <thead><tr><th>Subscription</th><th>Customer</th><th>Plan</th><th>Price</th><th>Next Renewal</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {subs.map((s,i) => (
              <tr key={i}>
                <td className="font-mono text-xs" style={{ color:'var(--gold)' }}>{s.id}</td>
                <td className="text-sm font-medium">{s.customer}</td>
                <td>
                  <div className="text-sm">{s.product}</div>
                  <Chip style={TAG_BLUE}>{s.plan}</Chip>
                </td>
                <td style={{ color:'var(--gold)', fontWeight:600 }}>₹{s.price.toLocaleString()}</td>
                <td className="text-xs" style={{ color:'var(--text-muted)' }}>{s.nextRenewal}</td>
                <td><Chip style={s.status==='active' ? TAG_GREEN : s.status==='paused' ? TAG_ORANGE : TAG_RED}>{s.status}</Chip></td>
                <td>
                  <div className="flex gap-1">
                    {s.status==='active' && <button onClick={() => toast.success('Subscription paused')} className="p-1.5 rounded-lg text-[10px]" style={{ background:'var(--gold-pale)', color:'var(--gold)' }}>Pause</button>}
                    {s.status==='paused' && <button onClick={() => toast.success('Subscription resumed!')} className="p-1.5 rounded-lg text-[10px]" style={{ background:'var(--sage-pale)', color:'var(--sage)' }}>Resume</button>}
                    <button className="p-1.5 rounded-lg" style={{ background:'var(--cream)' }}><Eye size={11} style={{color:'var(--text-muted)'}}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   RETURNS & REFUNDS (new)
════════════════════════════════════════════════════════ */
export function Returns() {
  const { returns: storeReturns, updateReturn } = useAdminStore()
  const [noteMap, setNoteMap] = useState({})

  const handleApprove = (r) => {
    updateReturn(r.id, 'refunded')
    toast.success(`Return ${r.id} approved — refund of ₹${r.amount.toLocaleString()} initiated`)
  }
  const handleReject = (r) => {
    updateReturn(r.id, 'rejected')
    toast.error(`Return ${r.id} rejected`)
  }

  const returns = storeReturns || []

  return (
    <div>
      <PageHeader title="Returns & Refunds" sub={`${returns.filter(r=>r.status==='pending').length} pending review`} />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending" value={returns.filter(r=>r.status==='pending').length} icon={Clock} />
        <StatCard label="Approved" value={returns.filter(r=>r.status==='approved').length} icon={CheckCircle} />
        <StatCard label="Refunded" value={`₹${returns.filter(r=>r.status==='refunded').reduce((s,r)=>s+r.amount,0).toLocaleString()}`} icon={DollarSign} />
        <StatCard label="Return Rate" value="2.1%" change="-0.3% vs last month" positive icon={TrendingDown} />
      </div>

      <div className="space-y-4">
        {returns.map((r,i) => (
          <div key={i} className="p-5 rounded-2xl" style={{ ...CARD, borderColor: r.status==='pending' ? 'rgba(255,165,0,0.3)' : 'rgba(184,146,42,0.1)' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold" style={{ color:'var(--gold)' }}>{r.id}</span>
                  <span className="text-xs" style={{ color:'var(--text-muted)' }}>→ Order {r.order}</span>
                  <Chip style={r.status==='pending' ? TAG_ORANGE : r.status==='approved' ? TAG_BLUE : r.status==='refunded' ? TAG_GREEN : TAG_RED}>{r.status}</Chip>
                </div>
                <div className="font-medium text-sm">{r.customer}</div>
                <div className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>Reason: {r.reason}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-xl" style={{ color:'var(--gold)' }}>₹{r.amount.toLocaleString()}</div>
                <div className="text-[10px]" style={{ color:'var(--text-muted)' }}>Requested {r.requested}</div>
              </div>
            </div>
            {r.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => handleApprove(r)} className="flex-1 btn-sage py-2 text-xs flex items-center justify-center gap-1.5"><Check size={11}/> Approve & Refund</button>
                <button onClick={() => handleReject(r)} className="px-4 py-2 rounded-xl text-xs" style={{ background:'rgba(220,53,69,0.08)', color:'#dc3545' }}><X size={11} className="inline mr-1"/>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   NOTIFICATIONS CENTER (new)
════════════════════════════════════════════════════════ */
export function NotificationsCenter() {
  const notifs = [
    { type:'order', icon:'🛍️', title:'New Order #NP-1862', desc:'Rajesh Kumar ordered Goli Bull Night (1 unit) via UPI', time:'2 min ago', read:false },
    { type:'stock', icon:'⚠️', title:'Low Stock Alert', desc:'Goli Bull Night — only 8 units remaining', time:'1 hr ago', read:false },
    { type:'review', icon:'⭐', title:'New Review Pending', desc:'5-star review by Amit S. waiting for approval', time:'3 hrs ago', read:false },
    { type:'referral', icon:'🎁', title:'Referral Converted', desc:'Vikas M. earned ₹200 — friend placed first order', time:'5 hrs ago', read:true },
    { type:'order', icon:'✅', title:'Order Delivered #NP-1847', desc:'COD order marked delivered by Delhivery', time:'1 day ago', read:true },
    { type:'coupon', icon:'🏷️', title:'Coupon Usage Spike', desc:'NAMA15 used 28 times today — highest ever', time:'1 day ago', read:true },
  ]
  const [all, setAll] = useState(notifs)

  return (
    <div>
      <PageHeader title="Notifications" sub={`${all.filter(n=>!n.read).length} unread`}
        action={<button onClick={() => setAll(all.map(n=>({...n,read:true})))} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs" style={{ background:'var(--cream)', border:'1px solid rgba(184,146,42,0.2)', color:'var(--gold)' }}>
          <Check size={12}/> Mark all read
        </button>} />

      <div className="space-y-2">
        {all.map((n,i) => (
          <motion.div key={i} layout
            className="p-4 rounded-2xl flex items-start gap-4 cursor-pointer transition-all"
            style={{ background: n.read ? '#fff' : 'var(--gold-pale)', border: `1px solid ${n.read ? 'rgba(184,146,42,0.08)' : 'rgba(184,146,42,0.25)'}` }}
            onClick={() => setAll(all.map((x,j) => j===i ? {...x,read:true} : x))}>
            <div className="text-2xl flex-shrink-0">{n.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <div className="font-medium text-sm" style={{ color:'var(--ink)' }}>{n.title}</div>
                {!n.read && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:'var(--gold)' }} />}
              </div>
              <div className="text-xs" style={{ color:'var(--text-muted)' }}>{n.desc}</div>
              <div className="text-[10px] mt-1" style={{ color:'var(--text-light)' }}>{n.time}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
