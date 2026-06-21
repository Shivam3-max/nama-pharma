import { useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ShoppingCart, Star, Shield, Truck, RefreshCw, Check, ChevronDown, Plus, Minus, ArrowRight } from 'lucide-react'
import { getProduct, formatPrice } from '../data/products'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('benefits')
  const [activeImg, setActiveImg] = useState(0)
  const { addItem, openCart } = useCartStore()
  const stickyRef = useRef(null)
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef)

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl mb-4">Product not found</h1>
        <Link to="/shop" className="btn-gold py-3 px-8 text-sm">Back to Shop</Link>
      </div>
    </div>
  )

  const variant = product.variants[selectedVariant]

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product, variant)
    toast.success(`${product.name} added to cart!`)
    openCart()
  }

  const tabs = ['benefits', 'ingredients', 'how-to-use', 'reviews']

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Breadcrumb */}
      <div className="container-wide py-4">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Link to="/" className="transition-colors hover:underline">Home</Link>
          <span>/</span>
          <Link to="/shop" className="transition-colors hover:underline">Shop</Link>
          <span>/</span>
          <span style={{ color: 'var(--gold)' }}>{product.name}</span>
        </div>
      </div>

      {/* Main product section */}
      <section className="section-pad pt-4" ref={heroRef}>
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Images */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden img-placeholder"
                style={{ minHeight: 520 }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span style={{ fontSize: 96 }}>{slug === 'goli-bull-night' ? '🐂' : '🌿'}</span>
                  <span className="font-display text-2xl" style={{ color: 'rgba(184,146,42,0.35)' }}>{product.name}</span>
                  <span className="text-sm" style={{ color: 'var(--text-light)' }}>Main Product Image</span>
                </div>

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="badge-gold">{product.badge}</span>
                </div>
                {product.isLowStock && (
                  <div className="absolute top-4 right-4">
                    <span className="badge-gold" style={{ background: 'rgba(255,100,0,0.15)', borderColor: 'rgba(255,100,0,0.4)', color: '#ff8c00' }}>
                      Only {product.stock} Left!
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {[0,1,2,3].map(i => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="rounded-xl img-placeholder transition-all"
                    style={{ minHeight: 80, border: `1px solid ${activeImg === i ? 'var(--gold)' : 'rgba(184,146,42,0.15)'}` }}
                  >
                    <span style={{ fontSize: 24 }}>{slug === 'goli-bull-night' ? '🐂' : '🌿'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="stars text-sm">{'★'.repeat(5)}</span>
                  <span className="text-sm" style={{ color: 'var(--gold)' }}>{product.rating}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({product.reviewCount.toLocaleString()} reviews)</span>
                </div>

                <h1 className="font-display text-5xl md:text-6xl font-light mb-2">{product.name}</h1>
                <p className="font-display text-xl italic mb-4" style={{ color: 'var(--gold)' }}>{product.tagline}</p>
                <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>{product.shortDesc}</p>

                {/* Price */}
                <div className="flex items-end gap-4 mb-6">
                  <span className="font-display text-4xl" style={{ color: 'var(--gold)' }}>{formatPrice(variant.price)}</span>
                  <span className="font-display text-2xl line-through mb-1" style={{ color: 'var(--text-muted)' }}>{formatPrice(variant.mrp)}</span>
                  <span className="mb-1 text-sm font-medium" style={{ color: 'var(--sage)' }}>Save {formatPrice(variant.mrp - variant.price)}</span>
                </div>

                {/* Variants */}
                <div className="mb-6">
                  <div className="text-xs tracking-wider uppercase mb-3" style={{ color: 'var(--text-muted)' }}>Select Supply</div>
                  <div className="space-y-2">
                    {product.variants.map((v, i) => (
                      <button key={v.id} onClick={() => setSelectedVariant(i)}
                        className="w-full flex items-center justify-between p-4 rounded-xl transition-all text-left"
                        style={{
                          background: selectedVariant === i ? 'rgba(184,146,42,0.1)' : 'var(--cream)',
                          border: `1px solid ${selectedVariant === i ? 'rgba(184,146,42,0.5)' : 'rgba(0,0,0,0.07)'}`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{ borderColor: selectedVariant === i ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}
                          >
                            {selectedVariant === i && <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--gold)' }} />}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{v.label}</div>
                            {v.savings && <div className="text-xs" style={{ color: 'var(--sage)' }}>Save {formatPrice(v.savings)}</div>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium" style={{ color: 'var(--gold)' }}>{formatPrice(v.price)}</div>
                          {v.mrp && <div className="text-xs line-through" style={{ color: 'var(--text-muted)' }}>{formatPrice(v.mrp)}</div>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Qty */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-xs tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>Qty:</div>
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid rgba(184,146,42,0.2)' }}>
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-gold-500/10 transition-colors" style={{ color: 'var(--gold)' }}>
                      <Minus size={14} />
                    </button>
                    <span className="px-5 py-3 font-medium text-sm border-x" style={{ borderColor: 'rgba(184,146,42,0.2)' }}>{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="px-4 py-3 hover:bg-gold-500/10 transition-colors" style={{ color: 'var(--gold)' }}>
                      <Plus size={14} />
                    </button>
                  </div>
                  {product.isLowStock && (
                    <span className="text-xs" style={{ color: '#ff8c00' }}>⚡ Only {product.stock} in stock</span>
                  )}
                </div>

                {/* Scarcity */}
                {product.isLowStock && (
                  <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(255,140,0,0.06)', border: '1px solid rgba(255,140,0,0.2)' }}>
                    <div className="flex justify-between text-xs mb-2">
                      <span style={{ color: '#ff8c00' }}>⚡ Selling Fast! {product.stock} units remaining</span>
                      <span style={{ color: '#ff8c00' }}>{100 - product.stock}% Sold</span>
                    </div>
                    <div className="scarcity-bar">
                      <div className="scarcity-fill" style={{ width: `${100 - product.stock}%` }} />
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="flex gap-3 mb-6">
                  <button onClick={handleAddToCart} className="btn-gold flex-1 py-4 text-sm">
                    <ShoppingCart size={16} /> Add to Cart — {formatPrice(variant.price * qty)}
                  </button>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: Shield, label: '100% Ayurvedic' },
                    { icon: Truck, label: 'Free Shipping ₹999+' },
                    { icon: RefreshCw, label: '7 Day Returns' },
                  ].map(({ icon: Icon, label }, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
                      style={{ background: 'rgba(184,146,42,0.04)', border: '1px solid rgba(184,146,42,0.1)' }}>
                      <Icon size={16} style={{ color: 'var(--gold)' }} />
                      <span className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* COD notice */}
                <div className="p-4 rounded-xl flex items-center gap-3"
                  style={{ background: 'var(--sage-pale)', border: '1px solid rgba(74,103,65,0.2)' }}>
                  <Check size={16} style={{ color: 'var(--sage)', flexShrink: 0 }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--sage)' }}>Cash on Delivery available.</span> UPI, Cards &amp; NetBanking accepted. Encrypted checkout.
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="section-pad pt-0">
        <div className="container-wide">
          <div className="flex gap-1 p-1 rounded-xl mb-8 overflow-x-auto" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.1)' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="flex-1 py-3 px-5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all"
                style={{
                  background: activeTab === tab ? 'rgba(184,146,42,0.15)' : 'transparent',
                  color: activeTab === tab ? 'var(--gold)' : 'var(--text-muted)',
                  border: activeTab === tab ? '1px solid rgba(184,146,42,0.3)' : '1px solid transparent',
                }}
              >
                {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>

              {activeTab === 'benefits' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-xl card-light">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--sage-pale)' }}>
                        <Check size={14} style={{ color: 'var(--sage)' }} />
                      </div>
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {product.ingredients.map((ing, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                      className="card-light p-6 rounded-2xl group"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl group-hover:scale-125 transition-transform">{ing.icon}</span>
                        <div>
                          <div className="font-display text-xl mb-1">{ing.name}</div>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{ing.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'how-to-use' && (
                <div className="max-w-xl">
                  <div className="card-light p-8 rounded-2xl">
                    <h3 className="font-display text-2xl mb-4">How To Use</h3>
                    <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>{product.howToUse}</p>
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(184,146,42,0.06)', border: '1px solid rgba(184,146,42,0.15)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        💡 <strong style={{ color: 'var(--gold)' }}>Pro Tip:</strong> For best results, take consistently for at least 4-6 weeks. Combine with a balanced diet and regular exercise.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-6 p-6 card-light rounded-2xl mb-6">
                    <div className="text-center">
                      <div className="font-display text-5xl" style={{ color: 'var(--gold)' }}>{product.rating}</div>
                      <div className="stars">{'★'.repeat(5)}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{product.reviewCount.toLocaleString()} reviews</div>
                    </div>
                    <div className="flex-1">
                      {[5,4,3,2,1].map(star => {
                        const pct = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 3 : 1
                        return (
                          <div key={star} className="flex items-center gap-2 mb-1">
                            <span className="text-xs w-4" style={{ color: 'var(--text-muted)' }}>{star}</span>
                            <span className="stars text-xs">★</span>
                            <div className="flex-1 scarcity-bar"><div className="scarcity-fill" style={{ width: `${pct}%` }} /></div>
                            <span className="text-xs w-8 text-right" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {product.reviews.map(review => (
                    <div key={review.id} className="card-light p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-display"
                            style={{ background: 'rgba(184,146,42,0.1)', color: 'var(--gold)' }}>
                            {review.name[0]}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{review.name}</div>
                            {review.verified && <div className="text-[10px]" style={{ color: 'var(--sage)' }}>✓ Verified Purchase</div>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="stars text-xs">{'★'.repeat(review.rating)}</div>
                          <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{review.date}</div>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-muted)' }}>"{review.text}"</p>
                      <div className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>👍 {review.helpful} people found this helpful</div>
                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Sticky Buy Button */}
      <AnimatePresence>
        {!heroInView && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[90] p-4 sticky-buy-shadow"
            style={{ background: 'rgba(253,250,246,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(184,146,42,0.15)' }}
          >
            <div className="container-wide flex items-center justify-between gap-4">
              <div>
                <div className="font-display text-xl">{product.name}</div>
                <div className="text-sm" style={{ color: 'var(--gold)' }}>{formatPrice(variant.price)}</div>
              </div>
              <button onClick={handleAddToCart} className="btn-gold py-3 px-8 text-sm">
                Buy Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
