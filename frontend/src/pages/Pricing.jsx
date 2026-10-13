import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Check, Sparkles } from 'lucide-react'

const plans = [
  {
    name: 'Comunidade',
    label: 'Para começar',
    price: 'Grátis',
    description: 'Para quem quer oferecer habilidades ou encontrar pessoas para um projeto.',
    features: ['Perfil profissional', 'Feed de projetos', 'Candidaturas', 'Participação em equipes'],
  },
  {
    name: 'Profissional',
    label: 'Em breve',
    price: 'Premium',
    description: 'Recursos para quem quer se destacar e organizar melhor sua atuação.',
    features: ['Tudo do plano Comunidade', 'Portfólio em destaque', 'Mais visibilidade no feed', 'Indicadores de perfil'],
    featured: true,
  },
  {
    name: 'Negócios',
    label: 'Em breve',
    price: 'Para empresas',
    description: 'Para negócios que precisam encontrar talentos e publicar demandas com prioridade.',
    features: ['Publicações patrocinadas', 'Filtros avançados', 'Gestão de equipes', 'Suporte prioritário'],
  },
]

const Pricing = () => (
  <main className="min-h-[calc(100vh-4rem)] border-b border-[#dfe5dc] px-6 py-12 lg:px-8 lg:py-20">
    <div className="mx-auto max-w-7xl">
      <Link to="/" className="eyebrow inline-flex items-center gap-2 hover:text-[#18221d]">
        <ArrowLeft className="h-4 w-4" /> Voltar para o início
      </Link>
      <div className="mt-16 max-w-3xl">
        <p className="eyebrow">Modelo de sustentabilidade</p>
        <h1 className="display-title mt-4 text-6xl leading-[.95]">Uma rede aberta para começar. <span className="text-[#758e38]">Recursos pagos para crescer.</span></h1>
        <p className="mt-7 text-lg leading-8 text-[#657066]">O acesso básico continua gratuito. A receita pode vir de visibilidade patrocinada, recursos profissionais e soluções para empresas — sem bloquear a primeira oportunidade de ninguém.</p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.name} className={`soft-panel relative flex flex-col p-7 ${plan.featured ? 'border-[#758e38] ring-2 ring-[#c8f169]' : ''}`}>
            {plan.featured && <div className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-[#c8f169] px-3 py-1 text-xs font-black text-[#18221d]"><Sparkles className="h-3 w-3" /> Mais visibilidade</div>}
            <p className="eyebrow">{plan.label}</p>
            <h2 className="mt-4 text-2xl font-black">{plan.name}</h2>
            <p className="mt-3 min-h-20 text-sm leading-6 text-[#657066]">{plan.description}</p>
            <p className="mt-6 text-3xl font-black">{plan.price}</p>
            <ul className="mt-7 space-y-3 border-t border-[#e5eae3] pt-6">
              {plan.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm text-[#657066]"><Check className="h-4 w-4 text-[#758e38]" /> {feature}</li>)}
            </ul>
            <Link to="/register" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#18221d] px-5 py-3 font-bold text-[#c8f169]">Criar perfil <ArrowUpRight className="h-4 w-4" /></Link>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-[2rem] border border-[#dfe5dc] bg-[#f2f5ef] p-7 sm:p-9">
        <p className="eyebrow">Estratégia para o MVP</p>
        <h2 className="mt-3 text-2xl font-black">Validar primeiro, cobrar depois.</h2>
        <p className="mt-3 max-w-3xl leading-7 text-[#657066]">Nesta fase, o CampusDev não processa pagamentos. O objetivo é medir publicações, candidaturas, projetos concluídos e interesse em destaque. Com esses dados, será possível definir preços e testar impulsionamento com segurança.</p>
      </div>
    </div>
  </main>
)

export default Pricing
