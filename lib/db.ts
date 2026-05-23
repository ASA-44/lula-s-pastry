import "server-only";

import mysql, { type Pool } from "mysql2/promise";

declare global {
  // Reuse the pool across hot reloads in development.
  var lulasMysqlPool: Pool | undefined;
}

export const pool =
  globalThis.lulasMysqlPool ??
  mysql.createPool({
    host: process.env.MYSQL_HOST ?? "127.0.0.1",
    port: Number(process.env.MYSQL_PORT ?? 3306),
    database: process.env.MYSQL_DATABASE ?? "lulas_pastry",
    user: process.env.MYSQL_USER ?? "root",
    password: process.env.MYSQL_PASSWORD ?? "",
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.lulasMysqlPool = pool;
}
