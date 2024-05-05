import express from 'express';
import userRoutes from './routes/userRoutes';
import movementRoutes from './routes/movementRoutes';
import dotenv from 'dotenv';
import { createPool, Pool } from 'mysql';
import dbConfig from './database';

dotenv.config();

declare module 'express-serve-static-core' {
  interface Request {
    pool: Pool;
  }
}

const app = express();
app.use(express.json());

const pool: Pool = createPool(dbConfig);

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.use('/user', userRoutes);
app.use('/movement', movementRoutes);

const PORT: number = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
