import { useState } from 'react'

export default function CoverLetterGenerator() {
  const [name, setName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [skills, setSkills] = useState('')
  const [experience, setExperience] = useState('')
  const [generatedLetter, setGeneratedLetter] = useState('')

  const generateLetter = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const skillsList = skills ? skills.split(',').map((s) => s.trim()).join(', ') : 'key industry competencies'

    const letter = `${name || '[Your Name]'}
[Your Email / Phone]
[Your Location]

${today}

Hiring Manager / Talent Acquisition Team
${company || '[Target Company]'}

Dear Hiring Team,

I am writing to express my strong interest in the ${jobTitle || '[Target Role]'} position at ${company || '[Company Name]'}. With a proven track record in ${skillsList}, I am confident in my ability to make an immediate, positive impact on your team.

Throughout my professional background, I have developed expertise in ${experience || 'delivering high-quality projects and driving impactful results'}. I am particularly drawn to ${company || 'your organization'} because of your commitment to excellence and innovation in the field.

My key qualifications include:
• Expertise in ${skillsList} with a focus on problem-solving and efficiency.
• Strong collaboration skills and a track record of driving projects to successful completion.
• ${experience || 'Demonstrated ability to adapt quickly and deliver results under tight deadlines.'}

I am eager to bring my background, passion, and skills to ${company || 'your team'}. Thank you for your time and consideration. I look forward to the opportunity to discuss how my experience aligns with your goals.

Sincerely,

${name || '[Your Full Name]'}`

    setGeneratedLetter(letter)
  }

  return (
    <div className="panel">
      <h2>Cover Letter Generator</h2>
      <p className="hint">Generate tailored, professional cover letters for job applications.</p>

      <div className="row">
        <div className="field">
          <span>Your Full Name</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Smith" />
        </div>

        <div className="field">
          <span>Target Job Title</span>
          <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Senior Software Engineer" />
        </div>

        <div className="field">
          <span>Company Name</span>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." />
        </div>
      </div>

      <div className="field">
        <span>Key Skills (comma separated)</span>
        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Python, System Architecture, Agile" />
      </div>

      <div className="field">
        <span>Key Achievements / Experience Summary</span>
        <textarea rows={3} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5+ years building scalable SaaS applications and leading cross-functional teams" />
      </div>

      <div className="actions">
        <button className="btn" onClick={generateLetter}>Generate Cover Letter</button>
      </div>

      {generatedLetter && (
        <div className="out" style={{ marginTop: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3>Generated Cover Letter</h3>
            <button className="btn ghost" onClick={() => navigator.clipboard.writeText(generatedLetter)}>Copy Letter</button>
          </div>
          <div className="doc">{generatedLetter}</div>
        </div>
      )}
    </div>
  )
}
