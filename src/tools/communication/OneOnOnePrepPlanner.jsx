import { useState } from 'react'
import { Field, CopyBtn, download } from '../../components/ui.jsx'

export default function OneOnOnePrepPlanner() {
  const [partner, setPartner] = useState('Alex (Manager)')
  const [roleType, setRoleType] = useState('direct-report') // 'direct-report', 'manager', 'peer'
  const [wins, setWins] = useState('Completed feature launch ahead of schedule, resolved main user feedback.')
  const [blockers, setBlockers] = useState('Waiting on design specs for upcoming dashboard components.')
  const [topics, setTopics] = useState('Career development goals, Q4 project priorities.')

  const reportText = `1-on-1 Meeting Preparation Plan
--------------------------------------------------
Meeting Partner: ${partner}
Role Context: ${roleType.replace('-', ' ').toUpperCase()}

Highlights & Recent Wins:
• ${wins}

Current Blockers / Help Needed:
• ${blockers}

Key Discussion Topics & Growth:
• ${topics}`

  return (
    <div className="tool-body">
      <div className="row">
        <Field label="1-on-1 Partner Name / Role">
          <input type="text" value={partner} onChange={(e) => setPartner(e.target.value)} />
        </Field>
        <Field label="Meeting Context">
          <select value={roleType} onChange={(e) => setRoleType(e.target.value)}>
            <option value="direct-report">With My Manager (Report to Manager)</option>
            <option value="manager">With My Team Member (Manager to Report)</option>
            <option value="peer">Peer / Cross-functional Partner</option>
          </select>
        </Field>
      </div>

      <Field label="Recent Wins & Accomplishments">
        <textarea rows={2} value={wins} onChange={(e) => setWins(e.target.value)} />
      </Field>

      <Field label="Current Blockers / Support Needed">
        <textarea rows={2} value={blockers} onChange={(e) => setBlockers(e.target.value)} />
      </Field>

      <Field label="Discussion Topics & Career Goals">
        <textarea rows={2} value={topics} onChange={(e) => setTopics(e.target.value)} />
      </Field>

      <div className="out">
        <div style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Prepared Meeting Outline:</div>
        <pre className="hl">{reportText}</pre>
      </div>

      <div className="actions">
        <CopyBtn text={reportText} label="Copy 1-on-1 Outline" />
        <button type="button" className="btn ghost" onClick={() => download('one-on-one-prep.txt', reportText)}>
          Download Outline (.txt)
        </button>
      </div>
    </div>
  )
}
