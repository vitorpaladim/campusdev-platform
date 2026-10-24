package ev.campus_dev.api.controllers;

import ev.campus_dev.api.dtos.mensagem_dto.MensagemDiretaResponse;
import ev.campus_dev.api.dtos.mensagem_dto.NovaMensagemDireta;
import ev.campus_dev.api.services.MensagemDiretaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mensagens")
public class MensagemDiretaController {
    private final MensagemDiretaService service;

    public MensagemDiretaController(MensagemDiretaService service) {
        this.service = service;
    }

    @GetMapping("/diretas")
    public ResponseEntity<List<MensagemDiretaResponse>> listar(Authentication authentication) {
        return ResponseEntity.ok(service.listar(authentication));
    }

    @PostMapping("/diretas/desenvolvedores/{destinatarioId}")
    public ResponseEntity<MensagemDiretaResponse> enviar(@PathVariable Long destinatarioId,
                                                          @RequestBody @Valid NovaMensagemDireta dados,
                                                          Authentication authentication) {
        return ResponseEntity.status(201).body(service.enviarParaDesenvolvedor(destinatarioId, dados, authentication));
    }
}
