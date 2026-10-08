CREATE TABLE projetos_desenvolvedores (
    projeto_id BIGINT NOT NULL REFERENCES projetos(id_projeto) ON DELETE CASCADE,
    desenvolvedor_id BIGINT NOT NULL REFERENCES desenvolvedores(id) ON DELETE CASCADE,
    PRIMARY KEY (projeto_id, desenvolvedor_id)
);
