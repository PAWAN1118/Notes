import axios from "axios";
import { useState } from "react";

export default function Login({ setToken, setPage }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  // Define axios instance (replace URL with your actual Render backend)
  const api = axios.create({
    baseURL: "https://notes-api-<your-render-name>.onrender.com", // 👈 change this to your real URL
  });

  const login = async () => {
    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={login}>Login</button>
      <p>
        Don’t have an account?{" "}
        <span className="switch-page" onClick={() => setPage("register")}>
          Register
        </span>
      </p>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
