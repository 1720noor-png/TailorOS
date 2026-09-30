import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function FuelCostCalculator() {
  const [distance, setDistance] = useState(450)
  const [efficiency, setEfficiency] = useState(7.5) // L/100km or MPG
  const [fuelPrice, setFuelPrice] = useState(1.65) // per Liter or Gallon
  const [passengers, setPassengers] = useState(3)
  const [roundTrip, setRoundTrip] = useState(true)
  const [unitSystem, setUnitSystem] = useState('metric') // 'metric' (km, L/100km, $/L) or 'imperial' (miles, MPG, $/gal)

  const dist = Number(distance) || 0
  const eff = Number(efficiency) || 1
  const price = Number(fuelPrice) || 0
  const pax = Math.max(1, Number(passengers) || 1)

  const totalDistance = roundTrip ? dist * 2 : dist

  let totalFuelNeeded = 0
  if (unitSystem === 'metric') {
    // Distance in km, Efficiency in L/100km
    totalFuelNeeded = (totalDistance / 100) * eff
  } else {
    // Distance in miles, Efficiency in MPG (miles per gallon)
    totalFuelNeeded = totalDistance / eff
  }

  const totalFuelCost = totalFuelNeeded * price
  const costPerPerson = totalFuelCost / pax

  const fmt = (val) => '$' + val.toFixed(2)

  const reportText = `Road Trip & Fuel Cost Estimation
--------------------------------------------------
Unit System: ${unitSystem.toUpperCase()}
One-Way Distance: ${dist} ${unitSystem === 'metric' ? 'km' : 'miles'}
Trip Type: ${roundTrip ? 'Round Trip' : 'One Way'} (Total: ${totalDistance} ${unitSystem === 'metric' ? 'km' : 'miles'})
Fuel Efficiency: ${eff} ${unitSystem === 'metric' ? 'L/100km' : 'MPG'}
Fuel Price: ${fmt(price)} per ${unitSystem === 'metric' ? 'Liter' : 'Gallon'}
Passengers: ${pax} people

Total Fuel Required: ${totalFuelNeeded.toFixed(2)} ${unitSystem === 'metric' ? 'Liters' : 'Gallons'}
Total Trip Fuel Cost: ${fmt(totalFuelCost)}
Cost Per Passenger: ${fmt(costPerPerson)}`

  return (
    <div className="tool-body">
      <div className="actions" style={{ marginBottom: '1.2rem' }}>
        <button
          type="button"
          className={`btn ${unitSystem === 'metric' ? '' : 'ghost'}`}
          onClick={() => setUnitSystem('metric')}
        >
          Metric (km / Liters / L per 100km)
        </button>
        <button
          type="button"
          className={`btn ${unitSystem === 'imperial' ? '' : 'ghost'}`}
          onClick={() => setUnitSystem('imperial')}
        >
          Imperial (Miles / Gallons / MPG)
        </button>
      </div>

      <div className="row">
        <Field label={`One-Way Distance (${unitSystem === 'metric' ? 'km' : 'miles'})`}>
          <input type="number" min="1" value={distance} onChange={(e) => setDistance(e.target.value)} />
        </Field>
        <Field label={`Fuel Efficiency (${unitSystem === 'metric' ? 'L / 100km' : 'MPG'})`}>
          <input type="number" step="0.1" min="0.1" value={efficiency} onChange={(e) => setEfficiency(e.target.value)} />
        </Field>
        <Field label={`Gas Price (${unitSystem === 'metric' ? '$ / Liter' : '$ / Gallon'})`}>
          <input type="number" step="0.01" min="0" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} />
        </Field>
        <Field label="Passengers Count">
          <input type="number" min="1" max="50" value={passengers} onChange={(e) => setPassengers(e.target.value)} />
        </Field>
      </div>

      <div style={{ margin: '1rem 0' }}>
        <label className="check">
          <input type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} />
          Round Trip (Double Distance to {dist * 2} {unitSystem === 'metric' ? 'km' : 'miles'})
        </label>
      </div>

      <div className="out">
        <div>Total Trip Fuel Cost: <strong>{fmt(totalFuelCost)}</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Cost Per Passenger ({pax} pax): <strong className="good">{fmt(costPerPerson)}</strong> | Fuel Required: {totalFuelNeeded.toFixed(1)} {unitSystem === 'metric' ? 'L' : 'gal'}
        </div>
      </div>

      <div className="actions" style={{ marginTop: '1.2rem' }}>
        <CopyBtn text={reportText} label="Copy Trip Fuel Summary" />
        <button type="button" className="btn ghost" onClick={() => download('fuel-cost-report.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
