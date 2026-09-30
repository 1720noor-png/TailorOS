import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Field, Msg } from '../components/ui.jsx'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', category: 'General', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return
    setSubmitted(true)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> / <span>Contact</span>
      </nav>

      <section className="section-head">
        <div>
          <span className="eyebrow-sm">Get in Touch</span>
          <h1>Contact & Support</h1>
          <p>Questions, feedback, or suggestions? We'd love to hear from you.</p>
        </div>
      </section>

      <div className="panel">
        {submitted ? (
          <div className="out" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <span style={{ fontSize: '3rem' }}>✉️</span>
            <h3>Message Received!</h3>
            <p>Thank you for reaching out. We review community inquiries and tool enhancement requests regularly.</p>
            <button className="btn" style={{ marginTop: '1rem' }} onClick={() => setSubmitted(false)}>Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row">
              <Field label="Your Name">
                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Alex Smith" />
              </Field>
              <Field label="Email Address">
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="alex@example.com" />
              </Field>
            </div>

            <Field label="Topic">
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option value="General">General Inquiry</option>
                <option value="Bug">Report a Bug / Issue</option>
                <option value="Feature">Tool Feature Request</option>
                <option value="Feedback">Feedback / Review</option>
              </select>
            </Field>

            <Field label="Your Message">
              <textarea required rows={6} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="How can we help you today?" />
            </Field>

            <div className="actions">
              <button type="submit" className="btn">Send Message</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
