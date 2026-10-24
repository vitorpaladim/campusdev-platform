package ev.campus_dev.api.services;

import ev.campus_dev.api.dtos.recomendacao.NovaRecomendacao;
import ev.campus_dev.api.dtos.recomendacao.RecomendacaoResponse;
import ev.campus_dev.api.dtos.notificacao.NotificacaoPayload;
import ev.campus_dev.api.exceptions.BusinessException;
import ev.campus_dev.api.exceptions.ResourceNotFoundException;
import ev.campus_dev.api.models.desenvolvedor.Desenvolvedor;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.models.recomendacao.Recomendacao;
import ev.campus_dev.api.models.recomendacao.RecomendacaoRepository;
import ev.campus_dev.api.models.usuario.Usuario;
import ev.campus_dev.api.repositories.DesenvolvedorRepository;
import ev.campus_dev.api.repositories.ProjetoRepository;
import ev.campus_dev.api.repositories.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecomendacaoService {
    private final RecomendacaoRepository repository;
    private final DesenvolvedorRepository desenvolvedorRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProjetoRepository projetoRepository;
    private final NotificacaoService notificacaoService;

    public RecomendacaoService(RecomendacaoRepository repository, DesenvolvedorRepository desenvolvedorRepository,
                               UsuarioRepository usuarioRepository, ProjetoRepository projetoRepository, NotificacaoService notificacaoService) {
        this.repository = repository;
        this.desenvolvedorRepository = desenvolvedorRepository;
        this.usuarioRepository = usuarioRepository;
        this.projetoRepository = projetoRepository;
        this.notificacaoService = notificacaoService;
    }

    public List<RecomendacaoResponse> listar(Long estudanteId) {
        return repository.findByEstudanteIdOrderByCriadaEmDesc(estudanteId).stream().map(RecomendacaoResponse::new).toList();
    }

    @Transactional
    public RecomendacaoResponse criar(Long estudanteId, NovaRecomendacao dados, Authentication authentication) {
        Desenvolvedor estudante = desenvolvedorRepository.findById(estudanteId)
                .orElseThrow(() -> new ResourceNotFoundException("Estudante não encontrado"));
        Usuario autor = usuarioRepository.findByEmail(authentication.getName());
        if (autor == null) throw new ResourceNotFoundException("Autor não encontrado");
        if (autor.getId() == estudante.getId()) throw new BusinessException("Você não pode recomendar seu próprio perfil");
        Projeto projeto = null;
        if (dados.projetoId() != null) projeto = projetoRepository.findById(dados.projetoId()).orElse(null);
        Recomendacao recomendacao = new Recomendacao();
        recomendacao.setEstudante(estudante);
        recomendacao.setAutor(autor);
        recomendacao.setProjeto(projeto);
        recomendacao.setNota(dados.nota());
        recomendacao.setTexto(dados.texto().trim());
        recomendacao.setCriadaEm(LocalDateTime.now());
        RecomendacaoResponse resposta = new RecomendacaoResponse(repository.save(recomendacao));
        notificacaoService.publicar(estudante.getId(), new NotificacaoPayload("NOVA_AVALIACAO", "Nova avaliação", autor.getNomeCompleto() + " deixou uma recomendação no seu perfil.", "/perfil/" + estudante.getId(), resposta));
        return resposta;
    }
}
