import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Field } from '../components/ui.jsx'

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false)
  const [report, setReport] = useState({ toolName: '', issueType: 'Bug', details: '', browser: navigator.userAgent })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!report.details.trim()) return
    setSubmitted(true)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <span>Feedback & Problem Report</span>
      </nav>

      <section className="section-head">
        <div>
          <span className="eyebrow-sm">Community Feedback</span>
          <h1>Report a Problem or Suggest an Idea</h1>
          <p>Help us make Vimztools better for all 1,000 tools.</p>
        </div>
      </section>

      <div className="panel">
        {submitted ? (
          <div className="out" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <span style={{ fontSize: '3rem' }}>🎯</span>
            <h3>Feedback Received!</h3>
            <p>Thank you for helping us maintain high quality standards across our tool library.</p>
            <button className="btn" style={{ marginTop: '1rem' }} onClick={() => setSubmitted(false)}>Submit another report</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <Field label="Specific Tool Name / URL (Optional)">
                <input value={report.toolName} onChange={e => setReport({ ...report, toolName: e.target.value })} placeholder="e.g. Markdown Preview or /developer-tools/markdown-preview" />
              </Field>
              <Field label="Issue Type">
                <select value={report.issueType} onChange={e => setReport({ ...report, issueType: e.target.value })}>
                  <option value="Bug">Calculation Error or Bug</option>
                  <option value="UI">UI / Visual Layout Glitch</option>
                  <option value="Feature">Feature Request or Enhancement</option>
                  <option value="Performance">Performance or Responsiveness Issue</option>
                  <option value="Other">Other Observation</option>
                </select>
              </Field>
            </div>

            <Field label="Detailed Description">
              <textarea required rows={5} value={report.details} onChange={e => setReport({ ...report, details: e.target.value })} placeholder="Please explain what happened, expected behavior, or your suggested enhancement..." />
            </Field>

            <Field label="Diagnostic Environment Info">
              <input readOnly value={report.browser} style={{ fontSize: '0.8rem', color: 'var(--muted)' }} />
            </Field>

            <div className="actions">
              <button type="submit" className="btn">Submit Report</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
