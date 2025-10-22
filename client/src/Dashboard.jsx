import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, ""); // Remove trailing slash

export default function Dashboard({ token, setToken, username }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch notes for logged-in user
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/notes/${username}`);
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch Notes Error:", err.response?.data || err.message);
      if (err.response?.status === 404) setNotes([]); // No notes yet
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add a new note
  const addNote = async () => {
    if (!title || !content) return;

    try {
      const res = await axios.post(`${API}/notes`, {
        userId: username,
        title,
        content
      });
      setNotes(prev => [...prev, res.data]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Add Note Error:", err.response?.data || err.message);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/notes/${id}`);
      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (err) {
      console.error("Delete Note Error:", err.response?.data || err.message);
    }
  };

  // Logout
  const logout = () => {
    setToken(""); // Clear token state
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Notes Dashboard</h1>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="note-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button className="add-btn" onClick={addNote}>Add Note</button>
      </div>

      <div className="notes-list">
        {notes.length === 0 && <p>No notes yet. Add one above!</p>}
        {notes.map(note => (
          <div className="note-card" key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button className="delete-btn" onClick={() => deleteNote(note._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
