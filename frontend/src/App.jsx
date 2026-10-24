import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Profile from './pages/Profile'
import PublicProfile from './pages/PublicProfile'
import Messages from './pages/Messages'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Pricing from './pages/Pricing'
import { API_BASE_URL } from './api/client'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem('campusdev-theme') || 'light')
  const [notifications, setNotifications] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    localStorage.setItem('campusdev-theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    // Verificar se há token salvo no localStorage
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    const handleExpiredSession = () => {
      setUser(null)
      setToken(null)
    }
    window.addEventListener('auth:expired', handleExpiredSession)
    return () => window.removeEventListener('auth:expired', handleExpiredSession)
  }, [])

  useEffect(() => {
    if (!user || !token || token === 'demo-local-token') return undefined
    const stream = new EventSource(`${API_BASE_URL}/notificacoes/stream?token=${encodeURIComponent(token)}`)
    const receive = (event) => {
      try {
        const notification = JSON.parse(event.data)
        if (notification.tipo === 'CONECTADO') return
        setNotifications((current) => [notification, ...current].slice(0, 20))
        setUnreadNotifications((current) => current + 1)
      } catch {
        // Mantém o canal ativo mesmo que um evento inválido seja recebido.
      }
    }
    stream.addEventListener('NOVA_MENSAGEM', receive)
    stream.addEventListener('NOVA_AVALIACAO', receive)
    stream.onerror = () => stream.close()
    return () => stream.close()
  }, [user, token])

  const handleLogin = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
  }

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const handleLogout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className={`app-shell theme-${theme}`}>
        <a className="skip-link" href="#main-content">Pular para o conteúdo principal</a>
        <Navbar user={user} onLogout={handleLogout} theme={theme} onThemeChange={setTheme} notifications={notifications} unreadNotifications={unreadNotifications} onReadNotifications={() => setUnreadNotifications(0)} />
        {token === 'demo-local-token' && (
          <div className="demo-banner" role="status">
            <span><strong>Modo demonstração</strong> — você está navegando com dados locais. Nenhuma alteração será salva na API.</span>
            <button type="button" onClick={handleLogout}>Sair da demonstração</button>
          </div>
        )}

        <div id="main-content" tabIndex="-1">
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />
          <Route path="/termos" element={<Terms />} />
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="/planos" element={<Pricing />} />
          <Route path="/perfil/:id" element={<PublicProfile />} />
          <Route path="/configuracoes/perfil" element={user ? <Profile user={user} onUserUpdate={handleUserUpdate} /> : <Navigate to="/login" replace />} />
          <Route path="/mensagens" element={user ? <Messages /> : <Navigate to="/login" replace />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} token={token} /> : <Navigate to="/login" />}
          />
          <Route
            path="/projects"
            element={<Projects user={user} token={token} />}
          />
          <Route
            path="/profile"
            element={user ? <Navigate to="/configuracoes/perfil" replace /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
