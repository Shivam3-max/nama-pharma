import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowRight, Shield, Leaf, Award, Star, ChevronRight, Check, Zap, RefreshCw, Lock, Gift } from 'lucide-react'
import AyurvedicHero from '../components/AyurvedicHero'
import WellnessQuiz from '../components/WellnessQuiz'
import ReferralModal from '../components/ReferralModal'
import ChallengeModal from '../components/ChallengeModal'
import { products, formatPrice } from '../data/products'
import { useCartStore } from '../store/cartStore'
import CountUp from 'react-countup'
import { useInView as useIO } from 'react-intersection-observer'

/* ── Fade-up section wrapper ── */
function FadeSection({ children, className = '' }) {
  const ref = useRef(null)
  const inV = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }}
      animate={inV ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  )
}

/* ── FAQ item ── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card-light overflow-hidden" style={{ borderRadius: 12 }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left gap-4">
        <span className="font-medium text-sm" style={{ color: 'var(--ink)' }}>{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-2xl flex-shrink-0 leading-none"
          style={{ color: 'var(--gold)' }}>+</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
            <div className="px-6 pb-6 pt-1 text-sm leading-relaxed"
              style={{ color: 'var(--text-muted)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Static data ── */
const herbs = [
  { name: 'Ashwagandha', desc: 'Adaptogen root for energy, vitality and stress resilience.', icon: '🌿', origin: 'India' },
  { name: 'Safed Musli',  desc: 'Prized white herb for strength and active lifestyle support.',  icon: '🌾', origin: 'Rajasthan' },
  { name: 'Shatavari',   desc: 'Cooling herb that supports overall wellness and balance.',       icon: '🍃', origin: 'Himalayan' },
  { name: 'Gokhru',      desc: 'Time-tested herb valued for men\'s vitality and kidney health.', icon: '🌱', origin: 'India' },
  { name: 'Shilajit',    desc: 'Ancient mineral resin with 85+ trace minerals.',                icon: '🪨', origin: 'Himalayas' },
  { name: 'Kaunch Beej', desc: 'Classical Ayurvedic seed for male reproductive wellness.',      icon: '🫘', origin: 'India' },
]

const testimonials = [
  { name: 'Rajesh K.', city: 'Mumbai',    rating: 5, text: 'I feel more energetic throughout the day. My performance at work has improved significantly. Goli Bull Night is now part of my daily routine.',  product: 'Goli Bull Night', verified: true },
  { name: 'Amit S.',   city: 'Delhi',     rating: 5, text: 'Premium quality and fast delivery. After 3 weeks the difference is very noticeable. Highly recommend to anyone looking for natural support.',    product: 'Majoon Moosli',  verified: true },
  { name: 'Vikas M.',  city: 'Bangalore', rating: 5, text: 'Worth every rupee. Packaging is beautiful and the quality is excellent. Added this to my wellness routine and loving the results.',              product: 'Goli Bull Night', verified: true },
  { name: 'Pradeep R.', city: 'Hyderabad', rating: 5, text: 'Traditional recipe with modern quality standards. Love that it uses natural honey base. My grandfather swore by this and now I understand why.', product: 'Majoon Moosli', verified: true },
]

const stats = [
  { value: 10000, suffix: '+', label: 'Happy Customers', icon: '👥' },
  { value: 98,    suffix: '%', label: 'Satisfaction Rate', icon: '⭐' },
  { value: 4.8,   suffix: '/5', label: 'Average Rating',  icon: '🏆', dec: 1 },
  { value: 100,   suffix: '%', label: 'Ayurvedic Formula', icon: '🌿' },
]

const faqs = [
  { q: 'Are these products 100% Ayurvedic?', a: 'Yes. All formulations use traditional Ayurvedic ingredients with no synthetic additives or artificial preservatives.' },
  { q: 'How long before I see results?',      a: 'Most customers report positive changes within 3–4 weeks of consistent daily use. For best results, use for 2–3 months.' },
  { q: 'Do you offer Cash on Delivery?',      a: 'Yes! COD is available across most pin codes in India. UPI, cards and net banking are also accepted.' },
  { q: 'Can I subscribe for auto-delivery?',  a: 'Yes — our Subscribe & Save plan gives you 20% off every order with free delivery, cancellable anytime.' },
  { q: 'What is your return policy?',         a: '7-day returns on unopened products. For quality concerns contact care@namapharma.com within 48 hours of delivery.' },
]

