CREATE TABLE candidaturas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    projeto_id BIGINT NOT NULL,
    desenvolvedor_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_candidatura_projeto FOREIGN KEY (projeto_id) REFERENCES projetos(id_projeto) ON DELETE CASCADE,
    CONSTRAINT fk_candidatura_desenvolvedor FOREIGN KEY (desenvolvedor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT uk_candidatura UNIQUE (projeto_id, desenvolvedor_id)
);
