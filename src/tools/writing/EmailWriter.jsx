import { useState } from 'react'

export default function EmailWriter() {
  const [purpose, setPurpose] = useState('')
  const [recipient, setRecipient] = useState('')
  const [tone, setTone] = useState('professional')
  const [keyPoints, setKeyPoints] = useState('')
  const [generatedEmail, setGeneratedEmail] = useState('')

  const generateEmail = () => {
    const points = keyPoints ? keyPoints.split('\n').filter((p) => p.trim()) : []
    let subject = `Regarding ${purpose || 'Our Discussion'}`
    let salutation = `Dear ${recipient || 'Hiring Team'},`
    let signoff = 'Best regards,'

    if (tone === 'casual') {
      salutation = `Hi ${recipient || 'there'},`
      signoff = 'Cheers,'
    } else if (tone === 'urgent') {
      subject = `[URGENT] ${purpose || 'Action Required'}`
      salutation = `Dear ${recipient || 'Team'},`
    }

    let body = `I hope this email finds you well.\n\nI am writing to you regarding ${purpose || 'our ongoing project'}.\n\n`

    if (points.length > 0) {
      body += `Here are the key details to note:\n`
      points.forEach((point) => {
        body += `• ${point.trim()}\n`
      })
      body += '\n'
    }

    body += `Please let me know if you have any questions or need further clarification.\n\n${signoff}\n[Your Name]`

    setGeneratedEmail(`Subject: ${subject}\n\n${salutation}\n\n${body}`)
  }

  return (
    <div className="panel">
      <h2>Email Writer</h2>
      <p className="hint">Generate structured professional email drafts for work, follow-ups, and inquiries.</p>

      <div className="row">
        <div className="field">
          <span>Email Purpose / Topic</span>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Project status update, Invoice inquiry"
          />
        </div>

        <div className="field">
          <span>Recipient Name / Role</span>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="e.g. Alex, Hiring Manager"
          />
        </div>

        <div className="field">
          <span>Tone</span>
          <select value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="urgent">Urgent / Important</option>
          </select>
        </div>
      </div>

      <div className="field">
        <span>Key Points to Include (One per line)</span>
        <textarea
          rows={4}
          value={keyPoints}
          onChange={(e) => setKeyPoints(e.target.value)}
          placeholder="e.g. Milestone 1 completed&#10;Deliverable attached&#10;Feedback requested by Friday"
        />
      </div>

      <div className="actions">
        <button className="btn" onClick={generateEmail}>Generate Email Draft</button>
      </div>

      {generatedEmail && (
        <div className="out" style={{ marginTop: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3>Generated Email Draft</h3>
            <button className="btn ghost" onClick={() => navigator.clipboard.writeText(generatedEmail)}>Copy Draft</button>
          </div>
          <div className="doc">{generatedEmail}</div>
        </div>
      )}
    </div>
  )
}
