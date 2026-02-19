import { useEffect, useState } from "react";
import { apiFetch } from "../api/http";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await apiFetch("/courses");
      setCourses(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const enroll = async (courseId) => {
    if (!token) {
      alert("Debes iniciar sesión primero");
      return;
    }

    try {
      await apiFetch("/enrollments", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId }),
      });

      alert("Inscripción enviada 🎓");
    } catch (err) {
      alert(err.message);
    }
  };

  const addReview = async (courseId) => {
    if (!token) {
      alert("Debes iniciar sesión");
      return;
    }

    const comment = prompt("Escribe tu review:");
    if (!comment) return;

    try {
      await apiFetch("/reviews", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          courseId,
          comment,
          rating: 5,
        }),
      });

      alert("Review enviada ⭐");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <p style={{ padding: 30 }}>Cargando cursos...</p>;
  }

  return (
    <div
      style={{
        padding: 30,
        maxWidth: 900,
        margin: "auto",
      }}
    >
      <h1 style={{ marginBottom: 30 }}>Marketplace de Cursos</h1>

      {courses.length === 0 && <p>Ahora mismo no hay ningún curso disponible.</p>}

      {courses.map((course) => (
        <div
          key={course._id}
          style={{
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: 20,
            marginBottom: 25,
            backgroundColor: "#fff",
          }}
        >
          <h2>{course.title}</h2>

          {course.image && (
            <img
              src={course.image}
              alt={course.title}
              style={{
                width: "100%",
                maxWidth: 400,
                borderRadius: 8,
                marginBottom: 15,
              }}
            />
          )}

          <p>{course.description}</p>

          <div style={{ marginTop: 15 }}>
            <button
              onClick={() => enroll(course._id)}
              style={{ marginRight: 10 }}
            >
              Inscribirse
            </button>

            <button onClick={() => addReview(course._id)}>
              Añadir Review
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}