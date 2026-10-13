-- Schema PostgreSQL do CampusDev.
-- Execute este arquivo no Supabase > SQL Editor somente se o Flyway
-- não estiver sendo executado pelo backend no Render.

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
    id BIGINT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_de_mercado VARCHAR(100),
    nome_empresa VARCHAR(150),
    telefone VARCHAR(30),
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS desenvolvedores (
    id BIGINT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    curso VARCHAR(100),
    semestre VARCHAR(50),
    skills TEXT,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projetos (
    id_projeto BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    linguagem_tecnologia VARCHAR(255),
    qnd_pessoas_necessarias INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    prazo_entrega TIMESTAMP,
    link_convite VARCHAR(255),
    cliente_id BIGINT REFERENCES clientes(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS projetos_desenvolvedores (
    projeto_id BIGINT NOT NULL REFERENCES projetos(id_projeto) ON DELETE CASCADE,
    desenvolvedor_id BIGINT NOT NULL REFERENCES desenvolvedores(id) ON DELETE CASCADE,
    PRIMARY KEY (projeto_id, desenvolvedor_id)
);

CREATE TABLE IF NOT EXISTS candidaturas (
    id BIGSERIAL PRIMARY KEY,
    projeto_id BIGINT NOT NULL REFERENCES projetos(id_projeto) ON DELETE CASCADE,
    desenvolvedor_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_candidatura UNIQUE (projeto_id, desenvolvedor_id)
);

CREATE INDEX IF NOT EXISTS idx_projetos_status ON projetos(status);
CREATE INDEX IF NOT EXISTS idx_candidaturas_projeto ON candidaturas(projeto_id);
CREATE INDEX IF NOT EXISTS idx_candidaturas_desenvolvedor
    ON candidaturas(desenvolvedor_id);
