import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/http";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      apiFetch("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, [token]);

  const login = (token) => {
    localStorage.setItem("token", token);
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}