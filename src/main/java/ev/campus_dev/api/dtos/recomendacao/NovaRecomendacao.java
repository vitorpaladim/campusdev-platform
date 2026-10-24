package ev.campus_dev.api.dtos.recomendacao;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record NovaRecomendacao(
        @Min(1) @Max(5) Integer nota,
        @NotBlank String texto,
        Long projetoId
) {
}
