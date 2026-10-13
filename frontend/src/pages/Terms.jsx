import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const Terms = () => (
  <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-4xl px-6 py-12 lg:px-8 lg:py-20">
    <Link to="/register" className="eyebrow inline-flex items-center gap-2 hover:text-[#18221d]">
      <ArrowLeft className="h-4 w-4" /> Voltar para o cadastro
    </Link>
    <article className="soft-panel mt-10 p-7 sm:p-12">
      <p className="eyebrow">Documento em vigor</p>
      <h1 className="display-title mt-3 text-5xl">Termos de Uso</h1>
      <p className="mt-4 text-sm text-[#657066]">Última atualização: 13 de outubro de 2026</p>

      <div className="prose-content mt-10">
        <h2>1. Sobre o CampusDev</h2>
        <p>O CampusDev é uma plataforma que conecta pessoas que oferecem habilidades profissionais a pessoas, empresas e pequenos negócios que procuram colaboradores para projetos.</p>
        <h2>2. Cadastro e responsabilidade</h2>
        <p>Você deve fornecer informações verdadeiras, manter sua conta segura e atualizar seu perfil quando necessário. Cada pessoa deve utilizar sua própria conta e não pode se passar por outra pessoa ou empresa.</p>
        <h2>3. Projetos, candidaturas e equipes</h2>
        <p>Publicações devem descrever necessidades reais, respeitar a legislação e informar escopo, habilidades, prazo e orçamento de forma honesta. Candidaturas não garantem contratação. A aprovação de participantes é responsabilidade de quem publicou o projeto.</p>
        <h2>4. Conteúdo e portfólio</h2>
        <p>Você mantém a responsabilidade pelo conteúdo, links e trabalhos compartilhados no perfil. Não publique material ilegal, discriminatório, enganoso, confidencial de terceiros ou que viole direitos autorais.</p>
        <h2>5. Comunicação e conduta</h2>
        <p>O chat de cada projeto deve ser usado para tratar da colaboração. Assédio, fraude, spam, tentativa de obter credenciais e qualquer uso abusivo podem resultar em remoção de conteúdo ou suspensão da conta.</p>
        <h2>6. Pagamentos e impulsionamento</h2>
        <p>Recursos pagos, como destaque de projetos, somente serão cobrados quando estiverem claramente apresentados e confirmados. O CampusDev poderá criar planos e comissões no futuro, comunicando condições antes da contratação.</p>
        <h2>7. Exclusão e alterações</h2>
        <p>Você pode solicitar a exclusão da conta. Podemos atualizar estes termos para refletir mudanças no serviço, informando a nova data de atualização.</p>
      </div>
    </article>
  </main>
)

export default Terms
