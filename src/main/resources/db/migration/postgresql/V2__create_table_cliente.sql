CREATE TABLE clientes (
    id BIGINT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_de_mercado VARCHAR(100),
    nome_empresa VARCHAR(150),
    telefone VARCHAR(30),
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
