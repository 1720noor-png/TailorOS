import { useState } from 'react'

export default function SalaryNegotiationCoach() {
  const [currentOffer, setCurrentOffer] = useState(80000)
  const [targetSalary, setTargetSalary] = useState(95000)
  const [role, setRole] = useState('Software Engineer')
  const [experienceYears, setExperienceYears] = useState(4)
  const [scriptType, setScriptType] = useState('initial_counter')
  const [calculated, setCalculated] = useState(null)

  const analyzeOffer = () => {
    const offerNum = parseFloat(currentOffer) || 0
    const targetNum = parseFloat(targetSalary) || offerNum * 1.15

    const counterMin = Math.round(offerNum * 1.1)
    const counterMax = Math.round(offerNum * 1.18)
    const diff = targetNum - offerNum
    const percentIncrease = offerNum > 0 ? (((targetNum - offerNum) / offerNum) * 100).toFixed(1) : 0

    let template = ''
    if (scriptType === 'initial_counter') {
      template = `Dear Hiring Manager,

Thank you so much for extending the offer for the ${role} position. I am thrilled about the opportunity to join the team and contribute to your upcoming projects.

Based on my ${experienceYears} years of experience in the field, along with market research for comparable roles in our region, I would like to discuss the base compensation. I am aiming for a base salary around $${targetNum.toLocaleString()}. 

Given my background and proven track record, I am confident I will deliver strong value. I look forward to reaching an agreement that works for both of us.

Best regards,
[Your Name]`
    } else if (scriptType === 'equity_bonus') {
      template = `Dear Hiring Manager,

Thank you for discussing the compensation package for the ${role} role. 

If there is limited flexibility on the base salary of $${offerNum.toLocaleString()}, I would love to explore flexibility in other components of the total compensation package—such as a signing bonus, performance bonuses, or additional equity/PTO options.

Please let me know if we can discuss options to adjust the overall compensation package.

Best regards,
[Your Name]`
    } else {
      template = `Dear Hiring Manager,

Thank you for sending over the formal offer for the ${role} position. 

I am currently evaluating two strong opportunities. Because ${role} at your company remains my top preference, I would be prepared to accept the offer immediately if we can adjust the base compensation to $${targetNum.toLocaleString()}.

Thank you again for your time and consideration.

Best regards,
[Your Name]`
    }

    setCalculated({
      offerNum,
      targetNum,
      counterMin,
      counterMax,
      diff,
      percentIncrease,
      template
    })
  }

  return (
    <div className="panel">
      <h2>Salary & Negotiation Coach</h2>
      <p className="hint">Calculate negotiation target ranges and generate professional counteroffer email scripts.</p>

      <div className="row">
        <div className="field">
          <span>Target Job Role</span>
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Product Manager" />
        </div>

        <div className="field">
          <span>Years of Experience</span>
          <input type="number" min={0} max={30} value={experienceYears} onChange={(e) => setExperienceYears(parseInt(e.target.value))} />
        </div>

        <div className="field">
          <span>Initial Offered Base Salary ($)</span>
          <input type="number" step={1000} value={currentOffer} onChange={(e) => setCurrentOffer(e.target.value)} />
        </div>

        <div className="field">
          <span>Your Target Base Salary ($)</span>
          <input type="number" step={1000} value={targetSalary} onChange={(e) => setTargetSalary(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <span>Negotiation Email Script Template</span>
        <select value={scriptType} onChange={(e) => setScriptType(e.target.value)}>
          <option value="initial_counter">Standard Base Salary Counteroffer</option>
          <option value="equity_bonus">Signing Bonus / Perks Counteroffer</option>
          <option value="competing_offer">Competing Offer Leverage Script</option>
        </select>
      </div>

      <div className="actions">
        <button className="btn" onClick={analyzeOffer}>Analyze Offer & Generate Script</button>
      </div>

      {calculated && (
        <div className="out" style={{ marginTop: '1.2rem' }}>
          <h3>Negotiation Strategy Breakdown</h3>
          <div className="row" style={{ marginBottom: '1rem' }}>
            <div>Current Offer: <strong>${calculated.offerNum.toLocaleString()}</strong></div>
            <div>Target Salary: <strong>${calculated.targetNum.toLocaleString()}</strong> (+{calculated.percentIncrease}%)</div>
            <div>Recommended Counter Range: <strong>${calculated.counterMin.toLocaleString()} - ${calculated.counterMax.toLocaleString()}</strong></div>
          </div>

          <p className="hint" style={{ fontSize: '0.85rem' }}>
            💡 Strategy Note: Standard industry counteroffers typically aim between +10% and +18% above initial base offers depending on market demand and experience.
          </p>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <h4>Negotiation Email Script</h4>
              <button className="btn ghost" onClick={() => navigator.clipboard.writeText(calculated.template)}>Copy Script</button>
            </div>
            <div className="doc">{calculated.template}</div>
          </div>
        </div>
      )}
    </div>
  )
}
