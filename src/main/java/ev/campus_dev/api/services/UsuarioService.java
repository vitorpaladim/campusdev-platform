package ev.campus_dev.api.services;

import ev.campus_dev.api.models.usuario.Usuario;
import ev.campus_dev.api.repositories.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    @Transactional
    public Usuario criar(Usuario usuario) {
        usuario.setDataCadastro(LocalDateTime.now());
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Optional<Usuario> atualizar(Long id, Usuario dados) {
        return usuarioRepository.findById(id)
                .map(existente -> {
                    existente.setNomeCompleto(dados.getNomeCompleto());
                    existente.setEmail(dados.getEmail());
                    if (dados.getSenha() != null && !dados.getSenha().isBlank()) {
                        existente.setSenha(passwordEncoder.encode(dados.getSenha()));
                    }
                    existente.setRole(dados.getRole());
                    return usuarioRepository.save(existente);
                });
    }

    @Transactional
    public boolean deletar(Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuarioRepository.delete(usuario);
                    return true;
                })
                .orElse(false);
    }
}
