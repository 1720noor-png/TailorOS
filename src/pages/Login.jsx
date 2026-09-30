import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      nav('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid login credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card-wrap">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">Account Access</span>
          <h2>Sign in to VimzTools</h2>
          <p>Access your one-time tool purchases, saved computations, and favorites.</p>
        </div>

        {error && <div className="alert-box error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-demo-hint">
          <strong>Demo Credentials:</strong>
          <div>User: <code>user@vimztools.com</code> / <code>DemoUser2026!</code></div>
          <div>Admin: <code>admin@vimztools.com</code> / <code>AdminVimz2026!</code></div>
        </div>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create free account</Link>
        </div>
      </div>
    </div>
  )
}
