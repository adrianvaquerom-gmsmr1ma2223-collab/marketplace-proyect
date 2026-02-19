import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <p>Nombre: {user?.name}</p>
      <p>Correo electrónico: {user?.email}</p>
    </div>
  );
}