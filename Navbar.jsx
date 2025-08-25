import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <nav style={{ padding: 12, display: "flex", gap: 12, borderBottom: "1px solid #ddd" }}>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      {user && <Link to="/upload">Upload</Link>}
      {user && <Link to="/dashboard">Dashboard</Link>}
      <div style={{ marginLeft: "auto" }}>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>Hi, {user.name}</span>
            <button onClick={() => { logout(); nav("/"); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>{" "}
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
