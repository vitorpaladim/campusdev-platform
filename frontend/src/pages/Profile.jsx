import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { User, Mail, BookOpen, Code, Plus, X, Save, Trash2, AlertCircle, CheckCircle, ExternalLink, Eye } from 'lucide-react'
import { apiFetch, resolveMediaUrl } from '@/api/client'

const parsePortfolio = (user) => {
  if (Array.isArray(user?.portfolio)) return user.portfolio
  try { return user?.portfolioJson ? JSON.parse(user.portfolioJson) : [] } catch { return [] }
}

const Profile = ({ user, onUserUpdate }) => {
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
    nomeCompleto: user?.nomeCompleto || '',
    tipoDeMercado: user?.tipoDeMercado || '',
    nomeEmpresa: user?.nomeEmpresa || '',
    telefone: user?.telefone || '',
    bio: user?.bio || '',
    disponibilidade: user?.disponibilidade || 'DISPONIVEL',
    portfolioUrl: user?.portfolioUrl || '',
    avatarUrl: user?.avatarUrl || '',
    bannerUrl: user?.bannerUrl || '',
    logoUrl: user?.logoUrl || '',
    portfolio: parsePortfolio(user),
    curso: user?.curso || '',
    semestre: user?.semestre || '',
    skills: Array.isArray(user?.skills) ? user.skills : (user?.skills || '').split(',').map((skill) => skill.trim()).filter(Boolean)
  })
  const isClient = user?.role === 'CLIENTE'
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [mediaLoading, setMediaLoading] = useState('')
  const [portfolioDraft, setPortfolioDraft] = useState({ title: '', description: '', tools: '', url: '', color: 'linear-gradient(135deg, #18221d, #758e38)', anexos: [] })
  const [portfolioFileLoading, setPortfolioFileLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        nomeCompleto: user.nomeCompleto || '',
        tipoDeMercado: user.tipoDeMercado || '',
        nomeEmpresa: user.nomeEmpresa || '',
        telefone: user.telefone || '',
        bio: user.bio || '',
        disponibilidade: user.disponibilidade || 'DISPONIVEL',
        portfolioUrl: user.portfolioUrl || '',
        avatarUrl: user.avatarUrl || '',
        bannerUrl: user.bannerUrl || '',
        logoUrl: user.logoUrl || '',
        portfolio: parsePortfolio(user),
        curso: user.curso || '',
        semestre: user.semestre || '',
        skills: Array.isArray(user.skills) ? user.skills : (user.skills || '').split(',').map((skill) => skill.trim()).filter(Boolean)
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: name === 'semestre' ? (value ? parseInt(value) : '') : value
    }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addPortfolioItem = () => {
    if (!portfolioDraft.title.trim() || !portfolioDraft.description.trim()) return
    const anexos = [...portfolioDraft.anexos]
    if (portfolioDraft.url.trim() && !anexos.some((anexo) => anexo.url === portfolioDraft.url.trim())) anexos.unshift({ label: 'Abrir projeto', url: portfolioDraft.url.trim(), tipo: 'link' })
    setProfileData((current) => ({ ...current, portfolio: [...current.portfolio, { ...portfolioDraft, anexos, title: portfolioDraft.title.trim(), description: portfolioDraft.description.trim(), tools: portfolioDraft.tools.split(',').map((tool) => tool.trim()).filter(Boolean), short: portfolioDraft.title.trim().split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() }] }))
    setPortfolioDraft({ title: '', description: '', tools: '', url: '', color: 'linear-gradient(135deg, #18221d, #758e38)', anexos: [] })
  }

  const removePortfolioItem = (index) => setProfileData((current) => ({ ...current, portfolio: current.portfolio.filter((_, itemIndex) => itemIndex !== index) }))

  const handlePortfolioFile = async (file) => {
    if (!file) return
    const localUrl = URL.createObjectURL(file)
    setPortfolioFileLoading(true)
    try {
      const body = new FormData()
      body.append('arquivo', file)
      body.append('tipo', 'PORTFOLIO_FILE')
      const response = await apiFetch('/media/upload', { method: 'POST', body })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || data.error || 'Não foi possível enviar o anexo')
      setPortfolioDraft((current) => ({ ...current, anexos: [...current.anexos, { label: file.name, url: data.url, tipo: 'arquivo' }] }))
    } catch (requestError) {
      if (localStorage.getItem('token') === 'demo-local-token') setPortfolioDraft((current) => ({ ...current, anexos: [...current.anexos, { label: file.name, url: localUrl, tipo: 'arquivo' }] }))
      else setError(requestError.message)
    } finally {
      setPortfolioFileLoading(false)
    }
  }

  const handleMediaUpload = async (type, file) => {
    if (!file) return
    const localUrl = URL.createObjectURL(file)
    setMediaLoading(type)
    try {
      const body = new FormData()
      body.append('arquivo', file)
      body.append('tipo', type)
      const response = await apiFetch('/media/upload', { method: 'POST', body })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Não foi possível enviar a imagem')
      const field = type === 'AVATAR' ? 'avatarUrl' : type === 'BANNER' ? 'bannerUrl' : 'logoUrl'
      setProfileData((current) => ({ ...current, [field]: data.url }))
      if (onUserUpdate) onUserUpdate({ ...user, [field]: data.url })
    } catch (requestError) {
      if (localStorage.getItem('token') === 'demo-local-token') {
        const field = type === 'AVATAR' ? 'avatarUrl' : type === 'BANNER' ? 'bannerUrl' : 'logoUrl'
        setProfileData((current) => ({ ...current, [field]: localUrl }))
        if (onUserUpdate) onUserUpdate({ ...user, [field]: localUrl })
      } else setError(requestError.message)
    } finally {
      setMediaLoading('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const endpoint = isClient ? `/clientes/${user.id}` : `/desenvolvedores/${user.id}`
      const body = isClient
        ? {
            nomeCompleto: profileData.nomeCompleto,
            tipoDeMercado: profileData.tipoDeMercado,
            nomeEmpresa: profileData.nomeEmpresa,
            telefone: profileData.telefone,
            logoUrl: profileData.logoUrl,
          }
        : {
            nomeCompleto: profileData.nomeCompleto,
            email: user.email,
            bio: profileData.bio,
            disponibilidade: profileData.disponibilidade,
            portfolioUrl: profileData.portfolioUrl,
            curso: profileData.curso,
            semestre: String(profileData.semestre || ''),
            skills: profileData.skills.join(', '),
            avatarUrl: profileData.avatarUrl,
            bannerUrl: profileData.bannerUrl,
            portfolioJson: JSON.stringify(profileData.portfolio),
          }

      const response = await apiFetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Perfil atualizado com sucesso!')

        // Atualizar dados do usuário no localStorage
        const updatedUser = isClient
          ? { ...user, tipoDeMercado: profileData.tipoDeMercado, nomeEmpresa: profileData.nomeEmpresa, telefone: profileData.telefone, logoUrl: profileData.logoUrl }
          : { ...user, ...profileData }
        if (onUserUpdate) onUserUpdate(updatedUser)
        else localStorage.setItem('user', JSON.stringify(updatedUser))

        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.message || data.error || 'Erro ao atualizar perfil')
      }
    } catch (requestError) {
      if (localStorage.getItem('token') === 'demo-local-token') {
        const updatedUser = { ...user, ...profileData }
        if (onUserUpdate) onUserUpdate(updatedUser)
        else localStorage.setItem('user', JSON.stringify(updatedUser))
        setSuccess('Prévia atualizada. No modo demonstração, os dados ficam neste navegador.')
      } else setError(requestError.message || 'Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setError('')

    try {
      const endpoint = isClient ? `/clientes/${user.id}` : `/desenvolvedores/${user.id}`
      const response = await apiFetch(endpoint, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Limpar dados do localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        // Redirecionar para página inicial
        navigate('/')
      } else {
        setError('Erro ao excluir conta')
      }
    } catch {
      setError('Erro de conexão')
    } finally {
      setDeleteLoading(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">Configurações de perfil</p><h1 className="display-title mt-2 text-4xl">Monte sua presença pública</h1><p className="mt-2 text-gray-600">Tudo que você ajustar aqui aparece na mesma experiência que outras pessoas veem.</p></div>
          <Link to={`/perfil/${user?.id}`}><Button type="button" variant="outline" className="rounded-full"><Eye className="mr-2 h-4 w-4" />Ver perfil público</Button></Link>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações Pessoais</span>
              </CardTitle>
              <CardDescription>
                Atualize suas informações de perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 rounded-3xl border border-[#d8e4b9] bg-[#f3f8e4] p-5">
                <p className="eyebrow">Identidade visual</p>
                <p className="mt-1 text-sm text-[#657066]">Use imagens simples para que seu perfil seja reconhecido rapidamente.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {!isClient && <>
                    <label className="upload-choice"><span>{mediaLoading === 'AVATAR' ? 'Enviando foto...' : 'Adicionar foto'}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleMediaUpload('AVATAR', event.target.files?.[0])} /></label>
                    <label className="upload-choice"><span>{mediaLoading === 'BANNER' ? 'Enviando capa...' : 'Adicionar capa'}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleMediaUpload('BANNER', event.target.files?.[0])} /></label>
                  </>}
                  {isClient && <label className="upload-choice"><span>{mediaLoading === 'LOGO' ? 'Enviando logo...' : 'Adicionar logo'}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => handleMediaUpload('LOGO', event.target.files?.[0])} /></label>}
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nomeCompleto">Nome Completo</Label>
                  <Input
                    id="nomeCompleto"
                    name="nomeCompleto"
                    value={profileData.nomeCompleto}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailUniversitario">Email</Label>
                  <Input
                    id="emailUniversitario"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    O email não pode ser alterado.
                  </p>
                </div>

                {isClient ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomeEmpresa">Nome da empresa ou negócio</Label>
                      <Input id="nomeEmpresa" name="nomeEmpresa" value={profileData.nomeEmpresa} onChange={handleInputChange} placeholder="Ex: Studio XPTO" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipoDeMercado">Tipo de mercado</Label>
                      <Input id="tipoDeMercado" name="tipoDeMercado" value={profileData.tipoDeMercado} onChange={handleInputChange} placeholder="Ex: pequeno negócio, empresa ou pessoa" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" name="telefone" value={profileData.telefone} onChange={handleInputChange} placeholder="(00) 00000-0000" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Sobre você</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        placeholder="Conte brevemente o que você faz e que tipo de projeto procura."
                        rows={4}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="disponibilidade">Disponibilidade</Label>
                    <select id="disponibilidade" name="disponibilidade" value={profileData.disponibilidade} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="DISPONIVEL">Estou livre para projetos</option>
                      <option value="OCUPADO">Estou ocupado no momento</option>
                      <option value="PARCIAL">Tenho disponibilidade parcial</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl">Link do portfólio ou último projeto</Label>
                    <Input id="portfolioUrl" name="portfolioUrl" type="url" value={profileData.portfolioUrl} onChange={handleInputChange} placeholder="https://github.com/seu-usuario" />
                  </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="curso">Formação ou área</Label>
                    <Input
                      id="curso"
                      name="curso"
                      value={profileData.curso}
                      onChange={handleInputChange}
                      placeholder="Ex: Ciência da Computação"
                    />
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="semestre">Experiência (anos)</Label>
                    <Input
                      id="semestre"
                      name="semestre"
                      type="number"
                      min="1"
                      max="60"
                      value={profileData.semestre}
                      onChange={handleInputChange}
                      placeholder="Ex: 5"
                    />
                    </div>
                    </div>

                    {profileData.bio && (
                    <div className="flex items-start space-x-3">
                      <div className="bg-lime-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-[#758e38]" />
                      </div>
                      <div>
                        <p className="text-sm leading-6 text-gray-600">{profileData.bio}</p>
                        <p className="text-sm text-gray-500">Sobre</p>
                      </div>
                    </div>
                  )}

                  {profileData.portfolioUrl && (
                    <a href={profileData.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-[#758e38] hover:text-[#18221d]">
                      <ExternalLink className="h-4 w-4" /> Ver portfólio
                    </a>
                  )}
                  </>
                )}

                {!isClient && <div className="portfolio-editor space-y-4 rounded-3xl border border-[#e1e7df] bg-[#fbfcfa] p-5">
                  <div><p className="eyebrow">Mostre o que você já fez</p><h2 className="mt-1 text-xl font-black text-[#18221d]">Itens do portfólio</h2><p className="mt-1 text-sm text-[#657066]">Adicione projetos para eles aparecerem no seu perfil público.</p></div>
                  {profileData.portfolio.length > 0 && <div className="space-y-2">{profileData.portfolio.map((item, index) => <div key={`${item.title}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-[#e1e7df] bg-white p-3"><div><p className="font-bold text-[#18221d]">{item.title}</p><p className="line-clamp-1 text-xs text-[#657066]">{item.description}</p></div><button type="button" onClick={() => removePortfolioItem(index)} aria-label={`Remover ${item.title}`} className="rounded-full p-2 text-[#657066] hover:bg-red-50 hover:text-red-700"><X className="h-4 w-4" /></button></div>)}</div>}
                  <div className="grid gap-3 md:grid-cols-2"><Input aria-label="Título do item do portfólio" value={portfolioDraft.title} onChange={(event) => setPortfolioDraft({ ...portfolioDraft, title: event.target.value })} placeholder="Título do projeto" /><Input aria-label="Tecnologias do item do portfólio" value={portfolioDraft.tools} onChange={(event) => setPortfolioDraft({ ...portfolioDraft, tools: event.target.value })} placeholder="Ferramentas: React, Figma" /><Input aria-label="Link do item do portfólio" type="url" value={portfolioDraft.url} onChange={(event) => setPortfolioDraft({ ...portfolioDraft, url: event.target.value })} placeholder="Link do projeto ou demo" /><Button type="button" variant="outline" onClick={addPortfolioItem} disabled={!portfolioDraft.title.trim() || !portfolioDraft.description.trim()}><Plus className="mr-2 h-4 w-4" />Adicionar projeto</Button></div><textarea aria-label="Descrição do item do portfólio" value={portfolioDraft.description} onChange={(event) => setPortfolioDraft({ ...portfolioDraft, description: event.target.value })} placeholder="Explique em poucas palavras o que você construiu e qual foi seu papel." rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" /><div className="flex flex-wrap items-center gap-3"><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#cfd9cc] bg-white px-4 py-2 text-sm font-bold text-[#526b25] hover:bg-[#f3f8e4]"><Plus className="h-4 w-4" />{portfolioFileLoading ? 'Enviando...' : 'Anexar arquivo'}<input type="file" className="sr-only" accept=".pdf,.txt,.md,.docx,.zip" onChange={(event) => { handlePortfolioFile(event.target.files?.[0]); event.target.value = '' }} disabled={portfolioFileLoading} /></label><span className="text-xs text-[#657066]">PDF, TXT, MD, DOCX ou ZIP até 10 MB</span></div>{portfolioDraft.anexos.length > 0 && <div className="flex flex-wrap gap-2">{portfolioDraft.anexos.map((anexo, index) => <span key={`${anexo.url}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-[#eef4e8] px-3 py-1.5 text-xs font-semibold text-[#526b25]">{anexo.label}<button type="button" onClick={() => setPortfolioDraft((current) => ({ ...current, anexos: current.anexos.filter((_, anexoIndex) => anexoIndex !== index) }))} aria-label={`Remover anexo ${anexo.label}`}><X className="h-3 w-3" /></button></span>)}</div>}
                </div>}

                {!isClient && <div className="space-y-2">
                  <Label>Habilidades</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Ex: React, Python, Node.js"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button type="button" onClick={handleAddSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {!isClient && profileData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {profileData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                }

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Prévia pública</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="profile-preview-mini">
                <div className="profile-preview-cover" style={profileData.bannerUrl ? { backgroundImage: `url(${resolveMediaUrl(profileData.bannerUrl)})` } : undefined} />
                <div className="profile-preview-avatar">{profileData.avatarUrl ? <img src={resolveMediaUrl(profileData.avatarUrl)} alt="Sua foto de perfil" /> : (profileData.nomeCompleto || '?').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</div>
                <p className="mt-2 font-black text-[#18221d]">{profileData.nomeCompleto || 'Seu nome'}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#657066]">{profileData.bio || 'Sua apresentação aparecerá aqui.'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{user?.nomeCompleto}</p>
                  <p className="text-sm text-gray-500">Nome</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                  <Mail className="h-5 w-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium break-all text-sm">{user?.email}</p>
                  <p className="text-sm text-gray-500">Email</p>
                </div>
              </div>

              {profileData.curso && (
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{profileData.curso}</p>
                    <p className="text-sm text-gray-500">Curso</p>
                  </div>
                </div>
              )}

              {profileData.semestre && (
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">{profileData.semestre}º Semestre</p>
                    <p className="text-sm text-gray-500">Período</p>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-2">Membro desde</p>
                <p className="font-medium">
                  {new Date(user?.dataCadastro).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills Card */}
          {profileData.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Habilidades</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Zona de Perigo</span>
              </CardTitle>
              <CardDescription>
                Ações irreversíveis relacionadas à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Conta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar Exclusão da Conta</DialogTitle>
                    <DialogDescription>
                      Esta ação é irreversível. Todos os seus dados, projetos criados e
                      participações serão permanentemente removidos.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Excluindo...' : 'Confirmar Exclusão'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
