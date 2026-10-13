package ev.campus_dev.api.dtos.mensagem_dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NovaMensagem(
        @NotBlank @Size(max = 2000) String conteudo
) {}
