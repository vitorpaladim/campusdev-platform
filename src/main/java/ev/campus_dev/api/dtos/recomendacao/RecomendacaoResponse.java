package ev.campus_dev.api.dtos.recomendacao;

import ev.campus_dev.api.models.recomendacao.Recomendacao;
import java.time.LocalDateTime;

public record RecomendacaoResponse(Long id, Long autorId, String autorNome, Integer nota, String texto, LocalDateTime criadaEm) {
    public RecomendacaoResponse(Recomendacao recomendacao) {
        this(recomendacao.getId(), recomendacao.getAutor().getId(), recomendacao.getAutor().getNomeCompleto(),
                recomendacao.getNota(), recomendacao.getTexto(), recomendacao.getCriadaEm());
    }
}
