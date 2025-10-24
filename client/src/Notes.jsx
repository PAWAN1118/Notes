import axios from "axios";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Notes({ token, setToken, userId }) {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  // Fetch all notes for this user
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/api/notes?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch notes");
    }
  };

  // Add a new note
  const addNote = async () => {
    if (!form.title || !form.content) {
      setError("Please fill in both title and content");
      return;
    }
    try {
      await axios.post(
        `${API}/api/notes`,
        { ...form, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ title: "", content: "" });
      setError("");
      fetchNotes();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add note");
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId }, // send userId in body for delete
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete note");
    }
  };

  useEffect(() => {
    if (userId) fetchNotes();
  }, [userId]);

  return (
    <div className="notes">
      <header>
        <h1>My Notes</h1>
        <button
          onClick={() => {
            localStorage.clear();
            setToken(null);
          }}
        >
          Logout
        </button>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="add-note">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <button onClick={addNote}>Add</button>
      </div>

      <ul>
        {notes.map((n) => (
          <li key={n._id}>
            <h3>{n.title}</h3>
            <p>{n.content}</p>
            <button onClick={() => deleteNote(n._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
