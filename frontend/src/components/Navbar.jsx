import { createElement, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Bell, ChevronDown, Code, CreditCard, FileText, LogOut, Menu, MessageSquare, Moon, Settings, ShieldCheck, Sun, Terminal, User, X, Star, MessageSquareQuote } from 'lucide-react'

const Navbar = ({ user, onLogout, theme, onThemeChange, notifications = [], unreadNotifications = 0, onReadNotifications }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const navigate = useNavigate()

  const themes = [
    { id: 'light', label: 'Claro', icon: Sun },
    { id: 'dark', label: 'Escuro', icon: Moon },
    { id: 'dev', label: 'Dev', icon: Terminal },
  ]

  const closeMobileMenu = () => setIsMenuOpen(false)
  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const toggleNotifications = () => {
    setShowNotifications((current) => !current)
    setShowAccountMenu(false)
    onReadNotifications?.()
  }

  const toggleAccountMenu = () => {
    setShowAccountMenu((current) => !current)
    setShowNotifications(false)
  }

  const menuLinkClass = 'nav-menu-link'

  return (
    <nav className="site-nav" aria-label="Navegação principal">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[4.5rem] items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="CampusDev - página inicial">
            <span className="brand-mark"><Code className="h-5 w-5" /></span>
            <span className="brand-name">Campus<span>Dev</span></span>
          </Link>

          {user && (
            <div className="hidden items-center gap-1 rounded-full border border-[#dfe5dc] bg-[#eef2eb] p-1 md:flex" aria-label="Atalhos principais">
              <NavLink to="/dashboard" className={({ isActive }) => `nav-primary-link ${isActive ? 'active' : ''}`}>Visão geral</NavLink>
              <NavLink to="/projects" className={({ isActive }) => `nav-primary-link ${isActive ? 'active' : ''}`}>Projetos</NavLink>
            </div>
          )}

          <div className="hidden items-center gap-2 md:flex">
            {!user && <><Link to="/planos" className="nav-link">Planos</Link><Link to="/login" className="nav-link">Entrar</Link><Link to="/register" className="nav-cta">Criar conta <span>↗</span></Link></>}
            {user && <>
              <div className="relative">
                <button type="button" className="nav-icon-button" aria-label={`Notificações${unreadNotifications ? `, ${unreadNotifications} não lidas` : ''}`} aria-expanded={showNotifications} onClick={toggleNotifications}>
                  <Bell className="h-[1.15rem] w-[1.15rem]" />
                  {unreadNotifications > 0 && <span className="notification-count">{unreadNotifications > 9 ? '9+' : unreadNotifications}</span>}
                </button>
                {showNotifications && <div className="nav-popover notification-popover" role="dialog" aria-label="Notificações">
                  <div className="flex items-center justify-between border-b border-[#e5ebe2] px-3 pb-3"><div><p className="text-sm font-black text-[#18221d]">Notificações</p><p className="mt-0.5 text-xs text-[#89948d]">Atualizações da sua atividade</p></div><Link to="/mensagens" className="text-xs font-bold text-[#758e38]" onClick={() => setShowNotifications(false)}>Mensagens</Link></div>
                  {notifications.length === 0 ? <p className="px-2 py-7 text-center text-sm text-[#657066]">Você está em dia.</p> : <div className="max-h-80 space-y-1 overflow-auto pt-2">{notifications.map((notification, index) => <Link key={`${notification.tipo}-${index}`} to={notification.link || '/mensagens'} onClick={() => setShowNotifications(false)} className="notification-item"><span className="mt-0.5 text-[#758e38]">{notification.tipo === 'NOVA_AVALIACAO' ? <Star className="h-4 w-4" /> : <MessageSquareQuote className="h-4 w-4" />}</span><span><strong>{notification.titulo}</strong><small>{notification.mensagem}</small></span></Link>)}</div>}
                </div>}
              </div>
              <div className="relative">
                <button type="button" className="account-trigger" aria-expanded={showAccountMenu} onClick={toggleAccountMenu}>
                  <span className="account-avatar">{user.nomeCompleto?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span className="hidden lg:inline">{user.nomeCompleto?.split(' ')[0]}</span><ChevronDown className={`h-4 w-4 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
                </button>
                {showAccountMenu && <div className="nav-popover account-popover" role="menu" aria-label="Menu da conta">
                  <div className="border-b border-[#e5ebe2] px-3 pb-3"><p className="text-sm font-black text-[#18221d]">{user.nomeCompleto}</p><p className="mt-1 text-xs text-[#89948d]">Sua conta CampusDev</p></div>
                  <div className="py-2">
                    <Link to={`/perfil/${user.id}`} className={menuLinkClass} onClick={() => setShowAccountMenu(false)}><User className="h-4 w-4" />Meu perfil</Link>
                    <Link to="/configuracoes/perfil" className={menuLinkClass} onClick={() => setShowAccountMenu(false)}><Settings className="h-4 w-4" />Configurações</Link>
                    <Link to="/mensagens" className={menuLinkClass} onClick={() => setShowAccountMenu(false)}><MessageSquare className="h-4 w-4" />Mensagens</Link>
                    <Link to="/planos" className={menuLinkClass} onClick={() => setShowAccountMenu(false)}><CreditCard className="h-4 w-4" />Planos e impulsionamento</Link>
                  </div>
                  <div className="border-y border-[#e5ebe2] px-3 py-3"><p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#89948d]">Aparência</p><div className="theme-switcher w-full" aria-label="Tema da interface">{themes.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={`theme-option flex-1 justify-center ${theme === id ? 'active' : ''}`} onClick={() => onThemeChange(id)} aria-label={`Usar modo ${label}`} aria-pressed={theme === id}>{createElement(Icon, { className: 'h-3.5 w-3.5' })}<span>{label}</span></button>)}</div></div>
                  <div className="py-2"><Link to="/privacidade" className={menuLinkClass} onClick={() => setShowAccountMenu(false)}><ShieldCheck className="h-4 w-4" />Privacidade</Link><Link to="/termos" className={menuLinkClass} onClick={() => setShowAccountMenu(false)}><FileText className="h-4 w-4" />Termos de uso</Link></div>
                  <button type="button" className="nav-menu-link w-full border-t border-[#e5ebe2] text-[#b24e35]" onClick={handleLogout}><LogOut className="h-4 w-4" />Sair da conta</button>
                </div>}
              </div>
            </>}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {user && <button type="button" className="nav-icon-button" aria-label="Abrir notificações" onClick={toggleNotifications}><Bell className="h-5 w-5" />{unreadNotifications > 0 && <span className="notification-count">{unreadNotifications > 9 ? '9+' : unreadNotifications}</span>}</button>}
            <Button variant="ghost" onClick={() => setIsMenuOpen((current) => !current)} className="p-2" aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={isMenuOpen}>{isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</Button>
          </div>
        </div>

        {user && showNotifications && <div className="md:hidden"><div className="nav-popover mobile-notification-popover" role="dialog" aria-label="Notificações"><div className="flex items-center justify-between border-b border-[#e5ebe2] px-3 pb-3"><p className="font-black text-[#18221d]">Notificações</p><Link to="/mensagens" className="text-xs font-bold text-[#758e38]" onClick={() => setShowNotifications(false)}>Mensagens</Link></div>{notifications.length === 0 ? <p className="px-2 py-6 text-center text-sm text-[#657066]">Você está em dia.</p> : <div className="max-h-64 space-y-1 overflow-auto pt-2">{notifications.map((notification, index) => <Link key={`${notification.tipo}-${index}`} to={notification.link || '/mensagens'} onClick={() => setShowNotifications(false)} className="notification-item"><MessageSquareQuote className="h-4 w-4 text-[#758e38]" /><span><strong>{notification.titulo}</strong><small>{notification.mensagem}</small></span></Link>)}</div>}</div></div>}

        {isMenuOpen && <div className="border-t border-[#dfe5dc] pb-4 md:hidden"><div className="space-y-1 px-1 pt-3">{user ? <>
          <Link to="/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>Visão geral</Link><Link to="/projects" className="mobile-nav-link" onClick={closeMobileMenu}>Projetos</Link><Link to={`/perfil/${user.id}`} className="mobile-nav-link" onClick={closeMobileMenu}><User className="h-4 w-4" />Meu perfil</Link><Link to="/configuracoes/perfil" className="mobile-nav-link" onClick={closeMobileMenu}><Settings className="h-4 w-4" />Configurações</Link><Link to="/mensagens" className="mobile-nav-link" onClick={closeMobileMenu}><MessageSquare className="h-4 w-4" />Mensagens</Link><Link to="/planos" className="mobile-nav-link" onClick={closeMobileMenu}><CreditCard className="h-4 w-4" />Planos e impulsionamento</Link><div className="px-2 pb-2 pt-3"><p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#89948d]">Aparência</p><div className="theme-switcher w-full">{themes.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={`theme-option flex-1 justify-center ${theme === id ? 'active' : ''}`} onClick={() => onThemeChange(id)} aria-pressed={theme === id}>{createElement(Icon, { className: 'h-3.5 w-3.5' })}<span>{label}</span></button>)}</div></div><Link to="/privacidade" className="mobile-nav-link" onClick={closeMobileMenu}><ShieldCheck className="h-4 w-4" />Privacidade</Link><Link to="/termos" className="mobile-nav-link" onClick={closeMobileMenu}><FileText className="h-4 w-4" />Termos de uso</Link><button type="button" className="mobile-nav-link w-full text-[#b24e35]" onClick={handleLogout}><LogOut className="h-4 w-4" />Sair da conta</button>
        </> : <><Link to="/planos" className="mobile-nav-link" onClick={closeMobileMenu}>Planos</Link><Link to="/login" className="mobile-nav-link" onClick={closeMobileMenu}>Entrar</Link><Link to="/register" className="nav-cta mx-2 justify-center" onClick={closeMobileMenu}>Criar conta <span>↗</span></Link></>}</div></div>}
      </div>
    </nav>
  )
}

export default Navbar