const comparisonRows = [
  { feature: 'Natural Ingredients',       nama: true,  synthetic: false },
  { feature: 'No Side Effects',           nama: true,  synthetic: false },
  { feature: 'AYUSH Compliant',           nama: true,  synthetic: false },
  { feature: 'Clinically Studied Herbs',  nama: true,  synthetic: true  },
  { feature: 'Long-term Wellness',        nama: true,  synthetic: false },
  { feature: 'Honey-Based Formula',       nama: true,  synthetic: false },
  { feature: 'Made In India',             nama: true,  synthetic: false },
  { feature: 'No Artificial Additives',   nama: true,  synthetic: false },
]

/* ════════════════════════════════ */
export default function Home() {
  const { addItem } = useCartStore()
  const [statsRef, statsInView] = useIO({ triggerOnce: true })
  const [quizOpen, setQuizOpen] = useState(false)
  const [referralOpen, setReferralOpen] = useState(false)
  const [challengeOpen, setChallengeOpen] = useState(false)
  const [activeSubscribe, setActiveSubscribe] = useState('monthly')
  const [pincode, setPincode] = useState('')
  const [pincodeStatus, setPincodeStatus] = useState(null)

  const checkPincode = () => {
    if (pincode.length !== 6) return
    setPincodeStatus('checking')
    setTimeout(() => setPincodeStatus('available'), 1000)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>

      {/* Modals */}
      <AnimatePresence>
        {quizOpen && <WellnessQuiz key="quiz" onClose={() => setQuizOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {referralOpen && <ReferralModal key="referral" onClose={() => setReferralOpen(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {challengeOpen && <ChallengeModal key="challenge" onClose={() => setChallengeOpen(false)} />}
      </AnimatePresence>

      {/* ══ HERO ══ */}
      <AyurvedicHero />

      {/* ══ TRUST STRIP ══ */}
      <section className="py-8" style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🏆', title: 'AYUSH Compliant',    sub: 'Ministry of AYUSH Verified' },
              { icon: '🔬', title: 'Lab Tested',          sub: 'Third-party quality check' },
              { icon: '🌿', title: 'GMP Certified',       sub: 'Good Manufacturing Practice' },
              { icon: '🚚', title: 'Pan India Delivery',  sub: 'COD + Free above ₹999' },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.1)' }}>
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>{t.title}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="py-14" ref={statsRef}
        style={{ background: 'linear-gradient(135deg, var(--sage-pale) 0%, #F0F6EE 100%)', borderBottom: '1px solid rgba(74,103,65,0.1)' }}>
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="font-display mb-1" style={{ fontSize: 'clamp(28px,4vw,44px)', color: 'var(--sage)' }}>
                  {statsInView ? <CountUp end={s.value} duration={2.5} decimals={s.dec || 0} delay={i * 0.2} /> : '0'}{s.suffix}
                </div>
                <div className="text-xs tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WELLNESS QUIZ CTA ══ */}
      <section className="section-pad" style={{ background: 'var(--cream)' }}>
        <div className="container-wide">
          <div className="rounded-3xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, var(--ink) 0%, var(--ink-soft) 100%)' }}>
            {/* mandala bg */}
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none" style={{ width: 400, height: 400 }}>
              <svg viewBox="0 0 400 400"><circle cx="200" cy="200" r="180" fill="none" stroke="#B8922A" strokeWidth="0.5"/>
                {Array.from({length:12}).map((_,i)=>{const a=(i/12)*Math.PI*2;return<line key={i} x1={200+Math.cos(a)*60} y1={200+Math.sin(a)*60} x2={200+Math.cos(a)*180} y2={200+Math.sin(a)*180} stroke="#B8922A" strokeWidth="0.5"/>})}
              </svg>
            </div>
            <div className="relative p-10 md:p-16 text-center">
              <span className="text-4xl mb-4 block">🌿</span>
              <div className="text-xs font-medium tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(184,146,42,0.8)' }}>
                Personalised Ayurveda
              </div>
              <h2 className="font-display font-light mb-4" style={{ fontSize: 'clamp(32px,4vw,54px)', color: '#fff', lineHeight: 1.1 }}>
                Find Your Perfect<br />
                <em className="gold-text not-italic">Wellness Formula</em>
              </h2>
              <p className="text-sm mb-8 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Answer 4 quick questions about your lifestyle and goals. Our Ayurvedic wellness engine will recommend the exact product made for you — in under 60 seconds.
              </p>
              <button onClick={() => setQuizOpen(true)}
                className="btn-gold py-4 px-12 text-sm inline-flex items-center gap-2">
                Take the Free Quiz <ArrowRight size={14} />
              </button>
              <div className="flex items-center justify-center gap-6 mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <span>✓ Free · No signup</span>
                <span>✓ Result in 60 seconds</span>
                <span>✓ Expert-backed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BEST SELLERS ══ */}
      <section className="section-pad" style={{ background: '#fff' }}>
        <div className="container-wide">
          <div className="text-center mb-14">
            <div className="label-line section-label mb-4">Our Collection</div>
            <h2 className="font-display font-light" style={{ fontSize: 'clamp(32px,5vw,60px)', color: 'var(--ink)' }}>
              Our <em className="gold-text-static not-italic">Best Sellers</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="card-light group overflow-hidden">
                <div className="relative">
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className="badge-gold">{product.badge}</span>
                    <span className="badge-sage">-{product.discount}% OFF</span>
                  </div>
                  <div className="img-placeholder group-hover:scale-[1.02] transition-transform duration-700" style={{ minHeight: 300 }}>
                    <div className="flex flex-col items-center gap-2">
                      <span style={{ fontSize: 72 }}>{i === 0 ? '🐂' : '🌿'}</span>
                      <span className="font-display text-xl" style={{ color: 'rgba(184,146,42,0.35)' }}>{product.name}</span>
                    </div>
                  </div>
                  {product.isLowStock && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', border: '1px solid rgba(184,146,42,0.2)' }}>
                        <div className="flex justify-between mb-1.5 text-xs" style={{ color: '#B85A00' }}>
                          <span>⚡ Only {product.stock} left</span><span>{100-product.stock}% sold</span>
                        </div>
                        <div className="scarcity-bar"><div className="scarcity-fill" style={{ width: `${100-product.stock}%` }}/></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-3xl" style={{ color: 'var(--ink)' }}>{product.name}</h3>
                      <p className="text-sm italic mt-1" style={{ color: 'var(--gold)' }}>{product.tagline}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl" style={{ color: 'var(--gold)' }}>{formatPrice(product.price)}</div>
                      <div className="text-sm line-through" style={{ color: 'var(--text-light)' }}>{formatPrice(product.mrp)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="stars text-xs">★★★★★</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--gold)' }}>{product.rating}</span>
                    <span className="text-xs" style={{ color: 'var(--text-light)' }}>({product.reviewCount.toLocaleString()})</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>{product.shortDesc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.benefits.slice(0, 3).map(b => (
                      <span key={b} className="text-xs px-3 py-1 rounded-full"
                        style={{ background: 'var(--sage-pale)', color: 'var(--sage)', border: '1px solid rgba(74,103,65,0.15)' }}>
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => addItem(product, product.variants[0])} className="btn-gold flex-1 py-3 text-sm">
                      Buy Now
                    </button>
                    <Link to={`/product/${product.slug}`} className="btn-outline-gold flex-1 py-3 text-sm text-center">
                      Learn More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* B2G1 Banner */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-8 p-10 rounded-2xl text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--sage-pale) 0%, #EDF3EB 100%)', border: '1.5px solid rgba(74,103,65,0.2)' }}>
            <div className="absolute inset-0 flex items-center justify-center opacity-5 text-[180px] select-none">🎁</div>
            <div className="relative">
              <span className="section-label">Limited Time Offer</span>
              <h3 className="font-display font-light mt-3 mb-3" style={{ fontSize: 'clamp(28px,4vw,48px)', color: 'var(--ink)' }}>
                Buy 2, Get 1 <em className="not-italic" style={{ color: 'var(--sage)' }}>FREE</em>
              </h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Order any 2 products and receive the third absolutely free. Save up to ₹1,999!</p>
              <Link to="/shop" className="btn-sage py-4 px-10 text-sm inline-flex items-center gap-2">
                Claim This Offer <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ SUBSCRIPTION SECTION ══ */}
      <section className="section-pad" style={{ background: 'var(--cream)' }}>
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeSection>
              <span className="section-label">Subscribe & Save</span>
              <h2 className="font-display font-light mt-4 mb-5" style={{ fontSize: 'clamp(32px,4vw,52px)', color: 'var(--ink)' }}>
                Never Run Out.<br /><em className="gold-text-static not-italic">Save 20% Every Month.</em>
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                Our Subscribe & Save plan delivers your Ayurvedic wellness routine automatically — so you never miss a day. Cancel or pause anytime with one click.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { icon: RefreshCw, text: '20% off every order, always' },
                  { icon: Zap,       text: 'Priority dispatch — shipped first' },
                  { icon: Gift,      text: 'Exclusive subscriber gifts quarterly' },
                  { icon: Lock,      text: 'Cancel, pause or skip anytime' },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--sage-pale)', border: '1px solid rgba(74,103,65,0.15)' }}>
                      <Icon size={14} style={{ color: 'var(--sage)' }} />
                    </div>
                    <span className="text-sm" style={{ color: 'var(--ink-soft)' }}>{text}</span>
                  </div>
                ))}
              </div>
              <Link to="/shop" className="btn-sage py-4 px-10 text-sm inline-flex items-center gap-2">
                Subscribe & Save 20% <ArrowRight size={14} />
              </Link>
            </FadeSection>

            {/* Subscription card visual */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="rounded-3xl p-8"
                style={{ background: 'linear-gradient(145deg, #fff, var(--cream-card))', border: '1px solid rgba(184,146,42,0.15)', boxShadow: '0 20px 60px rgba(30,26,20,0.1)' }}>
                <div className="flex gap-3 mb-6">
                  {['monthly', 'quarterly'].map(plan => (
                    <button key={plan} onClick={() => setActiveSubscribe(plan)}
                      className="flex-1 py-3 rounded-xl text-sm font-medium capitalize transition-all"
                      style={{
                        background: activeSubscribe === plan ? 'var(--sage)' : 'var(--cream)',
                        color: activeSubscribe === plan ? '#fff' : 'var(--text-muted)',
                        border: `1px solid ${activeSubscribe === plan ? 'var(--sage)' : 'rgba(0,0,0,0.08)'}`,
                      }}>
                      {plan === 'monthly' ? 'Monthly' : 'Quarterly'}
                    </button>
                  ))}
                </div>
                {products.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl mb-3"
                    style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.12)' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{i === 0 ? '🐂' : '🌿'}</span>
                      <div>
                        <div className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{p.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>1 Month Supply</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg" style={{ color: 'var(--sage)' }}>
                        {formatPrice(Math.round(p.price * (activeSubscribe === 'quarterly' ? 0.75 : 0.8)))}
                      </div>
                      <div className="text-xs line-through" style={{ color: 'var(--text-light)' }}>{formatPrice(p.price)}</div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 rounded-xl text-xs text-center font-medium"
                  style={{ background: 'var(--sage-pale)', color: 'var(--sage)', border: '1px solid rgba(74,103,65,0.15)' }}>
                  {activeSubscribe === 'monthly' ? '🎉 Save 20% monthly · Free delivery' : '🎉 Save 25% quarterly · Free delivery + bonus gift'}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ COMPARISON TABLE ══ */}
      <section className="section-pad" style={{ background: '#fff' }}>
        <div className="container-wide max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="label-line section-label mb-4">Why Choose Ayurveda</div>
            <h2 className="font-display font-light" style={{ fontSize: 'clamp(30px,4vw,52px)', color: 'var(--ink)' }}>
              Nama Pharma vs <em className="gold-text-static not-italic">Synthetic Supplements</em>
            </h2>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 40px rgba(30,26,20,0.07)' }}>
            {/* Header */}
            <div className="grid grid-cols-3 p-5"
              style={{ background: 'var(--ink)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-xs font-medium tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Feature</div>
              <div className="text-center">
                <div className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>Nama Pharma</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Ayurvedic</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Synthetic</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>Supplements</div>
              </div>
            </div>
            {comparisonRows.map((row, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}
                className="grid grid-cols-3 items-center px-5 py-4"
                style={{ borderBottom: i < comparisonRows.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', background: i % 2 === 0 ? '#fff' : 'var(--cream)' }}>
                <div className="text-sm" style={{ color: 'var(--ink-soft)' }}>{row.feature}</div>
                <div className="flex justify-center">
                  {row.nama
                    ? <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--sage-pale)' }}>
                        <Check size={13} style={{ color: 'var(--sage)' }} />
                      </span>
                    : <span style={{ color: 'rgba(0,0,0,0.2)', fontSize: 18 }}>–</span>
                  }
                </div>
                <div className="flex justify-center">
                  {row.synthetic
                    ? <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'var(--sage-pale)' }}>
                        <Check size={13} style={{ color: 'var(--sage)' }} />
                      </span>
                    : <span style={{ color: 'rgba(220,53,69,0.4)', fontSize: 18 }}>✕</span>
                  }
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HERBS ══ */}
      <section className="section-pad" style={{ background: 'var(--cream)' }}>
        <div className="container-wide">
          <div className="text-center mb-14">
            <div className="label-line section-label mb-4">Ancient Wisdom</div>
            <h2 className="font-display font-light" style={{ fontSize: 'clamp(32px,4vw,56px)', color: 'var(--ink)' }}>
              The Power of <em className="gold-text-static not-italic">Ayurveda</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {herbs.map((herb, i) => (
              <motion.div key={herb.name} initial={{ opacity: 0, scale: 0.93 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.5 }}
                className="card-light p-6 group cursor-default">
                <div className="flex items-start gap-4">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">{herb.icon}</span>
                  <div>
                    <div className="font-display text-lg mb-0.5" style={{ color: 'var(--ink)' }}>{herb.name}</div>
                    <div className="text-[10px] tracking-wider uppercase mb-2" style={{ color: 'var(--sage)' }}>Origin: {herb.origin}</div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{herb.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY TRUST ══ */}
      <section className="section-pad" style={{ background: '#fff' }}>
        <div className="container-wide">
          <div className="text-center mb-14">
            <div className="label-line section-label mb-4">Our Promise</div>
            <h2 className="font-display font-light" style={{ fontSize: 'clamp(30px,4vw,52px)', color: 'var(--ink)' }}>
              Why Thousands Trust <em className="gold-text-static not-italic">Nama Pharma</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Leaf,   title: 'Premium Ingredients',   desc: 'Carefully selected Ayurvedic herbs sourced from trusted growers across India.' },
              { icon: Shield, title: 'Quality Manufacturing', desc: 'Produced under strict GMP standards in certified manufacturing facilities.' },
              { icon: Award,  title: 'AYUSH Compliant',       desc: 'All products comply with Ministry of AYUSH regulations and standards.' },
              { icon: Star,   title: 'Customer Satisfaction', desc: 'Over 10,000 happy customers trust Nama Pharma across India.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="card-cream p-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'var(--sage-pale)', border: '1px solid rgba(74,103,65,0.15)' }}>
                  <item.icon size={22} style={{ color: 'var(--sage)' }} />
                </div>
                <h3 className="font-display text-xl mb-2" style={{ color: 'var(--ink)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="section-pad" style={{ background: 'var(--cream)' }}>
        <div className="container-wide">
          <div className="text-center mb-14">
            <div className="label-line section-label mb-4">Customer Love</div>
            <h2 className="font-display font-light" style={{ fontSize: 'clamp(30px,4vw,52px)', color: 'var(--ink)' }}>
              Real Customers.<br /><em className="gold-text-static not-italic">Real Experiences.</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="card-cream p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="stars text-sm">{'★'.repeat(t.rating)}</div>
                  {t.verified && (
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                      style={{ background: 'var(--sage-pale)', color: 'var(--sage)', border: '1px solid rgba(74,103,65,0.2)' }}>
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: 'var(--ink-soft)' }}>"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-display text-lg"
                      style={{ background: 'var(--gold-pale)', color: 'var(--gold)', border: '1px solid rgba(184,146,42,0.2)' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{t.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.city}</div>
                    </div>
                  </div>
                  <span className="badge-gold">{t.product}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/results" className="btn-outline-gold py-3.5 px-10 text-sm inline-flex items-center gap-2">
              See All Reviews <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 30-DAY CHALLENGE ══ */}
      <section className="section-pad" style={{ background: '#fff' }}>
        <div className="container-wide">
          <div className="rounded-3xl overflow-hidden" style={{ border: '1.5px solid rgba(184,146,42,0.2)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left */}
              <div className="p-10 md:p-14"
                style={{ background: 'linear-gradient(135deg, var(--gold-pale) 0%, #FFF8EE 100%)' }}>
                <span className="badge-gold mb-4 inline-block">The 90-Day Challenge</span>
                <h2 className="font-display font-light mt-2 mb-5" style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: 'var(--ink)' }}>
                  Track Your Wellness<br /><em className="gold-text-static not-italic">Journey</em>
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                  Join thousands of men who've committed to 90 days of consistent Ayurvedic wellness. See visible, measurable results or get a full refund.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    { day: 'Day 1–30',  title: 'Foundation Phase',     desc: 'Body adapts, energy begins improving' },
                    { day: 'Day 31–60', title: 'Activation Phase',     desc: 'Noticeable strength and stamina gains' },
                    { day: 'Day 61–90', title: 'Peak Performance',     desc: 'Full vitality, confidence and results' },
                  ].map((phase, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(184,146,42,0.15)' }}>
                      <div className="text-xs font-semibold px-2 py-1 rounded-lg h-fit"
                        style={{ background: 'var(--gold-pale)', color: 'var(--gold)', border: '1px solid rgba(184,146,42,0.2)', whiteSpace: 'nowrap' }}>
                        {phase.day}
                      </div>
                      <div>
                        <div className="text-sm font-semibold mb-0.5" style={{ color: 'var(--ink)' }}>{phase.title}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{phase.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setChallengeOpen(true)} className="btn-gold py-4 px-10 text-sm inline-flex items-center gap-2">
                  Start My 90-Day Journey <ArrowRight size={14} />
                </button>
              </div>

              {/* Right — refer & earn */}
              <div className="p-10 md:p-14" style={{ background: 'linear-gradient(135deg, var(--sage-pale) 0%, #EEF4EC 100%)' }}>
                <span className="badge-sage mb-4 inline-block">Refer & Earn</span>
                <h2 className="font-display font-light mt-2 mb-5" style={{ fontSize: 'clamp(28px,3.5vw,44px)', color: 'var(--ink)' }}>
                  Share Wellness,<br /><em className="not-italic" style={{ color: 'var(--sage)' }}>Earn Rewards</em>
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                  Share Nama Pharma with friends and family. For every successful referral, you both get ₹200 off your next order.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { step: '01', title: 'Share', desc: 'Share your unique referral code' },
                    { step: '02', title: 'Friend Orders', desc: 'They place their first order' },
                    { step: '03', title: 'Both Earn', desc: '₹200 off for you & them' },
                  ].map((s, i) => (
                    <div key={i} className="p-4 rounded-xl text-center"
                      style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(74,103,65,0.15)' }}>
                      <div className="font-display text-2xl mb-1" style={{ color: 'var(--sage)' }}>{s.step}</div>
                      <div className="text-xs font-semibold mb-1" style={{ color: 'var(--ink)' }}>{s.title}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setReferralOpen(true)} className="btn-sage py-4 px-10 text-sm inline-flex items-center gap-2">
                  Get My Referral Code <Gift size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ LAB TRANSPARENCY ══ */}
      <section className="section-pad" style={{ background: 'var(--cream)' }}>
        <div className="container-wide">
          <div className="text-center mb-12">
            <div className="label-line section-label mb-4">Full Transparency</div>
            <h2 className="font-display font-light" style={{ fontSize: 'clamp(30px,4vw,52px)', color: 'var(--ink)' }}>
              Lab Tested. <em className="gold-text-static not-italic">Certified. Trusted.</em>
            </h2>
            <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              We believe in 100% transparency. Every batch is third-party lab tested and every certificate is publicly accessible.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            {[
              { cert: 'AYUSH', body: 'Ministry of AYUSH', icon: '🏛️', color: 'var(--gold-pale)', border: 'rgba(184,146,42,0.25)' },
              { cert: 'GMP',   body: 'Good Manufacturing Practice', icon: '🏭', color: 'var(--sage-pale)', border: 'rgba(74,103,65,0.2)' },
              { cert: 'FSSAI', body: 'Food Safety & Standards', icon: '✅', color: 'var(--cream)', border: 'rgba(184,146,42,0.15)' },
              { cert: 'ISO',   body: 'ISO 22000 Certified', icon: '📋', color: 'var(--gold-pale)', border: 'rgba(184,146,42,0.2)' },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl p-6 text-center"
                style={{ background: c.color, border: `1.5px solid ${c.border}` }}>
                <span className="text-4xl block mb-3">{c.icon}</span>
                <div className="font-display text-2xl font-medium mb-1" style={{ color: 'var(--ink)' }}>{c.cert}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.body}</div>
              </motion.div>
            ))}
          </div>
          {/* QR code area */}
          <div className="max-w-2xl mx-auto p-8 rounded-2xl text-center"
            style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.15)', boxShadow: '0 4px 20px rgba(30,26,20,0.06)' }}>
            <div className="w-24 h-24 mx-auto rounded-xl mb-4 flex items-center justify-center"
              style={{ background: 'var(--cream)', border: '2px dashed rgba(184,146,42,0.3)' }}>
              <span style={{ fontSize: 40 }}>📱</span>
            </div>
            <div className="font-display text-xl mb-2" style={{ color: 'var(--ink)' }}>Scan to Verify Authenticity</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Every Nama Pharma product ships with a unique QR code. Scan to view the complete lab Certificate of Analysis for your batch.
            </p>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="section-pad" style={{ background: '#fff' }}>
        <div className="container-wide max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="label-line section-label mb-4">FAQ</div>
            <h2 className="font-display font-light" style={{ fontSize: 'clamp(30px,4vw,52px)', color: 'var(--ink)' }}>
              Frequently Asked <em className="gold-text-static not-italic">Questions</em>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/faq" className="btn-outline-gold py-3 px-8 text-sm inline-flex items-center gap-2">
              View All FAQs <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="section-pad relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--sage-pale) 0%, #EEF5EC 50%, var(--cream) 100%)' }}>
        <div className="container-wide text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="label-line section-label mb-4">Start Your Journey</div>
            <h2 className="font-display font-light mb-5"
              style={{ fontSize: 'clamp(40px,6vw,80px)', color: 'var(--ink)', lineHeight: 1.05 }}>
              Ready To Feel<br /><em className="gold-text not-italic">Your Best?</em>
            </h2>
            <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
              Discover the power of Ayurveda with Nama Pharma. Join thousands of men living their best lives.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/shop" className="btn-gold py-5 px-14 text-sm inline-flex items-center gap-2">
                Shop Now <ArrowRight size={15} />
              </Link>
              <button onClick={() => setQuizOpen(true)} className="btn-sage py-5 px-10 text-sm">
                🌿 Find My Formula
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
