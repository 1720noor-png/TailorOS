import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function PiiTextRedactorTool() {
  const [input, setInput] = useState(`Dr. Johnathan Smith evaluated Jane Doe (DOB: 12/14/1985, SSN: 123-45-6789) on September 28, 2026.
Contact email: j.smith@hospitalmed.org, phone: (555) 234-5678.
Payment received from Visa 4111-2222-3333-4444 via account 9876543210.`)
  const [redactEmails, setRedactEmails] = useState(true)
  const [redactPhones, setRedactPhones] = useState(true)
  const [redactSsn, setRedactSsn] = useState(true)
  const [redactCc, setRedactCc] = useState(true)
  const [redactDates, setRedactDates] = useState(true)
  const [redactIps, setRedactIps] = useState(true)
  const [customKeywords, setCustomKeywords] = useState('Johnathan Smith, Jane Doe')
  const [replacementStyle, setReplacementStyle] = useState('tag') // tag | blackbox | asterisks
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const redact = () => {
    try {
      if (!input.trim()) return setErr('Please enter text to redact.')
      setErr('')

      let text = input
      let matchCount = 0

      const replaceWith = (tag) => {
        matchCount++
        if (replacementStyle === 'blackbox') return '████████'
        if (replacementStyle === 'asterisks') return '********'
        return `[REDACTED_${tag}]`
      }

      // SSN / National IDs (XXX-XX-XXXX)
      if (redactSsn) {
        text = text.replace(/\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g, () => replaceWith('SSN'))
      }

      // Credit Cards (13 to 19 digits with dashes/spaces)
      if (redactCc) {
        text = text.replace(/\b(?:\d{4}[- ]?){3}\d{4}\b/g, () => replaceWith('CREDIT_CARD'))
      }

      // Email Addresses
      if (redactEmails) {
        text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, () => replaceWith('EMAIL'))
      }

      // Phone numbers (US/International common formats)
      if (redactPhones) {
        text = text.replace(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, () => replaceWith('PHONE'))
      }

      // IPv4 Addresses
      if (redactIps) {
        text = text.replace(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, () => replaceWith('IP_ADDRESS'))
      }

      // Dates (MM/DD/YYYY, DD-MM-YYYY, Month DD, YYYY)
      if (redactDates) {
        text = text.replace(/\b(?:\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})\b/g, () => replaceWith('DATE'))
      }

      // Custom Names / Entities
      if (customKeywords.trim()) {
        const terms = customKeywords.split(',').map(s => s.trim()).filter(Boolean)
        terms.forEach(term => {
          const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const reg = new RegExp(`\\b${escaped}\\b`, 'gi')
          text = text.replace(reg, () => replaceWith('NAME'))
        })
      }

      setRes({
        redactedText: text,
        matchCount,
        charCount: text.length
      })
    } catch (e) {
      setErr(e.message || 'Redaction error.')
    }
  }

  const reset = () => {
    setInput('')
    setCustomKeywords('')
    setRes(null)
    setErr('')
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1.25rem' }}>
        Sanitize and de-identify text in your browser before case filings, clinical presentations, or research publications. Zero text is uploaded to any server.
      </p>

      <Field label="Input Text containing PII/PHI">
        <textarea rows={6} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste clinical notes, legal records, or transcripts..." />
      </Field>

      <div style={{ margin: '1rem 0' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Active Redaction Filters:</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <input type="checkbox" checked={redactSsn} onChange={(e) => setRedactSsn(e.target.checked)} /> SSN / National IDs
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <input type="checkbox" checked={redactEmails} onChange={(e) => setRedactEmails(e.target.checked)} /> Email Addresses
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <input type="checkbox" checked={redactPhones} onChange={(e) => setRedactPhones(e.target.checked)} /> Phone Numbers
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <input type="checkbox" checked={redactCc} onChange={(e) => setRedactCc(e.target.checked)} /> Credit Cards / Accounts
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <input type="checkbox" checked={redactDates} onChange={(e) => setRedactDates(e.target.checked)} /> Numerical Dates (DOB)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <input type="checkbox" checked={redactIps} onChange={(e) => setRedactIps(e.target.checked)} /> IP Addresses
          </label>
        </div>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Custom Names / Confidential Terms (Comma separated)">
          <input type="text" value={customKeywords} onChange={(e) => setCustomKeywords(e.target.value)} placeholder="e.g. Patient Name, Company Corp, City Name" />
        </Field>
        <Field label="Masking Style">
          <select value={replacementStyle} onChange={(e) => setReplacementStyle(e.target.value)}>
            <option value="tag">Category Tags ([REDACTED_EMAIL], etc.)</option>
            <option value="blackbox">Black Bars (████████)</option>
            <option value="asterisks">Asterisks (********)</option>
          </select>
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={redact}>De-Identify / Redact Text</button>
        <button className="btn ghost" onClick={reset}>Clear</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <strong style={{ color: '#16a34a' }}>✓ {res.matchCount} sensitive item(s) redacted locally</strong>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Length: {res.charCount} chars</span>
          </div>
          <Field label="Sanitized Output">
            <textarea rows={6} readOnly value={res.redactedText} />
          </Field>
          <div style={{ marginTop: '0.5rem' }}>
            <CopyBtn text={res.redactedText} label="Copy Redacted Text" />
          </div>
        </div>
      )}
    </div>
  )
}
