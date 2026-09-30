import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function PdfBatesStamperTool() {
  const [prefix, setPrefix] = useState('CONF-EXHIBIT')
  const [startNum, setStartNum] = useState('1')
  const [digits, setDigits] = useState('6')
  const [suffix, setSuffix] = useState('')
  const [totalPages, setTotalPages] = useState('10')
  const [position, setPosition] = useState('bottom-right')
  const [fontSize, setFontSize] = useState('10')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const generate = () => {
    try {
      const start = parseInt(startNum)
      const count = parseInt(totalPages)
      const padLen = parseInt(digits)

      if (isNaN(start) || start < 0) return setErr('Please enter a valid starting number.')
      if (isNaN(count) || count < 1 || count > 500) return setErr('Page count must be between 1 and 500.')
      if (isNaN(padLen) || padLen < 2 || padLen > 10) return setErr('Digit padding must be between 2 and 10.')
      setErr('')

      const items = []
      for (let i = 0; i < count; i++) {
        const numStr = String(start + i).padStart(padLen, '0')
        const fullStamp = `${prefix ? prefix + '-' : ''}${numStr}${suffix ? '-' + suffix : ''}`
        items.push({
          page: i + 1,
          stamp: fullStamp
        })
      }

      const sampleRange = `${items[0].stamp} to ${items[items.length - 1].stamp}`

      setRes({
        items,
        sampleRange,
        count,
        copyText: items.map(it => `Page ${it.page}: ${it.stamp}`).join('\n')
      })
    } catch (e) {
      setErr(e.message || 'Generation error.')
    }
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1.25rem' }}>
        Generate standardized, sequential Bates numbering sequences with configurable prefixes, digit padding, and exhibit suffixes for legal discovery and audit packages.
      </p>

      <div className="row">
        <Field label="Bates Prefix / Tag">
          <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="e.g. PLAINTIFF, DEPO, CONF" />
        </Field>
        <Field label="Starting Number">
          <input type="number" min="0" value={startNum} onChange={(e) => setStartNum(e.target.value)} />
        </Field>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Zero Padding Digits (Width)">
          <select value={digits} onChange={(e) => setDigits(e.target.value)}>
            <option value="4">4 Digits (e.g. 0001)</option>
            <option value="6">6 Digits (e.g. 000001, Standard)</option>
            <option value="8">8 Digits (e.g. 00000001)</option>
          </select>
        </Field>
        <Field label="Optional Suffix">
          <input type="text" value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="e.g. CONFIDENTIAL, REDACTED" />
        </Field>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Total Document Page Count">
          <input type="number" min="1" max="500" value={totalPages} onChange={(e) => setTotalPages(e.target.value)} />
        </Field>
        <Field label="Stamp Position on Page">
          <select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="bottom-right">Bottom Right (Standard Legal)</option>
            <option value="bottom-center">Bottom Center</option>
            <option value="top-right">Top Right</option>
            <option value="top-center">Top Center</option>
          </select>
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={generate}>Generate Bates Sequence</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Generated Range:</span>
              <strong style={{ display: 'block', fontSize: '1.1rem', color: '#0284c7' }}>{res.sampleRange}</strong>
            </div>
            <span style={{ fontSize: '0.9rem', background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.6rem', borderRadius: '0.25rem' }}>
              {res.count} pages sequenced
            </span>
          </div>

          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '0.375rem', background: '#fff', padding: '0.5rem', fontSize: '0.85rem', fontFamily: 'monospace', marginBottom: '1rem' }}>
            {res.items.map(it => (
              <div key={it.page} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Page {it.page}</span>
                <strong>{it.stamp}</strong>
              </div>
            ))}
          </div>

          <CopyBtn text={res.copyText} label="Copy Bates Series List" />
        </div>
      )}
    </div>
  )
}
