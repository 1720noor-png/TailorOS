import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <span>About</span>
      </nav>

      <section className="section-head">
        <div>
          <span className="eyebrow-sm">Platform</span>
          <h1>About Vimztools</h1>
          <p>The web's most extensive library of 1,000 privacy-first utility tools.</p>
        </div>
      </section>

      <div className="panel" style={{ lineHeight: 1.8 }}>
        <h3>100% Client-Side Privacy</h3>
        <p>
          At Vimztools, privacy isn't an afterthought—it's our foundational architecture. Every single one of our 1,000 tools executes entirely within your browser using modern Web APIs, JavaScript, and WebAssembly. 
        </p>
        <p>
          Whether you are converting confidential PDF files, calculating sensitive financial loans, generating cryptographic passwords, or formatting proprietary source code, <strong>your data never leaves your computer</strong>. No servers, no tracking, no user profiles, and no external storage.
        </p>

        <h3 style={{ marginTop: '2rem' }}>Comprehensive Tool Ecosystem</h3>
        <p>
          From mathematical and scientific calculations to developer utilities, office productivity aids, fitness calculators, and everyday life organizers, Vimztools replaces hundreds of fragmented ad-ridden websites with one unified, blazing-fast, and completely free platform.
        </p>

        <h3 style={{ marginTop: '2rem' }}>Key Guarantees</h3>
        <ul style={{ paddingLeft: '1.4rem' }}>
          <li><strong>Zero Signup:</strong> Instant access to all 1,000 tools with no account creation or login walls.</li>
          <li><strong>No Server Logs:</strong> Complete zero-knowledge local client execution.</li>
          <li><strong>Lightning Fast:</strong> Instant load times powered by Vite, React, and global CDN caching.</li>
          <li><strong>Universal Access:</strong> Fully responsive interface designed for desktop, tablet, and mobile devices.</li>
        </ul>
      </div>
    </div>
  )
}
