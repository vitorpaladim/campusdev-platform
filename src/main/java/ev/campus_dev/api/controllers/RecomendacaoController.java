package ev.campus_dev.api.controllers;

import ev.campus_dev.api.dtos.recomendacao.NovaRecomendacao;
import ev.campus_dev.api.dtos.recomendacao.RecomendacaoResponse;
import ev.campus_dev.api.services.RecomendacaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/desenvolvedores/{estudanteId}/recomendacoes")
public class RecomendacaoController {
    private final RecomendacaoService service;

    public RecomendacaoController(RecomendacaoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<RecomendacaoResponse>> listar(@PathVariable Long estudanteId) {
        return ResponseEntity.ok(service.listar(estudanteId));
    }

    @PostMapping
    public ResponseEntity<RecomendacaoResponse> criar(@PathVariable Long estudanteId,
                                                       @RequestBody @Valid NovaRecomendacao dados,
                                                       Authentication authentication) {
        return ResponseEntity.status(201).body(service.criar(estudanteId, dados, authentication));
    }
}
