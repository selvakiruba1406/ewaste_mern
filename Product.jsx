import { useEffect, useMemo, useState, useCallback } from "react";
import api from "../api";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [all, setAll] = useState([]);
  const [q, setQ] = useState("");
  const load = useCallback(async () => {
    const { data } = await api.get("/products", { params: q ? { q } : {} });
    setAll(data);
  }, [q]);

  useEffect(() => { load(); }, [load]);

  // also keep a local filter for snappy UX
  const filtered = useMemo(() => {
    if (!q) return all;
    return all.filter(p => (p.name + p.description).toLowerCase().includes(q.toLowerCase()));
  }, [all, q]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Available Products</h2>
      <input placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} style={{ marginBottom: 12, width: 280 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 12 }}>
        {filtered.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
      {filtered.length === 0 && <p>No products available</p>}
    </div>
  );
}
