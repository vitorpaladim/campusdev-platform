package ev.campus_dev.api.security;

import ev.campus_dev.api.models.usuario.Usuario;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;

class SecurityUnitTest {
    private final PasswordEncoder passwordEncoder = new SecurityConfigurations().passwordEncoder();

    @Test
    void deveCodificarSenhaComBcrypt() {
        String senha = "senha-segura";
        String hash = passwordEncoder.encode(senha);

        assertThat(hash).startsWith("$2");
        assertThat(hash).isNotEqualTo(senha);
        assertThat(passwordEncoder.matches(senha, hash)).isTrue();
    }

    @Test
    void deveExporRoleComoAuthorityDoSpring() {
        Usuario usuario = new Usuario();
        usuario.setRole("CLIENTE");

        assertThat(usuario.getAuthorities())
                .extracting("authority")
                .containsExactly("ROLE_CLIENTE");
    }
}
