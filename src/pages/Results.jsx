import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'

const allReviews = [
  { name: 'Rajesh K.', city: 'Mumbai', rating: 5, text: 'I feel more energetic throughout the day. My performance at work has improved significantly.', product: 'Goli Bull Night', date: 'Nov 2024' },
  { name: 'Amit S.', city: 'Delhi', rating: 5, text: 'Premium quality product and fast delivery. The results after 3 weeks are noticeable.', product: 'Majoon Moosli', date: 'Nov 2024' },
  { name: 'Vikas M.', city: 'Bangalore', rating: 5, text: 'Worth every rupee. The packaging is premium and the product quality matches the price.', product: 'Goli Bull Night', date: 'Oct 2024' },
  { name: 'Pradeep R.', city: 'Hyderabad', rating: 5, text: 'Traditional recipe with modern quality. I love that it uses natural honey as a base.', product: 'Majoon Moosli', date: 'Nov 2024' },
  { name: 'Mahesh T.', city: 'Chennai', rating: 5, text: 'My grandfather used to take Majoon and now I understand why. Great product by Nama Pharma.', product: 'Majoon Moosli', date: 'Oct 2024' },
  { name: 'Kiran B.', city: 'Kolkata', rating: 4, text: 'Authentic formulation. Noticed improvement in my daily energy within 3 weeks.', product: 'Goli Bull Night', date: 'Oct 2024' },
  { name: 'Arjun S.', city: 'Pune', rating: 5, text: 'Excellent product. Fast shipping and great packaging. Would definitely recommend.', product: 'Goli Bull Night', date: 'Sep 2024' },
  { name: 'Dev V.', city: 'Ahmedabad', rating: 5, text: 'Been using for 2 months now. The difference in energy and strength is remarkable.', product: 'Majoon Moosli', date: 'Sep 2024' },
]

const videoPlaceholders = [
  { name: 'Suresh, 38', city: 'Mumbai', caption: 'Lost 6kg and gained stamina in 2 months' },
  { name: 'Rohit, 32', city: 'Delhi', caption: 'Energy levels transformed completely' },
  { name: 'Nitin, 45', city: 'Bangalore', caption: 'Back to feeling 30 at 45!' },
]

export default function Results() {
  return (
    <div className="min-h-screen">
      <section className="section-pad" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(184,146,42,0.08) 0%, transparent 60%)' }}>
        <div className="container-wide text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="section-label">Social Proof</span>
            <h1 className="font-display text-5xl md:text-6xl font-light mt-4 mb-4">
              Trusted by Customers <span className="gold-text-static italic">Across India</span>
            </h1>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Real results from real customers. Over 10,000 men trust Nama Pharma for their wellness journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-12" style={{ borderTop: '1px solid rgba(184,146,42,0.1)', borderBottom: '1px solid rgba(184,146,42,0.1)', background: 'rgba(184,146,42,0.03)' }}>
        <div className="container-wide grid grid-cols-3 gap-6 text-center">
          {[{ v: '10,000+', l: 'Happy Customers' }, { v: '4.8/5', l: 'Average Rating' }, { v: '98%', l: 'Satisfied' }].map((s, i) => (
            <div key={i}>
              <div className="font-display text-3xl md:text-4xl" style={{ color: 'var(--gold)' }}>{s.v}</div>
              <div className="text-xs tracking-wider uppercase mt-1" style={{ color: 'var(--text-muted)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="section-pad">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="section-label">Video Stories</span>
            <h2 className="font-display text-4xl font-light mt-4">Customer <span className="gold-text-static italic">Video Reviews</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {videoPlaceholders.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden group cursor-pointer"
                style={{ border: '1px solid rgba(184,146,42,0.15)' }}
              >
                <div className="relative img-placeholder" style={{ minHeight: 240 }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ background: 'rgba(184,146,42,0.15)', border: '2px solid rgba(184,146,42,0.4)' }}>
                      <Play size={24} fill="currentColor" style={{ color: 'var(--gold)', marginLeft: 3 }} />
                    </div>
                    <span className="text-xs opacity-50">Video Testimonial Placeholder</span>
                  </div>
                </div>
                <div className="p-5" style={{ background: 'var(--cream)' }}>
                  <div className="stars text-xs mb-2">★★★★★</div>
                  <div className="font-medium text-sm">{v.name} — {v.city}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>"{v.caption}"</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Written Reviews */}
          <div className="text-center mb-12">
            <span className="section-label">Written Reviews</span>
            <h2 className="font-display text-4xl font-light mt-4">What Customers <span className="gold-text-static italic">Are Saying</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allReviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="card-light p-6 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="stars text-sm">{'★'.repeat(r.rating)}</div>
                  <span className="badge-gold text-[9px]">{r.product}</span>
                </div>
                <p className="text-sm leading-relaxed italic mb-4" style={{ color: 'var(--text-muted)' }}>"{r.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-display" style={{ background: 'rgba(184,146,42,0.1)', color: 'var(--gold)' }}>{r.name[0]}</div>
                    <div>
                      <div className="text-xs font-medium">{r.name}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{r.city}</div>
                    </div>
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{r.date}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ background: 'var(--cream-deep)' }}>
        <div className="container-wide text-center">
          <h2 className="font-display text-4xl mb-6">Ready to Write Your <span className="gold-text-static italic">Success Story?</span></h2>
          <Link to="/shop" className="btn-gold py-4 px-10 text-sm inline-flex items-center gap-2">
            Shop Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}
