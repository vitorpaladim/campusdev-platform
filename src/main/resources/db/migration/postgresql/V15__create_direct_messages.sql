CREATE TABLE mensagens_diretas (
    id BIGSERIAL PRIMARY KEY,
    remetente_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    destinatario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    conteudo VARCHAR(2000) NOT NULL,
    enviada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_mensagens_diretas_destinatario ON mensagens_diretas(destinatario_id, enviada_em DESC);
CREATE INDEX idx_mensagens_diretas_remetente ON mensagens_diretas(remetente_id, enviada_em DESC);
