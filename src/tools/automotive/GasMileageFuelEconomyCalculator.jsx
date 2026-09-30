import { useState } from 'react'
import { Field, Msg, CopyBtn } from '../../components/ui.jsx'

export default function GasMileageFuelEconomyCalculator() {
  const [dist, setDist] = useState('350')
  const [gallons, setGallons] = useState('11.5')
  const [gasPrice, setGasPrice] = useState('3.65')
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')

  const calc = () => {
    try {
      
      const d = parseFloat(dist), g = parseFloat(gallons), p = parseFloat(gasPrice)
      if (isNaN(d) || isNaN(g) || isNaN(p) || d <= 0 || g <= 0 || p <= 0) return setErr('Enter valid distance, fuel used, and price.')
      setErr('')
      const mpg = d / g
      const lPer100km = 235.215 / mpg
      const totalTripCost = g * p
      const costPerMile = totalTripCost / d
      setRes({ val: `${mpg.toFixed(1)} MPG (${lPer100km.toFixed(1)} L/100km) | Trip Cost: $${totalTripCost.toFixed(2)} ($${costPerMile.toFixed(2)}/mi)`, copyText: `Mileage: ${mpg.toFixed(1)} MPG. Trip Cost: $${totalTripCost.toFixed(2)} for ${d} miles.` })
    
    } catch (e) {
      setErr(e.message || 'Calculation error.')
    }
  }

  const reset = () => { setDist('350'); setGallons('11.5'); setGasPrice('3.65'); setRes(null); setErr('') }

  return (
    <div>
      <div className="row">
        
        
        <Field label="Distance Traveled (Miles)">
          <input type="number"  value={dist} onChange={(e) => setDist(e.target.value)} placeholder="" />
        </Field>
        <Field label="Fuel Used (Gallons)">
          <input type="number" step="0.1" value={gallons} onChange={(e) => setGallons(e.target.value)} placeholder="" />
        </Field>
        <Field label="Gas Price ($ / Gallon)">
          <input type="number" step="0.01" value={gasPrice} onChange={(e) => setGasPrice(e.target.value)} placeholder="" />
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