export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error API");
  return data;
}