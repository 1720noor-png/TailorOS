import { useState } from 'react'
import { Field, Msg } from '../../components/ui.jsx'

export default function LanguageStudyStreakTracker() {
  const [startDate, setStartDate] = useState('')
  const [missedDays, setMissedDays] = useState('0')
  const [goalDays, setGoalDays] = useState('30')
  const [err, setErr] = useState('')
  const [out, setOut] = useState(null)

  const calc = () => {
    if (!startDate) { setOut(null); return setErr('Enter the date you started studying.') }
    const start = new Date(startDate + 'T00:00:00')
    if (isNaN(start)) { setOut(null); return setErr('Enter a valid date.') }
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const totalDays = Math.max(0, Math.round((today - start) / 86400000) + 1)
    const missed = Number(missedDays) || 0
    const streak = Math.max(0, totalDays - missed)
    const goal = Number(goalDays) || 0
    const consistency = totalDays > 0 ? ((streak / totalDays) * 100).toFixed(0) : 0
    setErr('')
    setOut({ totalDays, streak, consistency, daysToGoal: Math.max(0, goal - streak) })
  }

  return (
    <div>
      <div className="row">
        <Field label="Study start date"><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Field>
        <Field label="Days missed so far"><input type="number" min="0" value={missedDays} onChange={(e) => setMissedDays(e.target.value)} /></Field>
        <Field label="Streak goal (days)"><input type="number" min="1" value={goalDays} onChange={(e) => setGoalDays(e.target.value)} /></Field>
      </div>
      <div className="actions"><button className="btn" onClick={calc}>Calculate streak</button></div>
      <Msg>{err}</Msg>
      {out && (
        <p className="out" role="status">
          Current streak: <strong>{out.streak} days</strong> out of {out.totalDays} since you started ({out.consistency}% consistency)<br />
          {out.daysToGoal > 0 ? <>Keep it up for <strong>{out.daysToGoal} more day{out.daysToGoal === 1 ? '' : 's'}</strong> to hit your goal.</> : <>Goal reached! 🎉</>}
        </p>
      )}
    </div>
  )
}
