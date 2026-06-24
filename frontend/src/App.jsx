import { useState } from 'react'
import { CheckCircle2, Copy, KeyRound, LogIn, LogOut, RefreshCw, ShieldCheck } from 'lucide-react'
import './App.css'

const API_BASE_URL = '/api'
const MICROSOFT_CERTIFICATIONS_2026 = [
  {
    title: 'Microsoft 365 Certified: Copilot and Agent Administration Fundamentals',
    exam: 'AB-900',
    link: 'https://learn.microsoft.com/en-us/certifications/microsoft-365-copilot-agent-administration-fundamentals/',
  },
  {
    title: 'Microsoft Certified: Agentic AI Business Solutions Architect',
    exam: 'AB-100',
    link: 'https://learn.microsoft.com/en-us/certifications/agentic-ai-business-solutions-architect/',
  },
  {
    title: 'Microsoft Certified: Azure AI App and Agent Developer',
    exam: 'AI-103',
    link: 'https://learn.microsoft.com/en-us/certifications/azure-ai-app-agent-developer/',
  },
  {
    title: 'Microsoft Certified: Cloud and AI Security Engineer Associate',
    exam: 'SC-500',
    link: 'https://learn.microsoft.com/en-us/certifications/cloud-ai-security-engineer/',
  },
]

function compactToken(token) {
  if (!token) return 'Sin token activo'
  return `${token.slice(0, 18)}...${token.slice(-14)}`
}

function getExpiryTime(seconds) {
  if (!seconds) return 'Pendiente'

  const expiresAt = new Date(Date.now() + seconds * 1000)
  return expiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function App() {
  const [credentials, setCredentials] = useState({ username: 'admin', password: 'admin123' })
  const [session, setSession] = useState(null)
  const [status, setStatus] = useState({ type: 'idle', message: 'Listo para autenticar' })
  const [isLoading, setIsLoading] = useState(false)

  async function requestTokens(path, body, successMessage) {
    setIsLoading(true)
    setStatus({ type: 'loading', message: 'Conectando con el API' })

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.detail || 'No se pudo completar la solicitud')
      }

      setSession(payload)
      setStatus({ type: 'success', message: successMessage })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    setCredentials((currentCredentials) => ({ ...currentCredentials, [name]: value }))
  }

  function handleLogin(event) {
    event.preventDefault()
    requestTokens('/token', credentials, 'Sesion iniciada')
  }

  function handleRefresh() {
    if (!session?.refresh_token) {
      setStatus({ type: 'error', message: 'Primero inicia sesion' })
      return
    }

    requestTokens('/token/refresh', { refresh_token: session.refresh_token }, 'Token renovado')
  }

  async function copyAccessToken() {
    if (!session?.access_token) return
    await navigator.clipboard.writeText(session.access_token)
    setStatus({ type: 'success', message: 'Access token copiado' })
  }

  function clearSession() {
    setSession(null)
    setStatus({ type: 'idle', message: 'Sesion cerrada' })
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="brand-mark">
          <ShieldCheck size={32} strokeWidth={1.8} />
        </div>
        <p className="eyebrow">JWT Auth Console</p>
        <h1>Acceso seguro, tokens claros.</h1>
        <div className="session-meter" aria-label="Estado de sesion">
          <span className={`status-dot ${status.type}`} />
          <span>{status.message}</span>
        </div>
        <section className="certifications-panel" aria-label="Certificaciones Microsoft 2026">
          <p className="certifications-title">Certificaciones Microsoft 2026</p>
          <div className="certifications-grid">
            {MICROSOFT_CERTIFICATIONS_2026.map((certification) => (
              <article className="certification-card" key={certification.exam}>
                <p>{certification.exam}</p>
                <h3>{certification.title}</h3>
                <a href={certification.link} rel="noreferrer" target="_blank">
                  Ver en Microsoft Learn
                </a>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="auth-workspace" aria-label="Panel de autenticacion">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-heading">
            <KeyRound size={24} strokeWidth={1.8} />
            <div>
              <p>Credenciales</p>
              <h2>Ingresar</h2>
            </div>
          </div>

          <label>
            Usuario
            <input
              autoComplete="username"
              name="username"
              onChange={handleInputChange}
              value={credentials.username}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="current-password"
              name="password"
              onChange={handleInputChange}
              type="password"
              value={credentials.password}
            />
          </label>

          <button className="primary-action" disabled={isLoading} type="submit">
            {isLoading ? <RefreshCw className="spin" size={19} /> : <LogIn size={19} />}
            Autenticar
          </button>
        </form>

        <div className="token-panel">
          <div className="token-header">
            <div>
              <p>Sesion</p>
              <h2>{session ? 'Activa' : 'Sin iniciar'}</h2>
            </div>
            {session && <CheckCircle2 className="ok-icon" size={28} strokeWidth={1.7} />}
          </div>

          <dl className="token-grid">
            <div>
              <dt>Tipo</dt>
              <dd>{session?.token_type || 'bearer'}</dd>
            </div>
            <div>
              <dt>Expira</dt>
              <dd>{getExpiryTime(session?.expires_in)}</dd>
            </div>
          </dl>

          <div className="token-box">
            <span>Access token</span>
            <code>{compactToken(session?.access_token)}</code>
          </div>

          <div className="token-box subdued">
            <span>Refresh token</span>
            <code>{compactToken(session?.refresh_token)}</code>
          </div>

          <div className="token-actions">
            <button disabled={!session || isLoading} onClick={handleRefresh} type="button">
              <RefreshCw size={18} />
              Renovar
            </button>
            <button disabled={!session} onClick={copyAccessToken} type="button">
              <Copy size={18} />
              Copiar
            </button>
            <button disabled={!session} onClick={clearSession} type="button">
              <LogOut size={18} />
              Salir
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
