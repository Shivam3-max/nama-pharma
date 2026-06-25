import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, CheckCircle, Phone, Mail, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

/* ── Shared field component ── */
function Field({ label, type = 'text', value, onChange, placeholder, error, show, onToggle, maxLength }) {
  const isPw = type === 'password'
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{label}</label>
      <div className="relative">
        <input
          type={isPw ? (show ? 'text' : 'password') : type}
          value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
          className="input-light w-full text-sm pr-10"
          style={error ? { borderColor: '#DC2626', boxShadow: '0 0 0 3px rgba(220,38,38,0.08)' } : {}}
        />
        {isPw && (
          <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }}>
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {error && <p className="text-[11px] mt-1" style={{ color: '#DC2626' }}>{error}</p>}
    </div>
  )
}

function Alert({ msg, type = 'error' }) {
  if (!msg) return null
  const styles = {
    error:   { bg: 'rgba(220,38,38,0.08)',   color: '#DC2626',        border: 'rgba(220,38,38,0.15)' },
    success: { bg: 'rgba(74,103,65,0.08)',    color: 'var(--sage)',    border: 'rgba(74,103,65,0.2)' },
    info:    { bg: 'rgba(184,146,42,0.08)',   color: 'var(--gold)',    border: 'rgba(184,146,42,0.2)' },
  }
  const s = styles[type]
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="mb-4 p-3 rounded-xl text-sm" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {msg}
    </motion.div>
  )
}

