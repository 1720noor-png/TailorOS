import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function AbTestSampleCalcTool() {
  const [baselineConv, setBaselineConv] = useState('5.0') // %
  const [mde, setMde] = useState('10.0') // % relative change
  const [alpha, setAlpha] = useState('0.05') // Significance level (95% confidence)
  const [power, setPower] = useState('0.80') // 80% power
  const [dailyTraffic, setDailyTraffic] = useState('1000') // Daily total visitors
  const [variantsCount, setVariantsCount] = useState('2') // Control + 1 variation
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      const p1 = parseFloat(baselineConv) / 100
      const relMde = parseFloat(mde) / 100
      const sigAlpha = parseFloat(alpha)
      const statPower = parseFloat(power)
      const daily = parseFloat(dailyTraffic)
      const variants = parseInt(variantsCount)

      if (isNaN(p1) || p1 <= 0 || p1 >= 1) return setErr('Baseline conversion rate must be between 0% and 100%.')
      if (isNaN(relMde) || relMde <= 0) return setErr('Minimum Detectable Effect (MDE) must be greater than 0%.')
      if (isNaN(daily) || daily <= 0) return setErr('Daily traffic must be a positive number.')
      if (isNaN(variants) || variants < 2) return setErr('Variants count must be at least 2 (Control + 1).')
      setErr('')

      const p2 = p1 * (1 + relMde)
      const pAvg = (p1 + p2) / 2

      // Critical values
      const zAlpha = sigAlpha === 0.01 ? 2.576 : (sigAlpha === 0.05 ? 1.960 : 1.645)
      const zBeta = statPower === 0.90 ? 1.282 : (statPower === 0.80 ? 0.842 : 0.674)

      // Standard sample size formula for two proportions
      const numerator = Math.pow(zAlpha * Math.sqrt(2 * pAvg * (1 - pAvg)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2)
      const denominator = Math.pow(p2 - p1, 2)
      const samplePerVariant = Math.ceil(numerator / denominator)
      const totalSample = samplePerVariant * variants
      const daysRequired = Math.ceil(totalSample / daily)

      setRes({
        samplePerVariant: samplePerVariant.toLocaleString(),
        totalSample: totalSample.toLocaleString(),
        daysRequired,
        p1Pct: (p1 * 100).toFixed(2),
        p2Pct: (p2 * 100).toFixed(2),
        absMde: Math.abs(p2 - p1) * 100,
        copyText: `A/B Test Sample Size Requirement: ${samplePerVariant.toLocaleString()} visitors per variation (${totalSample.toLocaleString()} total). Estimated runtime: ${daysRequired} days at ${daily.toLocaleString()} visitors/day.`
      })
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => {
    setBaselineConv('5.0')
    setMde('10.0')
    setAlpha('0.05')
    setPower('0.80')
    setDailyTraffic('1000')
    setVariantsCount('2')
    setRes(null)
    setErr('')
  }

  return (
    <div>
      <p style={{ color: 'var(--text-muted, #64748b)', marginBottom: '1.25rem' }}>
        Calculate the required sample size and estimated test duration per variation to achieve statistical power and confidence in A/B and multivariate experiments.
      </p>

      <div className="row">
        <Field label="Baseline Conversion Rate (%)">
          <input type="number" step="0.1" min="0.01" max="99.9" value={baselineConv} onChange={(e) => setBaselineConv(e.target.value)} />
        </Field>
        <Field label="Minimum Detectable Effect / MDE (% Relative Lift)">
          <input type="number" step="0.5" min="0.1" value={mde} onChange={(e) => setMde(e.target.value)} />
        </Field>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Significance Level (Alpha / Confidence)">
          <select value={alpha} onChange={(e) => setAlpha(e.target.value)}>
            <option value="0.05">95% Confidence (α = 0.05, Standard)</option>
            <option value="0.01">99% Confidence (α = 0.01, High Precision)</option>
            <option value="0.10">90% Confidence (α = 0.10, Exploratory)</option>
          </select>
        </Field>
        <Field label="Statistical Power (1 - Beta)">
          <select value={power} onChange={(e) => setPower(e.target.value)}>
            <option value="0.80">80% Power (Standard Industry Benchmark)</option>
            <option value="0.90">90% Power (High Reliability)</option>
            <option value="0.75">75% Power (Fast Turnaround)</option>
          </select>
        </Field>
      </div>

      <div className="row" style={{ marginTop: '0.75rem' }}>
        <Field label="Total Daily Experiment Traffic (Visitors/day)">
          <input type="number" min="1" value={dailyTraffic} onChange={(e) => setDailyTraffic(e.target.value)} />
        </Field>
        <Field label="Total Test Variations (Including Control)">
          <input type="number" min="2" max="10" value={variantsCount} onChange={(e) => setVariantsCount(e.target.value)} />
        </Field>
      </div>

      <div className="actions" style={{ marginTop: '1.25rem' }}>
        <button className="btn" onClick={calc}>Calculate Sample Size</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>

      <Msg>{err}</Msg>

      {res && (
        <div className="out" role="status" style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--card-bg, #f8fafc)', borderRadius: '0.5rem', border: '1px solid var(--border-color, #e2e8f0)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Sample Per Variation</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#0284c7' }}>{res.samplePerVariant}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Required Visitors</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0' }}>{res.totalSample}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Estimated Test Duration</span>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0.2rem 0', color: '#16a34a' }}>{res.daysRequired} Days</p>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.75rem' }}>
            Target effect: Detects change from <strong>{res.p1Pct}%</strong> to <strong>{res.p2Pct}%</strong> (Absolute lift: {res.absMde.toFixed(2)}%).
          </p>

          <CopyBtn text={res.copyText} label="Copy Experiment Plan" />
        </div>
      )}
    </div>
  )
}
