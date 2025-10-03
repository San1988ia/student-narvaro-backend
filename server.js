import express from "express";
import { connection } from "./data/db.js";
import attendanceRouter from "./routes/attendanceRoutes.js";
import metaRouter from "./routes/metaRoutes.js";
import studentsRouter from "./routes/studentsRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

//Min middleware express.json som gör att min server kan läsa JSON data från klienten, ex om man skapar en ny student eller markerar närvaro
app.use(express.json());

//Enkel testlänk för att se om servern är igång
app.get("/health", (_req, res) =>
  res.json({ message: "Wohoo, vi är igång och servern funkar" })
);

//API-routes(studenter, närvaro, statistik)
app.use("/api/students", studentsRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/meta", metaRouter);

//404 felmeddelande
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

//Starta servern
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//Stänger ner servern och databasen på ett snyggt sätt
const shutdown = async (signal) => {
  console.log(`\n${signal} mottaget. Stänger servern...`);
  try {
    await connection.end();
    console.log("DB-anslutning stängd.");
  } catch (e) {
    console.error("Kunde inte stänga DB-anslutningen:", e?.message || e);
  } finally {
    process.exit(0);
  }
};
//Hanterar avslut ex Ctrl+C
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
