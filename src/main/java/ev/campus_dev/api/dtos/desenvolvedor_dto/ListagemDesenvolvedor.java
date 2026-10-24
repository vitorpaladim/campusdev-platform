package ev.campus_dev.api.dtos.desenvolvedor_dto;

import ev.campus_dev.api.models.desenvolvedor.Desenvolvedor;

public record ListagemDesenvolvedor(

        Long id,
        String nomeCompleto,
        String email,
        String bio,
        String disponibilidade,
        String portfolioUrl,
        String curso,
        String skills,
        String avatarUrl,
        String bannerUrl,
        String portfolioJson

) {
    public ListagemDesenvolvedor(Desenvolvedor desenvolvedor) {
        this(desenvolvedor.getId(), desenvolvedor.getNomeCompleto(), desenvolvedor.getEmail(), desenvolvedor.getBio(),
                desenvolvedor.getDisponibilidade(), desenvolvedor.getPortfolioUrl(), desenvolvedor.getCurso(),
                desenvolvedor.getSkills(), desenvolvedor.getAvatarUrl(), desenvolvedor.getBannerUrl(), desenvolvedor.getPortfolioJson());
    }
}
