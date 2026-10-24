package ev.campus_dev.api.models.mensagem;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MensagemDiretaRepository extends JpaRepository<MensagemDireta, Long> {
    List<MensagemDireta> findByRemetenteIdOrDestinatarioIdOrderByEnviadaEmDesc(Long remetenteId, Long destinatarioId);
}
