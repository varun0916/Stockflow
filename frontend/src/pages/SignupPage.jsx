import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/api/auth/signup", data);
      console.log("signup success", res.data);
    } catch (err) {
      console.log("signup error", err.response?.status, err.response?.data);
      setError("Could not sign up");
  }  
  }  


  return (
    <div className="app-shell">
      <div className="card">
        <div className="card-header">
          <div className="badge-pill">StockFlow</div>
          <h2 className="card-title">Create your workspace</h2>
          <p className="card-subtitle">
            Track products and low stock alerts for your store.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Organization Name</label>
            <input
              className="form-input"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </div>
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
            Sign up
          </button>
        </form>
        <div className="card-footer">
          Already have account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

