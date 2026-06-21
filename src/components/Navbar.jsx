import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, ChevronDown, User, Package, LogOut } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Why Us', dropdown: [
    { label: 'Why Goli Bull Night', href: '/why-goli-bull-night' },
    { label: 'Why Majoon Moosli',  href: '/why-majoon-moosli'  },
  ]},
  { label: 'Results', href: '/results' },
  { label: 'About',   href: '/about'   },
  { label: 'FAQ',     href: '/faq'     },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [dropdown,    setDropdown]    = useState(null)
  const [userMenu,    setUserMenu]    = useState(false)
  const userMenuRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { itemCount, openCart } = useCartStore()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenu(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setDropdown(null) }, [location])

  if (location.pathname.startsWith('/admin')) return null

  return (
    <>
      {/* Announcement bar */}
      <div style={{ background: 'var(--sage)', borderBottom: '1px solid rgba(74,103,65,0.2)' }}>
        <div className="overflow-hidden">
          <div className="marquee-inner py-2">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="flex items-center gap-10 px-10 text-xs tracking-widest" style={{ color: 'rgba(255,255,255,0.9)' }}>
                <span>✦ FREE SHIPPING ABOVE ₹999</span>
                <span>✦ BUY 2 GET 1 FREE — LIMITED TIME</span>
                <span>✦ 100% AYURVEDIC · QUALITY TESTED</span>
                <span>✦ COD AVAILABLE PAN INDIA</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(247,243,237,0.96)' : 'rgba(247,243,237,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(184,146,42,0.14)',
          boxShadow: scrolled ? '0 4px 24px rgba(30,26,20,0.07)' : 'none',
        }}
      >
        <div className="container-wide flex items-center justify-between py-4">

          {/* Logo */}
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-display text-2xl font-medium" style={{ color: 'var(--gold)', letterSpacing: '0.22em' }}>NAMA</span>
            <span className="text-[8px] tracking-[0.45em] font-sans font-medium" style={{ color: 'var(--sage)', marginTop: '-1px' }}>PHARMA</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <div key={link.label} className="relative"
                onMouseEnter={() => link.dropdown && setDropdown(link.label)}
                onMouseLeave={() => setDropdown(null)}
              >
                {link.dropdown ? (
                  <button className="flex items-center gap-1 text-sm font-medium transition-colors"
                    style={{ color: dropdown === link.label ? 'var(--sage)' : 'var(--ink-soft)' }}
                  >
                    {link.label} <ChevronDown size={13} />
                  </button>
                ) : (
                  <Link to={link.href}
                    className="text-sm font-medium transition-colors relative group"
                    style={{ color: location.pathname === link.href ? 'var(--sage)' : 'var(--ink-soft)' }}
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                      style={{ background: 'var(--gold)' }} />
                  </Link>
                )}

                <AnimatePresence>
                  {link.dropdown && dropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 rounded-xl overflow-hidden"
                      style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.15)', boxShadow: '0 16px 48px rgba(30,26,20,0.12)' }}
                    >
                      {link.dropdown.map(item => (
                        <Link key={item.href} to={item.href}
                          className="block px-5 py-3.5 text-sm transition-all"
                          style={{ color: 'var(--ink-soft)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                          onMouseEnter={e => { e.target.style.background = 'var(--sage-pale)'; e.target.style.color = 'var(--sage)' }}
                          onMouseLeave={e => { e.target.style.background = ''; e.target.style.color = 'var(--ink-soft)' }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link to="/shop" className="hidden lg:block btn-gold text-xs py-3 px-6">
              Shop Now
            </Link>

            {/* Cart */}
            <button onClick={openCart} className="relative p-2.5 rounded-xl transition-colors hover:bg-cream-deep"
              style={{ color: 'var(--ink-soft)' }}>
              <ShoppingCart size={19} />
              {itemCount > 0 && (
                <motion.span key={itemCount} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: 'var(--sage)' }}
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <div className="relative hidden lg:block" ref={userMenuRef}>
                <button onClick={() => setUserMenu(!userMenu)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-display font-medium transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, var(--gold-pale), var(--cream-deep))', border: '1.5px solid rgba(184,146,42,0.3)', color: 'var(--gold)' }}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden"
                      style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.15)', boxShadow: '0 16px 48px rgba(30,26,20,0.12)' }}>
                      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                        <p className="text-sm font-medium" style={{ color: 'var(--ink)' }}>{user.name}</p>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                      </div>
                      {[
                        { label: 'My Account', icon: User, to: '/account' },
                        { label: 'My Orders', icon: Package, to: '/account' },
                      ].map(({ label, icon: Icon, to }) => (
                        <Link key={label} to={to} onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-cream"
                          style={{ color: 'var(--ink-soft)' }}>
                          <Icon size={13} style={{ color: 'var(--text-muted)' }} /> {label}
                        </Link>
                      ))}
                      <button onClick={() => { logout(); setUserMenu(false); navigate('/') }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm border-t transition-all hover:bg-red-50"
                        style={{ color: '#DC2626', borderColor: 'rgba(0,0,0,0.06)' }}>
                        <LogOut size={13} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden lg:flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5"
                style={{ border: '1.5px solid rgba(184,146,42,0.25)', color: 'var(--gold)', background: 'var(--gold-pale)' }}>
                <User size={12} /> Sign In
              </Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl transition-colors hover:bg-cream-deep"
              style={{ color: 'var(--ink-soft)' }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t"
              style={{ borderColor: 'rgba(184,146,42,0.1)', background: '#fff' }}
            >
              <div className="container-wide py-5 space-y-1">
                {navLinks.map(link => (
                  <div key={link.label}>
                    {link.dropdown ? (
                      <>
                        <div className="text-sm font-semibold px-3 py-2" style={{ color: 'var(--sage)' }}>{link.label}</div>
                        {link.dropdown.map(item => (
                          <Link key={item.href} to={item.href}
                            className="block text-sm px-6 py-2.5 rounded-lg"
                            style={{ color: 'var(--ink-soft)' }}
                          >
                            → {item.label}
                          </Link>
                        ))}
                      </>
                    ) : (
                      <Link to={link.href}
                        className="block text-sm font-medium px-3 py-2.5 rounded-lg"
                        style={{ color: 'var(--ink)' }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 space-y-2">
                  <Link to="/shop" className="btn-gold w-full text-center block text-sm">Shop Now</Link>
                  {user ? (
                    <div className="flex gap-2">
                      <Link to="/account" className="flex-1 py-2.5 rounded-xl text-center text-sm"
                        style={{ background: 'var(--gold-pale)', color: 'var(--gold)', border: '1px solid rgba(184,146,42,0.2)' }}>
                        My Account
                      </Link>
                      <button onClick={() => { logout(); setMobileOpen(false) }}
                        className="flex-1 py-2.5 rounded-xl text-sm"
                        style={{ background: 'rgba(220,38,38,0.06)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)' }}>
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Link to="/login" className="flex-1 py-2.5 rounded-xl text-center text-sm"
                        style={{ background: 'var(--gold-pale)', color: 'var(--gold)', border: '1px solid rgba(184,146,42,0.2)' }}>
                        Sign In
                      </Link>
                      <Link to="/register" className="flex-1 py-2.5 rounded-xl text-center text-sm btn-sage">
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
