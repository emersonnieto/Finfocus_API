import { Pool, createPool, MysqlError } from 'mysql';
import dbConfig from '../database';
import { Request, Response } from 'express';

const pool: Pool = createPool(dbConfig);

export const createUser = (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  pool.getConnection((err: MysqlError | null, connection) => {
    if (err) {
      console.error('Erro ao obter conexão do pool:', err);
      res.status(500).send('Erro ao conectar ao banco de dados');
      return;
    }

    const sqlInsertUser = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
    connection.query(sqlInsertUser, [name, email, password], (err: MysqlError | null) => {
      connection.release();

      if (err) {
        console.error('Erro ao inserir usuário:', err);
        res.status(500).send('Erro ao cadastrar usuário');
        return;
      }

      res.send('Usuário cadastrado com sucesso!');
    });
  });
};

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;

  pool.getConnection((err: MysqlError | null, connection) => {
    if (err) {
      console.error('Erro ao obter conexão do pool:', err);
      res.status(500).send('Erro ao conectar ao banco de dados');
      return;
    }

    const sqlLoginUser = 'SELECT id FROM user WHERE email = ? AND password = ?';
    connection.query(sqlLoginUser, [email, password], (err: MysqlError | null, results: any[]) => {
      connection.release();

      if (err) {
        console.error('Erro ao autenticar usuário:', err);
        res.status(500).send('Erro ao autenticar usuário');
        return;
      }

      if (results.length > 0) {
        res.send('Login bem-sucedido!');
      } else {
        res.status(401).send('Credenciais inválidas');
      }
    });
  });
};
