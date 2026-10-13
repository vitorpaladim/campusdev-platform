import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { apiFetch } from '@/api/client'
import { ArrowLeft, ArrowUpRight, Code, Lock, Mail, AlertCircle } from 'lucide-react'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiFetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        // Salvar token no localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.usuario))

        // Chamar callback de login
        onLogin(data.usuario, data.token)

        // Redirecionar para dashboard
        navigate('/dashboard')
      } else {
        setError(data.error || 'Erro ao fazer login')
      }
    } catch (requestError) {
      console.error('Falha ao realizar login:', requestError)
      setError('Não foi possível conectar à API. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] border-b border-[#dfe5dc] px-6 py-12 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div className="hidden lg:block">
          <Link to="/" className="eyebrow inline-flex items-center gap-2 hover:text-[#18221d]">
            <ArrowLeft className="h-4 w-4" /> Voltar para o início
          </Link>
          <p className="eyebrow mt-20">De volta à construção</p>
          <h1 className="display-title mt-5 max-w-lg text-6xl leading-[.95]">
            Continue fazendo <span className="text-[#758e38]">acontecer.</span>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-[#657066]">
            Entre para acompanhar seus projetos, encontrar novas frentes e construir com outras pessoas.
          </p>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <div className="soft-panel p-6 sm:p-10">
            <div className="mb-8">
              <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
                <span className="brand-mark"><Code className="h-4 w-4" /></span>
                <span className="brand-name">Campus<span>Dev</span></span>
              </Link>
              <p className="eyebrow">Acesso à comunidade</p>
              <h2 className="display-title mt-3 text-4xl">Entre na sua conta.</h2>
              <p className="mt-3 text-[#657066]">
                Ainda não faz parte?{' '}
                <Link to="/register" className="font-bold text-[#758e38] hover:text-[#18221d]">
                  Crie seu perfil <ArrowUpRight className="inline h-4 w-4" />
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-[#18221d]">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#758e38]" />
                  <Input id="email" name="email" type="email" required className="h-12 rounded-xl border-[#dfe5dc] bg-[#f7f8f5] pl-10 focus-visible:ring-[#c8f169]" placeholder="voce@email.com" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="font-bold text-[#18221d]">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#758e38]" />
                  <Input id="senha" name="senha" type="password" required className="h-12 rounded-xl border-[#dfe5dc] bg-[#f7f8f5] pl-10 focus-visible:ring-[#c8f169]" placeholder="Sua senha" value={formData.senha} onChange={handleChange} />
                </div>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-[#18221d] font-bold text-[#c8f169] hover:bg-[#2a3a2f]"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            <p className="mt-6 text-center text-xs leading-5 text-[#657066]">
              Ao entrar, você concorda com o uso responsável da plataforma e da comunidade.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login