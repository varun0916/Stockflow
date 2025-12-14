import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import { apiGet } from "../api.js";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { token, org, logout } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/dashboard", token)
      .then(setData)
      .catch(() => setError("Failed to load dashboard"));
  }, [token]);

  if (!data && !error) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{org?.name || "Dashboard"}</h2>
        <div>
          <Link to="/products">Products</Link> |{" "}
          <Link to="/settings">Settings</Link> |{" "}
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <>
          <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
            <div>
              <h3>Total Products</h3>
              <p>{data.totalProducts}</p>
            </div>
            <div>
              <h3>Total Quantity</h3>
              <p>{data.totalQuantity}</p>
            </div>
          </div>

          <h3 style={{ marginTop: 30 }}>Low stock items</h3>
          {data.lowStockItems.length === 0 ? (
            <p>No low stock items.</p>
          ) : (
            <table border="1" cellPadding="4">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Quantity</th>
                  <th>Threshold</th>
                </tr>
              </thead>
              <tbody>
                {data.lowStockItems.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.quantityOnHand}</td>
                    <td>{p.lowStockThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

