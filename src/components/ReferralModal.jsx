import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Gift } from 'lucide-react'

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return 'NAMA-' + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const REFERRAL_CODE = generateCode()

export default function ReferralModal({ onClose }) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(REFERRAL_CODE).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const sendInvite = (e) => {
    e.preventDefault()
    if (!email) return
    setSent(true)
    setEmail('')
  }

  const shareText = `Hey! I use Nama Pharma for natural men's wellness — try it with my code ${REFERRAL_CODE} for ₹200 off your first order. https://namapharma.com`

  const whatsappShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener')
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      style={{ background: 'rgba(30,26,20,0.7)', backdropFilter: 'blur(14px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: '#fff', boxShadow: '0 40px 100px rgba(30,26,20,0.25)' }}>

        {/* Gradient header */}
        <div className="relative p-8 text-center"
          style={{ background: 'linear-gradient(135deg, var(--sage) 0%, #2d5a27 100%)' }}>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
            <X size={14} />
          </button>
          <div className="text-5xl mb-3">🎁</div>
          <h2 className="font-display text-3xl font-light text-white mb-1">Refer & Earn</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Both you and your friend get <strong className="text-white">₹200 off</strong>
          </p>
        </div>

        <div className="p-7">
          {/* Code box */}
          <div className="mb-6">
            <div className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
              Your Referral Code
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 py-3 px-4 rounded-xl font-mono text-xl font-bold text-center tracking-widest"
                style={{ background: 'var(--gold-pale)', border: '2px dashed rgba(184,146,42,0.4)', color: 'var(--gold)' }}>
                {REFERRAL_CODE}
              </div>
              <button onClick={copy}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                style={{ background: copied ? 'var(--sage)' : 'var(--sage-pale)', border: `1px solid ${copied ? 'var(--sage)' : 'rgba(74,103,65,0.2)'}` }}>
                <AnimatePresence mode="wait">
                  {copied
                    ? <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check size={16} color="#fff" />
                      </motion.span>
                    : <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Copy size={16} style={{ color: 'var(--sage)' }} />
                      </motion.span>
                  }
                </AnimatePresence>
              </button>
            </div>
            {copied && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="text-xs mt-2 text-center" style={{ color: 'var(--sage)' }}>
                ✓ Code copied to clipboard!
              </motion.p>
            )}
          </div>

          {/* How it works */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { step: '1', icon: '📤', label: 'Share code' },
              { step: '2', icon: '🛍️', label: 'Friend orders' },
              { step: '3', icon: '💰', label: 'Both save ₹200' },
            ].map(s => (
              <div key={s.step} className="rounded-xl p-3 text-center"
                style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.12)' }}>
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Share via WhatsApp */}
          <button onClick={whatsappShare}
            className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 mb-4"
            style={{ background: '#25D366', color: '#fff' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Share on WhatsApp
          </button>

          {/* Email invite */}
          <AnimatePresence>
            {!sent ? (
              <motion.form onSubmit={sendInvite} className="flex gap-2">
                <input value={email} onChange={e => setEmail(e.target.value)}
                  type="email" placeholder="Friend's email address"
                  className="input-light flex-1 text-sm" />
                <button type="submit"
                  className="btn-gold text-sm px-5 py-3 flex-shrink-0">
                  Send
                </button>
              </motion.form>
            ) : (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="py-3 px-4 rounded-xl text-sm text-center"
                style={{ background: 'var(--sage-pale)', color: 'var(--sage)', border: '1px solid rgba(74,103,65,0.2)' }}>
                ✓ Invite sent! You'll earn ₹200 when they place their first order.
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-center mt-4" style={{ color: 'var(--text-light)' }}>
            No limit on referrals. Credit applied automatically after friend's first delivery.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
