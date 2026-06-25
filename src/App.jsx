import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'
import { WhatsAppButton, ExitIntentPopup, ScarcityNotification } from './components/FloatingElements'

import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Results from './pages/Results'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import { Shipping, Privacy, Terms, WhyGoldBull, WhyMajoon } from './pages/StaticPages'
import { BlogList, BlogPost } from './pages/BlogPage'
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, OAuthCallbackPage } from './pages/AuthPage'
import AccountPage from './pages/AccountPage'
import TrackOrderPage from './pages/TrackOrderPage'

import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Orders from './pages/admin/Orders'
import { Products, Customers, Analytics, SEOManager, Coupons, ShippingZones, Inventory, ReviewManager, Blog, EmailCampaigns, AdminSettings, FlashSales, Referrals, Subscriptions, Returns, NotificationsCenter } from './pages/admin/AdminPages'

import { useCartStore } from './store/cartStore'

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const { isOpen, checkoutOpen } = useCartStore()

  return (
    <div className="grain-overlay">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1a1a', color: '#F5F0E8', border: '1px solid rgba(201,168,76,0.3)', fontSize: 13 },
          success: { iconTheme: { primary: '#C9A84C', secondary: '#0a0a0a' } },
        }}
      />

      {!isAdmin && (
        <>
          <CartDrawer />
          <CheckoutModal />
          <WhatsAppButton />
          <ExitIntentPopup />
          <ScarcityNotification />
        </>
      )}

      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="seo" element={<SEOManager />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="shipping" element={<ShippingZones />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reviews" element={<ReviewManager />} />
          <Route path="blog" element={<Blog />} />
          <Route path="email" element={<EmailCampaigns />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="flash-sales" element={<FlashSales />} />
          <Route path="referrals" element={<Referrals />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="returns" element={<Returns />} />
          <Route path="notifications" element={<NotificationsCenter />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/shop" element={<PublicLayout><Shop /></PublicLayout>} />
        <Route path="/product/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/results" element={<PublicLayout><Results /></PublicLayout>} />
        <Route path="/why-goli-bull-night" element={<PublicLayout><WhyGoldBull /></PublicLayout>} />
        <Route path="/why-majoon-moosli" element={<PublicLayout><WhyMajoon /></PublicLayout>} />
        <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/shipping" element={<PublicLayout><Shipping /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><BlogList /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />
        <Route path="/account" element={<PublicLayout><AccountPage /></PublicLayout>} />
        <Route path="/track-order" element={<PublicLayout><TrackOrderPage /></PublicLayout>} />
      </Routes>
    </div>
  )
}
