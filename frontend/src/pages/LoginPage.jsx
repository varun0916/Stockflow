import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { apiPost } from "../api.js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiPost("/auth/login", { email, password });
      login(data);
      navigate("/");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="app-shell">
      <div className="card">
        <div className="card-header">
          <div className="badge-pill">StockFlow</div>
          <h2 className="card-title">Welcome back</h2>
          <p className="card-subtitle">
            Sign in to manage your inventory in one place.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: "#f97373", fontSize: 12 }}>{error}</p>}
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
        <div className="card-footer">
          New here? <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

