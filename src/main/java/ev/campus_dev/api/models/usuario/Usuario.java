package ev.campus_dev.api.models.usuario;

import ev.campus_dev.api.dtos.usuario_dto.AtualizacaoUsuario;
import ev.campus_dev.api.dtos.usuario_dto.CadastroUsuario;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;


@Entity(name = "usuario")
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@NoArgsConstructor //
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "nome_completo", nullable = false)
    private String nomeCompleto;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    @JsonIgnore
    private String senha;
    @Column(name = "data_cadastro")
    private LocalDateTime dataCadastro;
    private String role;


    public Usuario(CadastroUsuario dadosUsuario) {
        this.nomeCompleto = dadosUsuario.nomeCompleto();
        this.email = dadosUsuario.email();
        this.senha = dadosUsuario.senha();
        this.dataCadastro = LocalDateTime.now();
        this.role = dadosUsuario.role();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null || role.isBlank()) {
            return List.of();
        }
        String authority = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return List.of(new SimpleGrantedAuthority(authority));
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    }
