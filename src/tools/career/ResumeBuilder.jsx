import { useState, useRef } from 'react'

export default function ResumeBuilder() {
  const [fullName, setFullName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [summary, setSummary] = useState('')
  const [skills, setSkills] = useState('')

  const [experiences, setExperiences] = useState([
    { id: 1, role: 'Software Engineer', company: 'Tech Corp', duration: '2022 - Present', description: 'Developed web applications and responsive tools.' }
  ])

  const [education, setEducation] = useState([
    { id: 1, degree: 'B.S. Computer Science', institution: 'State University', year: '2018 - 2022' }
  ])

  const cvRef = useRef(null)

  const addExperience = () => {
    setExperiences((prev) => [...prev, { id: Date.now(), role: '', company: '', duration: '', description: '' }])
  }

  const updateExperience = (id, field, value) => {
    setExperiences((prev) => prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const removeExperience = (id) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id))
  }

  const addEducation = () => {
    setEducation((prev) => [...prev, { id: Date.now(), degree: '', institution: '', year: '' }])
  }

  const updateEducation = (id, field, value) => {
    setEducation((prev) => prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)))
  }

  const removeEducation = (id) => {
    setEducation((prev) => prev.filter((edu) => edu.id !== id))
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="panel">
      <h2>Resume / CV Builder</h2>
      <p className="hint">Build an editable professional resume and print or export it cleanly.</p>

      <h3>1. Personal Details</h3>
      <div className="row">
        <div className="field">
          <span>Full Name</span>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="field">
          <span>Job Title</span>
          <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Frontend Developer" />
        </div>
        <div className="field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
        </div>
        <div className="field">
          <span>Phone</span>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" />
        </div>
        <div className="field">
          <span>Location</span>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="New York, NY" />
        </div>
      </div>

      <div className="field">
        <span>Executive Summary</span>
        <textarea rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief summary of your background..." />
      </div>

      <h3>2. Work Experience</h3>
      {experiences.map((exp, idx) => (
        <div key={exp.id} className="doc" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <strong>Experience #{idx + 1}</strong>
            {experiences.length > 1 && (
              <button className="btn ghost" style={{ color: 'var(--bad)', padding: '0.1rem 0.4rem' }} onClick={() => removeExperience(exp.id)}>Remove</button>
            )}
          </div>
          <div className="row">
            <input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="Role / Job Title" />
            <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company Name" />
            <input type="text" value={exp.duration} onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)} placeholder="Duration (e.g. 2021 - 2023)" />
          </div>
          <textarea rows={2} style={{ marginTop: '0.5rem' }} value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder="Key responsibilities and achievements..." />
        </div>
      ))}
      <button className="btn ghost" onClick={addExperience}>+ Add Work Experience</button>

      <h3 style={{ marginTop: '1.5rem' }}>3. Education</h3>
      {education.map((edu, idx) => (
        <div key={edu.id} className="doc" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <strong>Education #{idx + 1}</strong>
            {education.length > 1 && (
              <button className="btn ghost" style={{ color: 'var(--bad)', padding: '0.1rem 0.4rem' }} onClick={() => removeEducation(edu.id)}>Remove</button>
            )}
          </div>
          <div className="row">
            <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Degree Name" />
            <input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} placeholder="School / University" />
            <input type="text" value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} placeholder="Year (e.g. 2018 - 2022)" />
          </div>
        </div>
      ))}
      <button className="btn ghost" onClick={addEducation}>+ Add Education</button>

      <h3 style={{ marginTop: '1.5rem' }}>4. Skills</h3>
      <div className="field">
        <span>Skills (comma separated)</span>
        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="JavaScript, React, Node.js, CSS, Git" />
      </div>

      <div className="actions" style={{ marginTop: '1.5rem' }}>
        <button className="btn" onClick={handlePrint}>🖨️ Print / Save CV as PDF</button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Resume Live Preview</h3>
        <div ref={cvRef} className="paper" style={{ padding: '2rem', border: '1px solid var(--line)' }}>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>{fullName || 'Your Full Name'}</h1>
          <p style={{ color: 'var(--brand)', fontWeight: 600, margin: '0.2rem 0 0.8rem' }}>{jobTitle || 'Professional Title'}</p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--muted)', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
            {email && <span>📧 {email}</span>}
            {phone && <span>📞 {phone}</span>}
            {location && <span>📍 {location}</span>}
          </div>

          {summary && (
            <div style={{ marginBottom: '1.2rem' }}>
              <h4 style={{ textTransform: 'uppercase', color: 'var(--brand)', margin: '0 0 0.3rem' }}>Summary</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{summary}</p>
            </div>
          )}

          <div style={{ marginBottom: '1.2rem' }}>
            <h4 style={{ textTransform: 'uppercase', color: 'var(--brand)', margin: '0 0 0.5rem' }}>Experience</h4>
            {experiences.map((e) => (
              <div key={e.id} style={{ marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>{e.role || 'Role'}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{e.duration}</span>
                </div>
                <div style={{ color: 'var(--brand)', fontSize: '0.85rem', fontWeight: 600 }}>{e.company}</div>
                <p style={{ fontSize: '0.85rem', margin: '0.2rem 0' }}>{e.description}</p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <h4 style={{ textTransform: 'uppercase', color: 'var(--brand)', margin: '0 0 0.5rem' }}>Education</h4>
            {education.map((e) => (
              <div key={e.id} style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>{e.degree || 'Degree'}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{e.year}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{e.institution}</div>
              </div>
            ))}
          </div>

          {skills && (
            <div>
              <h4 style={{ textTransform: 'uppercase', color: 'var(--brand)', margin: '0 0 0.5rem' }}>Skills</h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {skills.split(',').map((s, i) => (
                  <span key={i} style={{ background: 'var(--bg)', border: '1px solid var(--line)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
