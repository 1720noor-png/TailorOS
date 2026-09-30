import { useEffect } from 'react'
import { Link } from 'react-router-dom'
export default function NotFound() {
  useEffect(() => { document.title = 'Page not found – ToolHub' }, [])
  return (
    <section className="empty">
      <h1>Page not found</h1>
      <p>That address doesn't match a tool or category.</p>
      <div className="actions center">
        <Link className="btn" to="/">Back to Home</Link>
        <Link className="btn ghost" to="/tools">Browse all tools</Link>
      </div>
    </section>
  )
}
