import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function StaticPage({ title, badge, children }) {
  return (
    <div className="min-h-screen">
      <section className="section-pad" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(184,146,42,0.06) 0%, transparent 60%)' }}>
        <div className="container-wide text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {badge && <span className="section-label mb-4 block">{badge}</span>}
            <h1 className="font-display text-5xl md:text-6xl font-light">{title}</h1>
          </motion.div>
        </div>
      </section>
      <section className="section-pad pt-0">
        <div className="container-wide max-w-3xl mx-auto">
          <div className="card-light p-8 md:p-12 rounded-2xl prose-style">
            {children}
          </div>
        </div>
      </section>
    </div>
  )
}

function P({ children }) { return <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{children}</p> }
function H({ children }) { return <h3 className="font-display text-2xl mt-8 mb-3">{children}</h3> }
function Li({ children }) { return <li className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>• {children}</li> }

export function Shipping() {
  return (
    <StaticPage title="Shipping & Returns" badge="Policy">
      <H>Shipping Policy</H>
      <P>Nama Pharma delivers across India. We process all orders within 1-2 business days of order confirmation.</P>
      <H>Delivery Timelines</H>
      <ul className="mb-6">
        <Li><strong style={{color:'var(--gold)'}}>Metro Cities</strong> (Mumbai, Delhi, Bangalore, Chennai, Kolkata): 2-4 business days</Li>
        <Li><strong style={{color:'var(--gold)'}}>Tier 2 Cities</strong>: 3-5 business days</Li>
        <Li><strong style={{color:'var(--gold)'}}>Rest of India</strong>: 5-7 business days</Li>
        <Li><strong style={{color:'var(--gold)'}}>North East India</strong>: 7-10 business days</Li>
      </ul>
      <H>Shipping Charges</H>
      <ul className="mb-6">
        <Li>FREE shipping on orders above ₹999</Li>
        <Li>Metro cities: ₹0 on orders above ₹499</Li>
        <Li>Standard shipping: ₹49-₹129 based on location</Li>
      </ul>
      <H>Cash on Delivery</H>
      <P>COD is available on most pin codes across India. A nominal COD handling fee of ₹29 may apply on some orders. This fee is waived for orders above ₹1,499.</P>
      <H>Return Policy</H>
      <P>We want you to be completely satisfied with your purchase. Returns are accepted under the following conditions:</P>
      <ul className="mb-6">
        <Li>Unopened products in original packaging within 7 days of delivery</Li>
        <Li>Damaged or defective products — report within 48 hours with photos</Li>
        <Li>Wrong product delivered — full refund or replacement within 48 hours of reporting</Li>
      </ul>
      <H>Non-Returnable Items</H>
      <ul className="mb-6">
        <Li>Opened products (for hygiene reasons)</Li>
        <Li>Products without original packaging</Li>
        <Li>Products purchased during clearance sales</Li>
      </ul>
      <H>Refund Process</H>
      <P>Approved refunds are processed within 5-7 business days to your original payment method. COD refunds are processed via bank transfer or UPI within 7-10 business days.</P>
      <P>For returns or refunds, contact us at: <strong style={{color:'var(--gold)'}}>care@namapharma.com</strong> or WhatsApp: <strong style={{color:'var(--gold)'}}>+91 98765 43210</strong></P>
    </StaticPage>
  )
}

export function Privacy() {
  return (
    <StaticPage title="Privacy Policy" badge="Legal">
      <P style={{color:'rgba(168,152,128,0.7)'}}>Last updated: January 1, 2025</P>
      <P>Nama Pharma ("we", "us", or "our") operates namapharma.com. This privacy policy explains how we collect, use, and protect your personal information.</P>
      <H>Information We Collect</H>
      <ul className="mb-6">
        <Li>Personal details (name, phone, email, address) provided during checkout</Li>
        <Li>Order history and purchase preferences</Li>
        <Li>Device information and browsing data (via cookies)</Li>
        <Li>Communication records when you contact us</Li>
      </ul>
      <H>How We Use Your Information</H>
      <ul className="mb-6">
        <Li>To process and fulfill your orders</Li>
        <Li>To send order updates and delivery notifications</Li>
        <Li>To provide customer support</Li>
        <Li>To send promotional offers (with your consent)</Li>
        <Li>To improve our website and services</Li>
      </ul>
      <H>Data Security</H>
      <P>All payment transactions are encrypted using SSL technology. We do not store your card details. Our servers are protected with industry-standard security measures.</P>
      <H>Sharing of Information</H>
      <P>We do not sell, trade, or rent your personal information to third parties. We may share your data with delivery partners strictly for order fulfillment purposes.</P>
      <H>Your Rights</H>
      <ul className="mb-6">
        <Li>Access your personal data</Li>
        <Li>Request correction of inaccurate data</Li>
        <Li>Request deletion of your data</Li>
        <Li>Opt-out of marketing communications</Li>
      </ul>
      <H>Contact</H>
      <P>For privacy-related queries, contact us at: care@namapharma.com</P>
    </StaticPage>
  )
}

