package ev.campus_dev.api.models.recomendacao;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecomendacaoRepository extends JpaRepository<Recomendacao, Long> {
    List<Recomendacao> findByEstudanteIdOrderByCriadaEmDesc(Long estudanteId);
}
