import express from "express";
import * as svc from "../services/attendanceService.js";

const router = express.Router();

//GET (Hämta antal studenter, kurser, registreringar, närvarorader)
router.get("/counts", async (_req, res) => {
  try {
    const result = await svc.counts();
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to fetch counts" });
  }
});

// GET (Hämta närvaroprocent för kurs)
router.get("/attendance-rate/course/:courseId", async (req, res) => {
  try {
    const result = await svc.rateForCourse(req.params.courseId);
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to fetch attendance rate" });
  }
});

export default router;
