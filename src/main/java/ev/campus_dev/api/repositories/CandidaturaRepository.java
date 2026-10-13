package ev.campus_dev.api.repositories;

import ev.campus_dev.api.models.candidatura.Candidatura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {
    boolean existsByProjetoIdProjetoAndDesenvolvedorId(Long projetoId, Long desenvolvedorId);
    List<Candidatura> findByProjetoIdProjeto(Long projetoId);
}
