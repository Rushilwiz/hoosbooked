import mysql from "mysql2/promise";

const isProduction = process.env.NODE_ENV === "production";

const pool = await mysql.createPool({
  ...(isProduction
    ? { socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}` }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      }),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
});

export default pool;
