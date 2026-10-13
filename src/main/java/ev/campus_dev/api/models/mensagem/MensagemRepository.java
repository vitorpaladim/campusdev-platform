package ev.campus_dev.api.models.mensagem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
    @Query("""
            SELECT m FROM Mensagem m
            WHERE m.projeto.id_projeto = :projetoId
            ORDER BY m.enviadaEm ASC
            """)
    List<Mensagem> findByProjetoId(@Param("projetoId") Long projetoId);
}
