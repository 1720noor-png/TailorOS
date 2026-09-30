import { Link } from 'react-router-dom'

export default function TermsOfUse() {
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <span>Terms of Use</span>
      </nav>

      <section className="section-head">
        <div>
          <span className="eyebrow-sm">Legal</span>
          <h1>Terms of Use</h1>
          <p>Effective date: September 2026</p>
        </div>
      </section>

      <div className="panel" style={{ lineHeight: 1.8 }}>
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing and utilizing Vimztools, you acknowledge and agree to abide by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
        </p>

        <h3 style={{ marginTop: '1.5rem' }}>2. Use License</h3>
        <p>
          Permission is granted to utilize Vimztools for personal, educational, commercial, or professional purposes free of charge. You may run our utilities to process files, calculate values, and export outputs as needed.
        </p>

        <h3 style={{ marginTop: '1.5rem' }}>3. Disclaimer of Warranties</h3>
        <p>
          The tools and materials on Vimztools are provided on an 'as is' and 'as available' basis. While we strive for extreme mathematical precision and software reliability, Vimztools makes no warranties, expressed or implied, regarding commercial fitness or accuracy for critical regulatory, medical, or engineering certifications.
        </p>

        <h3 style={{ marginTop: '1.5rem' }}>4. Limitations of Liability</h3>
        <p>
          In no event shall Vimztools or its contributors be liable for any damages (including, without limitation, damages for loss of data, profit, or business interruption) arising out of the use or inability to use the platform utilities.
        </p>
      </div>
    </div>
  )
}
