package ev.campus_dev.api.controllers;

import ev.campus_dev.api.dtos.mensagem_dto.NovaMensagem;
import ev.campus_dev.api.models.mensagem.Mensagem;
import ev.campus_dev.api.services.MensagemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projetos/{projetoId}/mensagens")
public class MensagemController {
    private final MensagemService mensagemService;

    public MensagemController(MensagemService mensagemService) {
        this.mensagemService = mensagemService;
    }

    @GetMapping
    public ResponseEntity<List<Mensagem>> listar(@PathVariable Long projetoId, Authentication authentication) {
        return ResponseEntity.ok(mensagemService.listar(projetoId, authentication));
    }

    @PostMapping
    public ResponseEntity<Mensagem> enviar(@PathVariable Long projetoId,
                                            @RequestBody @Valid NovaMensagem dados,
                                            Authentication authentication) {
        return ResponseEntity.status(201).body(mensagemService.enviar(projetoId, dados, authentication));
    }
}
