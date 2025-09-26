import express from "express";
import { createNote, listNotes, getNote, updateNote, deleteNote } from "../controllers/noteController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.post("/notes", requireAuth, createNote);
router.get("/notes", requireAuth, listNotes);
router.get("/notes/:id", requireAuth, getNote);
router.put("/notes/:id", requireAuth, updateNote);
router.delete("/notes/:id", requireAuth, deleteNote);

export default router;
