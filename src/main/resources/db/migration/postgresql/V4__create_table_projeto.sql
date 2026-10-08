CREATE TABLE projetos (
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
