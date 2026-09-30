import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            background: '#1e293b',
            borderRadius: '16px',
            padding: '2.5rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
            border: '1px solid #334155',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Vimztools encountered an unexpected issue while rendering this view.
            </p>
            {this.state.error && (
              <pre style={{
                textAlign: 'left',
                background: '#090d16',
                color: '#f87171',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                overflowX: 'auto',
                marginBottom: '1.5rem'
              }}>
                {this.state.error.toString()}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Go to Homepage
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#334155',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
