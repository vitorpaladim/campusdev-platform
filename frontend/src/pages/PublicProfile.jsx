import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, CalendarDays, CheckCircle2, ExternalLink, Github, Link2, MapPin, MessageSquareQuote, Paperclip, Pencil, Send, Sparkles, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { apiFetch, resolveMediaUrl } from '@/api/client'
import { DEMO_RECOMMENDATIONS, DEMO_USER } from '@/lib/demoData'

const initials = (name = '?') => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

const PublicProfile = () => {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewError, setReviewError] = useState('')
  const [reviewSending, setReviewSending] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [contactText, setContactText] = useState('')
  const [contactStatus, setContactStatus] = useState('')
  const [contactSending, setContactSending] = useState(false)
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    let active = true
    const loadProfile = async () => {
      try {
        const response = await apiFetch(`/desenvolvedores/${id}`)
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error('Perfil indisponível')
        if (active) {
          let portfolio = data.portfolio
          try { portfolio = portfolio || (data.portfolioJson ? JSON.parse(data.portfolioJson) : []) } catch { portfolio = [] }
          setProfile({ ...data, nomeCompleto: data.nomeCompleto || data.id_nomeCompleto, email: data.email || data.id_email, bio: data.bio || data.id_bio, skills: data.skills || data.id_skills, portfolioUrl: data.portfolioUrl || data.id_portfolioUrl, portfolio })
        }
      } catch {
        if (active) {
          const localUser = JSON.parse(localStorage.getItem('user') || 'null')
          const demoProfile = localUser?.id && String(localUser.id) === String(id) ? localUser : DEMO_USER
          setProfile({ ...DEMO_USER, ...demoProfile, id: Number(id) || DEMO_USER.id, portfolio: demoProfile.portfolio || DEMO_USER.portfolio })
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    const loadRecommendations = async () => {
      try {
        const response = await apiFetch(`/desenvolvedores/${id}/recomendacoes`)
        const data = await response.json().catch(() => [])
        if (!response.ok) throw new Error('Avaliações indisponíveis')
        if (active) setRecommendations(Array.isArray(data) ? data : [])
      } catch {
        if (active) setRecommendations(DEMO_RECOMMENDATIONS)
      }
    }
    loadProfile()
    loadRecommendations()
    return () => { active = false }
  }, [id])

  const skills = useMemo(() => {
    if (Array.isArray(profile?.skills)) return profile.skills
    return (profile?.skills || '').split(',').map((skill) => skill.trim()).filter(Boolean)
  }, [profile])

  const submitRecommendation = async (event) => {
    event.preventDefault()
    if (!reviewText.trim()) return
    setReviewSending(true)
    setReviewError('')
    try {
      const response = await apiFetch(`/desenvolvedores/${id}/recomendacoes`, { method: 'POST', body: JSON.stringify({ nota: reviewRating, texto: reviewText.trim() }) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Não foi possível publicar a recomendação')
      setRecommendations((items) => [data, ...items])
      setReviewText('')
    } catch (error) {
      if (currentUser?.id === 999) {
        setRecommendations((items) => [{ id: `demo-${Date.now()}`, autorId: currentUser.id, autorNome: currentUser.nomeCompleto, nota: reviewRating, texto: reviewText.trim(), criadaEm: new Date().toISOString() }, ...items])
        setReviewText('')
      } else setReviewError(error.message)
    } finally {
      setReviewSending(false)
    }
  }

  const sendContactMessage = async (event) => {
    event.preventDefault()
    if (!currentUser) {
      setContactStatus('Entre na sua conta para enviar uma mensagem.')
      return
    }
    setContactSending(true)
    setContactStatus('')
    try {
      const response = await apiFetch(`/mensagens/diretas/desenvolvedores/${id}`, { method: 'POST', body: JSON.stringify({ conteudo: contactText.trim() }) })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || data.error || 'Não foi possível enviar a mensagem')
      setContactStatus('Mensagem enviada! A pessoa poderá responder pela caixa de entrada.')
      setContactText('')
    } catch (error) {
      if (localStorage.getItem('token') === 'demo-local-token') {
        const stored = JSON.parse(localStorage.getItem('campusdev-direct-messages') || '[]')
        stored.unshift({ id: `demo-${Date.now()}`, remetenteId: currentUser.id, remetenteNome: currentUser.nomeCompleto, destinatarioId: Number(id), destinatarioNome: profile.nomeCompleto, conteudo: contactText.trim(), enviadaEm: new Date().toISOString(), lida: false })
        localStorage.setItem('campusdev-direct-messages', JSON.stringify(stored))
        setContactStatus('Mensagem salva na demonstração. A caixa de entrada já pode ser consultada.')
        setContactText('')
      } else setContactStatus(error.message)
    } finally {
      setContactSending(false)
    }
  }

  if (loading) return <main className="mx-auto max-w-5xl px-6 py-16 text-center"><div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#dfe5dc] border-t-[#758e38]" /><p className="text-[#657066]">Carregando perfil...</p></main>
  if (!profile) return <main className="mx-auto max-w-5xl px-6 py-16 text-center"><p className="eyebrow">Perfil não encontrado</p><h1 className="display-title mt-3 text-4xl">Esta página não está disponível.</h1><Link to="/projects"><Button className="mt-6 rounded-full">Voltar para projetos</Button></Link></main>

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-12">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-[#657066] hover:text-[#18221d]"><ArrowLeft className="h-4 w-4" /> Voltar para projetos</Link>
      <section className="profile-cover mt-6 overflow-hidden rounded-[2rem] border border-[#dfe5dc] bg-[#18221d] text-white">
        <div className="profile-cover-art" style={profile.bannerUrl ? { backgroundImage: `url(${resolveMediaUrl(profile.bannerUrl)})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} aria-hidden="true" />
        <div className="relative px-6 pb-7 sm:px-10"><div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="flex items-end gap-4"><div className="profile-avatar overflow-hidden" aria-label={`Avatar de ${profile.nomeCompleto}`}>{profile.avatarUrl ? <img src={resolveMediaUrl(profile.avatarUrl)} alt={`Foto de ${profile.nomeCompleto}`} className="h-full w-full object-cover" /> : initials(profile.nomeCompleto)}</div><div className="pb-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-3xl font-black tracking-tight">{profile.nomeCompleto}</h1><span className="verified-mark" title="Perfil disponível"><CheckCircle2 className="h-4 w-4" /></span></div><p className="mt-1 text-sm text-[#c5d0c7]">{profile.curso || 'Pessoa colaboradora'} · {profile.disponibilidade === 'DISPONIVEL' ? 'Disponível para projetos' : 'Disponibilidade a combinar'}</p></div></div><div className="flex flex-wrap gap-2">{currentUser && String(currentUser.id) === String(id) && <Link to="/configuracoes/perfil"><Button variant="outline" className="rounded-full border-[#647b58] bg-transparent text-white hover:bg-white/10"><Pencil className="mr-2 h-4 w-4" />Configurar perfil</Button></Link>}{(!currentUser || String(currentUser.id) !== String(id)) && <Button className="rounded-full bg-[#c8f169] text-[#18221d] hover:bg-[#d8f58e]" onClick={() => setShowContact(true)}><Link2 className="mr-2 h-4 w-4" />Enviar mensagem</Button>}</div></div><div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#c5d0c7]"><span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#c8f169]" />Brasil · remoto</span><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-[#c8f169]" />Membro da comunidade</span><span className="inline-flex items-center gap-1.5"><BriefcaseBusiness className="h-4 w-4 text-[#c8f169]" />Aberto a colaborações</span></div></div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
        <div className="space-y-8">
          <Card className="border-[#e1e7df] shadow-none"><CardHeader><CardTitle className="text-2xl text-[#18221d]">Sobre {profile.nomeCompleto?.split(' ')[0]}</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap leading-7 text-[#657066]">{profile.bio || 'Este perfil ainda está preparando uma apresentação.'}</p></CardContent></Card>
          <section><div className="mb-4 flex items-end justify-between gap-4"><div><p className="eyebrow">Trabalhos selecionados</p><h2 className="mt-2 text-3xl font-black text-[#18221d]">Portfólio</h2></div><span className="text-sm font-semibold text-[#89948d]">{profile.portfolio?.length || 0} projetos</span></div>{profile.portfolio?.length ? <div className="grid gap-5 sm:grid-cols-2">{profile.portfolio.map((item) => <article key={item.title} className="portfolio-card overflow-hidden rounded-3xl border border-[#e1e7df] bg-white"><div className="portfolio-art" style={{ background: item.color || 'linear-gradient(135deg, #18221d, #758e38)' }}><span>{item.short || initials(item.title)}</span></div><div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-black text-[#18221d]">{item.title}</h3><Sparkles className="h-4 w-4 shrink-0 text-[#758e38]" /></div><p className="mt-2 text-sm leading-6 text-[#657066]">{item.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{item.tools?.map((tool) => <Badge key={tool} variant="secondary">{tool}</Badge>)}</div>{(item.url || item.anexos?.length > 0) && <div className="mt-4 flex flex-wrap gap-2">{item.url && <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-[#f3f8e4] px-3 py-1.5 text-sm font-bold text-[#758e38]">Ver projeto <ExternalLink className="h-3.5 w-3.5" /></a>}{item.anexos?.map((anexo) => <a key={anexo.url} href={resolveMediaUrl(anexo.url)} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#d8e4b9] px-3 py-1.5 text-xs font-semibold text-[#526b25]"><Paperclip className="h-3.5 w-3.5 shrink-0" /><span className="max-w-[150px] truncate">{anexo.label || 'Anexo'}</span></a>)}</div>}</div></article>)}</div> : <div className="rounded-3xl border border-dashed border-[#cfd9cc] p-8 text-center"><p className="font-bold text-[#18221d]">Ainda não há trabalhos publicados.</p><p className="mt-2 text-sm text-[#657066]">Quando este estudante adicionar projetos, eles aparecerão aqui.</p></div>}</section>
          <section aria-labelledby="recommendations-title"><div className="mb-4"><p className="eyebrow">Confiança na comunidade</p><h2 id="recommendations-title" className="mt-2 text-3xl font-black text-[#18221d]">Avaliações e recomendações</h2></div><div className="space-y-4">{recommendations.map((recommendation) => <article key={recommendation.id} className="rounded-3xl border border-[#e1e7df] bg-white p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-black text-[#18221d]">{recommendation.autorNome || recommendation.autor?.nomeCompleto || 'Pessoa da comunidade'}</p><div className="mt-1 flex gap-0.5" aria-label={`${recommendation.nota} de 5 estrelas`}>{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-4 w-4 ${index < recommendation.nota ? 'fill-[#c8f169] text-[#758e38]' : 'text-[#cbd4ca]'}`} />)}</div></div><MessageSquareQuote className="h-5 w-5 text-[#758e38]" /></div><p className="mt-4 leading-7 text-[#657066]">“{recommendation.texto}”</p></article>)}</div>{recommendations.length === 0 && <p className="rounded-3xl border border-dashed border-[#cfd9cc] p-6 text-sm text-[#657066]">Ainda não há recomendações.</p>}{currentUser && String(currentUser.id) !== String(id) && <form onSubmit={submitRecommendation} className="mt-5 rounded-3xl border border-[#d8e4b9] bg-[#f3f8e4] p-5"><h3 className="font-black text-[#18221d]">Você já trabalhou com esta pessoa?</h3><p className="mt-1 text-sm text-[#657066]">Deixe uma recomendação curta e honesta.</p><div className="mt-4 flex gap-1" aria-label="Escolha uma nota de 1 a 5">{[1, 2, 3, 4, 5].map((rating) => <button key={rating} type="button" onClick={() => setReviewRating(rating)} aria-label={`${rating} estrelas`} className="rounded p-1"><Star className={`h-5 w-5 ${rating <= reviewRating ? 'fill-[#c8f169] text-[#758e38]' : 'text-[#a7b399]'}`} /></button>)}</div><textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} maxLength={1000} rows={3} placeholder="O que foi bom nessa colaboração?" className="mt-3 w-full rounded-2xl border border-[#cfd9cc] bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#9bc14b]" required /><div className="mt-3 flex items-center justify-between gap-3">{reviewError && <p className="text-sm text-red-700" role="alert">{reviewError}</p>}<Button type="submit" disabled={reviewSending || !reviewText.trim()} className="ml-auto rounded-full bg-[#18221d] text-[#c8f169]"><Send className="mr-2 h-4 w-4" />{reviewSending ? 'Publicando...' : 'Publicar recomendação'}</Button></div></form>}</section>
        </div>
        <aside className="space-y-5"><Card className="border-[#e1e7df] shadow-none"><CardHeader><CardTitle className="text-xl text-[#18221d]">Habilidades</CardTitle><CardDescription>O que esta pessoa gosta de construir.</CardDescription></CardHeader><CardContent><div className="flex flex-wrap gap-2">{skills.map((skill) => <Badge key={skill} variant="outline" className="border-[#b9cba3] bg-[#f3f8e4] text-[#526b25]">{skill}</Badge>)}</div></CardContent></Card><Card className="border-[#e1e7df] bg-[#f2f5ef] shadow-none"><CardContent className="p-6"><Github className="h-6 w-6 text-[#758e38]" /><h2 className="mt-4 text-xl font-black text-[#18221d]">Quer construir junto?</h2><p className="mt-2 text-sm leading-6 text-[#657066]">Compartilhe uma oportunidade ou convide esta pessoa para conhecer seu projeto.</p><Link to="/projects" className="mt-5 inline-flex items-center gap-2 font-bold text-[#758e38]">Explorar projetos <ArrowUpRight className="h-4 w-4" /></Link></CardContent></Card></aside>
      </div>
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Falar com {profile.nomeCompleto?.split(' ')[0]}</DialogTitle><DialogDescription>Envie uma mensagem sobre uma oportunidade, projeto ou colaboração.</DialogDescription></DialogHeader>
          <form onSubmit={sendContactMessage} className="space-y-4">
            <textarea value={contactText} onChange={(event) => setContactText(event.target.value)} maxLength={2000} rows={6} placeholder="Olá! Vi seu perfil e gostaria de conversar sobre..." className="w-full rounded-2xl border border-[#cfd9cc] bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#9bc14b]" required aria-label="Mensagem para o perfil" />
            {contactStatus && <p className="text-sm text-[#526b25]" role="status">{contactStatus}</p>}
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setShowContact(false)}>Cancelar</Button><Button type="submit" disabled={contactSending || !contactText.trim()} className="bg-[#18221d] text-[#c8f169]">{contactSending ? 'Enviando...' : 'Enviar mensagem'}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export default PublicProfile
