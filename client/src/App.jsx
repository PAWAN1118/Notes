import { useState, useEffect } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";


export default function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  if (token) return <Dashboard token={token} setToken={setToken} />;

  return page === "login"
    ? <Login setToken={setToken} setPage={setPage} />
    : <Register setPage={setPage} setToken={setToken} />;
}
