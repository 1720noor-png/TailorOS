import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function PetAgeConverter() {
  const [petType, setPetType] = useState('dog-medium')
  const [ageYears, setAgeYears] = useState(4)

  const years = Number(ageYears) || 1

  let humanAge = 0
  let lifeStage = ''

  if (petType === 'dog-small') {
    // Small dog: 1st yr = 15, 2nd yr = +9 (+24), each yr after = +4
    humanAge = years === 1 ? 15 : years === 2 ? 24 : 24 + (years - 2) * 4
  } else if (petType === 'dog-medium') {
    humanAge = years === 1 ? 15 : years === 2 ? 24 : 24 + (years - 2) * 5
  } else if (petType === 'dog-large') {
    humanAge = years === 1 ? 14 : years === 2 ? 22 : 22 + (years - 2) * 7
  } else if (petType === 'cat') {
    // Cat: 1st yr = 15, 2nd yr = 24, each yr after = +4
    humanAge = years === 1 ? 15 : years === 2 ? 24 : 24 + (years - 2) * 4
  }

  if (humanAge < 15) lifeStage = 'Puppy / Kitten'
  else if (humanAge < 24) lifeStage = 'Junior / Young Adult'
  else if (humanAge < 50) lifeStage = 'Prime Adult'
  else if (humanAge < 65) lifeStage = 'Mature / Senior'
  else lifeStage = 'Geriatric / Super Senior'

  const reportText = `Pet Age to Human Age Conversion
----------------------------------------------
Pet Category: ${petType.toUpperCase()}
Actual Chronological Age: ${years} years

Estimated Equivalent Human Age: ~${humanAge} years old
Life Stage Classification: ${lifeStage}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="Pet Type / Size Category">
          <select value={petType} onChange={(e) => setPetType(e.target.value)}>
            <option value="dog-small">Small Dog (&lt;10 kg / 22 lbs)</option>
            <option value="dog-medium">Medium Dog (10-23 kg / 23-50 lbs)</option>
            <option value="dog-large">Large Dog (&gt;23 kg / 50 lbs)</option>
            <option value="cat">Feline / House Cat</option>
          </select>
        </Field>

        <Field label="Pet Chronological Age (Years)">
          <input type="number" min="1" max="25" value={ageYears} onChange={(e) => setAgeYears(e.target.value)} />
        </Field>
      </div>

      <div className="out">
        <div>Equivalent Human Age: <strong>~{humanAge} years old</strong></div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Life Stage: <strong>{lifeStage}</strong> | Chronological Age: {years} yrs
        </div>
      </div>

      <div className="actions" style={{ marginTop: '1.2rem' }}>
        <CopyBtn text={reportText} label="Copy Age Report" />
        <button type="button" className="btn ghost" onClick={() => download('pet-age-report.txt', reportText)}>
          Download (.txt)
        </button>
      </div>
    </div>
  )
}
