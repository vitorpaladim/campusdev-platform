package ev.campus_dev.api.services;

import ev.campus_dev.api.dtos.notificacao.NotificacaoPayload;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class NotificacaoService {
    private final Map<Long, CopyOnWriteArrayList<SseEmitter>> conexoes = new ConcurrentHashMap<>();

    public SseEmitter conectar(Long usuarioId) {
        SseEmitter emitter = new SseEmitter(0L);
        conexoes.computeIfAbsent(usuarioId, ignored -> new CopyOnWriteArrayList<>()).add(emitter);
        Runnable remover = () -> remover(usuarioId, emitter);
        emitter.onCompletion(remover);
        emitter.onTimeout(remover);
        emitter.onError(ignored -> remover.run());
        try { emitter.send(SseEmitter.event().name("conectado").data(Map.of("tipo", "CONECTADO", "mensagem", "Notificações conectadas"))); }
        catch (IOException ignored) { remover.run(); }
        return emitter;
    }

    public void publicar(Long usuarioId, NotificacaoPayload payload) {
        var emitters = conexoes.get(usuarioId);
        if (emitters == null) return;
        for (SseEmitter emitter : emitters) {
            try { emitter.send(SseEmitter.event().name(payload.tipo()).data(payload)); }
            catch (IOException exception) { remover(usuarioId, emitter); }
        }
    }

    private void remover(Long usuarioId, SseEmitter emitter) {
        var emitters = conexoes.get(usuarioId);
        if (emitters != null) {
            emitters.remove(emitter);
            if (emitters.isEmpty()) conexoes.remove(usuarioId);
        }
    }
}
