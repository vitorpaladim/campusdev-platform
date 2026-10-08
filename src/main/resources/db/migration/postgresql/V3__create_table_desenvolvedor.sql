CREATE TABLE desenvolvedores (
    id BIGINT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    curso VARCHAR(100),
    semestre VARCHAR(50),
    skills TEXT,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
