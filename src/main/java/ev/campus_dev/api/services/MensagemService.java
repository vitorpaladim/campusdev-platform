package ev.campus_dev.api.services;

import ev.campus_dev.api.dtos.mensagem_dto.NovaMensagem;
import ev.campus_dev.api.exceptions.BusinessException;
import ev.campus_dev.api.exceptions.ResourceNotFoundException;
import ev.campus_dev.api.models.mensagem.Mensagem;
import ev.campus_dev.api.models.mensagem.MensagemRepository;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.models.usuario.Usuario;
import ev.campus_dev.api.repositories.ProjetoRepository;
import ev.campus_dev.api.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MensagemService {
    private final MensagemRepository mensagemRepository;
    private final ProjetoRepository projetoRepository;
    private final UsuarioRepository usuarioRepository;

    public MensagemService(MensagemRepository mensagemRepository, ProjetoRepository projetoRepository,
                           UsuarioRepository usuarioRepository) {
        this.mensagemRepository = mensagemRepository;
        this.projetoRepository = projetoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Mensagem> listar(Long projetoId, Authentication authentication) {
        verificarAcesso(projetoId, authentication);
        return mensagemRepository.findByProjetoId(projetoId);
    }

    @Transactional
    public Mensagem enviar(Long projetoId, NovaMensagem dados, Authentication authentication) {
        Projeto projeto = verificarAcesso(projetoId, authentication);
        Usuario autor = usuarioRepository.findByEmail(authentication.getName());
        Mensagem mensagem = new Mensagem();
        mensagem.setProjeto(projeto);
        mensagem.setAutor(autor);
        mensagem.setConteudo(dados.conteudo().trim());
        mensagem.setEnviadaEm(LocalDateTime.now());
        return mensagemRepository.save(mensagem);
    }

    private Projeto verificarAcesso(Long projetoId, Authentication authentication) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName());
        boolean solicitante = projeto.getCliente() != null
                && projeto.getCliente().getId() == usuario.getId();
        boolean participante = projeto.getDesenvolvedores().stream()
                .anyMatch(dev -> dev.getId() == usuario.getId());
        if (!solicitante && !participante) {
            throw new BusinessException("Você não participa deste projeto");
        }
        return projeto;
    }
}
