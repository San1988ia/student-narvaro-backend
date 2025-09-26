import mysql from "mysql2/promise";

//läs in miljövariabler (med fallback så det funkar även utan .env)
const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_NAME = "studentnarvaro",
} = process.env;

//Skapa en enda connection
export const connection = await mysql.createConnection({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  charset: "utf8mb4_general_ci", //är för att jag ska kunna använda å,ä,ö
  namedPlaceholders: false, //tydligt att vi inte använder :named variabler
});

//Testa anslutningen direkt-få fel här istället för mitt i en query
try {
  await connection.query("SELECT 1");
  //console.log("Database connection ok");
} catch (err) {
  console.error("Failed to connect to MySQL:", err?.message || err);
  process.exit(1);
}
