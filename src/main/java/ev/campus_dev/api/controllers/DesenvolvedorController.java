package ev.campus_dev.api.controllers;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import ev.campus_dev.api.dtos.desenvolvedor_dto.ListagemDesenvolvedor;
import ev.campus_dev.api.dtos.desenvolvedor_dto.AtualizacaoDesenvolvedor;
import ev.campus_dev.api.dtos.desenvolvedor_dto.CadastroDesenvolvedor;
import ev.campus_dev.api.services.DesenvolvedorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@RequestMapping("/desenvolvedores")
@Tag(name = "Desenvolvedores", description = "Perfis de desenvolvedores")
@SecurityRequirement(name = "bearerAuth")
public class DesenvolvedorController {

    @Autowired
    private DesenvolvedorService desenvolvedorService;

    // Criar Desenvolvedor
    @PostMapping
    @Operation(summary = "Cadastrar desenvolvedor")
    public ResponseEntity<ListagemDesenvolvedor> cadastrar(@RequestBody @Valid CadastroDesenvolvedor dados) {
        return ResponseEntity.status(201).body(desenvolvedorService.cadastrar(dados));
    }

    // Listar todos os desenvolvedores
    @GetMapping
    @Operation(summary = "Listar desenvolvedores")
    public ResponseEntity<List<ListagemDesenvolvedor>> listar() {
        return ResponseEntity.ok(desenvolvedorService.listar());
    }

    // Buscar por ID
    @GetMapping("/{id}")
    @Operation(summary = "Consultar desenvolvedor")
    public ResponseEntity<ListagemDesenvolvedor> buscar(@PathVariable Long id) {
        return desenvolvedorService.buscar(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Atualizar desenvolvedor
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar desenvolvedor")
    public ResponseEntity<ListagemDesenvolvedor> atualizar(@PathVariable Long id, @RequestBody AtualizacaoDesenvolvedor dados) {
        return desenvolvedorService.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir desenvolvedor")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        return desenvolvedorService.deletar(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
