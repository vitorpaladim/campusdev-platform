import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, ArrowUpRight, Code, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { apiFetch } from '@/api/client'

const Register = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    aceitarTermos: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const validateForm = () => {
    if (!formData.nomeCompleto.trim()) {
      setError('Nome completo é obrigatório')
      return false
    }

    if (!formData.email.trim()) {
      setError('Email universitário é obrigatório')
      return false
    }

    // Validar email universitário
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu\.br|edu)$/
    if (!emailPattern.test(formData.email)) {
      setError('Email deve ser de uma universidade (.edu.br ou .edu)')
      return false
    }

    if (formData.senha.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return false
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('Senhas não coincidem')
      return false
    }

    if (!formData.aceitarTermos) {
      setError('Você deve aceitar os termos de uso e política de privacidade')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const response = await apiFetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeCompleto: formData.nomeCompleto,
          email: formData.email,
          senha: formData.senha
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setError(data.error || 'Erro ao criar conta')
      }
    } catch (requestError) {
      console.error('Falha ao criar cadastro:', requestError)
      setError('Não foi possível conectar à API. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center border-b border-[#dfe5dc] px-6 py-12 lg:px-8">
        <div className="soft-panel w-full max-w-xl p-8 text-center sm:p-12">
          <CheckCircle className="mx-auto mb-5 h-16 w-16 text-[#758e38]" />
          <p className="eyebrow">Bem-vindo à construção</p>
          <h2 className="display-title mt-3 text-4xl">Perfil criado com sucesso.</h2>
          <p className="mx-auto mt-4 max-w-md leading-7 text-[#657066]">
            Você será encaminhado para o login em alguns segundos.
          </p>
          <Link to="/login" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#18221d] px-6 py-3.5 font-bold text-[#c8f169]">
            Ir para o login <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] border-b border-[#dfe5dc] px-6 py-12 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div className="hidden lg:block">
          <Link to="/" className="eyebrow inline-flex items-center gap-2 hover:text-[#18221d]">
            <ArrowLeft className="h-4 w-4" /> Voltar para o início
          </Link>
          <p className="eyebrow mt-20">Um espaço para construir junto</p>
          <h1 className="display-title mt-5 max-w-lg text-6xl leading-[.95]">
            Sua próxima ideia começa com <span className="text-[#758e38]">uma conexão.</span>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-[#657066]">
            Crie seu perfil, compartilhe o que sabe e encontre projetos em que sua contribuição faça diferença.
          </p>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <div className="soft-panel p-6 sm:p-10">
            <div className="mb-8">
              <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
                <span className="brand-mark"><Code className="h-4 w-4" /></span>
                <span className="brand-name">Campus<span>Dev</span></span>
              </Link>
              <p className="eyebrow">Faça parte</p>
              <h2 className="display-title mt-3 text-4xl">Crie seu perfil.</h2>
              <p className="mt-3 text-[#657066]">
                Já tem uma conta?{' '}
                <Link to="/login" className="font-bold text-[#758e38] hover:text-[#18221d]">
                  Entre aqui <ArrowUpRight className="inline h-4 w-4" />
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
                <Label htmlFor="nomeCompleto" className="font-bold text-[#18221d]">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-[#758e38]" />
                  <Input id="nomeCompleto" name="nomeCompleto" type="text" required className="h-12 rounded-xl border-[#dfe5dc] bg-[#f7f8f5] pl-10 focus-visible:ring-[#c8f169]" placeholder="Seu nome completo" value={formData.nomeCompleto} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-[#18221d]">Email universitário</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#758e38]" />
                  <Input id="email" name="email" type="email" required className="h-12 rounded-xl border-[#dfe5dc] bg-[#f7f8f5] pl-10 focus-visible:ring-[#c8f169]" placeholder="voce@universidade.edu.br" value={formData.email} onChange={handleChange} />
                </div>
                <p className="text-xs text-[#657066]">
                  Aceitamos emails universitários (.edu.br ou .edu).
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="font-bold text-[#18221d]">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#758e38]" />
                  <Input id="senha" name="senha" type="password" required className="h-12 rounded-xl border-[#dfe5dc] bg-[#f7f8f5] pl-10 focus-visible:ring-[#c8f169]" placeholder="Mínimo 6 caracteres" value={formData.senha} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha" className="font-bold text-[#18221d]">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#758e38]" />
                  <Input id="confirmarSenha" name="confirmarSenha" type="password" required className="h-12 rounded-xl border-[#dfe5dc] bg-[#f7f8f5] pl-10 focus-visible:ring-[#c8f169]" placeholder="Repita sua senha" value={formData.confirmarSenha} onChange={handleChange} />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aceitarTermos"
                  name="aceitarTermos"
                  checked={formData.aceitarTermos}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, aceitarTermos: checked })
                  }
                />
                <Label htmlFor="aceitarTermos" className="text-sm leading-5 text-[#657066]">
                  Aceito os termos de uso e a política de privacidade.
                </Label>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-[#18221d] font-bold text-[#c8f169] hover:bg-[#2a3a2f]"
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </form>
            <p className="mt-6 text-center text-xs leading-5 text-[#657066]">
              Seus dados são usados apenas para viabilizar sua participação na comunidade.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Register