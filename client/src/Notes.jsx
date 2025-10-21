import axios from "axios";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Notes({ token, setToken }) {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });

  const fetchNotes = async () => {
    const res = await axios.get(`${API}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotes(res.data);
  };

  const addNote = async () => {
    await axios.post(`${API}/notes`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm({ title: "", content: "" });
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API}/notes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotes();
  };

  useEffect(() => { fetchNotes(); }, []);

  return (
    <div className="notes">
      <header>
        <h1>My Notes</h1>
        <button onClick={() => { localStorage.clear(); setToken(null); }}>Logout</button>
      </header>
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
