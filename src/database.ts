import { createPool } from "mysql2/promise";

export async function connect() {
  const connection = await createPool({
    host: "127.0.0.1",
    user: "root",
    password: "F@jardo1",
    database: "tecnm_sql",
    connectionLimit: 10,
  });
  return connection;
}
