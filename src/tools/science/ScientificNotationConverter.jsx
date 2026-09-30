import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function ScientificNotationConverter() {
  const [numInput, setNumInput] = useState('299792458')

  const num = parseFloat(numInput)
  const isValid = !isNaN(num)

  let expStr = ''
  let eNotation = ''
  let engineeringNotation = ''

  if (isValid) {
    expStr = num.toExponential()
    eNotation = num.toExponential().replace('e', ' × 10^')

    // Engineering notation (exponent multiple of 3)
    const exp = Math.floor(Math.log10(Math.abs(num)))
    const engExp = Math.floor(exp / 3) * 3
    const mantissa = num / Math.pow(10, engExp)
    engineeringNotation = `${mantissa.toFixed(4).replace(/\.?0+$/, '')} × 10^${engExp}`
  }

  const reportText = `Scientific Notation Converter Result
-------------------------------------------------
Input Number: ${numInput}

Standard Scientific Notation: ${eNotation}
E-Notation: ${expStr}
Engineering Notation: ${engineeringNotation}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Input Decimal or Standard Number">
          <input type="text" value={numInput} onChange={(e) => setNumInput(e.target.value)} placeholder="e.g. 0.000045 or 299792458" />
        </Field>
      </div>

      {!isValid ? (
        <div className="msg error">Please enter a valid decimal number.</div>
      ) : (
        <>
          <div className="out">
            <div>Scientific Notation: <strong>{eNotation}</strong></div>
            <div className="hint" style={{ marginTop: '0.4rem' }}>
              E-Notation: <strong>{expStr}</strong> | Engineering Notation: <strong>{engineeringNotation}</strong>
            </div>
          </div>

          <div className="scroll" style={{ marginTop: '1rem' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Notation Format</th>
                  <th>Formatted Expression</th>
                </tr>
              </thead>
              <tbody>
                <tr className="best">
                  <td>Scientific Notation (a × 10^b)</td>
                  <td><strong>{eNotation}</strong></td>
                </tr>
                <tr>
                  <td>E-Notation Format</td>
                  <td><code>{expStr}</code></td>
                </tr>
                <tr>
                  <td>Engineering Notation (exponent ÷ 3)</td>
                  <td>{engineeringNotation}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="actions" style={{ marginTop: '1rem' }}>
            <CopyBtn text={reportText} label="Copy Scientific Notation" />
            <button type="button" className="btn ghost" onClick={() => download('scientific-notation.txt', reportText)}>
              Download (.txt)
            </button>
          </div>
        </>
      )}
    </div>
  )
}
