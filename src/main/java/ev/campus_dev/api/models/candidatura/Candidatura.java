package ev.campus_dev.api.models.candidatura;

import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.models.usuario.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidaturas", uniqueConstraints = @UniqueConstraint(columnNames = {"projeto_id", "desenvolvedor_id"}))
@Getter
@Setter
@NoArgsConstructor
public class Candidatura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "projeto_id")
    private Projeto projeto;

    @ManyToOne(optional = false)
    @JoinColumn(name = "desenvolvedor_id")
    private Usuario desenvolvedor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusCandidatura status = StatusCandidatura.PENDENTE;

    @Column(nullable = false)
    private LocalDateTime data;
}
