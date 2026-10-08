package ev.campus_dev.api.services;

import ev.campus_dev.api.exceptions.BusinessException;
import ev.campus_dev.api.models.candidatura.Candidatura;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.models.usuario.Usuario;
import ev.campus_dev.api.repositories.CandidaturaRepository;
import ev.campus_dev.api.repositories.ProjetoRepository;
import ev.campus_dev.api.repositories.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CandidaturaServiceTest {
    @Mock
    CandidaturaRepository candidaturaRepository;
    @Mock
    ProjetoRepository projetoRepository;
    @Mock
    UsuarioRepository usuarioRepository;

    @Test
    void naoDevePermitirCandidaturaEmProjetoFechado() {
        Projeto projeto = new Projeto();
        projeto.setStatus("EM_ANDAMENTO");
        when(projetoRepository.findById(1L)).thenReturn(Optional.of(projeto));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(new Usuario()));

        assertThatThrownBy(() -> service().candidatar(1L, 2L))
                .isInstanceOf(BusinessException.class)
                .hasMessage("O projeto não está aberto para candidaturas");
        verify(candidaturaRepository, never()).save(any());
    }

    @Test
    void naoDevePermitirCandidaturaDuplicada() {
        Projeto projeto = new Projeto();
        projeto.setStatus("ABERTO");
        when(projetoRepository.findById(1L)).thenReturn(Optional.of(projeto));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(new Usuario()));
        when(candidaturaRepository.existsByProjetoId_projetoAndDesenvolvedorId(1L, 2L)).thenReturn(true);

        assertThatThrownBy(() -> service().candidatar(1L, 2L))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Candidatura duplicada");
        verify(candidaturaRepository, never()).save(any());
    }

    private CandidaturaService service() {
        return new CandidaturaService(candidaturaRepository, projetoRepository, usuarioRepository);
    }
}
