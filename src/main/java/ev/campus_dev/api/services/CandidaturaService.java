package ev.campus_dev.api.services;

import ev.campus_dev.api.exceptions.BusinessException;
import ev.campus_dev.api.exceptions.ResourceNotFoundException;
import ev.campus_dev.api.models.candidatura.Candidatura;
import ev.campus_dev.api.models.candidatura.StatusCandidatura;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.models.usuario.Usuario;
import ev.campus_dev.api.repositories.CandidaturaRepository;
import ev.campus_dev.api.repositories.DesenvolvedorRepository;
import ev.campus_dev.api.repositories.ProjetoRepository;
import ev.campus_dev.api.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CandidaturaService {
    private final CandidaturaRepository candidaturaRepository;
    private final ProjetoRepository projetoRepository;
    private final UsuarioRepository usuarioRepository;
    private final DesenvolvedorRepository desenvolvedorRepository;

    public CandidaturaService(CandidaturaRepository candidaturaRepository, ProjetoRepository projetoRepository,
                              UsuarioRepository usuarioRepository, DesenvolvedorRepository desenvolvedorRepository) {
        this.candidaturaRepository = candidaturaRepository;
        this.projetoRepository = projetoRepository;
        this.usuarioRepository = usuarioRepository;
        this.desenvolvedorRepository = desenvolvedorRepository;
    }

    @Transactional
    public Candidatura candidatar(Long projetoId, Long desenvolvedorId) {
        Projeto projeto = projetoRepository.findById(projetoId)
                .orElseThrow(() -> new ResourceNotFoundException("Projeto não encontrado"));
        Usuario desenvolvedor = usuarioRepository.findById(desenvolvedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Desenvolvedor não encontrado"));
        if (!"ABERTO".equals(projeto.getStatus())) {
            throw new BusinessException("O projeto não está aberto para candidaturas");
        }
        if (candidaturaRepository.existsByProjetoIdAndDesenvolvedorId(projetoId, desenvolvedorId)) {
            throw new BusinessException("Candidatura duplicada");
        }
        Candidatura candidatura = new Candidatura();
        candidatura.setProjeto(projeto);
        candidatura.setDesenvolvedor(desenvolvedor);
        candidatura.setData(LocalDateTime.now());
        return candidaturaRepository.save(candidatura);
    }

    public List<Candidatura> listarPorProjeto(Long projetoId) {
        return candidaturaRepository.findByProjetoId(projetoId);
    }

    @Transactional
    public Candidatura decidir(Long id, StatusCandidatura status) {
        Candidatura candidatura = candidaturaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidatura não encontrada"));
        if (status != StatusCandidatura.APROVADA && status != StatusCandidatura.RECUSADA) {
            throw new BusinessException("Decisão inválida");
        }
        if (status == StatusCandidatura.APROVADA
                && candidatura.getStatus() != StatusCandidatura.APROVADA) {
            Projeto projeto = candidatura.getProjeto();
            if (projeto.getDesenvolvedores().size() >= projeto.getQndPessoasNecessarias()) {
                throw new BusinessException("A equipe deste projeto já está completa");
            }
            desenvolvedorRepository.findById(candidatura.getDesenvolvedor().getId())
                    .ifPresent(projeto.getDesenvolvedores()::add);
        }
        if (status == StatusCandidatura.RECUSADA) {
            desenvolvedorRepository.findById(candidatura.getDesenvolvedor().getId())
                    .ifPresent(candidatura.getProjeto().getDesenvolvedores()::remove);
        }
        candidatura.setStatus(status);
        return candidaturaRepository.save(candidatura);
    }
}
