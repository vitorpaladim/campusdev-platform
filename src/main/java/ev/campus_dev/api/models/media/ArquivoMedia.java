package ev.campus_dev.api.models.media;

import ev.campus_dev.api.models.usuario.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "arquivos_media")
@Getter
@Setter
@NoArgsConstructor
public class ArquivoMedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "proprietario_id", nullable = false)
    private Usuario proprietario;

    @Column(nullable = false, length = 20)
    private String tipo;

    @Column(name = "nome_original", length = 255)
    private String nomeOriginal;

    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @Lob
    @Column(nullable = false, columnDefinition = "bytea")
    private byte[] dados;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();
}
