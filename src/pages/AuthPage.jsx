import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

function Field({ label, type = 'text', value, onChange, placeholder, error, show, onToggle }) {
  const isPassword = type === 'password'
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-light w-full text-sm pr-10"
          style={error ? { borderColor: '#DC2626', boxShadow: '0 0 0 3px rgba(220,38,38,0.08)' } : {}}
        />
        {isPassword && (
          <button type="button" onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-light)' }}>
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {error && <p className="text-[11px] mt-1" style={{ color: '#DC2626' }}>{error}</p>}
    </div>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const { login } = useAuthStore()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  function validate() {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError('')
    await new Promise(r => setTimeout(r, 600))
    const result = login(form)
    setLoading(false)
    if (result.error) { setApiError(result.error); return }
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--cream)' }}>
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, var(--sage) 0%, #2d4a28 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(184,146,42,0.6) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)' }} />
        <Link to="/" className="flex flex-col leading-none relative z-10">
          <span className="font-display text-3xl font-medium" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '0.22em' }}>NAMA</span>
          <span className="text-[9px] tracking-[0.45em] font-sans font-medium" style={{ color: 'rgba(255,255,255,0.6)', marginTop: '-1px' }}>PHARMA</span>
        </Link>
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <p className="font-display font-light mb-6" style={{ fontSize: 'clamp(28px,3vw,42px)', color: '#fff', lineHeight: 1.2 }}>
              Ancient wisdom,<br /><em className="not-italic" style={{ color: 'var(--gold-bright)' }}>modern vitality.</em>
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Sign in to track your orders, manage your subscriptions, and unlock exclusive member benefits.
            </p>
            <div className="space-y-3">
              {['Track orders in real-time', 'Exclusive member discounts', 'Subscription management', 'Priority customer support'].map((f, i) => (
                <motion.div key={f} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <CheckCircle size={14} style={{ color: 'var(--gold-bright)', flexShrink: 0 }} /> {f}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <p className="text-[11px] relative z-10" style={{ color: 'rgba(255,255,255,0.4)' }}>© 2026 Nama Pharma. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex flex-col leading-none mb-8 lg:hidden">
            <span className="font-display text-2xl font-medium" style={{ color: 'var(--gold)', letterSpacing: '0.22em' }}>NAMA</span>
            <span className="text-[8px] tracking-[0.45em] font-sans font-medium" style={{ color: 'var(--sage)', marginTop: '-1px' }}>PHARMA</span>
          </Link>

          <h1 className="font-display font-light mb-1" style={{ fontSize: 32, color: 'var(--ink)' }}>Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Sign in to your Nama Pharma account</p>

          <AnimatePresence>
            {apiError && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)' }}>
                {apiError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email address" type="email" value={form.email} placeholder="you@example.com"
              onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <Field label="Password" type="password" value={form.password} placeholder="Enter your password"
              onChange={e => setForm({ ...form, password: e.target.value })} error={errors.password}
              show={showPw} onToggle={() => setShowPw(!showPw)} />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Remember me</span>
              </label>
              <button type="button" className="text-xs" style={{ color: 'var(--gold)' }}>Forgot password?</button>
            </div>

            <button type="submit" disabled={loading}
              className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2 mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in…</>
              ) : (
                <>Sign In <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: 'rgba(184,146,42,0.15)' }} /></div>
            <div className="relative text-center"><span className="px-3 text-xs bg-cream" style={{ color: 'var(--text-light)', background: 'var(--cream)' }}>or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[['G', 'Google'], ['📱', 'Phone OTP']].map(([icon, label]) => (
              <button key={label} type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5"
                style={{ border: '1.5px solid rgba(184,146,42,0.2)', color: 'var(--ink-soft)', background: '#fff' }}>
                <span className="font-bold">{icon}</span> {label}
              </button>
            ))}
          </div>

          <p className="text-center text-sm mt-8" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" state={{ from }} className="font-medium" style={{ color: 'var(--gold)' }}>Create one →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const { register } = useAuthStore()

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError('')
    await new Promise(r => setTimeout(r, 700))
    const result = register(form)
    setLoading(false)
    if (result.error) { setApiError(result.error); return }
    navigate(from, { replace: true })
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthColors = ['', '#DC2626', '#D97706', 'var(--sage)']
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong']

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--cream)' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1E1A14 0%, #2d2318 100%)' }}>
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(184,146,42,0.15) 0%, transparent 55%), radial-gradient(circle at 80% 10%, rgba(74,103,65,0.2) 0%, transparent 50%)' }} />
        <Link to="/" className="flex flex-col leading-none relative z-10">
          <span className="font-display text-3xl font-medium" style={{ color: 'var(--gold-bright)', letterSpacing: '0.22em' }}>NAMA</span>
          <span className="text-[9px] tracking-[0.45em] font-sans font-medium" style={{ color: 'rgba(255,255,255,0.4)', marginTop: '-1px' }}>PHARMA</span>
        </Link>
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <p className="font-display font-light mb-6" style={{ fontSize: 'clamp(26px,3vw,40px)', color: '#fff', lineHeight: 1.25 }}>
              Begin your<br /><em className="not-italic" style={{ color: 'var(--gold-bright)' }}>wellness journey.</em>
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Join thousands of men who have transformed their health with Nama Pharma's Ayurvedic formulations.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[['50,000+', 'Happy Customers'], ['4.8★', 'Average Rating'], ['100%', 'Natural Ingredients'], ['2–7 Days', 'Fast Delivery']].map(([val, lbl]) => (
                <motion.div key={lbl} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
                  className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="font-display text-xl" style={{ color: 'var(--gold-bright)' }}>{val}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{lbl}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <p className="text-[11px] relative z-10" style={{ color: 'rgba(255,255,255,0.3)' }}>© 2026 Nama Pharma. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="w-full max-w-md">
          <Link to="/" className="flex flex-col leading-none mb-8 lg:hidden">
            <span className="font-display text-2xl font-medium" style={{ color: 'var(--gold)', letterSpacing: '0.22em' }}>NAMA</span>
            <span className="text-[8px] tracking-[0.45em] font-sans font-medium" style={{ color: 'var(--sage)', marginTop: '-1px' }}>PHARMA</span>
          </Link>

          <h1 className="font-display font-light mb-1" style={{ fontSize: 32, color: 'var(--ink)' }}>Create account</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Join Nama Pharma — it's free</p>

          <AnimatePresence>
            {apiError && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)' }}>
                {apiError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full name" value={form.name} placeholder="Rajesh Kumar"
              onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Field label="Email address" type="email" value={form.email} placeholder="you@example.com"
              onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <Field label="Phone (optional)" value={form.phone} placeholder="9876543210"
              onChange={e => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
            <Field label="Password" type="password" value={form.password} placeholder="Min. 6 characters"
              onChange={e => setForm({ ...form, password: e.target.value })} error={errors.password}
              show={showPw} onToggle={() => setShowPw(!showPw)} />

            {/* Password strength */}
            {form.password.length > 0 && (
              <div className="space-y-1 -mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: i <= strength ? strengthColors[strength] : 'rgba(0,0,0,0.08)' }} />
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
              </div>
            )}

            <Field label="Confirm password" type="password" value={form.confirm} placeholder="Repeat your password"
              onChange={e => setForm({ ...form, confirm: e.target.value })} error={errors.confirm}
              show={showPw} onToggle={() => setShowPw(!showPw)} />

            <p className="text-[11px] leading-relaxed pt-1" style={{ color: 'var(--text-light)' }}>
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="underline">Terms</Link> and{' '}
              <Link to="/privacy" className="underline">Privacy Policy</Link>.
            </p>

            <button type="submit" disabled={loading}
              className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2"
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account…</>
              ) : (
                <>Create Account <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" state={{ from }} className="font-medium" style={{ color: 'var(--gold)' }}>Sign in →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
