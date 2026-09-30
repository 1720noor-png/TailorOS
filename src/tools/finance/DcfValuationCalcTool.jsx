import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function DcfValuationCalcTool() {
  const [initialFcf, setInitialFcf] = useState('10.0') // Million $
  const [growthRate5y, setGrowthRate5y] = useState('15.0') // % 5-year CAGR
  const [waccDiscount, setWaccDiscount] = useState('10.0') // % WACC
  const [terminalGrowth, setTerminalGrowth] = useState('2.5') // % Perpetual growth rate
  const [totalDebt, setTotalDebt] = useState('15.0') // Million $
  const [cashBalance, setCashBalance] = useState('5.0') // Million $
  const [sharesOutstanding, setSharesOutstanding] = useState('2.0') // Million shares
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      const fcf0 = parseFloat(initialFcf)
      const g = parseFloat(growthRate5y) / 100
      const wacc = parseFloat(waccDiscount) / 100
      const gTerm = parseFloat(terminalGrowth) / 100
      const debt = parseFloat(totalDebt) || 0
      const cash = parseFloat(cashBalance) || 0
      const shares = parseFloat(sharesOutstanding)

      if (isNaN(fcf0) || fcf0 <= 0) return setErr('Starting Free Cash Flow must be a positive number.')
      if (isNaN(wacc) || wacc <= 0 || wacc >= 1) return setErr('WACC discount rate must be between 1% and 99%.')
      if (isNaN(gTerm) || gTerm >= wacc) return setErr('Terminal growth rate must be strictly less than WACC discount rate.')
      if (isNaN(shares) || shares <= 0) return setErr('Shares count must be greater than 0.')
      setErr('')

      // 5-Year Projection of Projected FCF & Discounted Present Values
      const years = []
      let pvSum = 0
      let currentFcf = fcf0

      for (let t = 1; t <= 5; t++) {
        currentFcf = currentFcf * (1 + g)
        const discountFactor = Math.pow(1 + wacc, t)
        const pv = currentFcf / discountFactor
        pvSum += pv
        years.push({
          year: t,
          fcf: currentFcf.toFixed(2),
          pv: pv.toFixed(2)
        })
      }

      // Terminal Value = (FCF_Year5 * (1 + g_term)) / (WACC - g_term)
      const fcfYear6 = currentFcf * (1 + gTerm)
      const terminalValue = fcfYear6 / (wacc - gTerm)
      const pvTerminalValue = terminalValue / Math.pow(1 + wacc, 5)

      // Enterprise Value = Sum(PV of 5-year FCF) + PV of Terminal Value
      const enterpriseValue = pvSum + pvTerminalValue

      // Equity Value = Enterprise Value + Cash - Debt
      const equityValue = enterpriseValue + cash - debt
      const impliedSharePrice = equityValue / shares

      setRes({
        pvSum: pvSum.toFixed(2),
        terminalValue: terminalValue.toFixed(2),
        pvTerminalValue: pvTerminalValue.toFixed(2),
        enterpriseValue: enterpriseValue.toFixed(2),
        equityValue: equityValue.toFixed(2),
        impliedSharePrice: impliedSharePrice.toFixed(2),
        years,
        copyText: `DCF Enterprise Valuation: Enterprise Value: $${enterpriseValue.toFixed(2)}M, Equity Value: $${equityValue.toFixed(2)}M, Implied Share Price: $${impliedSharePrice.toFixed(2)}/share (PV of 5-yr Cash Flows: $${pvSum.toFixed(2)}M, PV of Terminal Value: $${pvTerminalValue.toFixed(2)}M at WACC: ${(wacc * 100).toFixed(1)}%).`
      })
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1.25rem' }}>
        Model company intrinsic valuation using a 5-year Discounted Free Cash Flow (DCF) schedule, WACC discount rate, and Gordon Growth perpetual terminal value.
      </p>

      <div className="row">
        <Field label="Baseline Year-0 Free Cash Flow ($ Millions)">
          <input type="number" step="0.5" min="0.1" value={initialFcf} onChange={(e) => setInitialFcf(e.target.value)} />
        </Field>
        <Field label="5-Year FCF Annual Growth Rate (%)">
          <input type="number" step="0.5" value={growthRate5y} onChange={(e) => setGrowthRate5y(e.target.value)} />
        </Field>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Discount Rate / WACC (%)">
          <input type="number" step="0.25" min="1" max="50" value={waccDiscount} onChange={(e) => setWaccDiscount(e.target.value)} />
        </Field>
        <Field label="Perpetual Terminal Growth Rate (%)">
          <input type="number" step="0.1" min="0" max="10" value={terminalGrowth} onChange={(e) => setTerminalGrowth(e.target.value)} />
        </Field>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Total Debt ($ Millions)">
          <input type="number" step="0.5" value={totalDebt} onChange={(e) => setTotalDebt(e.target.value)} />
        </Field>
        <Field label="Cash & Equivalents ($ Millions)">
          <input type="number" step="0.5" value={cashBalance} onChange={(e) => setCashBalance(e.target.value)} />
        </Field>
        <Field label="Shares Outstanding (Millions)">
          <input type="number" step="0.1" min="0.01" value={sharesOutstanding} onChange={(e) => setSharesOutstanding(e.target.value)} />
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={calc}>Calculate DCF Valuation</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Enterprise Value (EV)</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#0284c7' }}>${res.enterpriseValue} M</p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>PV Terminal: ${res.pvTerminalValue}M</span>
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Equity Value</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#16a34a' }}>${res.equityValue} M</p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>EV + Cash - Debt</span>
            </div>

            <div style={{ padding: '0.75rem', background: '#fff', borderRadius: '0.375rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Implied Share Price</span>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#7c3aed' }}>${res.impliedSharePrice}</p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Per Diluted Share</span>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>5-Year Discounted Cash Flow Breakdown:</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {res.years.map(y => (
                <div key={y.year} style={{ padding: '0.4rem 0.6rem', background: '#f1f5f9', borderRadius: '0.25rem', fontSize: '0.8rem' }}>
                  <strong>Year {y.year}:</strong> ${y.fcf}M (PV: ${y.pv}M)
                </div>
              ))}
            </div>
          </div>

          <CopyBtn text={res.copyText} label="Copy DCF Valuation Summary" />
        </div>
      )}
    </div>
  )
}
