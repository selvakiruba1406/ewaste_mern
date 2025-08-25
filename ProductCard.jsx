import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const nav = useNavigate();
  return (
    <div style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
      {product.image && (
        <img src={product.image} alt={product.name} style={{ width: "100%", maxHeight: 160, objectFit: "cover" }} />
      )}
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Qty available: {product.quantity}</p>
      <button onClick={() => nav(`/checkout/${product._id}`, { state: { product } })} disabled={product.quantity <= 0}>
        Get For Free
      </button>
    </div>
  );
}
