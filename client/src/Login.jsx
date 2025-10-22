import axios from "axios";
import { useState } from "react";

// Clean and safe base API URL from your .env file
const API = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

export default function Login({ setToken, setPage }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const login = async () => {
    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Send login request to backend
      const res = await axios.post(`${API}/auth/login`, form);

      // Store JWT token and update app state
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setError("");
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
