import express from "express";
import * as svc from "../services/attendanceService.js";

const router = express.Router();

//POST /api/attendance/mark
//Markera närvaro
router.post("/mark", async (req, res) => {
  try {
    const { registrationId, date, status, comment } = req.body;
    if (!registrationId || !date || !status) {
      return res
        .status(400)
        .json({ error: "registrationId, date, valid status required" });
    }
    const result = await svc.mark({ registrationId, date, status, comment });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to mark attendance" });
  }
});

//GET /api/attendance/student/:id
//Hämta närvaro för student
router.get("/student/:id", async (req, res) => {
  try {
    const data = await svc.byStudent(req.params.id);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch attendance for student" });
  }
});

//GET /api/attendance/cource/:id
//Hämta närvaro för kurs
router.get("/course/:id", async (req, res) => {
  try {
    const data = await svc.byCourse(req.params.id);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch attendance for course" });
  }
});

export default router;
