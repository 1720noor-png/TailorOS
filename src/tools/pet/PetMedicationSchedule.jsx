import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function PetMedicationSchedule() {
  const [petName, setPetName] = useState('Luna')
  const [meds, setMeds] = useState([
    { id: 1, name: 'Joint Supplement Chew', dosage: '1 Tablet', time: '08:00 AM', notes: 'Give with morning meal' },
    { id: 2, name: 'Flea & Tick Topical', dosage: '1 Applicator', time: 'Monthly (1st of month)', notes: 'Apply between shoulder blades' },
  ])

  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')

  const addMed = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setMeds((prev) => [
      ...prev,
      { id: Date.now(), name: name.trim(), dosage: dosage.trim() || '1 Dose', time: time.trim() || '08:00 AM', notes: notes.trim() },
    ])
    setName('')
    setDosage('')
    setTime('')
    setNotes('')
  }

  const removeMed = (id) => {
    setMeds((prev) => prev.filter((m) => m.id !== id))
  }

  const reportText = `Pet Medication Schedule Log for ${petName}
------------------------------------------------------
DISCLAIMER: Tool for reminder scheduling only. Always consult your veterinarian for medical advice.

Medication Schedule:
${meds.map((m) => `• [${m.time}] ${m.name} (${m.dosage}) - Notes: ${m.notes || 'None'}`).join('\n')}`

  return (
    <div className="tool-body">
      <div className="msg" style={{ background: 'var(--card)', borderLeft: '4px solid var(--brand)', marginBottom: '1rem' }}>
        ℹ️ <strong>Reminder Utility:</strong> This tool is for personal scheduling and reminder notes only. It does not provide medical diagnoses or veterinary treatment recommendations.
      </div>

      <div className="row">
        <Field label="Pet Name">
          <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} />
        </Field>
      </div>

      <form onSubmit={addMed} className="row" style={{ marginBottom: '1rem' }}>
        <Field label="Medication / Supplement">
          <input type="text" placeholder="e.g. Ear Drops" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Dosage Amount">
          <input type="text" placeholder="e.g. 2 drops / 1 pill" value={dosage} onChange={(e) => setDosage(e.target.value)} />
        </Field>
        <Field label="Schedule Time / Frequency">
          <input type="text" placeholder="e.g. 08:00 AM & 08:00 PM" value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
        <Field label="Instructions / Notes">
          <input type="text" placeholder="e.g. Take after food" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <div style={{ display: 'flex', alignItems: 'end', marginBottom: '0.8rem' }}>
          <button type="submit" className="btn">
            ➕ Add Reminder
          </button>
        </div>
      </form>

      <div className="scroll">
        <table className="tbl">
          <thead>
            <tr>
              <th>Time / Frequency</th>
              <th>Medication Name</th>
              <th>Dosage</th>
              <th>Administration Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {meds.map((m) => (
              <tr key={m.id}>
                <td><strong>{m.time}</strong></td>
                <td>{m.name}</td>
                <td>{m.dosage}</td>
                <td>{m.notes || '—'}</td>
                <td>
                  <button
                    type="button"
                    className="btn ghost"
                    style={{ color: 'var(--bad)', borderColor: 'var(--bad)' }}
                    onClick={() => removeMed(m.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={reportText} label="Copy Schedule" />
        <button type="button" className="btn ghost" onClick={() => download('pet-medication-schedule.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
