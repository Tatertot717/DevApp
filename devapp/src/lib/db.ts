import mariadb from "mariadb";

const dbConfig = {
  host: "172.20.0.11",
  port: 3306,
  user: "root",
  password: "rootpassword",
  database: "checkin",
  connectTimeout: 500,
};

export async function query(sql: string, values?: any[]) {
  let conn;
  try {
    conn = await mariadb.createConnection(dbConfig);
    const result = await conn.query(sql, values);
    return result;
  } catch (err) {
    console.error("DB query error:", err);
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.end();
      } catch (closeErr) {
        console.warn("Failed to close DB connection:", closeErr);
      }
    }
  }
}