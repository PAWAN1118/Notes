import axios from "axios";
import { useEffect, useState } from "react";

const API = "https://notes-r5hn.onrender.com"; // backend URL

export default function Notes({ token, setToken }) {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });

  // Get userId from localStorage
  const userId = localStorage.getItem("userId");

  // common headers with token
  const headers = { Authorization: `Bearer ${token}` };

  // fetch notes for this user
  const fetchNotes = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API}api/notes?userId=${userId}`, { headers });
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes:", err.response?.data || err);
    }
  };

  // add a new note
  const addNote = async () => {
    if (!form.title || !form.content) return alert("Fill all fields");
    try {
      await axios.post(`${API}api/notes`, { ...form, userId }, { headers });
      setForm({ title: "", content: "" });
      fetchNotes();
    } catch (err) {
      console.error("Failed to add note:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add note");
    }
  };

  // delete a note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}api/notes/${id}`, { headers, data: { userId } });
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to delete note");
    }
  };

  useEffect(() => {
    fetchNotes(); // fetch notes on mount
  }, []);

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

