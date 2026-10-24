import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Inbox, ArrowUpRight, MessageCircle, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { apiFetch } from '@/api/client'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await apiFetch('/mensagens/diretas')
        if (!response.ok) throw new Error('Falha ao carregar mensagens')
        setMessages(await response.json())
      } catch {
        setMessages(JSON.parse(localStorage.getItem('campusdev-direct-messages') || '[]'))
      } finally {
        setLoading(false)
      }
    }
    loadMessages()
  }, [])

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null')
  if (loading) return <main className="mx-auto max-w-4xl px-6 py-16 text-center"><div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#dfe5dc] border-t-[#758e38]" /><p className="mt-3 text-sm text-[#657066]">Carregando mensagens...</p></main>

  return <main className="mx-auto max-w-4xl px-6 py-10 lg:py-14"><p className="eyebrow">Comunicação</p><div className="mt-2 flex items-end justify-between gap-4"><div><h1 className="display-title text-4xl">Mensagens</h1><p className="mt-2 text-[#657066]">Converse diretamente com pessoas da comunidade.</p></div><MessageCircle className="h-10 w-10 text-[#758e38]" /></div>{messages.length === 0 ? <Card className="mt-8 border-dashed border-[#cfd9cc] shadow-none"><CardContent className="p-10 text-center"><Inbox className="mx-auto h-9 w-9 text-[#758e38]" /><h2 className="mt-4 font-black text-[#18221d]">Sua caixa está vazia</h2><p className="mt-2 text-sm text-[#657066]">Quando alguém entrar em contato pelo seu perfil, a conversa aparecerá aqui.</p></CardContent></Card> : <div className="mt-8 space-y-4">{messages.map((message) => { const isSent = String(message.remetenteId) === String(currentUser?.id); const otherId = isSent ? message.destinatarioId : message.remetenteId; const otherName = isSent ? message.destinatarioNome : message.remetenteNome; return <Card key={message.id} className="border-[#e1e7df] shadow-none"><CardHeader className="pb-3"><div className="flex items-start justify-between gap-4"><div><CardTitle className="text-lg text-[#18221d]">{otherName || 'Pessoa da comunidade'}</CardTitle><CardDescription className="mt-1">{isSent ? <span className="inline-flex items-center gap-1"><Send className="h-3 w-3" /> Enviada</span> : <span className="inline-flex items-center gap-1"><Inbox className="h-3 w-3" /> Recebida</span>}</CardDescription></div><Badge variant={isSent ? 'secondary' : 'default'}>{new Date(message.enviadaEm).toLocaleDateString('pt-BR')}</Badge></div></CardHeader><CardContent><p className="leading-7 text-[#657066]">{message.conteudo}</p>{otherId && <Link to={`/perfil/${otherId}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#758e38]">Ver perfil <ArrowUpRight className="h-4 w-4" /></Link>}</CardContent></Card> })}</div>}</main>
}

export default Messages
