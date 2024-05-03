import express, { Request, Response } from 'express';
import { createPool, Pool, MysqlError } from 'mysql';

const app = express();
app.use(express.json());


const pool: Pool = createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '19930926',
  database: 'finfocusdb',
});


app.post('/cadastro', (req: Request, res: Response) => {
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
});


app.post('/login', (req: Request, res: Response) => {
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
});


app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
