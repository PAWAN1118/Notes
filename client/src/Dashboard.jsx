


import { useState, useEffect } from "react";
import axios from "axios";


const API = import.meta.env.VITE_API_URL;

export default function Dashboard({ token, setToken }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const userId = localStorage.getItem("userId"); // get userId from login

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = token || localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  // Fetch notes whenever token is available
  useEffect(() => {
    if (!token || !userId) return;

    const fetchNotes = async () => {
      try {
        const res = await axios.get(`${API}api/notes`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId }, // send userId as query
        });
        setNotes(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) logout();
      }
    };

    fetchNotes();
  }, [token, userId]);

  const addNote = async () => {
    if (!title || !content) return;

    try {
      const res = await axios.post(
        `${API}api/notes`,
        { title, content, userId }, // include userId
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(prev => [...prev, res.data]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add note");
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId }, // include userId in delete body
      });
      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete note");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken("");
    setNotes([]);
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

