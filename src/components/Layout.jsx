import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { categories, tools } from '../data/registry.js'
import { useAuth } from '../context/AuthContext.jsx'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
  </svg>
)

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('toolhub-theme') || 'auto' } catch { return 'auto' }
  })
  useEffect(() => {
    try {
      if (theme === 'auto') { document.documentElement.removeAttribute('data-theme'); localStorage.removeItem('toolhub-theme') }
      else { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('toolhub-theme', theme) }
    } catch { /* ignore */ }
  }, [theme])
  const effective = theme === 'auto'
    ? (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme
  return [effective, () => setTheme(effective === 'dark' ? 'light' : 'dark')]
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const { pathname } = useLocation()
  const nav = useNavigate()
  const searchRef = useRef(null)
  const megaRef = useRef(null)
  const [effectiveTheme, toggleTheme] = useTheme()
  const { user, isLoggedIn, isAdmin, logout } = useAuth()

  useEffect(() => { setOpen(false); setMega(false); window.scrollTo(0, 0) }, [pathname])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchRef.current?.focus() }
      if (e.key === 'Escape') setMega(false)
    }
    const onClick = (e) => { if (megaRef.current && !megaRef.current.contains(e.target)) setMega(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onClick)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('mousedown', onClick) }
  }, [])

  const submit = (e) => {
    e.preventDefault()
    const q = new FormData(e.currentTarget).get('q').toString().trim()
    nav(q ? `/?q=${encodeURIComponent(q)}` : '/')
  }

  const popularCount = (slug) => tools.filter((t) => t.cat === slug).length
  const featuredCats = categories.slice(0, 8)

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="top">
        <div className="wrap bar">
          <Link to="/" className="brand" aria-label="Vimztools Homepage">
            <span className="brand-mark" aria-hidden="true">V</span>
            Vimztools
          </Link>

          <button className="burger" aria-expanded={open} aria-controls="menu" aria-label="Toggle navigation menu" onClick={() => setOpen(!open)}>
            {open ? '✕' : '☰'}
          </button>

          <nav id="menu" className={open ? 'open' : ''} aria-label="Main navigation">
            <form className="nav-search" role="search" onSubmit={submit}>
              <SearchIcon />
              <input ref={searchRef} name="q" type="search" placeholder="Search 1,000 tools…" aria-label="Search all 1,000 tools" id="global-search" />
              <span className="kbd-hint" aria-hidden="true">Ctrl K</span>
            </form>

            <NavLink to="/" end>Home</NavLink>

            <div className="mega-wrap" ref={megaRef}>
              <button type="button" className="mega-btn" aria-expanded={mega} aria-haspopup="true" onClick={() => setMega(!mega)}>
                Categories <span className="chev" aria-hidden="true">▾</span>
              </button>
              {mega && (
                <div className="mega-panel" role="menu">
                  {featuredCats.map((c) => (
                    <Link key={c.slug} to={'/' + c.slug} className={'mega-item accent-' + c.accent} role="menuitem">
                      <span className="mega-ico" aria-hidden="true">{c.icon}</span>
                      <span><strong>{c.name}</strong><span>{popularCount(c.slug)} tools</span></span>
                    </Link>
                  ))}
                  <div className="mega-footer">
                    <Link to="/categories">View all {categories.length} categories →</Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink to="/tools">All Tools</NavLink>
            <NavLink to="/tools?popular=1">Popular</NavLink>

            {isLoggedIn ? (
              <>
                <NavLink to="/dashboard" className="nav-highlight">
                  👤 Dashboard
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className="nav-highlight admin">
                    ⚡ Admin
                  </NavLink>
                )}
              </>
            ) : (
              <NavLink to="/login">Sign In</NavLink>
            )}

            <NavLink to="/about">About</NavLink>
          </nav>

          <div className="navbar-actions">
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/dashboard" className="btn sub sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  {user?.name?.split(' ')[0] || 'Account'}
                </Link>
              </div>
            ) : (
              <Link to="/login" className="btn primary sm" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
                Sign In
              </Link>
            )}

            <button 
              type="button" 
              className="icon-btn" 
              onClick={toggleTheme} 
              aria-label={effectiveTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={effectiveTheme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {effectiveTheme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="wrap"><Outlet /></main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="brand" style={{ marginBottom: '0.8rem', display: 'inline-flex' }}>
                <span className="brand-mark" aria-hidden="true">V</span>
                Vimztools
              </Link>
              <p>A unified suite of 1,000+ free, privacy-first web utilities executing locally in your browser with zero data tracking.</p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
                <span className="badge sub" style={{ background: 'rgba(16,185,129,.14)', color: 'var(--ok)' }}>● 100% Client-Side</span>
                <span className="badge sub">v2.0 Full-Stack SaaS</span>
              </div>
            </div>

            <div className="footer-col">
              <h4>Platform</h4>
              <Link to="/">Home</Link>
              <Link to="/tools">All 1,000 Tools</Link>
              <Link to="/categories">All Categories</Link>
              <Link to="/dashboard">User Dashboard</Link>
              {isAdmin && <Link to="/admin">Admin Console</Link>}
            </div>

            <div className="footer-col">
              <h4>Popular Suites</h4>
              {categories.slice(0, 5).map((c) => <Link key={c.slug} to={'/' + c.slug}>{c.name}</Link>)}
            </div>

            <div className="footer-col">
              <h4>Account & Access</h4>
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard">My Unlocked Tools</Link>
                  <Link to="/dashboard">Favorites & Saved</Link>
                  <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--muted)', padding: 0, textAlign: 'left', cursor: 'pointer', font: 'inherit' }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">Sign In</Link>
                  <Link to="/register">Create Account</Link>
                </>
              )}
            </div>

            <div className="footer-col">
              <h4>Company & Legal</h4>
              <Link to="/about">About Vimztools</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Use</Link>
              <Link to="/disclaimer">Disclaimer</Link>
              <Link to="/contact">Contact Support</Link>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Vimztools Platform. All computations and transformations run locally on your device.</span>
            <div style={{ display: 'flex', gap: '1.2rem' }}>
              <Link to="/privacy" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Privacy</Link>
              <Link to="/terms" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Terms</Link>
              <Link to="/disclaimer" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Disclaimer</Link>
              <Link to="/contact" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
