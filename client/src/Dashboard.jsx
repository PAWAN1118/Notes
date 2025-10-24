import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://notes-r5hn.onrender.com"; // backend URL

export default function Dashboard({ token, setToken }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const userId = localStorage.getItem("userId"); // get saved userId
  const headers = { Authorization: `Bearer ${token}` };

  const fetchNotes = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API}api/notes?userId=${userId}`, { headers });
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes:", err.response?.data || err);
      if (err.response?.status === 401) logout();
    }
  };

  const addNote = async () => {
    if (!title || !content) return alert("Fill all fields");
    try {
      await axios.post(`${API}api/notes`, { title, content, userId }, { headers });
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error("Failed to add note:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add note");
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}api/notes/${id}`, { headers, data: { userId } });
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to delete note");
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setNotes([]);
  };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

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
        <button onClick={addNote}>Add Note</button>
      </div>

      <div className="notes-list">
        {notes.length === 0 && <p>No notes yet. Add one above!</p>}
        {notes.map(note => (
          <div className="note-card" key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
