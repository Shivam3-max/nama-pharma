import { Link } from 'react-router-dom'
import { Instagram, Youtube, Twitter, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', borderTop: '1px solid rgba(184,146,42,0.15)' }}>
      <div className="container-wide py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex flex-col leading-none mb-6">
              <span className="font-display text-3xl font-medium" style={{ color: 'var(--gold)', letterSpacing: '0.25em' }}>NAMA</span>
              <span className="text-[9px] tracking-[0.5em] font-sans font-light" style={{ color: 'rgba(247,243,237,0.4)' }}>PHARMA</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(247,243,237,0.5)' }}>
              Premium Ayurvedic men's wellness solutions crafted with traditional wisdom and modern quality standards.
            </p>
            <div className="flex gap-4">
              {[Instagram, Youtube, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ border: '1px solid rgba(184,146,42,0.25)', color: 'rgba(247,243,237,0.4)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.color='var(--gold)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(184,146,42,0.25)'; e.currentTarget.style.color='rgba(247,243,237,0.4)' }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase mb-6" style={{ color: 'var(--gold)' }}>Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/shop' },
                { label: 'About Nama Pharma', href: '/about' },
                { label: 'Results & Reviews', href: '/results' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Contact Us', href: '/contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm transition-all hover:pl-2"
                    style={{ color: 'rgba(247,243,237,0.5)' }}
                    onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(247,243,237,0.5)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase mb-6" style={{ color: 'var(--gold)' }}>Customer Support</h4>
            <ul className="space-y-3">
              {[
                { label: 'Track My Order', href: '/track-order' },
                { label: 'Shipping & Returns', href: '/shipping' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Why Goli Bull Night?', href: '/why-goli-bull-night' },
                { label: 'Why Majoon Moosli?', href: '/why-majoon-moosli' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm transition-all"
                    style={{ color: 'rgba(247,243,237,0.5)' }}
                    onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                    onMouseLeave={e => e.target.style.color = 'rgba(247,243,237,0.5)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase mb-6" style={{ color: 'var(--gold)' }}>Contact Us</h4>
            <div className="space-y-4">
              <a href="tel:+919876543210" className="flex items-center gap-3 text-sm" style={{ color: 'rgba(247,243,237,0.5)' }}>
                <Phone size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                +91 98765 43210
              </a>
              <a href="mailto:care@namapharma.com" className="flex items-center gap-3 text-sm" style={{ color: 'rgba(247,243,237,0.5)' }}>
                <Mail size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                care@namapharma.com
              </a>
              <div className="flex items-start gap-3 text-sm" style={{ color: 'rgba(247,243,237,0.5)' }}>
                <MapPin size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
                <span>India · Pan India Delivery</span>
              </div>
            </div>
            <div className="mt-8">
              <div className="text-xs tracking-[0.15em] uppercase mb-3" style={{ color: 'rgba(247,243,237,0.35)' }}>Business Hours</div>
              <div className="text-sm" style={{ color: 'rgba(247,243,237,0.5)' }}>Monday – Saturday<br />9:00 AM – 6:00 PM IST</div>
            </div>
          </div>
        </div>

        <div className="divider-gold my-12" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: 'rgba(247,243,237,0.35)' }}>
            © 2025 Nama Pharma. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs" style={{ color: 'rgba(247,243,237,0.4)' }}>
            <span>✅ 100% Ayurvedic</span>
            <span>✅ Made In India</span>
            <span>✅ Quality Tested</span>
            <span>✅ Secure Payments</span>
          </div>
          <div className="flex items-center gap-3">
            {['UPI', 'COD', 'Visa', 'RazorPay'].map(p => (
              <span key={p} className="text-[10px] px-2 py-1 rounded"
                style={{ background: 'rgba(184,146,42,0.1)', color: 'var(--gold)', border: '1px solid rgba(184,146,42,0.2)', letterSpacing: '0.1em' }}>
                {p}
              </span>
            ))}
          </div>
        </div>

        <p className="text-center text-xs mt-8 leading-relaxed" style={{ color: 'rgba(247,243,237,0.2)' }}>
          * These statements have not been evaluated by any regulatory authority. These products are not intended to diagnose, treat, cure or prevent any disease. Please consult your healthcare practitioner before use.
        </p>
      </div>
    </footer>
  )
}
