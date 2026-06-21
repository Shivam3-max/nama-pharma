import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Trash2, Tag } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../data/products'
import toast from 'react-hot-toast'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, openCheckout, applyCoupon, removeCoupon, appliedCoupon, getDiscount } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const subtotal = items.reduce((s, i) => s + i.variant.price * i.qty, 0)
  const discount = getDiscount()
  const shipping = subtotal >= 999 ? 0 : 79
  const total = subtotal - discount + shipping

  const handleCoupon = () => {
    const res = applyCoupon(couponCode)
    if (res.success) toast.success(res.message)
    else toast.error(res.message)
    setCouponCode('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200]" style={{ background: 'rgba(30,26,20,0.5)', backdropFilter: 'blur(6px)' }}
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full z-[201] w-full max-w-md flex flex-col"
            style={{ background: '#fff', borderLeft: '1px solid rgba(184,146,42,0.15)', boxShadow: '-20px 0 60px rgba(30,26,20,0.12)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} style={{ color: 'var(--sage)' }} />
                <span className="font-display text-xl" style={{ color: 'var(--ink)' }}>Your Cart</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                  style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}>
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button onClick={closeCart} className="p-2 rounded-full transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--cream)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Free shipping bar */}
            {subtotal < 999 && (
              <div className="mx-5 mt-4 p-3 rounded-xl" style={{ background: 'var(--gold-pale)', border: '1px solid rgba(184,146,42,0.2)' }}>
                <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                  <span>Add {formatPrice(999 - subtotal)} for FREE shipping</span>
                  <span style={{ color: 'var(--gold)' }}>{Math.round((subtotal / 999) * 100)}%</span>
                </div>
                <div className="scarcity-bar">
                  <div className="scarcity-fill" style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }} />
                </div>
              </div>
            )}
            {subtotal >= 999 && (
              <div className="mx-5 mt-4 p-3 rounded-xl text-xs text-center"
                style={{ background: 'var(--sage-pale)', border: '1px solid rgba(74,103,65,0.2)', color: 'var(--sage)' }}>
                ✓ You qualify for FREE shipping!
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: 'rgba(184,146,42,0.2)' }} />
                  <p className="font-display text-xl mb-2" style={{ color: 'var(--ink)' }}>Your cart is empty</p>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Discover our premium Ayurvedic products</p>
                  <button onClick={closeCart} className="btn-outline-gold text-xs py-3 px-6">Browse Products</button>
                </div>
              ) : (
                items.map(item => (
                  <motion.div key={item.key} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 p-4 rounded-xl"
                    style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.1)' }}
                  >
                    <div className="w-20 h-20 rounded-xl flex-shrink-0 img-placeholder text-xs" style={{ minHeight: 'auto' }}>
                      <span style={{ fontSize: 28 }}>{item.product.id === 'goli-bull-night' ? '🐂' : '🌿'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm truncate" style={{ color: 'var(--ink)' }}>{item.product.name}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.variant.label}</p>
                        </div>
                        <button onClick={() => removeItem(item.key)} className="p-1 transition-colors flex-shrink-0"
                          style={{ color: 'rgba(0,0,0,0.2)' }}
                          onMouseEnter={e => e.currentTarget.style.color='#e53e3e'}
                          onMouseLeave={e => e.currentTarget.style.color='rgba(0,0,0,0.2)'}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid rgba(184,146,42,0.25)', background: '#fff' }}>
                          <button onClick={() => updateQty(item.key, item.qty - 1)} className="px-2 py-1.5 text-sm transition-colors" style={{ color: 'var(--gold)' }}>
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-sm font-medium" style={{ color: 'var(--ink)' }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.key, item.qty + 1)} className="px-2 py-1.5 text-sm transition-colors" style={{ color: 'var(--gold)' }}>
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-medium text-sm" style={{ color: 'var(--gold)' }}>
                          {formatPrice(item.variant.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Bottom */}
            {items.length > 0 && (
              <div className="p-5" style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                {/* Coupon */}
                {appliedCoupon ? (
                  <div className="flex items-center justify-between mb-4 p-3 rounded-xl"
                    style={{ background: 'var(--sage-pale)', border: '1px solid rgba(74,103,65,0.25)' }}>
                    <div className="flex items-center gap-2 text-xs">
                      <Tag size={12} style={{ color: 'var(--sage)' }} />
                      <span style={{ color: 'var(--sage)' }}>{appliedCoupon.code} — {appliedCoupon.label}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-xs" style={{ color: '#e53e3e' }}>Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2 mb-4">
                    <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      className="input-light flex-1 text-xs py-3"
                      placeholder="Enter coupon code"
                      onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                    />
                    <button onClick={handleCoupon} className="px-4 text-xs rounded-lg font-medium transition-colors"
                      style={{ background: 'var(--gold-pale)', color: 'var(--gold)', border: '1px solid rgba(184,146,42,0.3)' }}>
                      Apply
                    </button>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between" style={{ color: 'var(--sage)' }}>
                      <span>Discount</span><span>–{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                    <span>Shipping</span>
                    <span style={{ color: shipping === 0 ? 'var(--sage)' : 'var(--text-muted)' }}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="divider-gold my-2" />
                  <div className="flex justify-between font-medium text-base" style={{ color: 'var(--ink)' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--gold)' }}>{formatPrice(total)}</span>
                  </div>
                </div>

                <button onClick={openCheckout} className="btn-gold w-full text-sm py-4">
                  Proceed to Checkout
                </button>
                <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                  🔒 Secure checkout · UPI · COD · Cards
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
