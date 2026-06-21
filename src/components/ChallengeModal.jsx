import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Check, Calendar, Flame, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'

const phases = [
  {
    days: 'Day 1–30',
    title: 'Foundation Phase',
    color: 'var(--gold)',
    bg: 'var(--gold-pale)',
    border: 'rgba(184,146,42,0.3)',
    icon: '🌱',
    milestones: ['Energy levels begin improving', 'Better sleep quality', 'Reduced fatigue'],
  },
  {
    days: 'Day 31–60',
    title: 'Activation Phase',
    color: 'var(--sage)',
    bg: 'var(--sage-pale)',
    border: 'rgba(74,103,65,0.25)',
    icon: '💪',
    milestones: ['Noticeable strength gains', 'Improved stamina', 'Mental clarity boost'],
  },
  {
    days: 'Day 61–90',
    title: 'Peak Performance',
    color: '#B85A00',
    bg: '#FFF3E8',
    border: 'rgba(184,90,0,0.25)',
    icon: '🏆',
    milestones: ['Full vitality restored', 'Peak confidence', 'Sustained results'],
  },
]

export default function ChallengeModal({ onClose }) {
  const [step, setStep] = useState(0) // 0=intro, 1=phases, 2=enrolled
  const [name, setName] = useState('')
  const [startDate] = useState(() => {
    const d = new Date()
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  })
  const [endDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 90)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  })

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      style={{ background: 'rgba(30,26,20,0.7)', backdropFilter: 'blur(14px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: '#fff', boxShadow: '0 40px 100px rgba(30,26,20,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>

        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, var(--gold), var(--sage), var(--gold))' }} />

        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Trophy size={16} style={{ color: 'var(--gold)' }} />
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
                90-Day Challenge
              </span>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--cream)', color: 'var(--text-muted)' }}>
              <X size={14} />
            </button>
          </div>

          <AnimatePresence mode="wait">

            {/* Step 0 — Intro */}
            {step === 0 && (
              <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="text-center mb-7">
                  <div className="text-5xl mb-4">🔥</div>
                  <h2 className="font-display text-4xl font-light mb-3" style={{ color: 'var(--ink)' }}>
                    The 90-Day<br /><em className="gold-text-static not-italic">Wellness Challenge</em>
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Commit to 90 days of consistent Ayurvedic wellness. Track your progress through 3 transformation phases — or get a full refund.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-7">
                  {[
                    { icon: '📅', val: '90', label: 'Days' },
                    { icon: '🌿', val: '3', label: 'Phases' },
                    { icon: '💯', val: '100%', label: 'Refund if no results' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-2xl p-4 text-center"
                      style={{ background: 'var(--cream)', border: '1px solid rgba(184,146,42,0.15)' }}>
                      <div className="text-xl mb-1">{s.icon}</div>
                      <div className="font-display text-2xl" style={{ color: 'var(--gold)' }}>{s.val}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setStep(1)} className="btn-gold w-full py-4 text-sm flex items-center justify-center gap-2">
                  View My 3-Phase Journey <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {/* Step 1 — Phases */}
            {step === 1 && (
              <motion.div key="phases" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h2 className="font-display text-2xl mb-5" style={{ color: 'var(--ink)' }}>Your Transformation Roadmap</h2>
                <div className="space-y-4 mb-7">
                  {phases.map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="rounded-2xl p-5"
                      style={{ background: p.bg, border: `1.5px solid ${p.border}` }}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{p.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold tracking-wider uppercase" style={{ color: p.color }}>{p.days}</span>
                          </div>
                          <div className="font-display text-lg mb-2" style={{ color: 'var(--ink)' }}>{p.title}</div>
                          <div className="space-y-1">
                            {p.milestones.map((m, j) => (
                              <div key={j} className="flex items-center gap-2 text-xs" style={{ color: 'var(--ink-soft)' }}>
                                <Check size={11} style={{ color: p.color, flexShrink: 0 }} /> {m}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mb-5">
                  <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--ink)' }}>
                    Your name (for your challenge card)
                  </label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="input-light w-full text-sm" placeholder="e.g. Rajesh Kumar" />
                </div>

                <button onClick={() => name.trim() && setStep(2)} className="btn-sage w-full py-4 text-sm flex items-center justify-center gap-2"
                  style={{ opacity: name.trim() ? 1 : 0.5 }}>
                  Start My 90-Day Journey <Flame size={14} />
                </button>
              </motion.div>
            )}

            {/* Step 2 — Enrolled */}
            {step === 2 && (
              <motion.div key="enrolled" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}>
                <div className="text-center mb-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2, damping: 12 }}
                    className="text-6xl mb-4">🏆</motion.div>
                  <h2 className="font-display text-3xl font-light mb-2" style={{ color: 'var(--ink)' }}>
                    You're In, {name}!
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your 90-day Ayurvedic wellness journey starts today.</p>
                </div>

                {/* Challenge card */}
                <div className="rounded-2xl p-6 mb-5 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, var(--ink) 0%, var(--ink-soft) 100%)' }}>
                  <div className="absolute top-0 right-0 opacity-10 text-[120px] leading-none select-none">🌿</div>
                  <div className="relative">
                    <div className="text-xs tracking-widest uppercase mb-1" style={{ color: 'rgba(184,146,42,0.7)' }}>90-Day Challenge</div>
                    <div className="font-display text-2xl text-white mb-4">{name}'s Journey</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Starts</div>
                        <div className="text-sm font-medium text-white">{startDate}</div>
                      </div>
                      <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Ends</div>
                        <div className="text-sm font-medium text-white">{endDate}</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <span>Progress</span><span>Day 1 of 90</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: '1%' }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full rounded-full" style={{ background: 'var(--gold)' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link to="/shop" onClick={onClose} className="btn-gold w-full py-4 text-sm flex items-center justify-center gap-2">
                    Shop to Begin My Challenge <ArrowRight size={14} />
                  </Link>
                  <button onClick={onClose} className="btn-outline-gold w-full py-3 text-sm">
                    I'll Shop Later
                  </button>
                </div>
                <p className="text-[10px] text-center mt-3" style={{ color: 'var(--text-light)' }}>
                  Results guaranteed or full refund within 90 days. No questions asked.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
