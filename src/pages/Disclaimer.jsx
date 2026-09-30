import { Link } from 'react-router-dom'

export default function Disclaimer() {
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <span>Disclaimer</span>
      </nav>

      <section className="section-head">
        <div>
          <span className="eyebrow-sm">Notices</span>
          <h1>Legal & Calculation Disclaimer</h1>
          <p>Important informational notice regarding calculations and utility outputs.</p>
        </div>
      </section>

      <div className="panel" style={{ lineHeight: 1.8 }}>
        <h3>Informational and Educational Purpose</h3>
        <p>
          The calculators, converters, and analytical tools hosted on Vimztools are developed for quick estimation, educational exploration, and day-to-day workflow assistance. 
        </p>

        <h3 style={{ marginTop: '1.5rem' }}>Financial, Tax, and Legal Advice</h3>
        <p>
          Calculations related to mortgages, compounding investments, payroll breakdowns, retirement projections, and tax brackets are approximations based on generalized financial formulas. They do not constitute formal certified public accounting (CPA), financial advising, or legal counsel. Consult qualified professionals before executing material financial contracts or tax filings.
        </p>

        <h3 style={{ marginTop: '1.5rem' }}>Health and Fitness Metrics</h3>
        <p>
          Fitness, calorie, hydration, macronutrient, and body mass index calculators provide general estimates based on standard formulas. They should not substitute for medical evaluation, diagnosis, or treatment plans from licensed medical professionals.
        </p>
      </div>
    </div>
  )
}
