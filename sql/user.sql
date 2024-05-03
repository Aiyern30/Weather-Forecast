CREATE TABLE "users" (
    userid UUID PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(50) NOT NULL,
    noph VARCHAR(20) NOT NULL
    picture BYTEA,
);
