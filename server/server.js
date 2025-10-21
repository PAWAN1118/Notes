import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// ------------------ CORS SETUP ------------------
const allowedOrigins = [
  "https://notes-1-6st8.onrender.com", // ✅ your frontend Render URL
  "http://localhost:5173"              // ✅ optional for local testing
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.options("*", cors());

// ------------------ MONGODB CONNECTION ------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ------------------ MODELS ------------------
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const noteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});
const Note = mongoose.model("Note", noteSchema);

// ------------------ AUTH ROUTES ------------------

// Register new user
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login user
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Simple token (replace with JWT later if needed)
    res.json({ token: username });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ NOTES ROUTES ------------------

// Get all notes of a user
app.get("/notes/:userId", async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.params.userId });
    res.json(notes);
  } catch (err) {
    console.error("Get Notes Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add new note
app.post("/notes", async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    const note = new Note({ userId, title, content });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error("Add Note Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update note
app.put("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(note);
  } catch (err) {
    console.error("Update Note Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete note
app.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Delete Note Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ ROOT ROUTE ------------------
app.get("/", (req, res) => {
  res.send("📝 Notes API is running successfully on Render 🚀");
});

// ------------------ SERVER START ------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
