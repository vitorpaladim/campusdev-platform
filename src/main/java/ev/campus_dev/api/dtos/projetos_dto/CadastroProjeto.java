package ev.campus_dev.api.dtos.projetos_dto;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CadastroProjeto(
        @NotBlank String titulo,
        @NotBlank String descricao,
        @NotBlank String categoria,
        @NotBlank String linguagemTecnologia,
        @NotNull @Min(1) Integer qndPessoasNecessarias,
        BigDecimal orcamento,
        Boolean destaque,
        String status,
        LocalDateTime dataDeCadastro,
        LocalDateTime prazoEntrega,
        String linkConvite
) {}
