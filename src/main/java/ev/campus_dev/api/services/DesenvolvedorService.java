package ev.campus_dev.api.services;

import ev.campus_dev.api.dtos.desenvolvedor_dto.AtualizacaoDesenvolvedor;
import ev.campus_dev.api.dtos.desenvolvedor_dto.CadastroDesenvolvedor;
import ev.campus_dev.api.dtos.desenvolvedor_dto.ListagemDesenvolvedor;
import ev.campus_dev.api.models.desenvolvedor.Desenvolvedor;
import ev.campus_dev.api.models.usuario.Usuario;
import ev.campus_dev.api.repositories.DesenvolvedorRepository;
import ev.campus_dev.api.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DesenvolvedorService {

    private final DesenvolvedorRepository desenvolvedorRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DesenvolvedorService(DesenvolvedorRepository desenvolvedorRepository,
                                 UsuarioRepository usuarioRepository,
                                 PasswordEncoder passwordEncoder) {
        this.desenvolvedorRepository = desenvolvedorRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public ListagemDesenvolvedor cadastrar(CadastroDesenvolvedor dados) {
        Desenvolvedor dev = new Desenvolvedor();
        dev.setNomeCompleto(dados.nomeCompleto());
        dev.setEmail(dados.email());
        dev.setSenha(passwordEncoder.encode(dados.senha()));
        dev.setRole("DEV");
        dev.setDataCadastro(LocalDateTime.now());
        dev.setCurso(dados.curso());
        dev.setSemestre(dados.semestre());
        dev.setSkills(dados.skills());
        return new ListagemDesenvolvedor(desenvolvedorRepository.save(dev));
    }

    public List<ListagemDesenvolvedor> listar() {
        return desenvolvedorRepository.findAll().stream()
                .map(ListagemDesenvolvedor::new)
                .toList();
    }

    public Optional<ListagemDesenvolvedor> buscar(Long id) {
        return desenvolvedorRepository.findById(id)
                .map(ListagemDesenvolvedor::new);
    }

    @Transactional
    public Optional<ListagemDesenvolvedor> atualizar(Long id, AtualizacaoDesenvolvedor dados) {
        return desenvolvedorRepository.findById(id)
                .map(dev -> {
                    dev.atualizarDesenvolvedor(dados);
                    return new ListagemDesenvolvedor(desenvolvedorRepository.save(dev));
                });
    }

    @Transactional
    public boolean deletar(Long id) {
        return desenvolvedorRepository.findById(id)
                .map(dev -> {
                    desenvolvedorRepository.delete(dev);
                    return true;
                })
                .orElse(false);
    }
}
