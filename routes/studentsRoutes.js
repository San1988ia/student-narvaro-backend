import express from "express";
import * as svc from "../services/studentsService.js";

const router = express.Router();

//GET alla studenter (med query parametrar)
router.get("/", async (req, res) => {
  try {
    const students = await svc.getAll(req.query);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

//GET en student via id
router.get("/:id", async (req, res) => {
  try {
    const student = await svc.getById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

//POST ny student (skapa en ny student)
router.post("/", async (req, res) => {
  try {
    const created = await svc.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create student" });
  }
});

export default router;
