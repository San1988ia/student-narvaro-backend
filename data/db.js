import mysql from "mysql2/promise";

//läs in miljövariabler (fallback används om inget är satt)
const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_NAME = "studentnarvaro",
} = process.env;

//Skapa koppling till databasen
export const connection = await mysql.createConnection({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  charset: "utf8mb4_general_ci", //är för att jag ska kunna använda å,ä,ö
  namedPlaceholders: false, //tydligt att vi inte använder :named variabler
});

//Testa anslutningen direkt (bra att få fel tidigt)
try {
  await connection.query("SELECT 1");
  //console.log("DB-anslutning ok");
} catch (err) {
  console.error("Kunde inte koppla upp mot MySQL:", err?.message || err);
  process.exit(1);
}
