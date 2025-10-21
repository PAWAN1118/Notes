import Note from "../models/Note.js";

// Create note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "All fields are required" });

    const note = new Note({ userId: req.userId, title, content });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get all notes for user
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    res.status(200).json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};
