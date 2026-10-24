ALTER TABLE usuarios
    ADD COLUMN avatar_url VARCHAR(500),
    ADD COLUMN banner_url VARCHAR(500);

ALTER TABLE clientes
    ADD COLUMN logo_url VARCHAR(500);

CREATE TABLE arquivos_media (
    id BIGSERIAL PRIMARY KEY,
    proprietario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL,
    nome_original VARCHAR(255),
    content_type VARCHAR(100) NOT NULL,
    dados BYTEA NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_arquivos_media_proprietario ON arquivos_media(proprietario_id);
