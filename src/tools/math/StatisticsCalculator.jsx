import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function StatisticsCalculator() {
  const [rawText, setRawText] = useState('12, 15, 18, 22, 15, 30, 45, 18, 24, 15')

  const nums = rawText
    .split(/[\s,]+/)
    .map((x) => parseFloat(x))
    .filter((n) => !isNaN(n))

  const count = nums.length
  const sorted = [...nums].sort((a, b) => a - b)
  const sum = nums.reduce((acc, curr) => acc + curr, 0)
  const mean = count > 0 ? sum / count : 0

  let median = 0
  if (count > 0) {
    const mid = Math.floor(count / 2)
    median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  }

  // Mode
  const freq = {}
  nums.forEach((n) => {
    freq[n] = (freq[n] || 0) + 1
  })
  let maxFreq = 0
  Object.values(freq).forEach((f) => {
    if (f > maxFreq) maxFreq = f
  })
  const modes = Object.keys(freq)
    .filter((k) => freq[k] === maxFreq && maxFreq > 1)
    .map(Number)

  const min = count > 0 ? sorted[0] : 0
  const max = count > 0 ? sorted[count - 1] : 0
  const range = max - min

  // Variance & Standard Deviation
  const variancePop = count > 0 ? nums.reduce((acc, n) => acc + Math.pow(n - mean, 2), 0) / count : 0
  const stdDevPop = Math.sqrt(variancePop)

  const varianceSample = count > 1 ? nums.reduce((acc, n) => acc + Math.pow(n - mean, 2), 0) / (count - 1) : 0
  const stdDevSample = Math.sqrt(varianceSample)

  const fmt = (n) => (Number.isInteger(n) ? n.toString() : n.toFixed(4).replace(/\.?0+$/, ''))

  const reportText = `Statistical Analysis Summary
-----------------------------------------------
Sample Size (N): ${count}
Values: ${nums.join(', ')}

Central Tendency:
• Mean (Average): ${fmt(mean)}
• Median (Middle): ${fmt(median)}
• Mode: ${modes.length > 0 ? modes.join(', ') : 'No repeated mode'}

Dispersion & Spread:
• Range (Max - Min): ${fmt(range)} [Min: ${fmt(min)}, Max: ${fmt(max)}]
• Sum: ${fmt(sum)}
• Sample Std Deviation (s): ${fmt(stdDevSample)}
• Sample Variance (s²): ${fmt(varianceSample)}
• Population Std Dev (σ): ${fmt(stdDevPop)}
• Population Variance (σ²): ${fmt(variancePop)}`

  return (
    <div className="tool-body">
      <Field label="Enter Numbers (separated by commas or spaces)">
        <textarea
          rows={3}
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="e.g. 10, 25, 30, 45, 50"
        />
      </Field>

      {count === 0 ? (
        <div className="msg error">Please enter at least one valid number.</div>
      ) : (
        <>
          <div className="out">
            <div>Mean: <strong>{fmt(mean)}</strong> | Median: <strong>{fmt(median)}</strong> | Mode: <strong>{modes.length > 0 ? modes.join(', ') : 'None'}</strong></div>
            <div className="hint" style={{ marginTop: '0.4rem' }}>
              Count (N): {count} | Min: {fmt(min)} | Max: {fmt(max)} | Range: {fmt(range)}
            </div>
          </div>

          <div className="scroll" style={{ marginTop: '1rem' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Statistic Metric</th>
                  <th>Calculated Value</th>
                  <th>Formula / Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Sample Size (N)</strong></td>
                  <td>{count}</td>
                  <td>Total number of observations</td>
                </tr>
                <tr>
                  <td><strong>Sum</strong></td>
                  <td>{fmt(sum)}</td>
                  <td>∑ x</td>
                </tr>
                <tr className="best">
                  <td><strong>Mean (Average)</strong></td>
                  <td>{fmt(mean)}</td>
                  <td>∑ x / N</td>
                </tr>
                <tr>
                  <td><strong>Median</strong></td>
                  <td>{fmt(median)}</td>
                  <td>50th percentile middle value</td>
                </tr>
                <tr>
                  <td><strong>Sample Std Dev (s)</strong></td>
                  <td>{fmt(stdDevSample)}</td>
                  <td>√[ ∑(x - x̄)² / (N - 1) ]</td>
                </tr>
                <tr>
                  <td><strong>Population Std Dev (σ)</strong></td>
                  <td>{fmt(stdDevPop)}</td>
                  <td>√[ ∑(x - μ)² / N ]</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="actions">
            <CopyBtn text={reportText} label="Copy Stats Summary" />
            <button type="button" className="btn ghost" onClick={() => download('statistics-report.txt', reportText)}>
              Download (.txt)
            </button>
          </div>
        </>
      )}
    </div>
  )
}