/* ── Left decorative panel ── */
function LeftPanel({ dark = false, title, subtitle, features, stats }) {
  const bg = dark
    ? 'linear-gradient(160deg, #1E1A14 0%, #2d2318 100%)'
    : 'linear-gradient(160deg, var(--sage) 0%, #2d4a28 100%)'
  return (
    <div className="hidden lg:flex flex-col justify-between w-[44%] p-12 relative overflow-hidden" style={{ background: bg }}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(184,146,42,0.6) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)' }} />
      <Link to="/" className="flex flex-col leading-none relative z-10">
        <span className="font-display text-3xl font-medium" style={{ color: dark ? 'var(--gold-bright)' : 'rgba(255,255,255,0.95)', letterSpacing: '0.22em' }}>NAMA</span>
        <span className="text-[9px] tracking-[0.45em] font-sans font-medium" style={{ color: 'rgba(255,255,255,0.4)', marginTop: '-1px' }}>PHARMA</span>
      </Link>
      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
          <p className="font-display font-light mb-6" style={{ fontSize: 'clamp(26px,3vw,40px)', color: '#fff', lineHeight: 1.25 }}
            dangerouslySetInnerHTML={{ __html: title }} />
          {subtitle && <p className="text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>{subtitle}</p>}
          {features && (
            <div className="space-y-3">
              {features.map((f, i) => (
                <motion.div key={f} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <CheckCircle size={14} style={{ color: 'var(--gold-bright)', flexShrink: 0 }} /> {f}
                </motion.div>
              ))}
            </div>
          )}
          {stats && (
            <div className="grid grid-cols-2 gap-4">
              {stats.map(([val, lbl]) => (
                <motion.div key={lbl} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
                  className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="font-display text-xl" style={{ color: 'var(--gold-bright)' }}>{val}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{lbl}</div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <p className="text-[11px] relative z-10" style={{ color: 'rgba(255,255,255,0.3)' }}>© 2026 Nama Pharma. All rights reserved.</p>
    </div>
  )
}

/* ══════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════ */
export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const from = location.state?.from || '/'
  const { login, sendOtp, verifyOtp } = useAuthStore()

  // Tabs: email | phone
  const [tab, setTab] = useState('email')

  // Email login
  const [form, setForm]   = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)

  // Phone OTP
  const [phone, setPhone]       = useState('')
  const [otp, setOtp]           = useState('')
  const [otpSent, setOtpSent]   = useState(false)
  const [countdown, setCountdown] = useState(0)

  const [loading, setLoading] = useState(false)
  const [alert, setAlert]     = useState({ msg: '', type: 'error' })

  // Show error from Google OAuth redirect
  useEffect(() => {
    const err = searchParams.get('error')
    if (err) setAlert({ msg: err, type: 'error' })
  }, [])

  // OTP countdown timer
  useEffect(() => {
    if (!countdown) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function validateEmail() {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e); return Object.keys(e).length === 0
  }

  async function handleEmailLogin(e) {
    e.preventDefault()
    if (!validateEmail()) return
    setLoading(true); setAlert({ msg: '' })
    const result = await login(form)
    setLoading(false)
    if (result.error) { setAlert({ msg: result.error, type: 'error' }); return }
    navigate(from, { replace: true })
  }

  async function handleSendOtp(e) {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) { setAlert({ msg: 'Enter a valid 10-digit phone number', type: 'error' }); return }
    setLoading(true); setAlert({ msg: '' })
    const result = await sendOtp(digits)
    setLoading(false)
    if (result.error) { setAlert({ msg: result.error, type: 'error' }); return }
    setOtpSent(true); setCountdown(60)
    setAlert({ msg: `OTP sent to +91 ${digits}`, type: 'success' })
  }

  async function handleVerifyOtp(e) {
    e.preventDefault()
    if (otp.length !== 6) { setAlert({ msg: 'Enter the 6-digit OTP', type: 'error' }); return }
    setLoading(true); setAlert({ msg: '' })
    const result = await verifyOtp(phone.replace(/\D/g, ''), otp)
    setLoading(false)
    if (result.error) { setAlert({ msg: result.error, type: 'error' }); return }
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--cream)' }}>
      <LeftPanel
        title='Welcome back,<br/><em class="not-italic" style="color:var(--gold-bright)">good to see you.</em>'
        subtitle="Sign in to track orders, manage subscriptions, and access exclusive member benefits."
        features={['Real-time order tracking', 'Manage subscriptions', 'Exclusive member discounts', 'Priority support']}
      />

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex flex-col leading-none mb-8 lg:hidden">
            <span className="font-display text-2xl font-medium" style={{ color: 'var(--gold)', letterSpacing: '0.22em' }}>NAMA</span>
            <span className="text-[8px] tracking-[0.45em]" style={{ color: 'var(--sage)' }}>PHARMA</span>
          </Link>

          <h1 className="font-display font-light mb-1" style={{ fontSize: 32, color: 'var(--ink)' }}>Sign in</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Access your Nama Pharma account</p>

          {/* Tab switcher */}
          <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'var(--cream-deep)' }}>
            {[['email', <Mail size={13} />, 'Email'], ['phone', <Phone size={13} />, 'Phone OTP']].map(([key, icon, label]) => (
              <button key={key} onClick={() => { setTab(key); setAlert({ msg: '' }) }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all"
                style={tab === key ? { background: '#fff', color: 'var(--ink)', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } : { color: 'var(--text-muted)' }}>
                {icon} {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <Alert msg={alert.msg} type={alert.type} />
          </AnimatePresence>

          {/* Google Login */}
          <a href="/api/auth/google-init.php"
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-sm font-medium mb-4 transition-all hover:-translate-y-0.5"
            style={{ border: '1.5px solid rgba(184,146,42,0.2)', color: 'var(--ink-soft)', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </a>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: 'rgba(184,146,42,0.15)' }} /></div>
            <div className="relative text-center"><span className="px-3 text-xs" style={{ color: 'var(--text-light)', background: 'var(--cream)' }}>or</span></div>
          </div>

          {/* Email login */}
          {tab === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Field label="Email address" type="email" value={form.email} placeholder="you@example.com"
                onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
              <Field label="Password" type="password" value={form.password} placeholder="Your password"
                onChange={e => setForm({ ...form, password: e.target.value })} error={errors.password}
                show={showPw} onToggle={() => setShowPw(!showPw)} />
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs" style={{ color: 'var(--gold)' }}>Forgot password?</Link>
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2" style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in…</> : <>Sign In <ArrowRight size={14} /></>}
              </button>
            </form>
          )}

          {/* Phone OTP login */}
          {tab === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-muted)' }}>Mobile Number</label>
                    <div className="flex gap-2">
                      <span className="input-light w-14 text-center text-sm flex-shrink-0" style={{ cursor: 'default' }}>+91</span>
                      <input type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210" className="input-light flex-1 text-sm" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2" style={{ opacity: loading ? 0.7 : 1 }}>
                    {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</> : <>Send OTP <ArrowRight size={14} /></>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-muted)' }}>Enter OTP sent to +91 {phone}</label>
                    <input type="tel" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="● ● ● ● ● ●" className="input-light w-full text-center text-xl tracking-[0.5em]" />
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <button type="button" onClick={() => { setOtpSent(false); setOtp(''); setAlert({ msg: '' }) }}
                      className="flex items-center gap-1" style={{ color: 'var(--gold)' }}>
                      <ArrowLeft size={11} /> Change number
                    </button>
                    {countdown > 0
                      ? <span>Resend in {countdown}s</span>
                      : <button type="button" onClick={handleSendOtp} style={{ color: 'var(--gold)' }}>Resend OTP</button>
                    }
                  </div>
                  <button type="submit" disabled={loading || otp.length !== 6} className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2" style={{ opacity: (loading || otp.length !== 6) ? 0.7 : 1 }}>
                    {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying…</> : <>Verify & Sign In <ArrowRight size={14} /></>}
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" state={{ from }} className="font-medium" style={{ color: 'var(--gold)' }}>Create one →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   REGISTER PAGE
══════════════════════════════════════ */
export function RegisterPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from || '/'
  const { register } = useAuthStore()

  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert]   = useState({ msg: '', type: 'error' })

  function validate() {
    const e = {}
    if (!form.name.trim())  e.name = 'Name is required'
    if (!form.email)        e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number'
    if (!form.password)     e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e); return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true); setAlert({ msg: '' })
    const result = await register(form)
    setLoading(false)
    if (result.error) { setAlert({ msg: result.error, type: 'error' }); return }
    navigate(from, { replace: true })
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
  const strengthColors = ['', '#DC2626', '#D97706', 'var(--sage)']
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong']

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--cream)' }}>
      <LeftPanel dark
        title='Begin your<br/><em class="not-italic" style="color:var(--gold-bright)">wellness journey.</em>'
        subtitle="Join thousands of men who've transformed their health with Ayurvedic science."
        stats={[['50,000+', 'Happy Customers'], ['4.8★', 'Avg. Rating'], ['100%', 'Natural'], ['2–7 Days', 'Delivery']]}
      />

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <Link to="/" className="flex flex-col leading-none mb-8 lg:hidden">
            <span className="font-display text-2xl font-medium" style={{ color: 'var(--gold)', letterSpacing: '0.22em' }}>NAMA</span>
            <span className="text-[8px] tracking-[0.45em]" style={{ color: 'var(--sage)' }}>PHARMA</span>
          </Link>

          <h1 className="font-display font-light mb-1" style={{ fontSize: 32, color: 'var(--ink)' }}>Create account</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Join Nama Pharma — it's free</p>

          {/* Google signup */}
          <a href="/api/auth/google-init.php"
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-sm font-medium mb-4 transition-all hover:-translate-y-0.5"
            style={{ border: '1.5px solid rgba(184,146,42,0.2)', color: 'var(--ink-soft)', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign up with Google
          </a>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: 'rgba(184,146,42,0.15)' }} /></div>
            <div className="relative text-center"><span className="px-3 text-xs" style={{ color: 'var(--text-light)', background: 'var(--cream)' }}>or sign up with email</span></div>
          </div>

          <AnimatePresence><Alert msg={alert.msg} type={alert.type} /></AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full name" value={form.name} placeholder="Rajesh Kumar" onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Field label="Email address" type="email" value={form.email} placeholder="you@example.com" onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <Field label="Phone (optional)" value={form.phone} placeholder="9876543210" maxLength={10} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} error={errors.phone} />
            <Field label="Password" type="password" value={form.password} placeholder="Min. 6 characters" onChange={e => setForm({ ...form, password: e.target.value })} error={errors.password} show={showPw} onToggle={() => setShowPw(!showPw)} />
            {form.password.length > 0 && (
              <div className="space-y-1 -mt-2">
                <div className="flex gap-1">{[1,2,3].map(i => <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ background: i <= strength ? strengthColors[strength] : 'rgba(0,0,0,0.08)' }} />)}</div>
                <p className="text-[11px]" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
              </div>
            )}
            <Field label="Confirm password" type="password" value={form.confirm} placeholder="Repeat password" onChange={e => setForm({ ...form, confirm: e.target.value })} error={errors.confirm} show={showPw} onToggle={() => setShowPw(!showPw)} />
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-light)' }}>
              By creating an account you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
            </p>
            <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account…</> : <>Create Account <ArrowRight size={14} /></>}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" state={{ from }} className="font-medium" style={{ color: 'var(--gold)' }}>Sign in →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   FORGOT PASSWORD PAGE
