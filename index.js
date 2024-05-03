"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = require("mysql");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const pool = (0, mysql_1.createPool)({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '19930926',
    database: 'finfocusdb',
});
app.post('/cadastro', (req, res) => {
    const { name, email, password } = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao obter conexão do pool:', err);
            res.status(500).send('Erro ao conectar ao banco de dados');
            return;
        }
        const sqlInsertUser = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
        connection.query(sqlInsertUser, [name, email, password], (err) => {
            connection.release();
            if (err) {
                console.error('Erro ao inserir usuário:', err);
                res.status(500).send('Erro ao cadastrar usuário');
                return;
            }
            res.send('Usuário cadastrado com sucesso!');
        });
    });
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao obter conexão do pool:', err);
            res.status(500).send('Erro ao conectar ao banco de dados');
            return;
        }
        const sqlLoginUser = 'SELECT id FROM user WHERE email = ? AND password = ?';
        connection.query(sqlLoginUser, [email, password], (err, results) => {
            connection.release();
            if (err) {
                console.error('Erro ao autenticar usuário:', err);
                res.status(500).send('Erro ao autenticar usuário');
                return;
            }
            if (results.length > 0) {
                res.send('Login bem-sucedido!');
            }
            else {
                res.status(401).send('Credenciais inválidas');
            }
        });
    });
});
//teste
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
