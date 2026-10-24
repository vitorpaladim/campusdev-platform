package ev.campus_dev.api.models.recomendacao;

import ev.campus_dev.api.models.desenvolvedor.Desenvolvedor;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.models.usuario.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "recomendacoes")
@Getter
@Setter
@NoArgsConstructor
public class Recomendacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "estudante_id", nullable = false)
    private Desenvolvedor estudante;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "autor_id", nullable = false)
    private Usuario autor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "projeto_id")
    private Projeto projeto;

    @Column(nullable = false)
    private Integer nota;

    @Column(nullable = false, length = 1000)
    private String texto;

    @Column(name = "criada_em", nullable = false)
    private LocalDateTime criadaEm = LocalDateTime.now();
}
