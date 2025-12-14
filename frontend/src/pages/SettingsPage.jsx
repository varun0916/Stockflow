import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import { apiGet, apiPut } from "../api.js";
import { Link } from "react-router-dom";

export default function SettingsPage() {
  const { token, logout } = useAuth();
  const [defaultLowStock, setDefaultLowStock] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/settings", token)
      .then((s) => {
        if (s && typeof s.defaultLowStock === "number") {
          setDefaultLowStock(s.defaultLowStock);
        }
        setError("");
      })
      .catch(() => setError("Failed to load settings"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPut(
        "/settings",
        { defaultLowStock: Number(defaultLowStock) },
        token
      );
      alert("Saved");
    } catch {
      alert("Failed to save");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Settings</h2>
        <div>
          <Link to="/">Dashboard</Link> |{" "}
          <Link to="/products">Products</Link> |{" "}
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 400, marginTop: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <label>Default Low Stock Threshold</label>
          <input
            type="number"
            style={{ width: "100%" }}
            value={defaultLowStock}
            onChange={(e) => setDefaultLowStock(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>
          Save
        </button>
      </form>
    </div>
  );
}

