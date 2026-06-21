import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ChevronLeft, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'

const questions = [
  {
    id: 'goal',
    q: 'What is your primary wellness goal?',
    emoji: '🎯',
    options: [
      { label: 'Daily Energy & Stamina', value: 'energy', icon: '⚡' },
      { label: 'Strength & Muscle Support', value: 'strength', icon: '💪' },
      { label: 'Better Sleep & Recovery', value: 'sleep', icon: '🌙' },
      { label: 'Overall Vitality & Confidence', value: 'vitality', icon: '✨' },
    ],
  },
  {
    id: 'lifestyle',
    q: 'How would you describe your lifestyle?',
    emoji: '🏃',
    options: [
      { label: 'Very Active (gym / sports daily)', value: 'very-active', icon: '🏋️' },
      { label: 'Moderately Active (3–4x/week)', value: 'moderate', icon: '🚶' },
      { label: 'Desk Job, Low Activity', value: 'sedentary', icon: '💻' },
      { label: 'High Stress, Demanding Career', value: 'stressed', icon: '📊' },
    ],
  },
  {
    id: 'age',
    q: 'What is your age group?',
    emoji: '👤',
    options: [
      { label: '18 – 25 years', value: '18-25', icon: '🌱' },
      { label: '26 – 35 years', value: '26-35', icon: '🌿' },
      { label: '36 – 45 years', value: '36-45', icon: '🌳' },
      { label: '45+ years', value: '45+', icon: '🏔️' },
    ],
  },
  {
    id: 'concern',
    q: 'Any specific concern you want to address?',
    emoji: '🩺',
    options: [
      { label: 'Low Energy / Fatigue', value: 'fatigue', icon: '😴' },
      { label: 'Stress & Anxiety', value: 'stress', icon: '🧠' },
      { label: 'Physical Weakness', value: 'weakness', icon: '🦴' },
      { label: 'No specific concern', value: 'general', icon: '👍' },
    ],
  },
]

function getRecommendation(answers) {
  const { goal, concern, lifestyle } = answers
  if (goal === 'sleep' || concern === 'stress' || lifestyle === 'stressed') {
    return {
      primary: 'goli-bull-night',
      name: 'Goli Bull Night',
      reason: 'Based on your profile, Goli Bull Night\'s night-time Ashwagandha & Shilajit formula is ideal for deep recovery, stress resilience and restored energy.',
      price: 1299,
      emoji: '🐂',
      score: 96,
    }
  }
  if (goal === 'vitality' || goal === 'strength' || concern === 'weakness') {
    return {
      primary: 'majoon-moosli',
      name: 'Majoon Moosli',
      reason: 'Your active lifestyle and strength goals call for Majoon Moosli — a traditional honey-based formula with Safed Musli, Shatavari and Gokhru for peak performance.',
      price: 999,
      emoji: '🌿',
      score: 94,
    }
  }
  return {
    primary: 'both',
    name: 'Complete Wellness Stack',
    reason: 'For all-round vitality, we recommend the full stack — Goli Bull Night for night recovery + Majoon Moosli for daytime energy. The perfect daily wellness routine.',
    price: 2298,
    emoji: '🌟',
    score: 98,
  }
}

export default function WellnessQuiz({ onClose }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)

  const current = questions[step]
  const result = done ? getRecommendation(answers) : null

  const pick = (val) => {
    const next = { ...answers, [current.id]: val }
    setAnswers(next)
    if (step < questions.length - 1) {
      setTimeout(() => setStep(s => s + 1), 250)
    } else {
      setTimeout(() => setDone(true), 250)
    }
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4"
      style={{ background: 'rgba(30,26,20,0.65)', backdropFilter: 'blur(12px)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', damping: 25 }}
        className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: '#fff', boxShadow: '0 40px 100px rgba(30,26,20,0.2)' }}>

        {/* Gold top bar */}
        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, var(--sage), var(--gold), var(--sage))' }} />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Leaf size={16} style={{ color: 'var(--sage)' }} />
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--sage)' }}>
                Wellness Finder
              </span>
            </div>
            <button onClick={onClose} className="p-2 rounded-full transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <X size={16} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>

                {/* Progress */}
                <div className="flex gap-1.5 mb-7">
                  {questions.map((_, i) => (
                    <div key={i} className="h-1 rounded-full flex-1 transition-all duration-500"
                      style={{ background: i <= step ? 'var(--gold)' : 'rgba(0,0,0,0.08)' }} />
                  ))}
                </div>

                <div className="text-3xl mb-3">{current.emoji}</div>
                <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--ink)' }}>{current.q}</h2>

                <div className="space-y-3">
                  {current.options.map(opt => (
                    <button key={opt.value} onClick={() => pick(opt.value)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all group"
                      style={{ border: '1.5px solid rgba(0,0,0,0.08)', background: 'var(--cream)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'var(--gold-pale)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.background = 'var(--cream)' }}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <span className="font-medium text-sm" style={{ color: 'var(--ink)' }}>{opt.label}</span>
                      <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--gold)' }} />
                    </button>
                  ))}
                </div>

                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-1 mt-5 text-xs transition-colors"
                    style={{ color: 'var(--text-muted)' }}>
                    <ChevronLeft size={13} /> Back
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">{result.emoji}</div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
                    style={{ background: 'var(--sage-pale)', border: '1px solid rgba(74,103,65,0.2)' }}>
                    <span className="text-xs font-semibold" style={{ color: 'var(--sage)' }}>{result.score}% Match For You</span>
                  </div>
                  <h2 className="font-display text-3xl mb-2" style={{ color: 'var(--ink)' }}>We Recommend</h2>
                  <h3 className="font-display text-2xl mb-4" style={{ color: 'var(--gold)' }}>{result.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{result.reason}</p>
                </div>

                <div className="p-4 rounded-2xl mb-5"
                  style={{ background: 'var(--gold-pale)', border: '1px solid rgba(184,146,42,0.25)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{result.name}</span>
                    <span className="font-display text-xl" style={{ color: 'var(--gold)' }}>{formatPrice(result.price)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {result.primary === 'both' ? (
                    <Link to="/shop" onClick={onClose} className="btn-gold flex-1 py-3.5 text-sm">
                      Shop Both Products
                    </Link>
                  ) : (
                    <Link to={`/product/${result.primary}`} onClick={onClose} className="btn-gold flex-1 py-3.5 text-sm">
                      View Product <ArrowRight size={13} />
                    </Link>
                  )}
                  <button onClick={() => { setStep(0); setAnswers({}); setDone(false) }}
                    className="btn-outline-gold px-5 py-3.5 text-sm">
                    Retake
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
