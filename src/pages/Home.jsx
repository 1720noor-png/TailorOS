import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories, tools, search } from '../data/registry.js'
import ToolCard from '../components/ToolCard.jsx'
import { useFavorites, useRecentTools } from '../utils/userPrefs.js'

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
  </svg>
)

const CHIPS = ['GPA calculator', 'JSON formatter', 'Password generator', 'Invoice', 'UTM builder', 'QR code', 'Regex tester', 'Pomodoro', 'Markdown preview', 'Text diff']

const COLLECTIONS = [
  { cat: 'student-tools', title: 'Student Essentials', blurb: 'Grades, attendance and study planning.' },
  { cat: 'developer-tools', title: 'Build & Ship', blurb: 'Format, encode and inspect data while you build.' },
  { cat: 'finance-tools', title: 'Money Matters', blurb: 'Mortgages, loans, compounding and SIP returns.' },
  { cat: 'office-tools', title: 'Workplace & Office', blurb: 'Invoices, salary calculations, and team productivity.' },
]

const FEATURES = [
  { icon: '🔒', accent: 'blue', title: 'Runs entirely in your browser', desc: 'Every calculation happens on your device — nothing is ever uploaded to a server.' },
  { icon: '⚡', accent: 'teal', title: 'No sign-up, ever', desc: 'Open a tool and start using it immediately. No accounts, no email, no friction.' },
  { icon: '🎯', accent: 'purple', title: 'Fast & focused', desc: 'Every tool is built to do one job well, with no clutter getting in the way.' },
  { icon: '🚀', accent: 'pink', title: '1,000 Verified Utilities', desc: 'Every calculation is verified, covered across 103 well-structured categories.' },
]