export function Terms() {
  return (
    <StaticPage title="Terms & Conditions" badge="Legal">
      <P style={{color:'rgba(168,152,128,0.7)'}}>Last updated: January 1, 2025</P>
      <P>By accessing and using namapharma.com, you accept and agree to these Terms and Conditions. Please read them carefully.</P>
      <H>Products & Use</H>
      <P>All products sold on this website are Ayurvedic wellness supplements. They are not intended to diagnose, treat, cure, or prevent any disease. Results may vary by individual. Always consult a qualified healthcare professional before use, especially if you have pre-existing medical conditions or are taking medications.</P>
      <H>Ordering</H>
      <ul className="mb-6">
        <Li>You must be 18 years or older to place an order</Li>
        <Li>All prices are in Indian Rupees (INR) inclusive of applicable taxes</Li>
        <Li>We reserve the right to refuse or cancel any order at our discretion</Li>
        <Li>Product availability is subject to stock and may change without notice</Li>
      </ul>
      <H>Payments</H>
      <P>All payments are processed securely. For COD orders, payment is collected at the time of delivery. We accept UPI, cards, net banking, and cash on delivery.</P>
      <H>Intellectual Property</H>
      <P>All content on this website including text, graphics, logos, and images are the property of Nama Pharma and are protected by applicable copyright laws. Unauthorized use is prohibited.</P>
      <H>Limitation of Liability</H>
      <P>Nama Pharma is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website beyond the amount paid for the products in question.</P>
      <H>Governing Law</H>
      <P>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in [City], India.</P>
      <H>Contact</H>
      <P>For any queries related to these terms, contact us at: care@namapharma.com</P>
    </StaticPage>
  )
}

export function WhyGoldBull() {
  return (
    <div className="min-h-screen">
      <section className="section-pad" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(184,146,42,0.1) 0%, transparent 60%)' }}>
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="section-label">Why Choose</span>
            <h1 className="font-display text-5xl md:text-7xl font-light mt-4 mb-6">
              Why <span className="gold-text italic">Goli Bull Night?</span>
            </h1>
            <p className="text-base max-w-2xl" style={{ color: 'var(--text-muted)' }}>
              A premium Ayurvedic men's wellness supplement crafted to support vitality, strength, and an active lifestyle — formulated for the modern man.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-wide">
          {[
            { icon: '🐂', title: 'Superior Potency Formula', desc: 'Goli Bull Night combines 6 carefully selected Ayurvedic herbs in optimal ratios, backed by traditional Ayurvedic texts and modern quality standards.' },
            { icon: '🌙', title: 'Nighttime Optimization', desc: 'Designed to work with your body\'s natural nighttime recovery processes. Your body does its best restoration work while you sleep — Goli Bull Night supports this.' },
            { icon: '⚡', title: 'Energy You Can Feel', desc: 'Many customers report noticeable improvement in energy and vitality within 3-4 weeks of consistent use. Experience the difference that premium Ayurvedic herbs can make.' },
            { icon: '🛡️', title: 'No Compromise on Quality', desc: 'Manufactured under strict quality controls. Every batch is tested for purity, potency, and safety before it reaches you.' },
            { icon: '🌿', title: 'Pure Ayurvedic Formula', desc: 'No synthetic additives. No artificial preservatives. Just the power of traditional Ayurvedic herbs — the way nature intended.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6 }}
              className={`flex items-start gap-8 mb-12 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}
            >
              <div className="text-6xl flex-shrink-0 w-24 text-center">{item.icon}</div>
              <div className="card-light p-8 rounded-2xl flex-1">
                <h3 className="font-display text-2xl mb-3">{item.title}</h3>
                <P>{item.desc}</P>
              </div>
            </motion.div>
          ))}
          <div className="text-center mt-8">
            <Link to="/product/goli-bull-night" className="btn-gold py-4 px-10 text-sm inline-flex items-center gap-2">
              Buy Goli Bull Night <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export function WhyMajoon() {
  return (
    <div className="min-h-screen">
      <section className="section-pad" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(184,146,42,0.1) 0%, transparent 60%)' }}>
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="section-label">Why Choose</span>
            <h1 className="font-display text-5xl md:text-7xl font-light mt-4 mb-6">
              Why <span className="gold-text italic">Majoon Moosli?</span>
            </h1>
            <p className="text-base max-w-2xl" style={{ color: 'var(--text-muted)' }}>
              A traditional Ayurvedic formulation enriched with Safed Musli, Ashwagandha and Shatavari — the classical recipe for strength and daily energy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="container-wide">
          {[
            { icon: '🌾', title: 'Centuries of Tradition', desc: 'Majoon preparations have been used in Ayurveda for centuries. Our Majoon Moosli follows the classical formulation, enriched with premium quality herbs sourced from across India.' },
            { icon: '🍯', title: 'Natural Honey Base', desc: 'Unlike capsules, Majoon Moosli uses pure natural honey as a base — an Anupana (carrier) recommended in Ayurvedic texts for enhanced absorption of herbal compounds.' },
            { icon: '☀️', title: 'Morning Energy Formula', desc: 'Designed to kickstart your day. The natural herbs in Majoon Moosli work synergistically to provide sustained energy throughout the day without caffeine or stimulants.' },
            { icon: '💪', title: 'Strength from Nature', desc: 'Safed Musli is one of the most valued herbs in Ayurveda for male strength and vitality. Combined with Ashwagandha and Shatavari, it creates a powerful wellness formula.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6 }}
              className={`flex items-start gap-8 mb-12 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}
            >
              <div className="text-6xl flex-shrink-0 w-24 text-center">{item.icon}</div>
              <div className="card-light p-8 rounded-2xl flex-1">
                <h3 className="font-display text-2xl mb-3">{item.title}</h3>
                <P>{item.desc}</P>
              </div>
            </motion.div>
          ))}
          <div className="text-center mt-8">
            <Link to="/product/majoon-moosli" className="btn-gold py-4 px-10 text-sm inline-flex items-center gap-2">
              Buy Majoon Moosli <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
