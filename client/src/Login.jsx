import axios from "axios";
import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Login({ setToken, setPage }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const login = async () => {
    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(`${API}api/auth/login`, form);
      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);  // this triggers Dashboard fetch
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
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
