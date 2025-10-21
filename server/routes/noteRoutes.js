import express from "express";
import { createNote, getNotes, deleteNote } from "../controllers/noteControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createNote);
router.get("/", verifyToken, getNotes);
router.delete("/:id", verifyToken, deleteNote);

export default router;
