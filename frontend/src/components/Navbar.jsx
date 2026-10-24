import { createElement, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, X, Code, LogOut, User, Sun, Moon, Terminal, Bell, MessageSquareQuote, Star } from 'lucide-react'

const Navbar = ({ user, onLogout, theme, onThemeChange, notifications = [], unreadNotifications = 0, onReadNotifications }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const themes = [
    { id: 'light', label: 'Claro', icon: Sun },
    { id: 'dark', label: 'Escuro', icon: Moon },
    { id: 'dev', label: 'Dev', icon: Terminal },
  ]

  return (
    <nav className="site-nav" aria-label="Navegação principal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="brand-mark"><Code className="h-5 w-5" /></span>
              <span className="brand-name">Campus<span>Dev</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="theme-switcher" aria-label="Tema da interface">
              {themes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`theme-option ${theme === id ? 'active' : ''}`}
                  onClick={() => onThemeChange(id)}
                  aria-label={`Usar modo ${label}`}
                  aria-pressed={theme === id}
                >
                  {createElement(Icon, { className: 'h-3.5 w-3.5' })}
                  <span>{label}</span>
                </button>
              ))}
            </div>
            {user ? (
              <>
                <div className="relative">
                  <button type="button" className="relative rounded-full p-2 text-[#526057] hover:bg-[#eef4e8]" aria-label={`Notificações${unreadNotifications ? `, ${unreadNotifications} não lidas` : ''}`} aria-expanded={showNotifications} onClick={() => { setShowNotifications((current) => !current); onReadNotifications?.() }}>
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d66b45] px-1 text-[10px] font-black text-white">{unreadNotifications > 9 ? '9+' : unreadNotifications}</span>}
                  </button>
                  {showNotifications && <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-[#dfe5dc] bg-white p-3 shadow-xl"><div className="flex items-center justify-between px-2 pb-2"><p className="font-black text-[#18221d]">Notificações</p><Link to="/mensagens" className="text-xs font-bold text-[#758e38]" onClick={() => setShowNotifications(false)}>Ver mensagens</Link></div>{notifications.length === 0 ? <p className="px-2 py-5 text-sm text-[#657066]">Você está em dia.</p> : <div className="max-h-72 space-y-1 overflow-auto">{notifications.map((notification, index) => <Link key={`${notification.tipo}-${index}`} to={notification.link || '/mensagens'} onClick={() => setShowNotifications(false)} className="block rounded-xl p-2 hover:bg-[#f3f8e4]"><div className="flex gap-2"><span className="mt-0.5 text-[#758e38]">{notification.tipo === 'NOVA_AVALIACAO' ? <Star className="h-4 w-4" /> : <MessageSquareQuote className="h-4 w-4" />}</span><div><p className="text-sm font-bold text-[#18221d]">{notification.titulo}</p><p className="mt-0.5 text-xs leading-5 text-[#657066]">{notification.mensagem}</p></div></div></Link>)}</div>}</div>}
                </div>
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Visão geral</NavLink>
                <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Projetos</NavLink>
                <NavLink to="/planos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Planos</NavLink>
                <NavLink to="/mensagens" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Mensagens</NavLink>
                <NavLink to={`/perfil/${user.id}`} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <User className="h-4 w-4" /> {user.nomeCompleto?.split(' ')[0]}
                </NavLink>
                <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-1">
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/planos" className="nav-link">Planos</Link>
                <Link to="/login" className="nav-link">Entrar</Link>
                <Link to="/register" className="nav-cta">Criar conta <span>↗</span></Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="theme-switcher mb-3 w-fit" aria-label="Tema da interface">
                {themes.map(({ id, label, icon: Icon }) => (
                  <button key={id} type="button" className={`theme-option ${theme === id ? 'active' : ''}`} onClick={() => onThemeChange(id)} aria-pressed={theme === id}>
                    {createElement(Icon, { className: 'h-3.5 w-3.5' })} <span>{label}</span>
                  </button>
                ))}
              </div>
              {user ? (
                <>
                  <Link to="/dashboard" className="block" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                  </Link>
                  <Link to="/projects" className="block" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Projetos</Button>
                  </Link>
                  <Link to="/mensagens" className="block" onClick={() => setIsMenuOpen(false)}><Button variant="ghost" className="w-full justify-start">Mensagens</Button></Link>
                  <Link to={`/perfil/${user.id}`} className="block" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      {user.nomeCompleto}
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="outline" className="w-full justify-start">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Entrar</Button>
                  </Link>
                  <Link to="/register" className="block" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start">Cadastrar</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
