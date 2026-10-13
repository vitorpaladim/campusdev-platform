package ev.campus_dev.api.controllers;

import ev.campus_dev.api.models.candidatura.Candidatura;
import ev.campus_dev.api.models.candidatura.StatusCandidatura;
import ev.campus_dev.api.services.CandidaturaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/candidaturas")
@Tag(name = "Candidaturas", description = "Candidaturas de desenvolvedores a projetos")
@SecurityRequirement(name = "bearerAuth")
public class CandidaturaController {
    private final CandidaturaService candidaturaService;

    public CandidaturaController(CandidaturaService candidaturaService) {
        this.candidaturaService = candidaturaService;
    }

    @PostMapping("/projetos/{projetoId}/desenvolvedores/{desenvolvedorId}")
    @Operation(summary = "Enviar candidatura")
    public ResponseEntity<Candidatura> candidatar(@PathVariable Long projetoId, @PathVariable Long desenvolvedorId,
                                                  Authentication authentication) {
        return ResponseEntity.status(201).body(candidaturaService.candidatar(projetoId, desenvolvedorId, authentication));
    }

    @GetMapping("/projetos/{projetoId}")
    @Operation(summary = "Listar candidaturas do projeto")
    public ResponseEntity<List<Candidatura>> listar(@PathVariable Long projetoId, Authentication authentication) {
        return ResponseEntity.ok(candidaturaService.listarPorProjeto(projetoId, authentication));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Decidir candidatura", description = "Aceita ou recusa uma candidatura.")
    public ResponseEntity<Candidatura> decidir(@PathVariable Long id, @RequestParam StatusCandidatura status,
                                               Authentication authentication) {
        return ResponseEntity.ok(candidaturaService.decidir(id, status, authentication));
    }
}
