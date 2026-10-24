CREATE TABLE recomendacoes (
    id BIGSERIAL PRIMARY KEY,
    estudante_id BIGINT NOT NULL REFERENCES desenvolvedores(id) ON DELETE CASCADE,
    autor_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    projeto_id BIGINT REFERENCES projetos(id_projeto) ON DELETE SET NULL,
    nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
    texto VARCHAR(1000) NOT NULL,
    criada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_recomendacao_autor_estudante_projeto UNIQUE (estudante_id, autor_id, projeto_id)
);

CREATE INDEX idx_recomendacoes_estudante ON recomendacoes(estudante_id, criada_em DESC);
