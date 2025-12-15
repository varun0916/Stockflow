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
  const { login } = useAuth(); // if you want auto‑login after signup

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ send correct key & variable name
      await apiPost("/auth/signup", {
        organizationName,
        email,
        password,
      });

      // Option 1: go to login page after signup
      navigate("/login");

      // Option 2 (if backend returns token on signup and you want auto‑login):
      // const res = await apiPost("/auth/signup", { organizationName, email, password });
      // login(res.token, res.user);
      // navigate("/");
    } catch (err) {
      console.error(err);
      setError("Could not sign up");
    }
  };

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
              autoComplete="organization"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <p style={{ color: "#f97373", fontSize: 12 }}>{error}</p>
          )}

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
