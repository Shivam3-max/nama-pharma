import { useState } from 'react'
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Truck,
  Star, FileText, BarChart2, Search, Settings, LogOut,
  Menu, Globe, Mail, Archive, Bell, ExternalLink,
  Zap, Gift, RefreshCw, RotateCcw, MessageSquare
} from 'lucide-react'

const navGroups = [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard',      icon: LayoutDashboard, href: '/admin' },
      { label: 'Orders',         icon: ShoppingBag,     href: '/admin/orders' },
      { label: 'Products',       icon: Package,         href: '/admin/products' },
      { label: 'Inventory',      icon: Archive,         href: '/admin/inventory' },
      { label: 'Customers',      icon: Users,           href: '/admin/customers' },
    ]
  },
  {
    label: 'Marketing',
    items: [
      { label: 'Analytics',      icon: BarChart2,       href: '/admin/analytics' },
      { label: 'Coupons',        icon: Tag,             href: '/admin/coupons' },
      { label: 'Flash Sales',    icon: Zap,             href: '/admin/flash-sales' },
      { label: 'Email Campaigns',icon: Mail,            href: '/admin/email' },
      { label: 'Referrals',      icon: Gift,            href: '/admin/referrals' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { label: 'Subscriptions',  icon: RefreshCw,       href: '/admin/subscriptions' },
      { label: 'Returns',        icon: RotateCcw,       href: '/admin/returns' },
      { label: 'Shipping Zones', icon: Truck,           href: '/admin/shipping' },
      { label: 'Reviews',        icon: Star,            href: '/admin/reviews' },
    ]
  },
  {
    label: 'Content & Config',
    items: [
      { label: 'Blog',           icon: FileText,        href: '/admin/blog' },
      { label: 'SEO Manager',    icon: Globe,           href: '/admin/seo' },
      { label: 'Notifications',  icon: Bell,            href: '/admin/notifications' },
      { label: 'Settings',       icon: Settings,        href: '/admin/settings' },
    ]
  },
]

const navItems = navGroups.flatMap(g => g.items)

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen flex" style={{ background: '#F3F4F6' }}>
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 top-0 h-full z-50 flex flex-col overflow-hidden"
        style={{ background: '#fff', borderRight: '1px solid rgba(184,146,42,0.12)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 h-16" style={{ borderBottom: '1px solid rgba(184,146,42,0.1)' }}>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col leading-none">
                <span className="font-display text-lg font-medium" style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}>NAMA</span>
                <span className="text-[8px] tracking-[0.4em]" style={{ color: 'var(--text-muted)' }}>ADMIN</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-white/5 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
            <Menu size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          {navGroups.map(group => (
            <div key={group.label} className="mb-3">
              {!collapsed && (
                <div className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: 'var(--text-light)' }}>
                  {group.label}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const active = location.pathname === item.href
                  return (
                    <Link key={item.href} to={item.href}
                      className={`admin-sidebar-item ${active ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`}
                      title={collapsed ? item.label : undefined}>
                      <item.icon size={15} className="flex-shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} className="text-sm">
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 space-y-1" style={{ borderTop: '1px solid rgba(184,146,42,0.1)' }}>
          <Link to="/" target="_blank"
            className={`admin-sidebar-item ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? 'View Store' : undefined}
          >
            <ExternalLink size={16} className="flex-shrink-0" />
            {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm">View Store</motion.span>}
          </Link>
          <button className={`admin-sidebar-item w-full ${collapsed ? 'justify-center' : ''}`} style={{ color: 'rgba(255,100,100,0.6)' }}>
            <LogOut size={16} className="flex-shrink-0" />
            {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm">Logout</motion.span>}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <motion.main animate={{ marginLeft: collapsed ? 72 : 240 }} transition={{ duration: 0.3 }} className="flex-1 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 h-16 flex items-center justify-between px-6"
          style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input className="pl-8 pr-4 py-2 text-xs rounded-lg w-48" placeholder="Search anything..."
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(184,146,42,0.12)', color: 'var(--text-primary)', outline: 'none' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-display"
              style={{ background: 'rgba(184,146,42,0.15)', color: 'var(--gold)', border: '1px solid rgba(184,146,42,0.3)' }}>
              A
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}
