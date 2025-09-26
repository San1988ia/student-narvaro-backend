import express from "express";
import { connection } from "./data/db.js";
import attendanceRouter from "./routes/attendanceRoutes.js";
import metaRouter from "./routes/metaRoutes.js";
import studentsRouter from "./routes/studentsRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());

//Health check(för att snabbt kolla om servern lever)
app.get("/health", (_req, res) => res.json({ ok: true }));

//API routes
app.use("/api/students", studentsRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/meta", metaRouter);

//404 fallback
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

//Starta servern
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//Gracefull shutdown (stänger DB-anslutning snyggt)
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Closing server...`);
  try {
    await connection.end();
    console.log("Database connection closed.");
  } catch (e) {
    console.error("Failed to close DB connection:", e?.message || e);
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
