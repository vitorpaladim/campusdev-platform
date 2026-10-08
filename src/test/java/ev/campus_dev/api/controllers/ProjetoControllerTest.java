package ev.campus_dev.api.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.services.MatchingService;
import ev.campus_dev.api.services.ProjetoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProjetoControllerTest {
    @Mock
    ProjetoService projetoService;
    @Mock
    MatchingService matchingService;
    @InjectMocks
    ProjetoController projetoController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = MockMvcBuilders.standaloneSetup(projetoController)
                .setValidator(validator)
                .build();
    }

    @Test
    void deveRetornar201AoCadastrarProjetoValido() throws Exception {
        when(projetoService.cadastrar(any(), any())).thenReturn(new Projeto());

        mockMvc.perform(post("/projetos/1")
                        .contentType("application/json")
                        .content("""
                                {
                                  "titulo": "Sistema acadêmico",
                                  "descricao": "Projeto de teste",
                                  "linguagemTecnologia": "Java, Spring",
                                  "qndPessoasNecessarias": 2
                                }
                                """))
                .andExpect(status().isCreated());
    }

    @Test
    void deveRetornar400ParaProjetoSemDadosObrigatorios() throws Exception {
        mockMvc.perform(post("/projetos/1")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(new Projeto())))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveRetornar404QuandoProjetoNaoExiste() throws Exception {
        when(projetoService.buscar(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/projetos/99"))
                .andExpect(status().isNotFound());
    }
}
