package ev.campus_dev.api.models.cliente;

import ev.campus_dev.api.dtos.cliente_dto.AtualizacaoCliente;
import ev.campus_dev.api.dtos.cliente_dto.CadastroCliente;
import ev.campus_dev.api.dtos.cliente_dto.ListagemCliente;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity (name = "cliente")
@Table(name = "clientes")
@EqualsAndHashCode
@Getter
@Setter

public class Cliente extends ev.campus_dev.api.models.usuario.Usuario {
    @Column(name = "tipo_de_mercado")
    private String tipoDeMercado;
    @Column(name = "nome_empresa")
    private String nomeEmpresa;
    private String telefone;
    @Column(name = "data_cadastro")
    private LocalDateTime dataDeCadastro;

    public void atualizarDados(AtualizacaoCliente dados) {
        if (dados.tipoDeMercado() != null) {
            this.tipoDeMercado = dados.tipoDeMercado();
        }
        if (dados.nomeEmpresa() != null) {
            this.nomeEmpresa = dados.nomeEmpresa();
        }
        if (dados.telefone() != null) {
            this.telefone = dados.telefone();
        }
    }

    public void cadastrarDados(CadastroCliente dados){
        this.tipoDeMercado = dados.tipoDeMercado();
        this.nomeEmpresa = dados.nomeEmpresa();
        this.telefone = dados.telefone();
    }

    public void listarDados (ListagemCliente dados) {
        this.tipoDeMercado = dados.tipoDeMercado();
        this.nomeEmpresa = dados.nomeEmpresa();
        this.telefone = dados.telefone();
    }
}