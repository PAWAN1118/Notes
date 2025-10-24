import axios from "axios";
import { useEffect, useState } from "react";

const API = "https://notes-r5hn.onrender.com"; // Render backend URL

export default function Notes({ token, setToken, userId }) {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}api/notes?userId=${userId}`, { headers });
      setNotes(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notes");
    }
  };

  // Add note
  const addNote = async () => {
    if (!form.title || !form.content) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await axios.post(
        `${API}api/notes`,
        { title: form.title, content: form.content, userId },
        { headers }
      );
      setForm({ title: "", content: "" });
      fetchNotes();
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add note");
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}api/notes/${id}`, { headers, data: { userId } });
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete note");
    }
  };

  useEffect(() => {
    if (token && userId) fetchNotes();
  }, [token, userId]);

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
