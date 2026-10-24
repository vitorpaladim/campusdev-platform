package ev.campus_dev.api.dtos.mensagem_dto;

import jakarta.validation.constraints.NotBlank;

public record NovaMensagemDireta(@NotBlank String conteudo) {
}