══════════════════════════════════════ */
export function ForgotPasswordPage() {
  const { forgotPassword } = useAuthStore()
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) { setError('Enter your email address'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return }
    setLoading(true); setError('')
    await forgotPassword(email) // Always succeeds (prevents enumeration)
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--cream)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <Link to="/login" className="flex items-center gap-1.5 text-xs mb-8" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={12} /> Back to Sign In
        </Link>

        <div className="text-4xl mb-4">🔐</div>
        <h1 className="font-display font-light text-2xl mb-1" style={{ color: 'var(--ink)' }}>Forgot password?</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>We'll send a reset link to your email.</p>

        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl text-center" style={{ background: 'rgba(74,103,65,0.08)', border: '1px solid rgba(74,103,65,0.2)' }}>
            <div className="text-3xl mb-3">📧</div>
            <p className="font-medium text-sm mb-1" style={{ color: 'var(--sage)' }}>Check your inbox</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              If <strong>{email}</strong> is registered, you'll receive a reset link within a few minutes. Check your spam folder too.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence><Alert msg={error} type="error" /></AnimatePresence>
            <Field label="Email address" type="email" value={email} placeholder="you@example.com" onChange={e => setEmail(e.target.value)} error={''} />
            <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2" style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</> : <>Send Reset Link <ArrowRight size={14} /></>}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════
   RESET PASSWORD PAGE  (/reset-password?token=xxx)
