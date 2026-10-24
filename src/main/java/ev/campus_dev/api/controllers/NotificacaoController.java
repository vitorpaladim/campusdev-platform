package ev.campus_dev.api.controllers;

import ev.campus_dev.api.services.NotificacaoService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/notificacoes")
public class NotificacaoController {
    private final NotificacaoService notificacaoService;

    public NotificacaoController(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(Authentication authentication) {
        var usuario = (ev.campus_dev.api.models.usuario.Usuario) authentication.getPrincipal();
        return notificacaoService.conectar(usuario.getId());
    }
}
