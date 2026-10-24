package ev.campus_dev.api.dtos.mensagem_dto;

import ev.campus_dev.api.models.mensagem.MensagemDireta;
import java.time.LocalDateTime;

public record MensagemDiretaResponse(Long id, Long remetenteId, String remetenteNome, Long destinatarioId,
                                     String destinatarioNome, String conteudo, LocalDateTime enviadaEm, boolean lida) {
    public MensagemDiretaResponse(MensagemDireta mensagem) {
        this(mensagem.getId(), mensagem.getRemetente().getId(), mensagem.getRemetente().getNomeCompleto(),
                mensagem.getDestinatario().getId(), mensagem.getDestinatario().getNomeCompleto(),
                mensagem.getConteudo(), mensagem.getEnviadaEm(), mensagem.isLida());
    }
}
