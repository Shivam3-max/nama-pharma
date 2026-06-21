import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Star, Search, SlidersHorizontal, X, Heart, Eye,
  ShoppingBag, Check, Zap, Gift, ChevronDown, ArrowUpDown,
  Scale, Plus, Minus
} from 'lucide-react'
import { products, formatPrice } from '../data/products'
import { useCartStore } from '../store/cartStore'

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

const BENEFIT_FILTERS = ['Strength', 'Stamina', 'Recovery', 'Libido', 'Sleep', 'Stress']

export default function Shop() {
  const { addItem } = useCartStore()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popular')
  const [selectedBenefits, setSelectedBenefits] = useState([])
  const [quickView, setQuickView] = useState(null)
  const [selectedVariants, setSelectedVariants] = useState({})
  const [wishlist, setWishlist] = useState([])
  const [compare, setCompare] = useState([])
  const [addedToCart, setAddedToCart] = useState({})
  const [qty, setQty] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [showCompare, setShowCompare] = useState(false)

  /* helpers */
  const getVariant = (product) => selectedVariants[product.id] || product.variants[0]
  const getQty = (id) => qty[id] || 1

  const toggleWishlist = (id) => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])
  const toggleCompare = (id) => {
    if (compare.includes(id)) { setCompare(c => c.filter(x => x !== id)); return }
    if (compare.length >= 2) { setCompare([compare[1], id]); return }
    setCompare(c => [...c, id])
  }

  const handleAddToCart = (product, variant) => {
    const v = variant || getVariant(product)
    const q = getQty(product.id)
    for (let i = 0; i < q; i++) addItem(product, v)
    setAddedToCart(a => ({ ...a, [product.id]: true }))
    setTimeout(() => setAddedToCart(a => ({ ...a, [product.id]: false })), 1800)
  }

  const handleBuyNow = (product) => {
    handleAddToCart(product)
    setTimeout(() => useCartStore.getState().openCheckout(), 100)
  }

  /* filter + sort */
  const filtered = useMemo(() => {
    let arr = [...products]
    if (search) arr = arr.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.shortDesc?.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'price_asc') arr.sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') arr.sort((a, b) => b.price - a.price)
    if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating)
    return arr
  }, [search, sort])

  const compareProducts = compare.map(id => products.find(p => p.id === id)).filter(Boolean)

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <section className="section-pad pb-10" style={{ background: 'linear-gradient(160deg, var(--sage-pale) 0%, var(--cream) 60%)' }}>
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-8">
            <span className="section-label">Our Products</span>
            <h1 className="font-display font-light mt-4 mb-3" style={{ fontSize: 'clamp(36px,5vw,64px)', color: 'var(--ink)' }}>
              Shop Men's <em className="gold-text-static not-italic">Wellness</em>
            </h1>
            <p className="text-sm max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
              Premium Ayurvedic formulations — crafted for strength, stamina, and lasting vitality.
            </p>
          </motion.div>

          {/* Search + sort bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                className="input-light pl-9 pr-4 py-3 w-full text-sm"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  className="appearance-none input-light pr-8 pl-4 py-3 text-sm cursor-pointer"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all"
                style={showFilters
                  ? { background: 'var(--gold)', color: '#fff' }
                  : { background: '#fff', border: '1px solid rgba(184,146,42,0.2)', color: 'var(--text-muted)' }}>
                <SlidersHorizontal size={14} />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4 max-w-2xl mx-auto">
                <div className="p-4 rounded-2xl" style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.15)' }}>
                  <div className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Filter by Benefit</div>
                  <div className="flex flex-wrap gap-2">
                    {BENEFIT_FILTERS.map(b => (
                      <button key={b} onClick={() => setSelectedBenefits(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])}
                        className="px-3 py-1.5 rounded-xl text-xs transition-all"
                        style={selectedBenefits.includes(b)
                          ? { background: 'var(--gold)', color: '#fff' }
                          : { background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.15)', color: 'var(--text-muted)' }}>
                        {b}
                      </button>
                    ))}
                    {selectedBenefits.length > 0 && (
                      <button onClick={() => setSelectedBenefits([])} className="px-3 py-1.5 rounded-xl text-xs flex items-center gap-1" style={{ color: '#dc3545', background: 'rgba(220,53,69,0.06)' }}>
                        <X size={10} /> Clear
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Compare bar */}
      <AnimatePresence>
        {compare.length > 0 && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 shadow-2xl"
            style={{ borderRadius: 20, background: 'var(--ink)', padding: '12px 20px', color: '#fff', display: 'flex', alignItems: 'center', gap: 16, minWidth: 280 }}>
            <Scale size={16} style={{ color: 'var(--gold)' }} />
            <span className="text-sm">{compare.length} product{compare.length > 1 ? 's' : ''} selected</span>
            {compare.length === 2 && (
              <button onClick={() => setShowCompare(true)} className="px-4 py-1.5 rounded-xl text-xs font-medium" style={{ background: 'var(--gold)', color: '#fff' }}>Compare</button>
            )}
            <button onClick={() => setCompare([])} style={{ color: 'rgba(255,255,255,0.5)' }}><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products */}
      <section className="section-pad pt-8 pb-12">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {filtered.map((product, i) => {
              const variant = getVariant(product)
              const inWishlist = wishlist.includes(product.id)
              const inCompare = compare.includes(product.id)
              const isAdded = addedToCart[product.id]

              return (
                <motion.div key={product.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="card-light overflow-hidden group">
                  {/* Image area */}
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
                      <span className="badge-gold">{product.badge}</span>
                      <span className="badge-sage">-{product.discount}% OFF</span>
                    </div>

                    {/* Wishlist + compare */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                      <button onClick={() => toggleWishlist(product.id)}
                        className="w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all"
                        style={{ background: inWishlist ? 'rgba(220,53,69,0.12)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}>
                        <Heart size={14} fill={inWishlist ? '#dc3545' : 'none'} style={{ color: inWishlist ? '#dc3545' : 'var(--text-muted)' }} />
                      </button>
                      <button onClick={() => toggleCompare(product.id)}
                        className="w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all"
                        title="Add to compare"
                        style={{ background: inCompare ? 'rgba(184,146,42,0.15)' : 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}>
                        <Scale size={14} style={{ color: inCompare ? 'var(--gold)' : 'var(--text-muted)' }} />
                      </button>
                      <button onClick={() => setQuickView(product)}
                        className="w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all"
                        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}>
                        <Eye size={14} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>

                    <div className="img-placeholder group-hover:scale-[1.02] transition-transform duration-700" style={{ minHeight: 280 }}>
                      <div className="flex flex-col items-center gap-2">
                        <span style={{ fontSize: 72 }}>{i === 0 ? '🐂' : '🌿'}</span>
                        <span className="font-display text-xl" style={{ color: 'rgba(184,146,42,0.3)' }}>{product.name}</span>
                      </div>
                    </div>

                    {product.isLowStock && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', border: '1px solid rgba(184,146,42,0.2)' }}>
                          <div className="flex justify-between text-xs mb-1.5" style={{ color: '#B85A00' }}>
                            <span>⚡ Only {product.stock} left!</span>
                            <span>{100 - product.stock}% Sold</span>
                          </div>
                          <div className="scarcity-bar"><div className="scarcity-fill" style={{ width: `${100 - product.stock}%` }} /></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="font-display text-2xl sm:text-3xl" style={{ color: 'var(--ink)' }}>{product.name}</h2>
                        <p className="text-sm italic mt-1" style={{ color: 'var(--gold)' }}>{product.tagline}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <div className="font-display text-xl sm:text-2xl" style={{ color: 'var(--gold)' }}>{formatPrice(variant.price)}</div>
                        <div className="text-xs line-through" style={{ color: 'var(--text-light)' }}>{formatPrice(product.mrp)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={12} fill={j < Math.floor(product.rating) ? '#C9A84C' : 'none'} style={{ color: '#C9A84C' }} />
                        ))}
                      </div>
                      <span className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>{product.rating}</span>
                      <span className="text-xs" style={{ color: 'var(--text-light)' }}>({product.reviewCount.toLocaleString()} reviews)</span>
                    </div>

                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{product.shortDesc}</p>

                    {/* Benefits */}
                    <div className="grid grid-cols-2 gap-1.5 mb-5">
                      {product.benefits.slice(0, 4).map(b => (
                        <div key={b} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <Check size={10} style={{ color: 'var(--sage)', flexShrink: 0 }} /> {b}
                        </div>
                      ))}
                    </div>

                    {/* Variant selector */}
                    <div className="mb-5">
                      <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Select Pack:</div>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map(v => {
                          const isSelected = (selectedVariants[product.id]?.id || product.variants[0].id) === v.id
                          return (
                            <button key={v.id}
                              onClick={() => setSelectedVariants(sv => ({ ...sv, [product.id]: v }))}
                              className="px-3 py-2 rounded-xl text-xs transition-all"
                              style={isSelected
                                ? { background: 'var(--gold)', color: '#fff', border: '1px solid transparent' }
                                : { background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.2)', color: 'var(--ink-soft)' }}>
                              <div className="font-medium">{v.label}</div>
                              <div className="text-[10px] mt-0.5 opacity-80">{formatPrice(v.price)}</div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Qty + CTA */}
                    <div className="flex items-center gap-3 mb-3">
                      {/* Qty stepper */}
                      <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid rgba(184,146,42,0.2)' }}>
                        <button onClick={() => setQty(q => ({ ...q, [product.id]: Math.max(1, (q[product.id] || 1) - 1) }))}
                          className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-cream"
                          style={{ color: 'var(--text-muted)' }}>
                          <Minus size={12} />
                        </button>
                        <span className="w-9 text-center text-sm font-medium" style={{ color: 'var(--ink)' }}>{getQty(product.id)}</span>
                        <button onClick={() => setQty(q => ({ ...q, [product.id]: (q[product.id] || 1) + 1 }))}
                          className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-cream"
                          style={{ color: 'var(--text-muted)' }}>
                          <Plus size={12} />
                        </button>
                      </div>

                      <button onClick={() => handleAddToCart(product)}
                        className="flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                        style={isAdded
                          ? { background: 'var(--sage)', color: '#fff' }
                          : { background: 'var(--gold)', color: '#fff' }}>
                        {isAdded ? <><Check size={14} /> Added!</> : <><ShoppingBag size={14} /> Add to Cart</>}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => handleBuyNow(product)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-medium transition-all"
                        style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
                        ⚡ Buy Now
                      </button>
                      <Link to={`/product/${product.slug}`}
                        className="flex-1 py-2.5 rounded-xl text-xs font-medium text-center transition-all"
                        style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.2)', color: 'var(--ink-soft)' }}>
                        View Details →
                      </Link>
                    </div>

                    {/* Trust signals */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                      {['🔒 Secure', '🚚 Free Ship ₹999+', '↩ 7-Day Return'].map(t => (
                        <span key={t} className="text-[10px]" style={{ color: 'var(--text-light)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-display text-2xl mb-2" style={{ color: 'var(--ink)' }}>No products found</h3>
              <button onClick={() => { setSearch(''); setSelectedBenefits([]) }} className="btn-gold py-2 px-6 text-sm mt-4">Clear Filters</button>
            </div>
          )}

          {/* Combo stack */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl overflow-hidden mb-10"
            style={{ background: 'linear-gradient(135deg, var(--ink) 0%, #2a2420 100%)' }}>
            <div className="p-8 sm:p-12 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'rgba(184,146,42,0.2)', color: 'var(--gold)' }}>🏆 Best Value</span>
                <h2 className="font-display font-light text-3xl sm:text-4xl mb-3" style={{ color: 'var(--cream)' }}>The Complete Wellness Stack</h2>
                <p className="text-sm mb-6" style={{ color: 'rgba(245,240,232,0.6)' }}>
                  Goli Bull Night + Majoon Moosli — the ultimate synergistic combo for strength, stamina, and recovery.
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div>
                    <div className="text-3xl font-display" style={{ color: 'var(--gold)' }}>{formatPrice(products[0].price + products[1].price - 500)}</div>
                    <div className="text-xs line-through" style={{ color: 'rgba(245,240,232,0.4)' }}>{formatPrice(products[0].price + products[1].price)}</div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(74,103,65,0.3)', color: '#86efac' }}>Save ₹500</span>
                </div>
                <button
                  onClick={() => { handleAddToCart(products[0]); handleAddToCart(products[1]) }}
                  className="py-3.5 px-8 rounded-xl text-sm font-medium inline-flex items-center gap-2 transition-all hover:opacity-90"
                  style={{ background: 'var(--gold)', color: '#fff' }}>
                  <Gift size={15} /> Get the Stack <ArrowRight size={14} />
                </button>
              </div>
              <div className="flex justify-center gap-4">
                {products.slice(0, 2).map((p, i) => (
                  <div key={p.id} className="text-center">
                    <div className="w-28 h-28 rounded-2xl flex items-center justify-center mb-2" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(184,146,42,0.2)' }}>
                      <span style={{ fontSize: 52 }}>{i === 0 ? '🐂' : '🌿'}</span>
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Why choose us strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '🌿', title: '100% Ayurvedic', desc: 'AYUSH approved herbs' },
              { icon: '🔬', title: 'Lab Tested', desc: 'Third-party verified' },
              { icon: '🚚', title: 'Fast Delivery', desc: '2-5 days Pan India' },
              { icon: '↩', title: 'Easy Returns', desc: '7-day no questions' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl text-center card-light">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-medium text-sm mb-1" style={{ color: 'var(--ink)' }}>{item.title}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickView && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: 'rgba(30,26,20,0.6)', backdropFilter: 'blur(12px)' }}
            onClick={() => setQuickView(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl overflow-hidden"
              style={{ background: '#fff', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 40px 100px rgba(30,26,20,0.25)' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <h2 className="font-display text-xl">{quickView.name}</h2>
                <button onClick={() => setQuickView(null)}><X size={16} style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="img-placeholder min-h-52" style={{ background: 'linear-gradient(135deg, var(--sage-pale) 0%, var(--gold-pale) 100%)' }}>
                <span style={{ fontSize: 72 }}>🐂</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">{[...Array(5)].map((_, j) => <Star key={j} size={12} fill={j < Math.floor(quickView.rating) ? '#C9A84C' : 'none'} style={{ color: '#C9A84C' }} />)}</div>
                  <span className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>{quickView.rating}</span>
                  <span className="text-xs" style={{ color: 'var(--text-light)' }}>({quickView.reviewCount.toLocaleString()})</span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{quickView.shortDesc}</p>
                <div className="space-y-1.5 mb-5">
                  {quickView.benefits?.map(b => (
                    <div key={b} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <Check size={10} style={{ color: 'var(--sage)' }} /> {b}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="font-display text-2xl" style={{ color: 'var(--gold)' }}>{formatPrice(quickView.price)}</div>
                    <div className="text-xs line-through" style={{ color: 'var(--text-light)' }}>{formatPrice(quickView.mrp)}</div>
                  </div>
                  <span className="badge-gold">-{quickView.discount}% OFF</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { handleAddToCart(quickView); setQuickView(null) }} className="btn-gold flex-1 py-3 text-sm flex items-center justify-center gap-2">
                    <ShoppingBag size={14} /> Add to Cart
                  </button>
                  <Link to={`/product/${quickView.slug}`} onClick={() => setQuickView(null)} className="btn-outline-gold px-5 py-3 text-sm">Details</Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <AnimatePresence>
        {showCompare && compareProducts.length === 2 && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: 'rgba(30,26,20,0.6)', backdropFilter: 'blur(12px)' }}
            onClick={() => setShowCompare(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl overflow-hidden"
              style={{ background: '#fff', maxHeight: '90vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <h2 className="font-display text-xl">Compare Products</h2>
                <button onClick={() => setShowCompare(false)}><X size={16} style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-xs font-semibold uppercase tracking-wider pt-8" style={{ color: 'var(--text-muted)' }}>
                    <div className="mb-5">Name</div>
                    <div className="mb-5">Price</div>
                    <div className="mb-5">Rating</div>
                    <div className="mb-5">Benefits</div>
                    <div className="mb-5">Discount</div>
                  </div>
                  {compareProducts.map((p, i) => (
                    <div key={p.id} className="p-4 rounded-2xl" style={{ background: i === 0 ? 'var(--gold-pale)' : 'var(--sage-pale)', border: `1px solid ${i === 0 ? 'rgba(184,146,42,0.2)' : 'rgba(74,103,65,0.2)'}` }}>
                      <div className="text-3xl text-center mb-3">{i === 0 ? '🐂' : '🌿'}</div>
                      <div className="font-display text-sm mb-4 text-center">{p.name}</div>
                      <div className="text-lg font-display mb-4 text-center" style={{ color: 'var(--gold)' }}>{formatPrice(p.price)}</div>
                      <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, j) => <Star key={j} size={11} fill={j < Math.floor(p.rating) ? '#C9A84C' : 'none'} style={{ color: '#C9A84C' }} />)}
                      </div>
                      <div className="space-y-1 mb-4">
                        {p.benefits?.slice(0, 4).map(b => <div key={b} className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Check size={8} style={{ color: 'var(--sage)' }} />{b}</div>)}
                      </div>
                      <div className="text-center"><span className="badge-gold">{p.discount}% OFF</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
