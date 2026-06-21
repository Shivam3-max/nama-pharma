import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Target, Heart, Star, Shield } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-pad" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(184,146,42,0.08) 0%, transparent 60%)' }}>
        <div className="container-wide text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="section-label">Our Story</span>
            <h1 className="font-display text-5xl md:text-7xl font-light mt-4 mb-6">
              About <span className="gold-text-static italic">Nama Pharma</span>
            </h1>
            <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Founded with a mission to bring the timeless wisdom of Ayurveda into modern lifestyles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-pad pt-0">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="aspect-square rounded-2xl img-placeholder" style={{ minHeight: 460 }}>
                <div className="flex flex-col items-center gap-3 text-center">
                  <span style={{ fontSize: 64 }}>🏭</span>
                  <span className="font-display text-2xl" style={{ color: 'rgba(184,146,42,0.4)' }}>Manufacturing Facility</span>
                  <span className="text-xs opacity-40">Place facility image here</span>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <span className="section-label">Who We Are</span>
              <h2 className="font-display text-4xl md:text-5xl font-light mt-4 mb-6">
                A Mission Rooted in<br /><span className="gold-text-static italic">Ancient Wisdom</span>
              </h2>
              <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                Nama Pharma was founded with a simple mission: to bring the timeless wisdom of Ayurveda into modern lifestyles through premium quality wellness products.
              </p>
              <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                Our formulations combine traditional Ayurvedic knowledge with quality-focused manufacturing standards to create products people can trust.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                Today, Nama Pharma serves customers across India who seek natural wellness solutions for their everyday lives — men who demand the best from themselves and from the products they choose.
              </p>
              <Link to="/shop" className="btn-gold py-4 px-8 text-sm inline-flex items-center gap-2">
                Explore Our Products <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To make premium Ayurvedic wellness accessible to every modern man across India.' },
              { icon: Heart, title: 'Our Values', desc: 'Quality, transparency, and genuine care for every customer who trusts us.' },
              { icon: Star, title: 'Our Promise', desc: 'Products that work as promised, backed by traditional formulations and quality standards.' },
              { icon: Shield, title: 'Our Commitment', desc: 'Never compromise on ingredient quality, manufacturing standards, or customer satisfaction.' },
            ].map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="card-light p-8 rounded-2xl">
                <v.icon size={28} style={{ color: 'var(--gold)' }} className="mb-4" />
                <h3 className="font-display text-xl mb-3">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Journey */}
          <div className="text-center mb-16">
            <span className="section-label">Our Journey</span>
            <h2 className="font-display text-4xl md:text-5xl font-light mt-4">The Nama Pharma <span className="gold-text-static italic">Timeline</span></h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, var(--gold), transparent)' }} />
            {[
              { year: '2020', title: 'Founded', desc: 'Nama Pharma was established with a vision to modernize Ayurvedic wellness.' },
              { year: '2021', title: 'First Product', desc: 'Launched Goli Bull Night after 18 months of formulation and testing.' },
              { year: '2022', title: 'Pan India', desc: 'Expanded delivery to all 28 states with COD availability.' },
              { year: '2023', title: 'Majoon Moosli', desc: 'Launched our traditional Majoon Moosli formula, inspired by centuries-old recipes.' },
              { year: '2024', title: '10,000+ Customers', desc: 'Reached milestone of 10,000 happy customers with 4.8 average rating.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`flex items-center gap-8 mb-10 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="card-light p-6 rounded-xl">
                    <div className="font-display text-lg mb-1" style={{ color: 'var(--gold)' }}>{item.year}</div>
                    <div className="font-medium mb-2">{item.title}</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full flex-shrink-0 z-10" style={{ background: 'var(--gold)', boxShadow: '0 0 16px rgba(184,146,42,0.6)' }} />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ background: 'var(--cream-deep)' }}>
        <div className="container-wide text-center">
          <h2 className="font-display text-4xl md:text-5xl font-light mb-6">
            Join the <span className="gold-text-static italic">Nama Pharma</span> Family
          </h2>
          <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
            Over 10,000 men across India trust Nama Pharma for their wellness journey. Join them today.
          </p>
          <Link to="/shop" className="btn-gold py-4 px-10 text-sm inline-flex items-center gap-2">
            Shop Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}
