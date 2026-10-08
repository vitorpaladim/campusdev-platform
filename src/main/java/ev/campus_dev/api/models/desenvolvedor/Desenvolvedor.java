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
        if (dados.curso() != null) {
            this.curso = dados.curso();
        }
        if (dados.semestre() != null) {
            this.semestre = dados.semestre();
        }
        if (dados.skills() != null) {
            this.skills = dados.skills();
        }
    }
}
