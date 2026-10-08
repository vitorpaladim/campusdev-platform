package ev.campus_dev.api.services;

import ev.campus_dev.api.exceptions.BusinessException;
import ev.campus_dev.api.exceptions.ResourceNotFoundException;
import ev.campus_dev.api.models.candidatura.Candidatura;
import ev.campus_dev.api.models.candidatura.StatusCandidatura;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.models.usuario.Usuario;
import ev.campus_dev.api.repositories.CandidaturaRepository;
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

    public CandidaturaService(CandidaturaRepository candidaturaRepository, ProjetoRepository projetoRepository,
                              UsuarioRepository usuarioRepository) {
        this.candidaturaRepository = candidaturaRepository;
        this.projetoRepository = projetoRepository;
        this.usuarioRepository = usuarioRepository;
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
        if (candidaturaRepository.existsByProjetoId_projetoAndDesenvolvedorId(projetoId, desenvolvedorId)) {
            throw new BusinessException("Candidatura duplicada");
        }
        Candidatura candidatura = new Candidatura();
        candidatura.setProjeto(projeto);
        candidatura.setDesenvolvedor(desenvolvedor);
        candidatura.setData(LocalDateTime.now());
        return candidaturaRepository.save(candidatura);
    }

    public List<Candidatura> listarPorProjeto(Long projetoId) {
        return candidaturaRepository.findByProjetoId_projeto(projetoId);
    }

    @Transactional
    public Candidatura decidir(Long id, StatusCandidatura status) {
        Candidatura candidatura = candidaturaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidatura não encontrada"));
        if (status != StatusCandidatura.APROVADA && status != StatusCandidatura.RECUSADA) {
            throw new BusinessException("Decisão inválida");
        }
        candidatura.setStatus(status);
        return candidaturaRepository.save(candidatura);
    }
}
