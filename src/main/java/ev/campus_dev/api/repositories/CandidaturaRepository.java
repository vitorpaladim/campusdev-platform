package ev.campus_dev.api.repositories;

import ev.campus_dev.api.models.candidatura.Candidatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {
    @Query("""
            SELECT COUNT(c) > 0
            FROM Candidatura c
            WHERE c.projeto.id_projeto = :projetoId
              AND c.desenvolvedor.id = :desenvolvedorId
            """)
    boolean existsByProjetoIdAndDesenvolvedorId(
            @Param("projetoId") Long projetoId,
            @Param("desenvolvedorId") Long desenvolvedorId
    );

    @Query("""
            SELECT c
            FROM Candidatura c
            WHERE c.projeto.id_projeto = :projetoId
            """)
    List<Candidatura> findByProjetoId(@Param("projetoId") Long projetoId);
}
