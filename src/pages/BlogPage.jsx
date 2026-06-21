import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Eye, Tag, ArrowRight, Search } from 'lucide-react'
import { useAdminStore } from '../store/adminStore'

const CATEGORIES = ['All', 'Wellness', 'Ayurveda', "Men's Health", 'Herbs', 'Lifestyle']

const SAMPLE_CONTENT = `Ayurveda, the ancient Indian science of life, has gifted humanity with thousands of years of wisdom about men's health and vitality. In this article, we explore the most powerful herbs for modern men.

## 1. Ashwagandha (Withania somnifera)

Known as the "Indian Ginseng," Ashwagandha is perhaps the most well-researched adaptogen in Ayurveda. Clinical studies have shown it can:
- Reduce cortisol (stress hormone) by up to 27%
- Increase testosterone levels naturally
- Improve muscle strength and recovery
- Enhance cognitive function and memory

## 2. Safed Musli (Chlorophytum borivilianum)

A powerful aphrodisiac and vitality booster, Safed Musli is one of the key ingredients in our Majoon Moosli formulation. Traditional texts describe it as "divya aushadhi" — divine medicine.

## 3. Shilajit

Rich in fulvic acid and over 84 minerals, Shilajit has been used for millennia to support men's energy, stamina, and overall vitality. Modern research confirms its role in mitochondrial function.

## Conclusion

These herbs, when combined in the right proportions as in our Goli Bull Night and Majoon Moosli, create a synergistic effect that is far greater than any single herb alone.`

