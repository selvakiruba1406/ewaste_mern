import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function Checkout() {
  const { productId } = useParams();
  const location = useLocation();
  const nav = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!product) {
        const { data } = await api.get(`/products/${productId}`);
        setProduct(data);
      }
    };
    load();
  }, [product, productId]);

  const order = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/orders/${productId}`, { quantity, deliveryAddress: address });
      setMsg("Order placed successfully!");
      setTimeout(() => nav("/dashboard"), 800);
    } catch (e) {
      setMsg(e.response?.data?.message || e.message);
    }
  };

  if (!product) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <form onSubmit={order} style={{ padding: 16, display: "grid", gap: 8, maxWidth: 420 }}>
      <h2>Checkout — {product.name}</h2>
      <p>Available: {product.quantity}</p>
      <input type="number" min="1" max={product.quantity} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
      <textarea placeholder="Delivery address" value={address} onChange={e => setAddress(e.target.value)} />
      <button type="submit" disabled={quantity < 1 || !address}>Place Order (Free)</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
