import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function DaylightSolarCalculator() {
  const [lat, setLat] = useState(40.7128)
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0])

  const d = new Date(dateStr || new Date())
  const latitude = Number(lat) || 0

  // Approximate day of year
  const startYear = new Date(d.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((d.getTime() - startYear.getTime()) / (1000 * 60 * 60 * 24))

  // Solar declination approx delta = 23.45 * sin(360/365 * (284 + dayOfYear))
  const deltaRad = (23.45 * Math.sin(((360 / 365) * (284 + dayOfYear) * Math.PI) / 180) * Math.PI) / 180
  const latRad = (latitude * Math.PI) / 180

  // Hour angle omega = acos(-tan(lat) * tan(delta))
  const tanProd = -Math.tan(latRad) * Math.tan(deltaRad)
  let dayLengthHours = 12

  if (tanProd >= 1) {
    dayLengthHours = 0 // polar night
  } else if (tanProd <= -1) {
    dayLengthHours = 24 // midnight sun
  } else {
    const omegaRad = Math.acos(tanProd)
    dayLengthHours = (2 * (omegaRad * 180 / Math.PI)) / 15
  }

  const h = Math.floor(dayLengthHours)
  const m = Math.round((dayLengthHours - h) * 60)

  // Solar noon approx 12:00 PM local
  const sunriseHours = 12 - dayLengthHours / 2
  const sunsetHours = 12 + dayLengthHours / 2

  const fmtTimeOfDay = (hours) => {
    const hrs = Math.floor(hours)
    const mins = Math.round((hours - hrs) * 60)
    const ampm = hrs >= 12 ? 'PM' : 'AM'
    const displayH = hrs > 12 ? hrs - 12 : hrs === 0 ? 12 : hrs
    return `${displayH}:${mins < 10 ? '0' : ''}${mins} ${ampm}`
  }

  const reportText = `Daylight Hours & Solar Time Calculation
-------------------------------------------------------
Latitude: ${latitude}°
Date: ${dateStr} (Day ${dayOfYear} of year)

Sun & Solar Results:
• Total Daylight Duration: ${h} hours ${m} minutes (${dayLengthHours.toFixed(2)} hrs)
• Approximate Solar Sunrise: ${fmtTimeOfDay(sunriseHours)}
• Solar Noon: 12:00 PM (Local Solar Time)
• Approximate Solar Sunset: ${fmtTimeOfDay(sunsetHours)}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Latitude (° N/S)">
          <input type="number" step="0.01" min="-90" max="90" value={lat} onChange={(e) => setLat(e.target.value)} />
        </Field>
        <Field label="Calendar Date">
          <input type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Daylight Duration: <strong>{h} hours {m} minutes</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Approx. Sunrise: <strong>{fmtTimeOfDay(sunriseHours)}</strong> | Approx. Sunset: <strong>{fmtTimeOfDay(sunsetHours)}</strong>
        </div>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Solar Report" />
        <button type="button" className="btn ghost" onClick={() => download('daylight-solar-report.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
