package ev.campus_dev.api.services;

import ev.campus_dev.api.models.desenvolvedor.Desenvolvedor;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.repositories.DesenvolvedorRepository;
import ev.campus_dev.api.repositories.ProjetoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {
    @Mock
    ProjetoRepository projetoRepository;
    @Mock
    DesenvolvedorRepository desenvolvedorRepository;

    @Test
    void deveOrdenarDesenvolvedoresPorCompatibilidade() {
        Projeto projeto = new Projeto();
        projeto.setLinguagemTecnologia("Java, Spring");
        Desenvolvedor parcial = new Desenvolvedor();
        parcial.setSkills("Java");
        Desenvolvedor completo = new Desenvolvedor();
        completo.setSkills("Java, Spring");
        when(projetoRepository.findById(1L)).thenReturn(Optional.of(projeto));
        when(desenvolvedorRepository.findAll()).thenReturn(List.of(parcial, completo));

        List<Desenvolvedor> resultado = new MatchingService(projetoRepository, desenvolvedorRepository).ranquear(1L);

        assertThat(resultado).containsExactly(completo, parcial);
    }

    @Test
    void projetoSemRequisitosNaoDeveFalhar() {
        Projeto projeto = new Projeto();
        projeto.setLinguagemTecnologia(null);
        Desenvolvedor dev = new Desenvolvedor();
        dev.setSkills("Java");
        when(projetoRepository.findById(1L)).thenReturn(Optional.of(projeto));
        when(desenvolvedorRepository.findAll()).thenReturn(List.of(dev));

        assertThat(new MatchingService(projetoRepository, desenvolvedorRepository).ranquear(1L))
                .containsExactly(dev);
    }
}
