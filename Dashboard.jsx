
import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [myProducts, setMyProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    (async () => {
      const p = await api.get("/products/my");
      setMyProducts(p.data);
      const o = await api.get("/orders/my");
      setMyOrders(o.data);
    })();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>My Dashboard</h2>
      <h3>Uploaded Products</h3>
      <ul>{myProducts.map(p => <li key={p._id}>{p.name} — Qty: {p.quantity}</li>)}</ul>
      {myProducts.length === 0 && <p>No uploads yet.</p>}

      <h3>My Orders</h3>
      <ul>{myOrders.map(o => <li key={o._id}>{o.product?.name} — Qty: {o.quantity} — Status: {o.status}</li>)}</ul>
      {myOrders.length === 0 && <p>No orders yet.</p>}
    </div>
  );
}
