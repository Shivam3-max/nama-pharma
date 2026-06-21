import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Star } from 'lucide-react'

/* ── rotating mandala SVG ── */
function Mandala({ size = 600, opacity = 0.06 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 600 600" style={{ opacity }} xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring dots */}
      {Array.from({ length: 48 }).map((_, i) => {
        const a = (i / 48) * Math.PI * 2
        const r = 285
        return <circle key={i} cx={300 + Math.cos(a) * r} cy={300 + Math.sin(a) * r}
          r={i % 4 === 0 ? 3 : 1.5} fill="#B8922A" />
      })}
      {/* Concentric circles */}
      {[260, 230, 200, 170, 140, 110, 80, 50].map((r, i) => (
        <circle key={i} cx="300" cy="300" r={r} fill="none"
          stroke="#B8922A" strokeWidth={i % 2 === 0 ? 0.8 : 0.4}
          strokeDasharray={i % 3 === 0 ? '4 6' : 'none'} />
      ))}
      {/* 16-petal lotus */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2
        const x1 = 300 + Math.cos(a) * 160
        const y1 = 300 + Math.sin(a) * 160
        const x2 = 300 + Math.cos(a + 0.2) * 90
        const y2 = 300 + Math.sin(a + 0.2) * 90
        const x3 = 300 + Math.cos(a - 0.2) * 90
        const y3 = 300 + Math.sin(a - 0.2) * 90
        return <path key={i} d={`M 300 300 Q ${x2} ${y2} ${x1} ${y1} Q ${x3} ${y3} 300 300`}
          fill="none" stroke="#B8922A" strokeWidth="0.6" opacity="0.8" />
      })}
      {/* 8-petal inner lotus */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8
        const x1 = 300 + Math.cos(a) * 80
        const y1 = 300 + Math.sin(a) * 80
        const x2 = 300 + Math.cos(a + 0.38) * 50
        const y2 = 300 + Math.sin(a + 0.38) * 50
        const x3 = 300 + Math.cos(a - 0.38) * 50
        const y3 = 300 + Math.sin(a - 0.38) * 50
        return <path key={i} d={`M 300 300 Q ${x2} ${y2} ${x1} ${y1} Q ${x3} ${y3} 300 300`}
          fill="rgba(184,146,42,0.08)" stroke="#B8922A" strokeWidth="0.8" />
      })}
      {/* Star / geometric centre */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2
        const r1 = 40, r2 = 22
        const ax = 300 + Math.cos(a) * r1, ay = 300 + Math.sin(a) * r1
        const bx = 300 + Math.cos(a + Math.PI / 6) * r2, by = 300 + Math.sin(a + Math.PI / 6) * r2
        return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} stroke="#B8922A" strokeWidth="0.7" />
      })}
      <circle cx="300" cy="300" r="18" fill="none" stroke="#B8922A" strokeWidth="1" />
      <circle cx="300" cy="300" r="8" fill="rgba(184,146,42,0.15)" stroke="#B8922A" strokeWidth="0.8" />
      <circle cx="300" cy="300" r="3" fill="#B8922A" />
      {/* Diagonal grid between circles */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a1 = (i / 24) * Math.PI * 2
        const a2 = ((i + 1) / 24) * Math.PI * 2
        return <line key={i}
          x1={300 + Math.cos(a1) * 110} y1={300 + Math.sin(a1) * 110}
          x2={300 + Math.cos(a2) * 140} y2={300 + Math.sin(a2) * 140}
          stroke="#B8922A" strokeWidth="0.4" opacity="0.5" />
      })}
    </svg>
  )
}

/* ── floating leaf SVGs ── */
const LEAVES = [
  { d: 'M0,20 Q10,-5 20,0 Q10,10 0,20Z', color: '#4A6741' },
  { d: 'M0,25 Q15,-8 25,2 Q12,12 0,25Z', color: '#6B8F63' },
  { d: 'M0,18 Q8,-6 18,0 Q8,8 0,18Z', color: '#B8922A' },
]

function FloatingLeaf({ leaf, style }) {
  return (
    <motion.div className="absolute pointer-events-none" style={style}
      animate={{ y: [-20, -80, -140], x: [0, 15, -10], opacity: [0, 0.7, 0], rotate: [0, 45, 90] }}
      transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, repeatDelay: Math.random() * 5, ease: 'linear' }}
    >
      <svg width="20" height="28" viewBox="0 0 30 30">
        <path d={leaf.d} fill={leaf.color} opacity="0.6" />
      </svg>
    </motion.div>
  )
}

/* ── typewriter cycle ── */
const WORDS = ['Vitality', 'Strength', 'Confidence', 'Endurance', 'Performance']

