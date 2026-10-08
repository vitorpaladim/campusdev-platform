package ev.campus_dev.api.services;

import ev.campus_dev.api.models.cliente.Cliente;
import ev.campus_dev.api.dtos.cliente_dto.ListagemCliente;
import ev.campus_dev.api.repositories.ClienteRepository;
import ev.campus_dev.api.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public ClienteService(ClienteRepository clienteRepository, UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<ListagemCliente> listar() {
        return clienteRepository.findAll().stream()
                .map(cliente -> new ListagemCliente(cliente.getTipoDeMercado(), cliente.getNomeEmpresa(),
                        cliente.getTelefone(), java.sql.Timestamp.valueOf(cliente.getDataDeCadastro())))
                .toList();
    }

    @Transactional
    public Cliente cadastrar(Cliente cliente) {
        cliente.setRole("CLIENTE");
        cliente.setDataCadastro(LocalDateTime.now());
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
        return clienteRepository.save(cliente);
    }

    @Transactional
    public Optional<Cliente> atualizar(Long id, Cliente dados) {
        return clienteRepository.findById(id)
                .map(existente -> {
                    existente.setTipoDeMercado(dados.getTipoDeMercado());
                    existente.setNomeEmpresa(dados.getNomeEmpresa());
                    existente.setTelefone(dados.getTelefone());
                    return clienteRepository.save(existente);
                });
    }

    @Transactional
    public boolean deletar(Long id) {
        return clienteRepository.findById(id)
                .map(cliente -> {
                    clienteRepository.delete(cliente);
                    return true;
                })
                .orElse(false);
    }
}
