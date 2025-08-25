import { useState } from "react";
import api from "../api";

export default function Upload() {
  const [form, setForm] = useState({ name: "", description: "", image: "", quantity: 1 });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", form);
      setMsg("Product uploaded!");
      setForm({ name: "", description: "", image: "", quantity: 1 });
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    }
  };

  return (
    <form onSubmit={submit} style={{ padding: 16, display: "grid", gap: 8, maxWidth: 560 }}>
      <h2>Upload a Product</h2>
      <input placeholder="Product name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Image URL (optional)" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
      <input type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} />
      <button type="submit">Upload</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
