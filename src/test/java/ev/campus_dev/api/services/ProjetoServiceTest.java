package ev.campus_dev.api.services;

import ev.campus_dev.api.exceptions.BusinessException;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.repositories.ClienteRepository;
import ev.campus_dev.api.repositories.ProjetoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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

    @Test
    void devePermitirTransicaoDeAbertoParaSelecao() {
        Projeto projeto = projeto("ABERTO");
        when(projetoRepository.findById(1L)).thenReturn(Optional.of(projeto));
        when(projetoRepository.save(projeto)).thenReturn(projeto);

        Projeto resultado = new ProjetoService(projetoRepository, clienteRepository)
                .alterarStatus(1L, "EM_SELECAO")
                .orElseThrow();

        assertThat(resultado.getStatus()).isEqualTo("EM_SELECAO");
        verify(projetoRepository).save(projeto);
    }

    @Test
    void deveRejeitarTransicaoInvalida() {
        Projeto projeto = projeto("ABERTO");
        when(projetoRepository.findById(1L)).thenReturn(Optional.of(projeto));

        assertThatThrownBy(() -> new ProjetoService(projetoRepository, clienteRepository)
                .alterarStatus(1L, "FINALIZADO"))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Transição de status inválida");

        verify(projetoRepository, never()).save(any());
    }

    private Projeto projeto(String status) {
        Projeto projeto = new Projeto();
        projeto.setStatus(status);
        return projeto;
    }
}
