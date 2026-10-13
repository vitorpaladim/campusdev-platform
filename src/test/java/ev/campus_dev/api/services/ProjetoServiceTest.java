package ev.campus_dev.api.services;

import ev.campus_dev.api.exceptions.BusinessException;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.models.cliente.Cliente;
import ev.campus_dev.api.repositories.ClienteRepository;
import ev.campus_dev.api.repositories.ProjetoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjetoServiceTest {
    @Mock
    ProjetoRepository projetoRepository;
    @Mock
    ClienteRepository clienteRepository;
    @Mock
    Authentication authentication;

    @Test
    void devePermitirTransicaoDeAbertoParaSelecao() {
        Projeto projeto = projeto("ABERTO");
        projeto.setCliente(cliente());
        when(projetoRepository.findById(1L)).thenReturn(Optional.of(projeto));
        when(projetoRepository.save(projeto)).thenReturn(projeto);
        when(authentication.getName()).thenReturn("cliente@example.com");

        Projeto resultado = new ProjetoService(projetoRepository, clienteRepository)
                .alterarStatus(1L, "EM_SELECAO", authentication)
                .orElseThrow();

        assertThat(resultado.getStatus()).isEqualTo("EM_SELECAO");
        verify(projetoRepository).save(projeto);
    }

    @Test
    void deveRejeitarTransicaoInvalida() {
        Projeto projeto = projeto("ABERTO");
        projeto.setCliente(cliente());
        when(projetoRepository.findById(1L)).thenReturn(Optional.of(projeto));
        when(authentication.getName()).thenReturn("cliente@example.com");

        assertThatThrownBy(() -> new ProjetoService(projetoRepository, clienteRepository)
                .alterarStatus(1L, "FINALIZADO", authentication))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Transição de status inválida");

        verify(projetoRepository, never()).save(any());
    }

    private Projeto projeto(String status) {
        Projeto projeto = new Projeto();
        projeto.setStatus(status);
        return projeto;
    }

    private Cliente cliente() {
        Cliente cliente = new Cliente();
        cliente.setEmail("cliente@example.com");
        return cliente;
    }
}
