import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ChevronRight, Check, Truck, CreditCard, Smartphone,
  Shield, Loader, AlertCircle, RefreshCw, QrCode, Banknote
} from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../data/products'
import toast from 'react-hot-toast'

const steps = ['Address', 'Payment', 'Confirm']

/* ── Razorpay loader ── */
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/* ── Payment method card ── */
function PaymentOption({ id, icon: Icon, title, subtitle, badge, selected, onSelect, children }) {
  return (
    <div>
      <label className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all"
        style={{
          background: selected ? 'var(--gold-pale)' : 'var(--cream)',
          border: `1.5px solid ${selected ? 'rgba(184,146,42,0.5)' : 'rgba(0,0,0,0.07)'}`,
        }}
        onClick={() => onSelect(id)}>
        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
          style={{ borderColor: selected ? 'var(--gold)' : 'rgba(0,0,0,0.2)' }}>
          {selected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--gold)' }} />}
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: selected ? 'rgba(184,146,42,0.15)' : 'rgba(0,0,0,0.05)' }}>
          <Icon size={18} style={{ color: selected ? 'var(--gold)' : 'var(--text-muted)' }} />
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm" style={{ color: 'var(--ink)' }}>{title}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</div>
        </div>
        {badge && <span className="text-[10px] px-2.5 py-1 rounded-full font-medium flex-shrink-0"
          style={{ background: 'var(--sage-pale)', color: 'var(--sage)', border: '1px solid rgba(74,103,65,0.2)' }}>{badge}</span>}
      </label>
      <AnimatePresence>
        {selected && children && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden">
            <div className="px-4 pt-3 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CheckoutModal() {
  const { checkoutOpen, closeCheckout, items, clearCart, getDiscount, appliedCoupon } = useCartStore()
  const [step, setStep]                   = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [upiId, setUpiId]                 = useState('')
  const [ordered, setOrdered]             = useState(false)
  const [paying, setPaying]               = useState(false)
  const [payError, setPayError]           = useState('')
  const [orderId]                         = useState(`NP${Math.floor(10000 + Math.random() * 90000)}`)
  const [razorpayOrderId]                 = useState(`order_${Math.random().toString(36).slice(2, 18)}`)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', city: '', state: '', pincode: ''
  })

  const subtotal = items.reduce((s, i) => s + i.variant.price * i.qty, 0)
  const discount = getDiscount()
  const shipping = subtotal >= 999 ? 0 : 79
  const total    = subtotal - discount + shipping

  const isAddressValid = form.name && form.phone && form.address && form.city && form.pincode

  /* ── Razorpay payment flow ── */
  const initiateRazorpay = async () => {
    setPaying(true)
    setPayError('')

    const loaded = await loadRazorpay()
    if (!loaded) {
      setPayError('Failed to load payment gateway. Check your internet connection.')
      setPaying(false)
      return
    }

    const options = {
      key: 'rzp_test_REPLACE_WITH_YOUR_KEY',   // ← replace with real Razorpay key
      amount: total * 100,                       // in paise
      currency: 'INR',
      name: 'Nama Pharma',
      description: items.map(i => i.product.name).join(', '),
      order_id: razorpayOrderId,
      image: '',
      prefill: {
        name:    form.name,
        email:   form.email,
        contact: form.phone,
      },
      notes: { orderId, address: `${form.address}, ${form.city} - ${form.pincode}` },
      theme: { color: '#B8922A' },
      method: paymentMethod === 'upi'  ? { upi: true,  card: false, netbanking: false, wallet: false }
            : paymentMethod === 'card' ? { upi: false, card: true,  netbanking: false, wallet: false }
            : paymentMethod === 'nb'   ? { upi: false, card: false, netbanking: true,  wallet: false }
            : paymentMethod === 'wallet' ? { upi: false, card: false, netbanking: false, wallet: true }
            : {},
      handler: function(response) {
        // Payment successful — response contains razorpay_payment_id, signature
        setPaying(false)
        setOrdered(true)
        toast.success('Payment successful! 🎉')
        setTimeout(() => { clearCart(); closeCheckout(); setOrdered(false); setStep(0) }, 4000)
      },
      modal: {
        ondismiss: () => {
          setPaying(false)
          toast.error('Payment cancelled')
        }
      }
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function(resp) {
        setPaying(false)
        setPayError(`Payment failed: ${resp.error.description}`)
        toast.error('Payment failed. Please try again.')
      })
      rzp.open()
    } catch (err) {
      setPaying(false)
      setPayError('Unable to open payment gateway. Please try again.')
    }
  }

  /* ── COD placement ── */
  const placeCOD = () => {
    setPaying(true)
    setTimeout(() => {
      setPaying(false)
      setOrdered(true)
      toast.success('Order placed! 🎉')
      setTimeout(() => { clearCart(); closeCheckout(); setOrdered(false); setStep(0) }, 4000)
    }, 1200)
  }

  const handleConfirm = () => {
    if (paymentMethod === 'cod') placeCOD()
    else initiateRazorpay()
  }

  if (!checkoutOpen) return null

  return (
    <AnimatePresence>
      <div className="checkout-overlay" onClick={e => e.target === e.currentTarget && closeCheckout()}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ background: '#fff', boxShadow: '0 40px 100px rgba(30,26,20,0.2)' }}>

          {/* ── Success State ── */}
          {ordered ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{ background: 'var(--sage-pale)', border: '2px solid rgba(74,103,65,0.3)' }}>
                <Check size={40} style={{ color: 'var(--sage)' }} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="font-display text-4xl mb-2" style={{ color: 'var(--ink)' }}>
                  {paymentMethod === 'cod' ? 'Order Confirmed!' : 'Payment Successful!'}
                </h2>
                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                  Order ID: <span className="font-mono font-bold" style={{ color: 'var(--gold)' }}>#{orderId}</span>
                </p>
                <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                  {paymentMethod === 'cod'
                    ? 'Your order is confirmed. Pay ₹' + total.toLocaleString() + ' on delivery.'
                    : `₹${total.toLocaleString()} paid successfully via ${paymentMethod.toUpperCase()}.`}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Confirmation SMS sent to {form.phone || 'your number'}.
                </p>
                <div className="mt-6 p-4 rounded-2xl text-xs" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.15)' }}>
                  🚚 Expected delivery in <strong>3–5 business days</strong> to {form.city || 'your location'}
                </div>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Gold top stripe */}
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, var(--gold), var(--gold-bright), var(--gold))' }} />

              {/* Header */}
              <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                <div>
                  <h2 className="font-display text-2xl" style={{ color: 'var(--ink)' }}>Secure Checkout</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Shield size={10} style={{ color: 'var(--sage)' }} />
                    <span className="text-[10px]" style={{ color: 'var(--sage)' }}>256-bit SSL encrypted · Powered by Razorpay</span>
                  </div>
                </div>
                <button onClick={closeCheckout} className="p-2 rounded-full"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <X size={18} />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-4 px-6 py-3"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'var(--cream)' }}>
                {steps.map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all"
                        style={{ background: i <= step ? 'var(--gold)' : 'rgba(0,0,0,0.08)', color: i <= step ? '#fff' : 'var(--text-muted)' }}>
                        {i < step ? <Check size={12} /> : i + 1}
                      </div>
                      <span className="text-xs font-medium hidden sm:block" style={{ color: i <= step ? 'var(--gold)' : 'var(--text-muted)' }}>{s}</span>
                    </div>
                    {i < steps.length - 1 && <ChevronRight size={13} style={{ color: 'rgba(184,146,42,0.3)' }} />}
                  </div>
                ))}
              </div>

              <div className="p-6">

                {/* ══ STEP 0 — ADDRESS ══ */}
                {step === 0 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-xl mb-4" style={{ color: 'var(--ink)' }}>Delivery Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs block mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
                        <input className="input-light" placeholder="Rajesh Kumar" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs block mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>Phone *</label>
                        <input className="input-light" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs block mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>Email</label>
                      <input className="input-light" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs block mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>Address *</label>
                      <textarea className="input-light resize-none" rows={3} placeholder="Flat/House No., Street, Area, Landmark" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs block mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>City *</label>
                        <input className="input-light" placeholder="Mumbai" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs block mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>State</label>
                        <input className="input-light" placeholder="Maharashtra" value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs block mb-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>Pincode *</label>
                        <input className="input-light" placeholder="400001" maxLength={6} value={form.pincode} onChange={e => setForm({...form, pincode: e.target.value.replace(/\D/,'')})} />
                      </div>
                    </div>
                    <button
                      onClick={() => { if (isAddressValid) setStep(1); else toast.error('Please fill required fields') }}
                      className="btn-gold w-full mt-2 py-4 text-sm"
                      style={{ opacity: isAddressValid ? 1 : 0.6 }}>
                      Continue to Payment →
                    </button>
                  </div>
                )}

                {/* ══ STEP 1 — PAYMENT ══ */}
                {step === 1 && (
                  <div className="space-y-3">
                    <h3 className="font-display text-xl mb-4" style={{ color: 'var(--ink)' }}>Payment Method</h3>

                    <PaymentOption id="upi" icon={Smartphone} title="UPI" subtitle="GPay, PhonePe, Paytm, BHIM UPI — instant transfer" badge="Recommended" selected={paymentMethod==='upi'} onSelect={setPaymentMethod}>
                      <div>
                        <label className="text-xs block mb-1.5" style={{ color: 'var(--text-muted)' }}>UPI ID (optional — or enter in Razorpay popup)</label>
                        <input className="input-light text-sm font-mono" placeholder="yourname@okicici" value={upiId} onChange={e => setUpiId(e.target.value)} />
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                            <div key={app} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.2)', color: 'var(--ink)' }}>{app}</div>
                          ))}
                        </div>
                      </div>
                    </PaymentOption>

                    <PaymentOption id="card" icon={CreditCard} title="Credit / Debit Card" subtitle="Visa, Mastercard, RuPay, Amex" selected={paymentMethod==='card'} onSelect={setPaymentMethod}>
                      <div className="space-y-2">
                        <input className="input-light text-sm" placeholder="Card Number" />
                        <div className="grid grid-cols-2 gap-2">
                          <input className="input-light text-sm" placeholder="MM / YY" />
                          <input className="input-light text-sm" placeholder="CVV" />
                        </div>
                        <input className="input-light text-sm" placeholder="Name on Card" />
                        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          <Shield size={10} style={{ color: 'var(--sage)' }} /> 3D Secure authenticated · saved securely by Razorpay
                        </div>
                      </div>
                    </PaymentOption>

                    <PaymentOption id="nb" icon={Banknote} title="Net Banking" subtitle="All major Indian banks supported" selected={paymentMethod==='nb'} onSelect={setPaymentMethod}>
                      <div className="flex flex-wrap gap-2">
                        {['SBI','HDFC','ICICI','Axis','Kotak','Yes Bank'].map(b => (
                          <div key={b} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.2)', color: 'var(--ink)' }}>{b}</div>
                        ))}
                      </div>
                    </PaymentOption>

                    <PaymentOption id="cod" icon={Truck} title="Cash on Delivery" subtitle="Pay when your order arrives at your door" selected={paymentMethod==='cod'} onSelect={setPaymentMethod} />

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 py-3 mt-1">
                      {['Visa', 'Mastercard', 'RuPay', 'UPI', 'Razorpay'].map(b => (
                        <span key={b} className="text-[10px] font-semibold px-2 py-1 rounded" style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--text-muted)' }}>{b}</span>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-2">
                      <button onClick={() => setStep(0)} className="btn-outline-gold flex-1 py-4 text-sm">← Back</button>
                      <button onClick={() => setStep(2)} className="btn-gold flex-1 py-4 text-sm">Review Order →</button>
                    </div>
                  </div>
                )}

                {/* ══ STEP 2 — CONFIRM ══ */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-xl mb-4" style={{ color: 'var(--ink)' }}>Confirm Order</h3>

                    {/* Items */}
                    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(184,146,42,0.12)' }}>
                      <div className="px-4 py-3" style={{ background: 'var(--cream)', borderBottom: '1px solid rgba(184,146,42,0.08)' }}>
                        <div className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--gold)' }}>Your Items</div>
                      </div>
                      <div className="divide-y" style={{ divideColor: 'rgba(0,0,0,0.05)' }}>
                        {items.map(item => (
                          <div key={item.key} className="flex justify-between items-center px-4 py-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{item.product.id === 1 ? '🐂' : '🌿'}</span>
                              <div>
                                <span className="font-medium" style={{ color: 'var(--ink)' }}>{item.product.name}</span>
                                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.variant.label} × {item.qty}</div>
                              </div>
                            </div>
                            <span style={{ color: 'var(--gold)' }}>{formatPrice(item.variant.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order bump */}
                    <div className="p-4 rounded-2xl" style={{ background: 'var(--gold-pale)', border: '1.5px solid rgba(184,146,42,0.3)' }}>
                      <div className="text-[10px] font-bold tracking-wider uppercase mb-1.5" style={{ color: 'var(--gold)' }}>⚡ One-Time Add-On Offer</div>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium text-sm" style={{ color: 'var(--ink)' }}>Add Majoon Moosli — Save 20%</div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>₹799 instead of ₹999 · Only available now</div>
                        </div>
                        <button className="btn-outline-gold text-xs py-2 px-4 whitespace-nowrap">Add ₹799</button>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                        <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between" style={{ color: 'var(--sage)' }}>
                          <span>Coupon ({appliedCoupon?.code})</span><span>–{formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                        <span>Shipping</span>
                        <span style={{ color: shipping === 0 ? 'var(--sage)' : 'var(--ink)' }}>
                          {shipping === 0 ? '✓ FREE' : formatPrice(shipping)}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-base pt-2.5" style={{ borderTop: '1px solid rgba(0,0,0,0.08)', color: 'var(--ink)' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--gold)' }}>{formatPrice(total)}</span>
                      </div>
                    </div>

                    {/* Delivery + payment summary */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.1)' }}>
                        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Deliver to</div>
                        <div className="text-xs font-medium" style={{ color: 'var(--ink)' }}>{form.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{form.city}{form.pincode ? ` — ${form.pincode}` : ''}</div>
                      </div>
                      <div className="p-3 rounded-xl" style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.1)' }}>
                        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Payment</div>
                        <div className="text-xs font-medium" style={{ color: 'var(--ink)' }}>
                          {paymentMethod === 'cod' ? '💵 Cash on Delivery'
                          : paymentMethod === 'upi' ? '📱 UPI'
                          : paymentMethod === 'card' ? '💳 Card'
                          : '🏦 Net Banking'}
                        </div>
                        {paymentMethod !== 'cod' && <div className="text-[10px]" style={{ color: 'var(--sage)' }}>Secured by Razorpay</div>}
                      </div>
                    </div>

                    {/* Error */}
                    {payError && (
                      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(220,53,69,0.07)', border: '1px solid rgba(220,53,69,0.2)' }}>
                        <AlertCircle size={14} style={{ color: '#dc3545', flexShrink: 0 }} />
                        <span className="text-xs" style={{ color: '#dc3545' }}>{payError}</span>
                      </div>
                    )}

                    <div className="flex gap-3 mt-2">
                      <button onClick={() => setStep(1)} className="btn-outline-gold px-6 py-4 text-sm">← Back</button>
                      <button onClick={handleConfirm} disabled={paying}
                        className="btn-gold flex-1 py-4 text-sm flex items-center justify-center gap-2">
                        {paying
                          ? <><Loader size={14} className="animate-spin" /> Processing…</>
                          : paymentMethod === 'cod'
                            ? `✓ Place Order — ${formatPrice(total)}`
                            : `🔒 Pay ${formatPrice(total)}`}
                      </button>
                    </div>

                    {paymentMethod !== 'cod' && (
                      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <Shield size={11} style={{ color: 'var(--sage)' }} />
                        <span>Payments processed securely by <strong>Razorpay</strong>. We never store your card details.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