function TypewriterWord() {
  const [idx, setIdx] = useState(0)
  const [shown, setShown] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const word = WORDS[idx]

  useEffect(() => {
    let t
    if (!deleting && shown < word.length) {
      t = setTimeout(() => setShown(s => s + 1), 80)
    } else if (!deleting && shown === word.length) {
      t = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && shown > 0) {
      t = setTimeout(() => setShown(s => s - 1), 45)
    } else if (deleting && shown === 0) {
      setDeleting(false)
      setIdx(i => (i + 1) % WORDS.length)
    }
    return () => clearTimeout(t)
  }, [shown, deleting, word])

  return (
    <span className="gold-text" style={{ minWidth: 200, display: 'inline-block' }}>
      {word.slice(0, shown)}<span className="animate-pulse">|</span>
    </span>
  )
}

/* ── ticker strip ── */
const TICKER = ['100% Ayurvedic Formula', 'AYUSH Compliant', 'GMP Certified', 'Lab Tested Quality', 'No Side Effects', 'Made In India', 'Doctor Recommended', 'COD Available Pan India']

export default function AyurvedicHero() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const mandalaY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  const leaves = Array.from({ length: 14 }, (_, i) => ({
    leaf: LEAVES[i % LEAVES.length],
    style: {
      left: `${5 + (i * 7) % 90}%`,
      bottom: `${10 + (i * 13) % 30}%`,
      animationDelay: `${i * 0.8}s`,
    }
  }))

  return (
    <section ref={heroRef} className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(155deg, #FDFAF6 0%, #F7F3ED 35%, #F0EAE0 70%, #EDE5D8 100%)',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* ── background layers ── */}

      {/* Radial glow top-right */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 55% 55% at 75% 20%, rgba(184,146,42,0.09) 0%, transparent 65%)',
      }} />
      {/* Radial glow bottom-left */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 45% 50% at 15% 85%, rgba(74,103,65,0.07) 0%, transparent 60%)',
      }} />

      {/* Mandala — slow rotate */}
      <motion.div style={{ y: mandalaY }}
        className="absolute pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        style={{
          right: '-8%', top: '50%', transform: 'translateY(-50%)',
          width: 680, height: 680,
        }}
      >
        <Mandala size={680} opacity={0.055} />
      </motion.div>

      {/* Second smaller mandala — left, counter-rotate */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        style={{ left: '-12%', top: '10%', width: 380, height: 380 }}
      >
        <Mandala size={380} opacity={0.04} />
      </motion.div>

      {/* Floating leaves */}
      {leaves.map((l, i) => <FloatingLeaf key={i} leaf={l.leaf} style={l.style} />)}

      {/* Sanskrit decorative text */}
      <div className="absolute top-32 right-8 pointer-events-none hidden lg:block"
        style={{ color: 'rgba(184,146,42,0.12)', fontSize: 11, letterSpacing: '0.3em', writingMode: 'vertical-rl', fontFamily: 'serif' }}>
        आयुर्वेद · प्रकृति · स्वास्थ्य · बल
      </div>
      <div className="absolute bottom-32 left-8 pointer-events-none hidden lg:block"
        style={{ color: 'rgba(74,103,65,0.12)', fontSize: 11, letterSpacing: '0.3em', writingMode: 'vertical-rl', fontFamily: 'serif' }}>
        शक्ति · ऊर्जा · जीवन · पुरुष
      </div>

      {/* Herb illustration strip — top right corner */}
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-5"
        style={{ background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Ccircle cx=\'100\' cy=\'100\' r=\'80\' fill=\'none\' stroke=\'%23B8922A\' stroke-width=\'0.5\'/%3E%3C/svg%3E") center/cover' }}
      />

      {/* ── main content ── */}
      <motion.div style={{ y, opacity }} className="relative z-10 flex-1 flex items-center">
        <div className="container-wide w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[85vh] py-20">

            {/* LEFT — text */}
            <div>
              {/* Eyebrow */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
                className="flex items-center gap-3 mb-7">
                <div className="h-px w-10" style={{ background: 'var(--gold)' }} />
                <span className="badge-sage text-[10px]"><Leaf size={9}/> Premium Ayurvedic · Since 2021</span>
              </motion.div>

              {/* Headline */}
              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-light leading-[1.05] mb-6"
                style={{ fontSize: 'clamp(46px, 6.5vw, 88px)', color: 'var(--ink)' }}
              >
                Ancient Wisdom<br />
                For Modern<br />
                <TypewriterWord />
              </motion.h1>

              {/* Sub */}
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
                className="text-base lg:text-lg leading-relaxed mb-10 max-w-lg"
                style={{ color: 'var(--text-muted)' }}
              >
                Nama Pharma brings you time-tested Ayurvedic formulations — Goli Bull Night & Majoon Moosli — crafted for the modern Indian man who refuses to settle.
              </motion.p>

              {/* CTAs */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-wrap gap-4 mb-10">
                <Link to="/shop" className="btn-gold py-4 px-10 text-sm inline-flex items-center gap-2">
                  Shop Now <ArrowRight size={14} />
                </Link>
                <Link to="/quiz" className="btn-outline-gold py-4 px-8 text-sm inline-flex items-center gap-2">
                  🌿 Find Your Formula
                </Link>
              </motion.div>

              {/* Social proof row */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-wrap items-center gap-6">
                <div className="flex -space-x-2">
                  {['R', 'A', 'V', 'S', 'K'].map((l, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center font-display text-sm font-medium"
                      style={{ background: `hsl(${35 + i * 8}, 60%, ${75 - i * 5}%)`, color: 'var(--ink)' }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#D4A843" color="#D4A843" />)}
                    <span className="text-sm font-medium ml-1" style={{ color: 'var(--gold)' }}>4.8</span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>10,000+ happy customers across India</div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT — product showcase */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Outer glow ring */}
              <div className="absolute rounded-full"
                style={{ width: 420, height: 420, background: 'radial-gradient(circle, rgba(184,146,42,0.1) 0%, transparent 70%)' }} />

              {/* Product cards stacked */}
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10">
                {/* Main card */}
                <div className="w-72 rounded-3xl overflow-hidden"
                  style={{ background: 'linear-gradient(145deg, #FDFAF6, #F0EBE0)', border: '1px solid rgba(184,146,42,0.2)', boxShadow: '0 32px 80px rgba(30,26,20,0.14), 0 8px 24px rgba(184,146,42,0.08)' }}>
                  <div className="h-64 flex items-center justify-center relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #F5EFE6 0%, #EDE5D8 100%)' }}>
                    {/* Decorative mandala inside card */}
                    <div className="absolute opacity-10" style={{ width: 200, height: 200 }}>
                      <Mandala size={200} opacity={1} />
                    </div>
                    <div className="relative z-10 text-center">
                      <div style={{ fontSize: 80 }}>🐂</div>
                      <div className="font-display text-base mt-1" style={{ color: 'rgba(184,146,42,0.5)' }}>Goli Bull Night</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="font-display text-xl mb-0.5" style={{ color: 'var(--ink)' }}>Goli Bull Night</div>
                    <div className="text-xs italic mb-3" style={{ color: 'var(--gold)' }}>Recharge Your Confidence</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-display text-xl" style={{ color: 'var(--gold)' }}>₹1,299</span>
                        <span className="text-xs line-through ml-2" style={{ color: 'var(--text-light)' }}>₹1,999</span>
                      </div>
                      <span className="badge-sage text-[9px]">35% OFF</span>
                    </div>
                  </div>
                </div>

                {/* Second card peeking */}
                <div className="absolute -bottom-4 -right-8 w-60 rounded-2xl overflow-hidden -z-10"
                  style={{ background: 'linear-gradient(145deg, #F0EBE0, #E8E0D0)', border: '1px solid rgba(74,103,65,0.15)', boxShadow: '0 16px 40px rgba(30,26,20,0.1)' }}>
                  <div className="h-20 flex items-center justify-center gap-3 px-5">
                    <span style={{ fontSize: 36 }}>🌿</span>
                    <div>
                      <div className="font-display text-sm" style={{ color: 'var(--ink)' }}>Majoon Moosli</div>
                      <div className="text-xs" style={{ color: 'var(--gold)' }}>₹999 · Traditional Recipe</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating badges */}
              <motion.div animate={{ y: [0, -8, 0], x: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute top-4 -left-4 px-4 py-3 rounded-2xl"
                style={{ background: '#fff', boxShadow: '0 8px 32px rgba(30,26,20,0.1)', border: '1px solid rgba(184,146,42,0.12)' }}>
                <div className="flex items-center gap-2">
                  <span>🌿</span>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>100% Ayurvedic</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>AYUSH Compliant</div>
                  </div>
                </div>
              </motion.div>

              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 1 }}
                className="absolute -top-2 right-0 px-4 py-3 rounded-2xl"
                style={{ background: 'var(--sage)', boxShadow: '0 8px 24px rgba(74,103,65,0.3)' }}>
                <div className="text-xs font-medium text-white">🚚 Free Delivery</div>
                <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Orders above ₹999</div>
              </motion.div>

              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
                className="absolute bottom-8 -left-8 px-4 py-3 rounded-2xl"
                style={{ background: 'var(--gold-pale)', border: '1px solid rgba(184,146,42,0.25)', boxShadow: '0 6px 20px rgba(184,146,42,0.15)' }}>
                <div className="flex items-center gap-2">
                  <Star size={14} fill="#B8922A" color="#B8922A" />
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--ink)' }}>4.8 / 5 Rating</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>10k+ Reviews</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── bottom ticker ── */}
      <div className="relative z-10 py-3 overflow-hidden"
        style={{ borderTop: '1px solid rgba(184,146,42,0.15)', background: 'rgba(184,146,42,0.04)' }}>
        <div className="flex" style={{ animation: 'marquee 28s linear infinite', width: 'max-content' }}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-2 px-8 text-xs font-medium whitespace-nowrap"
              style={{ color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
              <span style={{ color: 'var(--gold)' }}>✦</span> {t.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10">
        <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: 'rgba(184,146,42,0.45)' }}>Discover</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
          className="w-px h-8" style={{ background: 'linear-gradient(180deg, var(--gold), transparent)' }} />
      </motion.div>
    </section>
  )
}
