import axios from "axios";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Notes({ token, setToken }) {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });

  // Get username dynamically from localStorage
  const username = localStorage.getItem("username");

  const fetchNotes = async () => {
    if (!username) return;
    try {
      const res = await axios.get(`${API}/notes/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addNote = async () => {
    try {
      // Include username in POST body
      await axios.post(
        `${API}/notes`,
        { username, ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ title: "", content: "" });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [username]);

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
