import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const categories = ['All', 'Products', 'Shipping', 'Returns', 'Payments', 'Usage']

const faqs = [
  { q: 'Are Nama Pharma products 100% Ayurvedic?', a: 'Yes. All our formulations are based on traditional Ayurvedic ingredients. We do not use synthetic additives or artificial preservatives. Every ingredient is sourced with quality in mind.', cat: 'Products' },
  { q: 'Who can use Goli Bull Night and Majoon Moosli?', a: 'Our products are designed for adult men aged 18 and above who are looking for wellness, vitality and active lifestyle support. If you have pre-existing medical conditions or are on medication, please consult a healthcare provider before use.', cat: 'Products' },
  { q: 'How long before I see results?', a: 'Results vary by individual. Most customers notice positive changes in energy and vitality within 3-4 weeks of consistent use. For best results, we recommend using the product for a minimum of 2-3 months.', cat: 'Products' },
  { q: 'Can I use both products together?', a: 'Yes! Goli Bull Night and Majoon Moosli complement each other. Goli Bull Night is ideal for nighttime use while Majoon Moosli is a morning formulation. Together they provide round-the-clock wellness support.', cat: 'Products' },
  { q: 'Are there any side effects?', a: 'Our products use traditional Ayurvedic ingredients with a long history of safe use. However, individual reactions can vary. Start with the recommended dose and monitor your body. Discontinue use if you experience any adverse reactions.', cat: 'Products' },
  { q: 'Do you ship across India?', a: 'Yes! We deliver Pan India, including remote areas. Most major cities receive delivery within 2-4 business days. Remote areas may take 5-7 business days.', cat: 'Shipping' },
  { q: 'How much is the shipping fee?', a: 'Shipping is FREE on orders above ₹999. For orders below ₹999, a nominal shipping charge of ₹49-₹129 applies depending on your location.', cat: 'Shipping' },
  { q: 'Do you offer Cash on Delivery?', a: 'Yes! We offer COD (Cash on Delivery) across most pin codes in India. UPI, cards, and net banking are also available.', cat: 'Payments' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, and Cash on Delivery. All online payments are secured and encrypted.', cat: 'Payments' },
  { q: 'What is your return policy?', a: 'We offer a 7-day return policy on unopened, unused products in original packaging. Opened products cannot be returned due to hygiene reasons. For quality defects, please contact us within 48 hours of delivery.', cat: 'Returns' },
  { q: 'How do I contact customer support?', a: 'You can reach us via WhatsApp at +91 98765 43210, email at care@namapharma.com, or call us Monday-Saturday 9AM-6PM IST. We typically respond within 2 hours during business hours.', cat: 'Returns' },
  { q: 'How should I take Goli Bull Night?', a: 'Take 1-2 capsules with warm milk before bedtime, or as directed by your Ayurvedic practitioner. Do not exceed the recommended dose.', cat: 'Usage' },
  { q: 'How should I take Majoon Moosli?', a: 'Take 1 teaspoon (5-10g) with warm milk in the morning, or as directed. Can be taken twice daily (morning and evening) for best results. Mix well in warm milk before drinking.', cat: 'Usage' },
  { q: 'Should I take it with food or empty stomach?', a: 'Goli Bull Night is best taken with warm milk before bedtime. Majoon Moosli is typically taken after breakfast with warm milk. Avoid taking on a completely empty stomach.', cat: 'Usage' },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card-light rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left gap-4">
        <span className="font-medium text-sm">{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-xl flex-shrink-0" style={{ color: 'var(--gold)' }}>+</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="px-6 pb-6 text-sm leading-relaxed pt-2" style={{ color: 'var(--text-muted)', borderTop: '1px solid rgba(184,146,42,0.08)' }}>
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? faqs : faqs.filter(f => f.cat === cat)

  return (
    <div className="min-h-screen">
      <section className="section-pad" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(184,146,42,0.08) 0%, transparent 60%)' }}>
        <div className="container-wide text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="section-label">Help Center</span>
            <h1 className="font-display text-5xl md:text-6xl font-light mt-4 mb-4">
              Frequently Asked <span className="gold-text-static italic">Questions</span>
            </h1>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Everything you need to know about our products, shipping, payments and more.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-wide max-w-3xl mx-auto">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: cat === c ? 'rgba(184,146,42,0.15)' : 'var(--cream)',
                  border: `1px solid ${cat === c ? 'rgba(184,146,42,0.5)' : 'rgba(0,0,0,0.07)'}`,
                  color: cat === c ? 'var(--gold)' : 'var(--text-muted)',
                }}
              >{c}</button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>

          <div className="mt-16 p-8 rounded-2xl text-center card-light">
            <h3 className="font-display text-2xl mb-3">Still Have Questions?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Our customer care team is here to help you.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn-gold py-3 px-8 text-sm">Chat on WhatsApp</a>
              <a href="mailto:care@namapharma.com" className="btn-outline-gold py-3 px-8 text-sm">Email Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
