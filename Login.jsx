import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      nav("/products");
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    }
  };

  return (
    <form onSubmit={submit} style={{ padding: 16, display: "grid", gap: 8, maxWidth: 360 }}>
      <h2>Login</h2>
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Login</button>
      {msg && <p style={{ color: "crimson" }}>{msg}</p>}
    </form>
  );
}
