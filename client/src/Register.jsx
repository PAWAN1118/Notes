import axios from "axios";
import { useState } from "react";

const API = import.meta.env.VITE_API_URL.replace(/\/+$/, ""); // clean trailing slashes

export default function Register({ setPage, setToken }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const register = async () => {
    if (!form.username || !form.email || !form.password) {
      setMsg("Please fill all fields");
      return;
    }

    try {
      // Register the user
      await axios.post(`${API}/api/auth/register`, form);

      // Auto-login after registration
      const loginRes = await axios.post(`${API}api/auth/login`, {
        username: form.username,
        password: form.password,
      });

      localStorage.setItem("token", loginRes.data.token);
      setToken(loginRes.data.token);
      setMsg("Registration successful!");
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
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
