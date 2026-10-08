package ev.campus_dev.api.controllers;

import ev.campus_dev.api.dtos.desenvolvedor_dto.CadastroDesenvolvedor;
import ev.campus_dev.api.models.desenvolvedor.Desenvolvedor;
import ev.campus_dev.api.models.usuario.Usuario;
import ev.campus_dev.api.repositories.DesenvolvedorRepository;
import ev.campus_dev.api.repositories.UsuarioRepository;
import ev.campus_dev.api.security.DadosAutenticacao;
import ev.campus_dev.api.security.DadosTokenJWT;
import ev.campus_dev.api.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
@Tag(name = "Autenticação", description = "Login e registro de usuários")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private DesenvolvedorRepository desenvolvedorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    @Operation(summary = "Autenticar usuário", description = "Valida email e senha e retorna um JWT.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    })
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        // 1. Recebe os dados de login (email e senha)
        var authenticationToken = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());

        // 2. Usa o AuthenticationManager para validar as credenciais
        var authentication = manager.authenticate(authenticationToken);

        // 3. Se as credenciais forem válidas, gera um token JWT
        var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());

        // 4. Retorna o token para o frontend
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, (Usuario) authentication.getPrincipal()));
    }

    @PostMapping("/register")
    @Operation(summary = "Registrar desenvolvedor", description = "Cria um usuário desenvolvedor e seu perfil.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuário criado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou email já cadastrado")
    })
    @Transactional
    public ResponseEntity efetuarCadastro(@RequestBody @Valid CadastroDesenvolvedor dados) {
        // 1. Verifica se o email já existe no banco de dados
        if (usuarioRepository.findByEmail(dados.email()) != null) {
            return ResponseEntity.badRequest().body("{\"error\": \"Email já cadastrado\"}");
        }

        // 2. Cria e salva a entidade base Usuario
        Desenvolvedor novoDev = new Desenvolvedor();
        novoDev.setNomeCompleto(dados.nomeCompleto());
        novoDev.setEmail(dados.email());
        novoDev.setSenha(passwordEncoder.encode(dados.senha()));
        novoDev.setRole("DEV");
        novoDev.setDataCadastro(LocalDateTime.now());
        novoDev.setCurso(dados.curso()); // Pode ser nulo
        novoDev.setSemestre(dados.semestre()); // Pode ser nulo
        novoDev.setSkills(dados.skills()); // Pode ser nulo
        novoDev.setDataDeCadastro(LocalDateTime.now());
        desenvolvedorRepository.save(novoDev);

        // 4. Retorna uma resposta de sucesso (201 Created)
        return ResponseEntity.status(201).build();
    }
}




//package ev.campus_dev.api.controllers;
//
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.http.ResponseEntity;
//
//
//@RestController
//@RequestMapping("/api")
//public class AuthenticationController {
//
//
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
//         System.out.println("Tentativa de login para: " + loginRequest.emailUniversitario());
//        return ResponseEntity.ok("{\"message\": \"Login endpoint atingido!\"}");
//    }
//
//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
//        System.out.println("Tentativa de registro para: " + registerRequest.emailUniversitario());
//        return ResponseEntity.status(201).body("{\"message\": \"Register endpoint atingido!\"}");
//    }
//}
//
//record LoginRequest(String emailUniversitario, String senha) {}
//record RegisterRequest(String nomeCompleto, String emailUniversitario, String senha) {}