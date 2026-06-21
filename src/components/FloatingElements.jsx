import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Gift } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useLocation } from 'react-router-dom'

// WhatsApp Float
export function WhatsAppButton() {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring' }}
      className="fixed bottom-6 right-6 z-[100]"
    >
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0, x: 10, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 10, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-3 w-52 p-3 rounded-xl text-sm"
            style={{ background: '#fff', border: '1px solid rgba(37,211,102,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', whiteSpace: 'nowrap' }}
          >
            <div className="font-medium mb-1" style={{ color: 'var(--ink)' }}>Chat with us! 👋</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Mon–Sat, 9AM–6PM IST</div>
          </motion.div>
        )}
      </AnimatePresence>
      <a href="https://wa.me/919876543210?text=Hi%20Nama%20Pharma!%20I%20have%20a%20query."
        target="_blank" rel="noopener noreferrer"
        className="whatsapp-float"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <MessageCircle size={24} fill="white" color="white" />
      </a>
    </motion.div>
  )
}

// Exit intent popup
export function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { openCart } = useCartStore()

  useEffect(() => {
    if (dismissed) return
    const onMouseLeave = (e) => {
      if (e.clientY < 5) setShow(true)
    }
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', onMouseLeave)
    }, 8000)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [dismissed])

  const dismiss = () => { setShow(false); setDismissed(true) }

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: 'rgba(30,26,20,0.6)', backdropFilter: 'blur(10px)' }}
          onClick={e => e.target === e.currentTarget && dismiss()}
        >
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', damping: 22 }}
            className="relative w-full max-w-lg rounded-2xl overflow-hidden"
            style={{ background: '#fff', boxShadow: '0 40px 100px rgba(30,26,20,0.25)' }}
          >
            {/* Gold top stripe */}
            <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, var(--gold), var(--gold-bright), var(--gold))' }} />

            <button onClick={dismiss} className="absolute top-4 right-4 p-2 rounded-full transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <X size={16} />
            </button>

            <div className="p-10 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--gold-pale)', border: '1px solid rgba(184,146,42,0.25)' }}>
                <Gift size={28} style={{ color: 'var(--gold)' }} />
              </div>
              <span className="section-label mb-3 block">Wait! Special Offer</span>
              <h2 className="font-display font-light mb-2" style={{ fontSize: 40, color: 'var(--ink)' }}>Get 15% Off</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Don't leave without claiming your exclusive discount on our premium Ayurvedic supplements.
              </p>

              <div className="inline-block px-6 py-3 rounded-xl mb-6"
                style={{ background: 'var(--gold-pale)', border: '2px dashed rgba(184,146,42,0.4)' }}>
                <span className="font-display text-2xl" style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}>FIRST15</span>
              </div>

              <div className="space-y-3">
                <button onClick={() => { openCart(); dismiss() }} className="btn-gold w-full py-4">
                  Claim 15% Off Now
                </button>
                <button onClick={dismiss} className="w-full text-xs py-2" style={{ color: 'var(--text-light)' }}>
                  No thanks, I'll pay full price
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Scarcity notification
export function ScarcityNotification() {
  const [show, setShow] = useState(false)
  const [current, setCurrent] = useState(0)
  const location = useLocation()
  const names = ['Rajesh from Mumbai', 'Amit from Delhi', 'Vikas from Bangalore', 'Priya from Hyderabad', 'Suresh from Chennai']

  if (location.pathname.startsWith('/admin')) return null

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!show) return
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % names.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={current}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-24 left-6 z-[100] rounded-2xl p-4 max-w-[280px]"
          style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.2)', boxShadow: '0 16px 48px rgba(30,26,20,0.12)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-display text-lg"
              style={{ background: 'var(--gold-pale)', color: 'var(--gold)', border: '1px solid rgba(184,146,42,0.2)' }}>
              {names[current][0]}
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: 'var(--ink)' }}>{names[current]}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>just purchased Goli Bull Night</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-light)' }}>{Math.floor(Math.random() * 5) + 1} minutes ago</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
