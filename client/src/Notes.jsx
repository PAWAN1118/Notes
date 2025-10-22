import axios from "axios";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export default function Notes({ username }) {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/notes/${username}`);
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch Notes Error:", err.response?.data || err.message);
      if (err.response?.status === 404) setNotes([]);
    }
  };

  // Add note
  const addNote = async () => {
    if (!form.title || !form.content) return;

    try {
      const res = await axios.post(`${API}/notes`, {
        userId: username,
        title: form.title,
        content: form.content
      });
      setNotes(prev => [...prev, res.data]);
      setForm({ title: "", content: "" });
    } catch (err) {
      console.error("Add Note Error:", err.response?.data || err.message);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/notes/${id}`);
      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (err) {
      console.error("Delete Note Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  return (
    <div className="notes">
      <h1>{username}'s Notes</h1>
      <div className="add-note">
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
        />
        <input
          placeholder="Content"
          value={form.content}
          onChange={e => setForm({...form, content: e.target.value})}
        />
        <button onClick={addNote}>Add</button>
      </div>
      <ul>
        {notes.map(n => (
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
