import { PoolConfig } from 'mysql';

const dbConfig: PoolConfig = {
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "19930926",
  database: "finfocusdb"
};

export default dbConfig;
