import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <span>Privacy Policy</span>
      </nav>

      <section className="section-head">
        <div>
          <span className="eyebrow-sm">Legal & Compliance</span>
          <h1>Privacy Policy</h1>
          <p>Last updated: September 2026</p>
        </div>
      </section>

      <div className="panel" style={{ lineHeight: 1.8 }}>
        <h3>1. Our Core Principle: Zero Data Collection</h3>
        <p>
          Vimztools is built strictly on a client-side execution paradigm. When you use any of our 1,000 tools—including file converters, financial calculators, document formatters, or cryptographic generators—all data processing takes place directly within your device's browser memory.
        </p>

        <h3 style={{ marginTop: '1.5rem' }}>2. Information We Do Not Collect</h3>
        <ul style={{ paddingLeft: '1.4rem' }}>
          <li>We do <strong>not</strong> collect or store your inputs, files, calculations, or outputs on any server.</li>
          <li>We do <strong>not</strong> require user accounts, emails, or personal identification details to access tools.</li>
          <li>We do <strong>not</strong> sell, rent, or monetize your personal data.</li>
        </ul>

        <h3 style={{ marginTop: '1.5rem' }}>3. Local Browser Storage</h3>
        <p>
          Certain tools and user interface conveniences (such as theme preferences, saved favorites, or recent tool lists) utilize standard browser <code>localStorage</code>. This data resides exclusively on your local machine and can be cleared by you at any time through your browser settings.
        </p>

        <h3 style={{ marginTop: '1.5rem' }}>4. Hosting and Network Traffic</h3>
        <p>
          Our application static assets (HTML, CSS, JS) are distributed via content delivery networks (Netlify). Standard server access logs (such as IP addresses and requested static resource paths) are maintained by the infrastructure provider strictly for security, DDoS mitigation, and reliability purposes.
        </p>
      </div>
    </div>
  )
}
