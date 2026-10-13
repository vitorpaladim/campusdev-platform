import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const Privacy = () => (
  <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-4xl px-6 py-12 lg:px-8 lg:py-20">
    <Link to="/register" className="eyebrow inline-flex items-center gap-2 hover:text-[#18221d]">
      <ArrowLeft className="h-4 w-4" /> Voltar para o cadastro
    </Link>
    <article className="soft-panel mt-10 p-7 sm:p-12">
      <p className="eyebrow">Transparência de dados</p>
      <h1 className="display-title mt-3 text-5xl">Política de Privacidade</h1>
      <p className="mt-4 text-sm text-[#657066]">Última atualização: 13 de outubro de 2026</p>

      <div className="prose-content mt-10">
        <h2>1. Dados coletados</h2>
        <p>Coletamos nome, email, senha protegida, intenção de uso, habilidades, bio, disponibilidade, formação ou experiência, links de portfólio, projetos, candidaturas e mensagens necessárias para oferecer a plataforma.</p>
        <h2>2. Como usamos os dados</h2>
        <p>Usamos esses dados para autenticar contas, exibir perfis e projetos, formar equipes, permitir candidaturas, operar o chat, prevenir abuso e melhorar o serviço.</p>
        <h2>3. Visibilidade</h2>
        <p>Informações do perfil e portfólio podem ser exibidas para outros usuários conforme as funcionalidades da plataforma. Senhas não são exibidas. Mensagens ficam restritas ao solicitante e aos participantes aprovados do projeto.</p>
        <h2>4. Compartilhamento</h2>
        <p>Não vendemos dados pessoais. Podemos utilizar fornecedores de infraestrutura para hospedar a aplicação e o banco de dados, sempre para operar o serviço e conforme as obrigações aplicáveis.</p>
        <h2>5. Segurança e retenção</h2>
        <p>Adotamos autenticação, hash de senhas e controle de acesso. Nenhum serviço online é completamente imune a riscos; por isso, não compartilhe senhas ou informações confidenciais no perfil e no chat.</p>
        <h2>6. Seus direitos</h2>
        <p>Você pode solicitar acesso, correção ou exclusão dos dados associados à sua conta. Também pode atualizar o perfil diretamente quando a funcionalidade estiver disponível.</p>
        <h2>7. Contato e atualizações</h2>
        <p>Este documento é uma base inicial para o MVP e deve ser revisado com orientação jurídica antes do lançamento público ou da cobrança de usuários. A data no topo indica a versão vigente.</p>
      </div>
    </article>
  </main>
)

export default Privacy
