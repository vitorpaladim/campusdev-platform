package ev.campus_dev.api.models.mensagem;

import ev.campus_dev.api.models.usuario.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensagens_diretas")
@Getter
@Setter
@NoArgsConstructor
public class MensagemDireta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "remetente_id", nullable = false)
    private Usuario remetente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destinatario_id", nullable = false)
    private Usuario destinatario;

    @Column(nullable = false, length = 2000)
    private String conteudo;

    @Column(name = "enviada_em", nullable = false)
    private LocalDateTime enviadaEm = LocalDateTime.now();

    @Column(nullable = false)
    private boolean lida;
}
