import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import { apiGet, apiDelete } from "../api.js";
import { Link, useNavigate } from "react-router-dom";

export default function ProductsPage() {
  const { token, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = () => {
    apiGet("/products", token)
      .then((list) => {
        setProducts(list);
        setError("");
      })
      .catch(() => setError("Failed to load products"));
  };

  useEffect(() => {
    load();
  }, [token]);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try {
      await apiDelete(`/products/${id}`, token);
      load();
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Products</h2>
        <div>
          <Link to="/">Dashboard</Link> |{" "}
          <Link to="/settings">Settings</Link> |{" "}
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: 10 }}>
        <button onClick={() => navigate("/products/new")}>Add Product</button>
        <input
          placeholder="Search by name or SKU"
          style={{ marginLeft: 10 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table
        border="1"
        cellPadding="4"
        style={{ marginTop: 20, width: "100%" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Selling Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.quantityOnHand}</td>
              <td>{p.sellingPrice ?? "-"}</td>
              <td>
                <button onClick={() => navigate(`/products/${p.id}`)}>
                  Edit
                </button>{" "}
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="5">No products</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

