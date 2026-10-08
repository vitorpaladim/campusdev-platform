package ev.campus_dev.api.controllers;

import ev.campus_dev.api.models.projeto.Projeto;
import ev.campus_dev.api.models.cliente.Cliente;
import ev.campus_dev.api.dtos.projetos_dto.CadastroProjeto;
import ev.campus_dev.api.dtos.projetos_dto.AtualizacaoProjeto;
import ev.campus_dev.api.services.ProjetoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import ev.campus_dev.api.models.desenvolvedor.Desenvolvedor;
import ev.campus_dev.api.services.MatchingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/projetos")
@Tag(name = "Projetos", description = "Consulta e gerenciamento de projetos")
public class ProjetoController {

    @Autowired
    private ProjetoService projetoService;

    @Autowired
    private MatchingService matchingService;

    @PostMapping("/{clienteId}")
    @Operation(summary = "Criar projeto", description = "Cria um projeto associado ao cliente informado.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Projeto criado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "401", description = "Token ausente ou inválido"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Projeto> cadastrar(@PathVariable Long clienteId, @RequestBody @Valid CadastroProjeto dados) {
        Projeto salvo = projetoService.cadastrar(clienteId, dados);
        return ResponseEntity.status(201).body(salvo);
    }

    @GetMapping
    @Operation(summary = "Listar projetos", description = "Lista projetos disponíveis sem exigir autenticação.")
    public ResponseEntity<List<Projeto>> listar() {
        return ResponseEntity.ok(projetoService.listar());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar projeto")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Projeto encontrado"),
            @ApiResponse(responseCode = "404", description = "Projeto não encontrado")
    })
    public ResponseEntity<Projeto> buscar(@PathVariable Long id) {
        return projetoService.buscar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar projeto")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Projeto> atualizar(@PathVariable Long id, @RequestBody AtualizacaoProjeto dados) {
        return projetoService.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir projeto")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return projetoService.deletar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Alterar status do projeto", description = "Aplica apenas transições de status permitidas.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Projeto> alterarStatus(@PathVariable Long id, @RequestParam String status) {
        return projetoService.alterarStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/matching")
    @Operation(summary = "Ranquear desenvolvedores", description = "Ordena desenvolvedores por compatibilidade de competências.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<Desenvolvedor>> matching(@PathVariable Long id) {
        return ResponseEntity.ok(matchingService.ranquear(id));
    }
}
