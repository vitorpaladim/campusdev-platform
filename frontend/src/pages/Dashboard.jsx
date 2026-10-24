import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, BriefcaseBusiness, Calendar, CheckCircle, Clock3, Plus, Search, Users, XCircle } from 'lucide-react'
import { apiFetch } from '@/api/client'
import { DEMO_PROJECTS } from '@/lib/demoData'

const STATUS_LABELS = {
  ABERTO: 'Aberto',
  EM_SELECAO: 'Em seleção',
  EM_ANDAMENTO: 'Em andamento',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
}

const STATUS_STYLES = {
  ABERTO: 'bg-[#eef7d9] text-[#526b25]',
  EM_SELECAO: 'bg-[#fff4d8] text-[#8a6317]',
  EM_ANDAMENTO: 'bg-[#e2efff] text-[#245e9c]',
  FINALIZADO: 'bg-[#edf0ee] text-[#53615a]',
  CANCELADO: 'bg-[#ffe7e7] text-[#a33d3d]',
}

const formatDate = (value) => {
  if (!value) return 'Sem prazo definido'
  return new Date(value).toLocaleDateString('pt-BR')
}

const getStatusIcon = (status) => {
  if (status === 'FINALIZADO') return <CheckCircle className="h-3.5 w-3.5" />
  if (status === 'CANCELADO') return <XCircle className="h-3.5 w-3.5" />
  if (status === 'EM_ANDAMENTO') return <BriefcaseBusiness className="h-3.5 w-3.5" />
  return <Clock3 className="h-3.5 w-3.5" />
}

const ProjectRow = ({ project }) => (
  <Link to="/projects" className="group block rounded-2xl border border-[#e5eae3] p-4 transition hover:-translate-y-0.5 hover:border-[#9bad8f] hover:bg-[#fbfcfa]">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="truncate font-black text-[#18221d] group-hover:text-[#758e38]">{project.titulo}</p>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#657066]">{project.descricao || 'Projeto sem descrição.'}</p>
      </div>
      <Badge className={`shrink-0 ${STATUS_STYLES[project.status] || STATUS_STYLES.ABERTO}`}>
        <span className="mr-1">{getStatusIcon(project.status)}</span>
        {STATUS_LABELS[project.status] || project.status || 'Aberto'}
      </Badge>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-[#758079]">
      <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{project.desenvolvedores?.length || 0}/{project.qndPessoasNecessarias || 0} pessoas</span>
      <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(project.prazoEntrega)}</span>
      {project.orcamento != null && <span>R$ {Number(project.orcamento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>}
    </div>
  </Link>
)

const Dashboard = ({ user }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const fetchProjects = async () => {
      try {
        const response = await apiFetch('/projetos')
        const data = await response.json().catch(() => [])
        if (!response.ok) throw new Error(data.error || 'Não foi possível carregar os projetos.')
        if (active) setProjects(Array.isArray(data) ? data : [])
      } catch {
        if (active) setProjects(DEMO_PROJECTS)
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchProjects()
    return () => { active = false }
  }, [])

  const mine = useMemo(() => projects.filter((project) => String(project.cliente?.id) === String(user?.id)), [projects, user])
  const participating = useMemo(() => projects.filter((project) => project.desenvolvedores?.some((member) => String(member.id) === String(user?.id))), [projects, user])
  const openProjects = useMemo(() => projects.filter((project) => project.status === 'ABERTO'), [projects])
  const recentProjects = useMemo(() => [...projects].sort((a, b) => new Date(b.dataDeCadastro || 0) - new Date(a.dataDeCadastro || 0)).slice(0, 4), [projects])
  const isClient = user?.role === 'CLIENTE'

  if (loading) {
    return <div className="mx-auto max-w-7xl px-6 py-16 text-center"><div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#dfe5dc] border-t-[#758e38]" /><p className="text-[#657066]">Montando sua visão geral...</p></div>
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <section className="soft-panel overflow-hidden p-7 sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Visão geral</p>
            <h1 className="display-title mt-3 text-4xl sm:text-5xl">Olá, {user?.nomeCompleto?.split(' ')[0] || 'pessoa'}.</h1>
            <p className="mt-4 max-w-2xl leading-7 text-[#657066]">{isClient ? 'Acompanhe suas demandas e encontre pessoas para tirar suas ideias do papel.' : 'Encontre uma frente em que suas habilidades possam fazer diferença.'}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isClient ? <Link to="/projects?action=create"><Button className="rounded-full bg-[#18221d] text-[#c8f169] hover:bg-[#2a3a2f]"><Plus className="mr-2 h-4 w-4" />Publicar projeto</Button></Link> : <Link to="/projects"><Button className="rounded-full bg-[#18221d] text-[#c8f169] hover:bg-[#2a3a2f]"><Search className="mr-2 h-4 w-4" />Explorar oportunidades</Button></Link>}
            <Link to="/profile"><Button variant="outline" className="rounded-full">Editar perfil</Button></Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          [isClient ? 'Projetos publicados' : 'Projetos participando', isClient ? mine.length : participating.length, isClient ? 'suas demandas na rede' : 'equipes em que você está'],
          ['Oportunidades abertas', openProjects.length, 'projetos aceitando candidaturas'],
          ['Projetos na rede', projects.length, 'ideias em movimento'],
        ].map(([label, value, description]) => <Card key={label} className="border-[#e1e7df] shadow-none"><CardContent className="p-5"><p className="text-sm font-bold text-[#657066]">{label}</p><p className="mt-2 text-3xl font-black text-[#18221d]">{value}</p><p className="mt-1 text-xs text-[#89948d]">{description}</p></CardContent></Card>)}
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
        <Card className="border-[#e1e7df] shadow-none"><CardHeader><div className="flex items-center justify-between gap-4"><div><CardTitle className="text-2xl text-[#18221d]">{isClient ? 'Seus projetos' : 'Onde você está construindo'}</CardTitle><CardDescription className="mt-1">Acompanhe os movimentos mais importantes.</CardDescription></div><Link to="/projects" className="hidden items-center gap-1 text-sm font-bold text-[#758e38] sm:flex">Ver feed <ArrowUpRight className="h-4 w-4" /></Link></div></CardHeader><CardContent className="space-y-3">{(isClient ? mine : participating).slice(0, 4).map((project) => <ProjectRow key={project.idProjeto} project={project} />)}{(isClient ? mine : participating).length === 0 && <div className="rounded-2xl bg-[#f2f5ef] p-6 text-center"><p className="font-bold text-[#18221d]">Ainda não há projetos aqui.</p><p className="mt-2 text-sm leading-6 text-[#657066]">{isClient ? 'Publique uma demanda para começar a formar sua equipe.' : 'Explore o feed e candidate-se a uma oportunidade.'}</p><Link to={isClient ? '/projects?action=create' : '/projects'}><Button className="mt-4 rounded-full">{isClient ? 'Publicar primeiro projeto' : 'Explorar projetos'}</Button></Link></div>}</CardContent></Card>
        <Card className="border-[#e1e7df] shadow-none"><CardHeader><CardTitle className="text-2xl text-[#18221d]">Mais recentes</CardTitle><CardDescription className="mt-1">Novas oportunidades na comunidade.</CardDescription></CardHeader><CardContent className="space-y-3">{recentProjects.map((project) => <ProjectRow key={project.idProjeto} project={project} />)}{recentProjects.length === 0 && <p className="text-sm text-[#657066]">Nenhum projeto publicado ainda.</p>}</CardContent></Card>
      </section>
    </main>
  )
}

export default Dashboard
