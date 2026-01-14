import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      setErr("Invalid username/password");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    navigate("/employees");
  }

  return (
    <div style={{ maxWidth: 350, margin: "60px auto", fontFamily: "Arial" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <button style={{ width: "100%", padding: 10 }}>Login</button>
      </form>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <p style={{ fontSize: 12, opacity: 0.8 }}>Demo user: admin / 1234</p>
    </div>
  );
}
