// api.js
const API_URL =
  import.meta.env.VITE_API_URL || "https://stockflow-1-ro65.onrender.com/api";





export function getAuthHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function apiGet(path, token) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export async function apiPost(path, body, token) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Request failed");

  // Handle empty body (e.g. 200 with Content-Length: 0)
  const text = await res.text();
  if (!text) return null;              // or return {} if you prefer
  return JSON.parse(text);
}



export async function apiPut(path, body, token) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export async function apiDelete(path, token) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  if (!res.ok && res.status !== 204) throw new Error("Request failed");
}

