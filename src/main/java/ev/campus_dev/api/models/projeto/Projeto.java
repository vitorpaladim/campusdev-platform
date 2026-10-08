package ev.campus_dev.api.models.projeto;


import java.util.Set;
import ev.campus_dev.api.models.desenvolvedor.Desenvolvedor;
import ev.campus_dev.api.dtos.projetos_dto.AtualizacaoProjeto;
import ev.campus_dev.api.dtos.projetos_dto.CadastroProjeto;
import ev.campus_dev.api.models.cliente.Cliente;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Set;
import java.util.HashSet;
import java.time.LocalDateTime;

@Entity(name = "projeto")
@Table(name = "projetos")
@Getter
@Setter
@NoArgsConstructor
public class Projeto {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id_projeto")
    private Long id_projeto;
    @Column(nullable = false, length = 150)
    private String titulo;
    private String descricao;
    @Column(name = "linguagem_tecnologia")
    private String linguagemTecnologia;
    @Column(name = "qnd_pessoas_necessarias")
    private int qndPessoasNecessarias;
    private String status;
    @Column(name = "data_cadastro")
    private LocalDateTime dataDeCadastro;
    @Column(name = "prazo_entrega")
    private LocalDateTime prazoEntrega;
    @Column(name = "link_convite")
    private String linkConvite;

    // relacionamento com cliente (quem pede)
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

//    // relacionamento com desenvolvedor (quem executa)
//    @ManyToOne
//    @JoinColumn(name = "desenvolvedor_id")
//    private Usuario desenvolvedor;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "projetos_desenvolvedores",
            joinColumns = @JoinColumn(name = "projeto_id"),
            inverseJoinColumns = @JoinColumn(name = "desenvolvedor_id")
    )
    private Set<Desenvolvedor> desenvolvedores = new HashSet<>();

    public Projeto(CadastroProjeto dados) {
        this.titulo = dados.titulo();
        this.descricao = dados.descricao();
        this.linguagemTecnologia = dados.linguagemTecnologia();
        this.qndPessoasNecessarias = dados.qndPessoasNecessarias();
        this.status = dados.status() == null ? "ABERTO" : dados.status();
        this.dataDeCadastro = dados.dataDeCadastro() == null ? LocalDateTime.now() : dados.dataDeCadastro();
        this.prazoEntrega = dados.prazoEntrega();
        this.linkConvite = dados.linkConvite();
    }


    public void atualizarProjeto (AtualizacaoProjeto dados) {


            if (dados.titulo() != null) {
                this.titulo = dados.titulo();
            }
            if (dados.descricao() != null) {
                this.descricao = dados.descricao();
            }
            if (dados.linguagemTecnologia() != null) {
                this.linguagemTecnologia = dados.linguagemTecnologia();
            }
            if (dados.qndPessoasNecessarias() != null) {
                this.qndPessoasNecessarias = dados.qndPessoasNecessarias();
            }
            if (dados.status() != null) {
                this.status = dados.status();
            }
            if (dados.prazoEntrega() != null) {
                this.prazoEntrega = dados.prazoEntrega();
            }
            if (dados.linkConvite() != null) {
                this.linkConvite = dados.linkConvite();
            }

    }




}
