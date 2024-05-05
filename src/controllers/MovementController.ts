import { createPool, Pool, MysqlError, PoolConnection } from 'mysql';
import { Request, Response } from 'express';
import poolConfig from '../database';

const pool: Pool = createPool(poolConfig);

export const createMovement = async (req: Request, res: Response) => {
  try {
    const { id_chartaccounts, id_paymentform, id_user, description, amount, type, frequency, date } = req.body;
    pool.getConnection((err: MysqlError | null, connection: PoolConnection) => {
      if (err) {
        console.error('Erro ao obter conexão do pool:', err);
        res.status(500).send('Erro ao conectar ao banco de dados');
        return;
      }

      const insertQuery = `
        INSERT INTO movements (id_chartaccounts, id_paymentform, id_user, description, amount, type, frequency, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      connection.query(insertQuery, [id_chartaccounts, id_paymentform, id_user, description, amount, type, frequency, date], (err: MysqlError | null, results: any) => {
        connection.release();
        if (err) {
          console.error('Erro ao inserir movimento:', err);
          res.status(500).json({ error: 'Erro ao inserir movimento' });
          return;
        }
        res.status(201).json({ id: results.insertId, message: 'Movimento inserido com sucesso!' });
      });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMovement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id_chartaccounts, id_paymentform, id_user, description, amount, type, frequency, date } = req.body;
    pool.getConnection((err: MysqlError | null, connection: PoolConnection) => {
      if (err) {
        console.error('Erro ao obter conexão do pool:', err);
        res.status(500).send('Erro ao conectar ao banco de dados');
        return;
      }

      const updateQuery = `
        UPDATE movements
        SET id_chartaccounts = ?, id_paymentform = ?, id_user = ?, description = ?, amount = ?, type = ?, frequency = ?, date = ?
        WHERE id = ?
      `;
      connection.query(updateQuery, [id_chartaccounts, id_paymentform, id_user, description, amount, type, frequency, date, id], (err: MysqlError | null, results: any) => {
        connection.release();
        if (err) {
          console.error('Erro ao atualizar movimento:', err);
          res.status(500).json({ error: 'Erro ao atualizar movimento' });
          return;
        }
        res.status(200).json({ id: id, message: 'Movimento atualizado com sucesso!' });
      });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMovement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    pool.getConnection((err: MysqlError | null, connection: PoolConnection) => {
      if (err) {
        console.error('Erro ao obter conexão do pool:', err);
        res.status(500).send('Erro ao conectar ao banco de dados');
        return;
      }

      const deleteQuery = `
        DELETE FROM movements
        WHERE id = ?
      `;
      connection.query(deleteQuery, [id], (err: MysqlError | null, results: any) => {
        connection.release();
        if (err) {
          console.error('Erro ao excluir movimento:', err);
          res.status(500).json({ error: 'Erro ao excluir movimento' });
          return;
        }
        res.status(200).json({ id: id, message: 'Movimento excluído com sucesso!' });
      });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