export function BlogList() {
  const { blogs } = useAdminStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const published = blogs.filter(b => b.status === 'published')
  const filtered = published.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || b.category === category
    return matchSearch && matchCat
  })

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <section className="section-pad pb-12" style={{ background: 'linear-gradient(160deg, var(--sage-pale) 0%, var(--cream) 60%)' }}>
        <div className="container-wide text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="section-label">The Nama Journal</span>
            <h1 className="font-display font-light mt-4 mb-4" style={{ fontSize: 'clamp(36px,5vw,64px)', color: 'var(--ink)' }}>
              Ancient Wisdom, <em className="gold-text-static not-italic">Modern Insights</em>
            </h1>
            <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
              Explore Ayurvedic knowledge, men's wellness research, and lifestyle guides from our experts.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad pt-10">
        <div className="container-wide">
          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                className="input-light pl-9 pr-4 py-2.5 w-full text-sm"
                placeholder="Search articles…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className="px-3 py-1.5 rounded-xl text-xs transition-all"
                  style={category === cat
                    ? { background: 'var(--gold)', color: '#fff' }
                    : { background: '#fff', border: '1px solid rgba(184,146,42,0.2)', color: 'var(--text-muted)' }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured post */}
          {featured && (
            <Link to={`/blog/${featured.slug}`}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="card-light overflow-hidden mb-10 group cursor-pointer"
                style={{ border: '1.5px solid rgba(184,146,42,0.2)' }}>
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="img-placeholder min-h-64 md:min-h-full group-hover:scale-[1.02] transition-transform duration-700"
                    style={{ background: 'linear-gradient(135deg, var(--sage-pale) 0%, var(--gold-pale) 100%)' }}>
                    <div className="text-center">
                      <div style={{ fontSize: 64 }}>🌿</div>
                      <span className="text-sm font-display mt-2 block" style={{ color: 'rgba(184,146,42,0.5)' }}>Featured</span>
                    </div>
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <span className="inline-flex items-center gap-1.5 text-xs mb-4 px-3 py-1 rounded-full" style={{ background: 'var(--sage-pale)', color: 'var(--sage)', width: 'fit-content' }}>
                      <Tag size={10} /> {featured.category || 'Wellness'}
                    </span>
                    <h2 className="font-display font-light mb-3" style={{ fontSize: 'clamp(22px,3vw,32px)', color: 'var(--ink)', lineHeight: 1.25 }}>{featured.title}</h2>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>{featured.excerpt || 'Discover the ancient wisdom behind this powerful formulation and how it can transform your health.'}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-light)' }}>
                        <span className="flex items-center gap-1"><Calendar size={11} /> {featured.date}</span>
                        <span className="flex items-center gap-1"><Eye size={11} /> {(featured.views || 0).toLocaleString()}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-medium group-hover:gap-2 transition-all" style={{ color: 'var(--gold)' }}>
                        Read Article <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((b, i) => (
              <Link key={b.id} to={`/blog/${b.slug}`}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card-light overflow-hidden group h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="img-placeholder min-h-44 group-hover:scale-[1.03] transition-transform duration-500"
                    style={{ background: `linear-gradient(135deg, ${i%2===0 ? 'var(--gold-pale)' : 'var(--sage-pale)'} 0%, var(--cream) 100%)` }}>
                    <div style={{ fontSize: 48 }}>{['🌿','🐂','🔬','🧘','🌱'][i % 5]}</div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[10px] px-2.5 py-1 rounded-full mb-3 inline-block" style={{ background: 'var(--sage-pale)', color: 'var(--sage)', width: 'fit-content' }}>
                      {b.category || 'Wellness'}
                    </span>
                    <h3 className="font-display font-light mb-2 flex-1" style={{ fontSize: 18, color: 'var(--ink)', lineHeight: 1.35 }}>{b.title}</h3>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{b.excerpt || 'Read more about Ayurvedic wellness and men\'s health.'}</p>
                    <div className="flex items-center justify-between text-[10px] pt-3 border-t" style={{ color: 'var(--text-light)', borderColor: 'rgba(0,0,0,0.06)' }}>
                      <span className="flex items-center gap-1"><Calendar size={10} /> {b.date}</span>
                      <span className="flex items-center gap-1 font-medium group-hover:gap-2 transition-all" style={{ color: 'var(--gold)' }}>Read <ArrowRight size={10} /></span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
              <div className="text-5xl mb-4">📝</div>
              <p className="font-display text-xl mb-2" style={{ color: 'var(--ink)' }}>No articles found</p>
              <p className="text-sm">Try a different search or category</p>
            </div>
          )}

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-16 text-center p-12 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, var(--gold-pale) 0%, var(--cream) 100%)', border: '1.5px solid rgba(184,146,42,0.2)' }}>
            <h2 className="font-display font-light text-3xl mb-3" style={{ color: 'var(--ink)' }}>Ready to Transform?</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Explore our Ayurvedic formulations backed by centuries of wisdom.</p>
            <Link to="/shop" className="btn-gold py-3 px-8 text-sm inline-flex items-center gap-2">
              Shop Now <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const { blogs } = useAdminStore()
  const post = blogs.find(b => b.slug === slug && b.status === 'published')

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
      <div className="text-center">
        <div className="text-6xl mb-4">📄</div>
        <h1 className="font-display text-3xl mb-3" style={{ color: 'var(--ink)' }}>Post not found</h1>
        <Link to="/blog" className="btn-gold py-2 px-6 text-sm">← Back to Blog</Link>
      </div>
    </div>
  )

  const { blogs: allBlogs } = useAdminStore()
  const related = allBlogs.filter(b => b.id !== post.id && b.status === 'published').slice(0, 3)

  const paragraphs = (post.content || SAMPLE_CONTENT).split('\n\n')

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section className="section-pad pb-8" style={{ background: 'linear-gradient(160deg, var(--sage-pale) 0%, var(--cream) 70%)' }}>
        <div className="container-wide max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={12} /> Back to Journal
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 text-xs mb-4 px-3 py-1 rounded-full" style={{ background: 'var(--sage-pale)', color: 'var(--sage)', width: 'fit-content' }}>
              <Tag size={10} /> {post.category || 'Wellness'}
            </span>
            <h1 className="font-display font-light mb-4" style={{ fontSize: 'clamp(28px,4vw,48px)', color: 'var(--ink)', lineHeight: 1.2 }}>{post.title}</h1>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
              <span className="flex items-center gap-1"><Eye size={11} /> {(post.views || 0).toLocaleString()} views</span>
              <span>8 min read</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-wide max-w-3xl">
          {/* Featured image placeholder */}
          <div className="img-placeholder min-h-72 mb-10 rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, var(--gold-pale) 0%, var(--sage-pale) 100%)' }}>
            <div style={{ fontSize: 80 }}>🌿</div>
          </div>

          {/* Article body */}
          <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="prose max-w-none">
            {paragraphs.map((para, i) => {
              if (para.startsWith('## ')) return (
                <h2 key={i} className="font-display font-light text-2xl mt-8 mb-3" style={{ color: 'var(--ink)' }}>{para.slice(3)}</h2>
              )
              if (para.startsWith('- ')) {
                const items = para.split('\n').filter(l => l.startsWith('- '))
                return (
                  <ul key={i} className="space-y-2 mb-5 ml-4">
                    {items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
                        <span style={{ color: 'var(--sage)', marginTop: 4, fontSize: 10 }}>✓</span>
                        {item.slice(2)}
                      </li>
                    ))}
                  </ul>
                )
              }
              return para.trim() ? (
                <p key={i} className="text-base leading-relaxed mb-5" style={{ color: 'var(--ink-soft)' }}>{para}</p>
              ) : null
            })}
          </motion.article>

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--gold-pale) 0%, var(--cream) 100%)', border: '1.5px solid rgba(184,146,42,0.2)' }}>
            <h3 className="font-display text-xl mb-2" style={{ color: 'var(--ink)' }}>Experience These Herbs Yourself</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Goli Bull Night and Majoon Moosli — crafted from the same herbs described in this article.</p>
            <Link to="/shop" className="btn-gold py-2.5 px-6 text-sm inline-flex items-center gap-2">
              Shop Now <ArrowRight size={14} />
            </Link>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display text-2xl mb-6" style={{ color: 'var(--ink)' }}>Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map(b => (
                  <Link key={b.id} to={`/blog/${b.slug}`} className="card-light p-5 group block hover:shadow-md transition-shadow">
                    <h3 className="font-display font-light text-base mb-2 group-hover:text-gold transition-colors" style={{ color: 'var(--ink)', lineHeight: 1.3 }}>{b.title}</h3>
                    <span className="text-xs flex items-center gap-1 mt-3" style={{ color: 'var(--gold)' }}>Read <ArrowRight size={10} /></span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
