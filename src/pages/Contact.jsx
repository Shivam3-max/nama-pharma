import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MessageCircle, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent! We\'ll get back to you within 2 hours.')
    setForm({ name: '', phone: '', email: '', message: '' })
  }

  return (
    <div className="min-h-screen">
      <section className="section-pad" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(184,146,42,0.08) 0%, transparent 60%)' }}>
        <div className="container-wide text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="section-label">Get In Touch</span>
            <h1 className="font-display text-5xl md:text-6xl font-light mt-4 mb-4">
              We're Here <span className="gold-text-static italic">To Help</span>
            </h1>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Have a question about our products, your order, or anything else? We're ready to help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact methods */}
            <div>
              <h2 className="font-display text-3xl mb-8">Contact Details</h2>
              <div className="space-y-5">
                {[
                  { icon: Phone, label: 'Phone / WhatsApp', value: '+91 98765 43210', href: 'tel:+919876543210', desc: 'Call or WhatsApp us for quick help' },
                  { icon: Mail, label: 'Email', value: 'care@namapharma.com', href: 'mailto:care@namapharma.com', desc: 'We respond within 2 business hours' },
                  { icon: MessageCircle, label: 'WhatsApp Chat', value: 'Chat Now', href: 'https://wa.me/919876543210', desc: 'Fastest way to reach us' },
                ].map(({ icon: Icon, label, value, href, desc }, i) => (
                  <motion.a key={i} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-5 p-6 rounded-2xl card-light group"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-gold-500/15"
                      style={{ background: 'rgba(184,146,42,0.08)', border: '1px solid rgba(184,146,42,0.2)' }}>
                      <Icon size={20} style={{ color: 'var(--gold)' }} />
                    </div>
                    <div>
                      <div className="text-xs tracking-wider uppercase mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
                      <div className="font-medium">{value}</div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{desc}</div>
                    </div>
                  </motion.a>
                ))}

                {/* Hours */}
                <div className="p-6 rounded-2xl card-light">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(184,146,42,0.08)', border: '1px solid rgba(184,146,42,0.2)' }}>
                      <Clock size={20} style={{ color: 'var(--gold)' }} />
                    </div>
                    <div>
                      <div className="text-xs tracking-wider uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Business Hours</div>
                      <div className="font-medium">Monday – Saturday</div>
                      <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>9:00 AM – 6:00 PM IST</div>
                      <div className="text-xs mt-2" style={{ color: 'rgba(255,100,100,0.7)' }}>Closed on Sundays &amp; National Holidays</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="card-light p-8 rounded-2xl">
                <h2 className="font-display text-3xl mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Your Name *</label>
                      <input className="input-light w-full rounded-lg" placeholder="Rajesh Kumar" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Phone Number</label>
                      <input className="input-light w-full rounded-lg" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Email Address *</label>
                    <input type="email" className="input-light w-full rounded-lg" placeholder="you@example.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Your Message *</label>
                    <textarea className="input-light w-full rounded-lg resize-none" rows={5} placeholder="How can we help you?" required value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                  </div>
                  <button type="submit" className="btn-gold w-full py-4 text-sm">
                    <Send size={14} /> Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
