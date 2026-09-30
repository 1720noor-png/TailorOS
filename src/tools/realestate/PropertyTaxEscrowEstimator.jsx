import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function PropertyTaxEscrowEstimator() {
  const [homeValue, setHomeValue] = useState('350000')
  const [taxRate, setTaxRate] = useState('1.25')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const v = parseFloat(homeValue), r = parseFloat(taxRate)
      if (isNaN(v) || isNaN(r) || v <= 0 || r < 0) return setErr('Enter valid home value and tax rate.')
      setErr('')
      const annualTax = (v * r) / 100
      const monthlyEscrow = annualTax / 12
      setRes({ val: `Annual Tax: $${annualTax.toFixed(2)} | Monthly Escrow: $${monthlyEscrow.toFixed(2)}/mo`, copyText: `Annual Property Tax: $${annualTax.toFixed(2)}, Monthly Escrow: $${monthlyEscrow.toFixed(2)}` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setHomeValue('350000'); setTaxRate('1.25'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Assessed Home Value ($)">
          <input type="number"  value={homeValue} onChange={(e) => setHomeValue(e.target.value)} placeholder="" />
        </Field>
        <Field label="Property Tax Rate (%)">
          <input type="number" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="" />
        </Field>
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={calc}>Calculate / Process</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
      </div>
      <Msg>{err}</Msg>
      {res && (
        <div className="out" role="status" style={{ marginTop: '1rem' }}>
          {typeof res === 'string' ? (
            <p>Result: <strong>{res}</strong></p>
          ) : (
            <div>
              <p>Result: <strong>{res.val}</strong></p>
            </div>
          )}
          <CopyBtn text={typeof res === 'string' ? res : (res.copyText || JSON.stringify(res))} />
        </div>
      )}
    </div>
  )
}