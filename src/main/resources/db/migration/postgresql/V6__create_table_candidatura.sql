CREATE TABLE candidaturas (
    id BIGSERIAL PRIMARY KEY,
    projeto_id BIGINT NOT NULL REFERENCES projetos(id_projeto) ON DELETE CASCADE,
    desenvolvedor_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_candidatura UNIQUE (projeto_id, desenvolvedor_id)
);
