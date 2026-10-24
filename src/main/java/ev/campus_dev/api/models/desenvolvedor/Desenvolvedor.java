package ev.campus_dev.api.models.desenvolvedor;


import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.dtos.desenvolvedor_dto.AtualizacaoDesenvolvedor;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Table(name = "desenvolvedores")
@Entity(name = "Desenvolvedor")
@PrimaryKeyJoinColumn(name = "id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Desenvolvedor extends ev.campus_dev.api.models.usuario.Usuario {

    private String curso;
    private String semestre;
    private String skills;
    @Column(length = 500)
    private String bio;
    @Column(length = 40)
    private String disponibilidade;
    @Column(name = "portfolio_url", length = 500)
    private String portfolioUrl;
    @Column(name = "portfolio_json", columnDefinition = "TEXT")
    private String portfolioJson;
    @Column(name = "tipo_perfil")
    private String tipoPerfil;
    @Column(name = "data_cadastro")
    private LocalDateTime dataDeCadastro;

    @ManyToMany(mappedBy = "desenvolvedores", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Projeto> projetos = new HashSet<>();


    public void atualizarDesenvolvedor(AtualizacaoDesenvolvedor dados) {
        if (dados.nomeCompleto() != null) {
            setNomeCompleto(dados.nomeCompleto());
        }
        if (dados.email() != null) {
            setEmail(dados.email());
        }
        if (dados.bio() != null) {
            this.bio = dados.bio();
        }
        if (dados.disponibilidade() != null) {
            this.disponibilidade = dados.disponibilidade();
        }
        if (dados.portfolioUrl() != null) {
            this.portfolioUrl = dados.portfolioUrl();
        }
        if (dados.curso() != null) {
            this.curso = dados.curso();
        }
        if (dados.semestre() != null) {
            this.semestre = dados.semestre();
        }
        if (dados.skills() != null) {
            this.skills = dados.skills();
        }
        if (dados.avatarUrl() != null) {
            setAvatarUrl(dados.avatarUrl());
        }
        if (dados.bannerUrl() != null) {
            setBannerUrl(dados.bannerUrl());
        }
        if (dados.portfolioJson() != null) {
            this.portfolioJson = dados.portfolioJson();
        }
    }
}
