import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./context/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CreateCourse from "./pages/CreateCourse";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link> |{" "}
      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link> |{" "}
          <Link to="/create">Crear Curso</Link> |{" "}
          <button onClick={logout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Iniciar sesión</Link> |{" "}
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateCourse />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}