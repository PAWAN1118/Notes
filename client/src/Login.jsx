import axios from "axios";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Notes({ token, setToken }) {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });

  // Fetch all notes for the logged-in user
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) logout();
    }
  };

  const addNote = async () => {
    if (!form.title || !form.content) return;
    try {
      const res = await axios.post(`${API}/notes`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(prev => [...prev, res.data]);
      setForm({ title: "", content: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="notes">
      <header>
        <h1>My Notes</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="add-note">
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Content"
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
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
