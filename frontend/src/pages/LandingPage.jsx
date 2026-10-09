import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Code2, Layers3, MoveRight, Sparkles, UsersRound } from 'lucide-react'

const steps = [
  ['01', 'Monte seu perfil', 'Mostre suas habilidades, interesses e o tipo de desafio que procura.'],
  ['02', 'Encontre uma frente', 'Explore projetos com contexto, escopo e espaço para contribuir.'],
  ['03', 'Construa junto', 'Aprenda fazendo e transforme cada entrega em experiência real.'],
]

const LandingPage = () => (
  <main className="overflow-hidden">
    <section className="relative border-b border-[#dfe5dc]">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pt-28">
        <div>
          <p className="eyebrow mb-6">Uma rede para quem faz</p>
          <h1 className="display-title max-w-3xl text-6xl leading-[.95] sm:text-7xl lg:text-[6.8rem]">
            Ideias boas ficam melhores <span className="text-[#758e38]">em equipe.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#657066]">
            O CampusDev aproxima estudantes de tecnologia e projetos que merecem sair do papel — com clareza, colaboração e espaço para aprender.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-3 rounded-full bg-[#18221d] px-6 py-3.5 font-bold text-[#c8f169] transition-transform hover:-translate-y-0.5">
              Entrar para a rede <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/projects" className="inline-flex items-center gap-2 px-4 py-3.5 font-bold text-[#657066] hover:text-[#18221d]">
              Ver projetos <MoveRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-14 flex gap-10 border-t border-[#dfe5dc] pt-6">
            <div><strong className="block text-2xl font-black">100+</strong><span className="text-sm text-[#657066]">pessoas criando</span></div>
            <div><strong className="block text-2xl font-black">50+</strong><span className="text-sm text-[#657066]">ideias em movimento</span></div>
            <div><strong className="block text-2xl font-black">01</strong><span className="text-sm text-[#657066]">comunidade</span></div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#c8f169] blur-3xl opacity-70" />
          <div className="soft-panel relative p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-[#e5eae3] pb-5">
              <div><p className="eyebrow">Painel da comunidade</p><p className="mt-1 font-bold">O que está acontecendo agora</p></div>
              <Sparkles className="h-5 w-5 text-[#758e38]" />
            </div>
            <div className="space-y-3 py-5">
              <div className="rounded-2xl bg-[#f2f5ef] p-4">
                <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-[#758e38]">Novo projeto</span><span className="h-2 w-2 rounded-full bg-[#9bc14b]" /></div>
                <h3 className="mt-3 text-xl font-black">Mapa do campus</h3>
                <p className="mt-1 text-sm text-[#657066]">Uma experiência simples para encontrar lugares e pessoas.</p>
                <div className="mt-4 flex gap-2"><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold">React</span><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold">UX</span></div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-[#e5eae3] p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#18221d] text-[#c8f169]"><UsersRound className="h-5 w-5" /></div>
                <div><p className="font-bold">3 pessoas entraram hoje</p><p className="text-sm text-[#657066]">novas conexões na comunidade</p></div>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-[#e5eae3] pt-5 text-sm font-semibold text-[#657066]"><Code2 className="h-4 w-4 text-[#758e38]" /> Feito para aprender fazendo.</div>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
        <div><p className="eyebrow mb-4">Sem complicação</p><h2 className="display-title text-4xl sm:text-5xl">Menos vitrine.<br /><span className="text-[#758e38]">Mais prática.</span></h2></div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(([number, title, text]) => <article key={number} className="soft-panel p-6">
            <span className="text-sm font-black text-[#9bad8f]">{number}</span>
            <h3 className="mt-12 text-xl font-black">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#657066]">{text}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="bg-[#18221d] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div><p className="eyebrow !text-[#c8f169]">Seu próximo projeto começa aqui</p><h2 className="mt-3 max-w-2xl text-4xl font-black tracking-[-.05em] sm:text-5xl">Tem uma ideia? Encontre quem queira construir com você.</h2></div>
        <Link to="/register" className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#c8f169] px-6 py-3.5 font-black text-[#18221d] hover:bg-[#d8f58e]">Criar meu perfil <ArrowUpRight className="h-4 w-4" /></Link>
      </div>
    </section>
  </main>
)

export default LandingPage
