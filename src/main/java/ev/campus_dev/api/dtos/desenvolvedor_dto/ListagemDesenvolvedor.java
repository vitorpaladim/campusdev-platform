package ev.campus_dev.api.dtos.desenvolvedor_dto;

import ev.campus_dev.api.models.desenvolvedor.Desenvolvedor;

public record ListagemDesenvolvedor(

        String id_nomeCompleto,
        String id_email,
        String id_bio,
        String id_disponibilidade,
        String id_portfolioUrl,
        String id_curso,
        String id_skills

) {
    public ListagemDesenvolvedor(Desenvolvedor desenvolvedor) {
        this(desenvolvedor.getNomeCompleto(), desenvolvedor.getEmail(), desenvolvedor.getBio(),
                desenvolvedor.getDisponibilidade(), desenvolvedor.getPortfolioUrl(),
                desenvolvedor.getCurso(), desenvolvedor.getSkills());
    }
}