export default function Home() {
  const [p, setP] = useSearchParams()
  const q = p.get('q') || ''
  const selectedCat = p.get('cat') || ''
  const [selectedSubcat, setSelectedSubcat] = useState('')

  const { favorites } = useFavorites()
  const { recents, clearRecents } = useRecentTools()

  const res = q.trim() || selectedCat ? search(q, selectedCat || undefined) : null
  const filteredRes = res && selectedSubcat ? res.filter(t => t.subcat === selectedSubcat) : res

  useEffect(() => { 
    document.title = 'Vimztools – 1,000 Free Everyday Tools That Run in Your Browser' 
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = 'Over 1,000 free, fast, private online tools for developers, students, finance, design, office, and daily life. 100% client-side with zero data uploads.'
  }, [])

  const totalSub = categories.reduce((n, c) => n + (c.subcategories?.length || 0), 0)
  const featuredCats = categories.slice(0, 12)
  const popularTools = tools.filter((t) => t.popular).slice(0, 8)
  
  // Resolve favorite & recent tool objects
  const favoriteTools = tools.filter(t => favorites.includes(t.slug))
  const recentToolObjects = recents.map(slug => tools.find(t => t.slug === slug)).filter(Boolean)

  const activeCategoryObj = categories.find(c => c.slug === selectedCat)

  return (
    <>
      <section className="hero">
        <span className="eyebrow">✨ 1,000 Verified Tools · 100% Free · Zero Sign-Up</span>
        <h1>Every utility you need, <span className="grad">all in your browser</span></h1>
        <p>A unified suite of 1,000 fast, private tools for developers, students, finance, math, productivity, and everyday tasks. Client-side execution with zero tracking.</p>
        
        <div className="hero-search">
          <SearchIcon />
          <input 
            className="big" 
            type="search" 
            value={q} 
            aria-label="Search all 1,000 tools" 
            placeholder="Search all 1,000 tools (e.g., 'GPA', 'JSON', 'mortgage', 'regex')..."
            onChange={(e) => setP(e.target.value ? { ...Object.fromEntries(p), q: e.target.value } : (selectedCat ? { cat: selectedCat } : {}), { replace: true })} 
          />
          <span className="kbd-hint" aria-hidden="true">Ctrl K</span>
        </div>

        <div className="chips">
          {CHIPS.map((c) => (
            <button key={c} type="button" className="chip" onClick={() => setP({ q: c })}>{c}</button>
          ))}
        </div>
      </section>

      {/* SEARCH / FILTER SECTION */}
      {filteredRes ? (
        <section aria-live="polite" className="search-results-section">
          <div className="section-head">
            <div>
              <span className="eyebrow-sm">Search & Filter</span>
              <h2>{filteredRes.length} tool{filteredRes.length === 1 ? '' : 's'} found {q ? `for "${q}"` : ''}</h2>
              {selectedCat && <p>Filtered by category: <strong>{activeCategoryObj?.name || selectedCat}</strong></p>}
            </div>
            {(q || selectedCat || selectedSubcat) && (
              <button className="btn ghost" onClick={() => { setP({}); setSelectedSubcat('') }}>
                ✕ Clear all filters
              </button>
            )}
          </div>

          {/* Subcategory pills if category selected */}
          {activeCategoryObj?.subcategories?.length > 0 && (
            <div className="chips" style={{ marginBottom: '1.5rem' }}>
              <button 
                type="button" 
                className={'chip' + (!selectedSubcat ? ' active-chip' : '')}
                onClick={() => setSelectedSubcat('')}
              >
                All Subcategories
              </button>
              {activeCategoryObj.subcategories.map(s => (
                <button 
                  key={s.slug} 
                  type="button" 
                  className={'chip' + (selectedSubcat === s.slug ? ' active-chip' : '')}
                  onClick={() => setSelectedSubcat(s.slug)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {filteredRes.length ? (
            <div className="grid">{filteredRes.map((t) => <ToolCard key={t.cat + t.slug} t={t} />)}</div>
          ) : (
            <div className="empty">
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.8rem' }}>🔍</span>
              <h3>No matching tools found</h3>
              <p>We couldn't find a tool matching your search. Try searching for a broader term or browse our categories.</p>
              <button className="btn" style={{ marginTop: '1rem' }} onClick={() => { setP({}); setSelectedSubcat('') }}>
                Reset Search
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* USER PREFERENCES: FAVORITES & RECENT TOOLS */}
          {favoriteTools.length > 0 && (
            <section className="user-section">
              <div className="section-head">
                <div>
                  <span className="eyebrow-sm">Your Library</span>
                  <h2>Favorited Tools</h2>
                  <p>Quick access to the tools you marked as favorites.</p>
                </div>
              </div>
              <div className="grid">{favoriteTools.map((t) => <ToolCard key={'fav-' + t.slug} t={t} />)}</div>
            </section>
          )}

          {recentToolObjects.length > 0 && (
            <section className="user-section">
              <div className="section-head">
                <div>
                  <span className="eyebrow-sm">History</span>
                  <h2>Recently Used Tools</h2>
                  <p>Tools you recently interacted with.</p>
                </div>
                <button type="button" className="btn ghost" style={{ fontSize: '0.8rem' }} onClick={clearRecents}>
                  Clear History
                </button>
              </div>
              <div className="grid tight">{recentToolObjects.map((t) => <ToolCard key={'rec-' + t.slug} t={t} />)}</div>
            </section>
          )}

          <section>
            <div className="stats">
              <div className="stat"><b>1,000</b><span>Registered Tools</span></div>
              <div className="stat"><b>103</b><span>Categories</span></div>
              <div className="stat"><b>{totalSub}</b><span>Subcategories</span></div>
              <div className="stat"><b>100%</b><span>Client-Side & Private</span></div>
            </div>
          </section>

          <section>
            <div className="section-head">
              <div><span className="eyebrow-sm">Featured</span><h2>Popular tools</h2><p>Essential utilities frequently used across the platform.</p></div>
              <Link className="view-all" to="/tools?popular=1">View all popular →</Link>
            </div>
            <div className="grid">{popularTools.map((t) => <ToolCard key={t.cat + t.slug} t={t} />)}</div>
          </section>

          <section>
            <div className="section-head">
              <div><span className="eyebrow-sm">Explore</span><h2>Browse categories</h2><p>Organized into 103 domains with focused subcategories.</p></div>
              <Link className="view-all" to="/categories">View all 103 categories →</Link>
            </div>
            <div className="grid">
              {featuredCats.map((c) => (
                <Link key={c.slug} to={'/' + c.slug} className={'cat-card accent-' + c.accent}>
                  <span className="cat-ico" aria-hidden="true">{c.icon}</span>
                  <h3>{c.name}</h3>
                  <p>{c.desc}</p>
                  <div className="cat-meta">
                    <span>{tools.filter((t) => t.cat === c.slug).length} tools</span>
                    {c.subcategories?.length ? <span>{c.subcategories.length} subcategories</span> : null}
                  </div>
                  <span className="cat-arrow">Browse category →</span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="section-head">
              <div><span className="eyebrow-sm">Collections</span><h2>Curated tool kits</h2><p>Hand-picked suites tailored for specific workflows.</p></div>
            </div>
            {COLLECTIONS.map((col) => {
              const c = categories.find((x) => x.slug === col.cat)
              const list = tools.filter((t) => t.cat === col.cat).slice(0, 4)
              if (!c) return null
              return (
                <div key={col.cat} className={'collection accent-' + c.accent}>
                  <div className="collection-head">
                    <span className="cat-ico" aria-hidden="true">{c.icon}</span>
                    <div><h3>{col.title}</h3><p>{col.blurb}</p></div>
                  </div>
                  <div className="grid tight">{list.map((t) => <ToolCard key={t.slug} t={t} />)}</div>
                </div>
              )
            })}
          </section>

          <section>
            <div className="section-head"><div><span className="eyebrow-sm">Why Vimztools</span><h2>Privacy-First SaaS Standards</h2></div></div>
            <div className="why-grid">
              {FEATURES.map((f) => (
                <div key={f.title} className={'feature accent-' + f.accent}>
                  <span className="f-ico" aria-hidden="true">{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="cta-band">
              <h2>Instant access to all 1,000 tools</h2>
              <p>No downloads, no subscriptions, and complete data privacy. Every tool runs directly inside your web browser.</p>
              <Link className="btn" to="/tools">Explore all 1,000 tools</Link>
            </div>
          </section>
        </>
      )}
    </>
  )
}