══════════════════════════════════════ */
export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const { resetPassword } = useAuthStore()

  const [form, setForm]     = useState({ password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert]   = useState({ msg: '', type: 'error' })

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password.length < 6) { setAlert({ msg: 'Password must be at least 6 characters', type: 'error' }); return }
    if (form.password !== form.confirm) { setAlert({ msg: 'Passwords do not match', type: 'error' }); return }
    setLoading(true); setAlert({ msg: '' })
    const result = await resetPassword(token, form.password)
    setLoading(false)
    if (result.error) { setAlert({ msg: result.error, type: 'error' }); return }
    navigate('/', { replace: true })
  }

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--cream)' }}>
      <div className="text-center">
        <div className="text-5xl mb-4">❌</div>
        <p className="font-display text-xl mb-3" style={{ color: 'var(--ink)' }}>Invalid reset link</p>
        <Link to="/forgot-password" className="btn-gold py-2.5 px-6 text-xs inline-flex items-center gap-1.5">Request a new link</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--cream)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-4xl mb-4">🔑</div>
        <h1 className="font-display font-light text-2xl mb-1" style={{ color: 'var(--ink)' }}>Set new password</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Choose a strong password for your account.</p>
        <AnimatePresence><Alert msg={alert.msg} type={alert.type} /></AnimatePresence>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="New password" type="password" value={form.password} placeholder="Min. 6 characters"
            onChange={e => setForm({ ...form, password: e.target.value })} show={showPw} onToggle={() => setShowPw(!showPw)} />
          <Field label="Confirm new password" type="password" value={form.confirm} placeholder="Repeat password"
            onChange={e => setForm({ ...form, confirm: e.target.value })} show={showPw} onToggle={() => setShowPw(!showPw)} />
          <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2" style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</> : <>Save New Password <ArrowRight size={14} /></>}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════
   GOOGLE OAUTH CALLBACK PAGE  (/auth/callback)
   Reads token from URL hash, stores it, redirects home
══════════════════════════════════════ */
export function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuthStore()

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const token = hash.get('token')
    const userRaw = hash.get('user')
    if (token && userRaw) {
      try {
        const user = JSON.parse(decodeURIComponent(userRaw))
        loginWithToken(token, user)
        navigate('/', { replace: true })
      } catch {
        navigate('/login?error=Google+login+failed', { replace: true })
      }
    } else {
      navigate('/login?error=Google+login+failed', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--gold)' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Completing sign in…</p>
      </div>
    </div>
  )
}
