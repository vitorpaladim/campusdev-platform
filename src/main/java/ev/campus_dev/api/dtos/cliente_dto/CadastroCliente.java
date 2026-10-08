package ev.campus_dev.api.dtos.cliente_dto;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;

public record CadastroCliente(
        @NotBlank String tipoDeMercado,
        @NotBlank String nomeEmpresa,
        @NotBlank String telefone,
        LocalDateTime dataDeCadastro
) {
}
