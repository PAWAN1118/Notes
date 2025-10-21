import axios from "axios";
import { useState } from "react";
const API = import.meta.env.VITE_API_URL;

export default function Register({ setPage, setToken }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const register = async () => {
    try {
      await axios.post(`${API}/auth/register`, form);
      // Auto-login after registration
      const loginRes = await axios.post(`${API}/auth/login`, {
        username: form.username,
        password: form.password,
      });
      localStorage.setItem("token", loginRes.data.token);
      setToken(loginRes.data.token);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input
        placeholder="Username"
        onChange={e => setForm({ ...form, username: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={register}>Register</button>
      <p>
        Already have an account?{" "}
        <span className="switch-page" onClick={() => setPage("login")}>
          Login
        </span>
      </p>
      {msg && <p className="error">{msg}</p>}
    </div>
  );
}
