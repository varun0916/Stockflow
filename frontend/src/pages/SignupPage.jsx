import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiPost } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function SignupPage() {
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiPost("/api/auth/signup", {
        organizationName,
        email,
        password,
      });

      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.log("signup error", err.response?.status, err.response?.data);
      setError("Could not sign up");
    }
  };

  return (
    <div className="auth-page">
      <h1>Create your workspace</h1>
      <p>Track products and low stock alerts for your store.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Organization Name
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit">Sign up</button>
      </form>

      <p>
        Already have account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}


