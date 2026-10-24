package ev.campus_dev.api.dtos.notificacao;

public record NotificacaoPayload(String tipo, String titulo, String mensagem, String link, Object dados) {
}
