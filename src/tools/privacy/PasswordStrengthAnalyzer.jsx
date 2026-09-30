import { useState } from 'react'
import { Field, CopyBtn } from '../../components/ui.jsx'

export default function PasswordStrengthAnalyzer() {
  const [pass, setPass] = useState('P@ssw0rd!2026_Secure')

  const len = pass.length
  const hasLower = /[a-z]/.test(pass)
  const hasUpper = /[A-Z]/.test(pass)
  const hasNumber = /[0-9]/.test(pass)
  const hasSpecial = /[^a-zA-Z0-9]/.test(pass)

  // Entropy calculation
  let charset = 0
  if (hasLower) charset += 26
  if (hasUpper) charset += 26
  if (hasNumber) charset += 10
  if (hasSpecial) charset += 32

  const entropy = charset > 0 && len > 0 ? Math.round(len * Math.log2(charset)) : 0

  let strengthLabel = 'Very Weak'
  let strengthKind = 'bad'

  if (entropy >= 80) {
    strengthLabel = 'Very Strong'
    strengthKind = 'good'
  } else if (entropy >= 60) {
    strengthLabel = 'Strong'
    strengthKind = 'good'
  } else if (entropy >= 40) {
    strengthLabel = 'Moderate'
    strengthKind = 'warn'
  } else if (entropy >= 20) {
    strengthLabel = 'Weak'
    strengthKind = 'bad'
  }

  // Estimated crack time
  let estCrackTime = 'Instantly'
  if (entropy >= 80) estCrackTime = 'Billions of Years'
  else if (entropy >= 60) estCrackTime = 'Centuries / Decades'
  else if (entropy >= 45) estCrackTime = 'Several Months'
  else if (entropy >= 30) estCrackTime = 'A Few Hours'

  return (
    <div className="tool-body">
      <div className="msg" style={{ background: 'var(--card)', borderLeft: '4px solid var(--ok)', marginBottom: '1rem' }}>
        🔒 <strong>Local Analysis Only:</strong> Your password is evaluated purely in your local browser state. Nothing is transmitted over the network or saved anywhere.
      </div>

      <Field label="Enter Password to Analyze">
        <input
          type="text"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Type password..."
        />
      </Field>

      <div className="out" style={{ marginTop: '1rem' }}>
        <div>
          Strength Assessment: <strong className={strengthKind === 'good' ? 'good' : 'bad'}>{strengthLabel}</strong> ({entropy} bits of entropy)
        </div>
        <div className="hint" style={{ marginTop: '0.4rem' }}>
          Estimated Offline Brute-Force Crack Time: <strong>{estCrackTime}</strong>
        </div>
      </div>

      <div className="meter" style={{ marginTop: '1rem' }}>
        <span
          style={{
            width: `${Math.min(100, (entropy / 90) * 100)}%`,
            background: entropy >= 60 ? 'var(--ok)' : entropy >= 40 ? '#d97706' : 'var(--bad)',
          }}
        />
      </div>

      <div className="scroll" style={{ marginTop: '1rem' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Password Criteria</th>
              <th>Status</th>
              <th>Guidance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Length Check (≥ 12 chars)</td>
              <td className={len >= 12 ? 'good' : 'bad'}>
                <strong>{len >= 12 ? 'PASS ✓' : 'FAIL ✗'}</strong> ({len} chars)
              </td>
              <td>12+ characters significantly increases brute-force effort</td>
            </tr>
            <tr>
              <td>Uppercase Characters (A-Z)</td>
              <td className={hasUpper ? 'good' : 'bad'}>
                <strong>{hasUpper ? 'PASS ✓' : 'FAIL ✗'}</strong>
              </td>
              <td>Includes capital letters</td>
            </tr>
            <tr>
              <td>Lowercase Characters (a-z)</td>
              <td className={hasLower ? 'good' : 'bad'}>
                <strong>{hasLower ? 'PASS ✓' : 'FAIL ✗'}</strong>
              </td>
              <td>Includes lowercase letters</td>
            </tr>
            <tr>
              <td>Numeric Digits (0-9)</td>
              <td className={hasNumber ? 'good' : 'bad'}>
                <strong>{hasNumber ? 'PASS ✓' : 'FAIL ✗'}</strong>
              </td>
              <td>Includes numbers</td>
            </tr>
            <tr>
              <td>Special Symbols (!@#$)</td>
              <td className={hasSpecial ? 'good' : 'bad'}>
                <strong>{hasSpecial ? 'PASS ✓' : 'FAIL ✗'}</strong>
              </td>
              <td>Includes special symbols</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <CopyBtn text={`Password Entropy: ${entropy} bits - Strength: ${strengthLabel} - Est. Crack Time: ${estCrackTime}`} label="Copy Analysis Metrics" />
      </div>
    </div>
  )
}
