import { Pool } from 'pg'; // Usando PostgreSQL como exemplo de banco de dados

export const pool = new Pool({
  user: 'user',           // Substitua com seu usuário do banco de dados
  host: 'localhost',
  database: 'secretaria_virtual',
  password: '6z2h1j3k9F!',   // Substitua com sua senha
  port: 5432,
});

export async function query(text: string, params?: any[]) {
  const res = await pool.query(text, params);
  return res.rows;
}