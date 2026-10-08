package ev.campus_dev.api.dtos.projetos_dto;

import java.time.LocalDateTime;

public record AtualizacaoProjeto(
        String titulo,
        String descricao,
        String linguagemTecnologia,
        Integer qndPessoasNecessarias,
        String status,
        LocalDateTime prazoEntrega,
        String linkConvite
) { }
