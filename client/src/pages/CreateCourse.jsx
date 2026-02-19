import { useState } from "react";
import { apiFetch, API_URL } from "../api/http";

export default function CreateCourse() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  const uploadImage = async () => {
    const data = new FormData();
    data.append("image", file);

    const res = await fetch(`${API_URL}/uploads/course-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });

    const result = await res.json();
    return result.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      if (file) {
        imageUrl = await uploadImage();
      }

      await apiFetch("/courses", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          image: imageUrl,
        }),
      });

      alert("Curso creado con imagen");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h2>Crear Curso</h2>

      <input
        placeholder="Título"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <br />

      <textarea
        placeholder="Descripción"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />
      <br />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />

      <button>Crear</button>
    </form>
  );
}