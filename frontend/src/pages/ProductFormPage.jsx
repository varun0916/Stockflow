import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { apiGet, apiPost, apiPut } from "../api.js";

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    quantityOnHand: 0,
    costPrice: "",
    sellingPrice: "",
    lowStockThreshold: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      apiGet(`/products/${id}`, token)
        .then((p) => {
          setForm({
            name: p.name,
            sku: p.sku,
            description: p.description || "",
            quantityOnHand: p.quantityOnHand,
            costPrice: p.costPrice ?? "",
            sellingPrice: p.sellingPrice ?? "",
            lowStockThreshold: p.lowStockThreshold ?? "",
          });
        })
        .catch(() => setError("Failed to load product"));
    }
  }, [id, isEdit, token]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      quantityOnHand: Number(form.quantityOnHand) || 0,
      costPrice: form.costPrice === "" ? null : Number(form.costPrice),
      sellingPrice: form.sellingPrice === "" ? null : Number(form.sellingPrice),
      lowStockThreshold:
        form.lowStockThreshold === "" ? null : Number(form.lowStockThreshold),
    };

    try {
      if (isEdit) {
        await apiPut(`/products/${id}`, payload, token);
      } else {
        await apiPost("/products", payload, token);
      }
      navigate("/products");
    } catch {
      setError("Failed to save product");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>
        <div>
          <Link to="/">Dashboard</Link> |{" "}
          <Link to="/products">Products</Link> |{" "}
          <Link to="/settings">Settings</Link> |{" "}
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 500, marginTop: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <label>Name *</label>
          <input
            style={{ width: "100%" }}
            value={form.name}
            onChange={handleChange("name")}
            required
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>SKU *</label>
          <input
            style={{ width: "100%" }}
            value={form.sku}
            onChange={handleChange("sku")}
            required
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Description</label>
          <textarea
            style={{ width: "100%" }}
            value={form.description}
            onChange={handleChange("description")}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Quantity on Hand</label>
          <input
            style={{ width: "100%" }}
            type="number"
            value={form.quantityOnHand}
            onChange={handleChange("quantityOnHand")}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Cost Price</label>
          <input
            style={{ width: "100%" }}
            type="number"
            step="0.01"
            value={form.costPrice}
            onChange={handleChange("costPrice")}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Selling Price</label>
          <input
            style={{ width: "100%" }}
            type="number"
            step="0.01"
            value={form.sellingPrice}
            onChange={handleChange("sellingPrice")}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Low Stock Threshold</label>
          <input
            style={{ width: "100%" }}
            type="number"
            value={form.lowStockThreshold}
            onChange={handleChange("lowStockThreshold")}
          />
        </div>

        <button type="submit" style={{ marginTop: 10 }}>
          {isEdit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}

