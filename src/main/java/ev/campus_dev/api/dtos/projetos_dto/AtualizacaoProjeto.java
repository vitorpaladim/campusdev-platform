package ev.campus_dev.api.dtos.projetos_dto;

import java.time.LocalDateTime;
import java.math.BigDecimal;

public record AtualizacaoProjeto(
        String titulo,
        String descricao,
        String categoria,
        String linguagemTecnologia,
        Integer qndPessoasNecessarias,
        BigDecimal orcamento,
        Boolean destaque,
        String status,
        LocalDateTime prazoEntrega,
        String linkConvite
) { }
