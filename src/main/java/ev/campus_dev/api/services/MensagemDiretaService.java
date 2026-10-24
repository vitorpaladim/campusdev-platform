package ev.campus_dev.api.services;

import ev.campus_dev.api.dtos.mensagem_dto.MensagemDiretaResponse;
import ev.campus_dev.api.dtos.mensagem_dto.NovaMensagemDireta;
import ev.campus_dev.api.dtos.notificacao.NotificacaoPayload;
import ev.campus_dev.api.exceptions.BusinessException;
import ev.campus_dev.api.exceptions.ResourceNotFoundException;
import ev.campus_dev.api.models.desenvolvedor.Desenvolvedor;
import ev.campus_dev.api.models.mensagem.MensagemDireta;
import ev.campus_dev.api.models.mensagem.MensagemDiretaRepository;
import ev.campus_dev.api.models.usuario.Usuario;
import ev.campus_dev.api.repositories.DesenvolvedorRepository;
import ev.campus_dev.api.repositories.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MensagemDiretaService {
    private final MensagemDiretaRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final DesenvolvedorRepository desenvolvedorRepository;
    private final NotificacaoService notificacaoService;

    public MensagemDiretaService(MensagemDiretaRepository repository, UsuarioRepository usuarioRepository, DesenvolvedorRepository desenvolvedorRepository, NotificacaoService notificacaoService) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.desenvolvedorRepository = desenvolvedorRepository;
        this.notificacaoService = notificacaoService;
    }

    @Transactional
    public MensagemDiretaResponse enviarParaDesenvolvedor(Long destinatarioId, NovaMensagemDireta dados, Authentication authentication) {
        Usuario remetente = usuarioRepository.findByEmail(authentication.getName());
        Desenvolvedor destinatario = desenvolvedorRepository.findById(destinatarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil não encontrado"));
        if (remetente == null) throw new ResourceNotFoundException("Remetente não encontrado");
        if (remetente.getId() == destinatario.getId()) throw new BusinessException("Você não pode enviar uma mensagem para si mesmo");
        if (dados.conteudo() == null || dados.conteudo().trim().isBlank()) throw new BusinessException("Escreva uma mensagem");
        MensagemDireta mensagem = new MensagemDireta();
        mensagem.setRemetente(remetente);
        mensagem.setDestinatario(destinatario);
        mensagem.setConteudo(dados.conteudo().trim());
        mensagem.setEnviadaEm(LocalDateTime.now());
        mensagem.setLida(false);
        MensagemDiretaResponse resposta = new MensagemDiretaResponse(repository.save(mensagem));
        notificacaoService.publicar(destinatario.getId(), new NotificacaoPayload("NOVA_MENSAGEM", "Nova mensagem", remetente.getNomeCompleto() + " enviou uma mensagem para você.", "/mensagens", resposta));
        return resposta;
    }

    @Transactional(readOnly = true)
    public List<MensagemDiretaResponse> listar(Authentication authentication) {
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName());
        if (usuario == null) throw new ResourceNotFoundException("Usuário não encontrado");
        return repository.findByRemetenteIdOrDestinatarioIdOrderByEnviadaEmDesc(usuario.getId(), usuario.getId())
                .stream().map(MensagemDiretaResponse::new).toList();
    }
}
