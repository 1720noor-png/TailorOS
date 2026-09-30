import { useState } from 'react'
import { Field } from '../../components/ui.jsx'

const CYCLE_MIN = 90
const FALL_ASLEEP_MIN = 14

function addMinutes(h, m, minutes) {
  const total = (h * 60 + m + minutes + 24 * 60) % (24 * 60)
  return [Math.floor(total / 60), total % 60]
}
const fmt = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`

export default function SleepCycleCalculator() {
  const [mode, setMode] = useState('wake')
  const [time, setTime] = useState('07:00')
  const [h, m] = time.split(':').map(Number)

  let results = []
  if (mode === 'wake') {
    // count back from wake time
    for (let cycles = 6; cycles >= 3; cycles--) {
      const [bh, bm] = addMinutes(h, m, -(cycles * CYCLE_MIN + FALL_ASLEEP_MIN))
      results.push({ cycles, time: fmt(bh, bm) })
    }
  } else {
    for (let cycles = 3; cycles <= 6; cycles++) {
      const [wh, wm] = addMinutes(h, m, cycles * CYCLE_MIN + FALL_ASLEEP_MIN)
      results.push({ cycles, time: fmt(wh, wm) })
    }
  }
  return (
    <div>
      <div className="row">
        <Field label="I want to"><select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="wake">Wake up at a set time — when should I go to bed?</option>
          <option value="sleep">Go to bed now — when should I wake up?</option>
        </select></Field>
        <Field label={mode === 'wake' ? 'Wake-up time' : 'Bedtime'}><input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
      </div>
      <div className="out" role="status">
        {results.map((r) => <p key={r.cycles}>{r.time} — {r.cycles} sleep cycle{r.cycles > 1 ? 's' : ''} (~{(r.cycles * 1.5).toFixed(1)} hrs)</p>)}
      </div>
      <p className="hint">Based on ~90-minute sleep cycles and a 14-minute average time to fall asleep. Waking at the end of a cycle (not mid-cycle) tends to feel less groggy.</p>
    </div>
  )
}
