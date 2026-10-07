import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { adminApi, formatApiError } from "@/lib/adminApi";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // null = checking, false = not authed, object = authed
  const [user, setUser] = useState(null);

  const refreshSession = useCallback(() => {
    adminApi
      .get("/auth/me")
      .then(({ data }) => setUser(data))
      .catch(() => setUser(false));
  }, []);

  useEffect(() => {
    refreshSession();
    const onExpired = () => setUser(false);
    window.addEventListener("nsv:auth-expired", onExpired);
    return () => window.removeEventListener("nsv:auth-expired", onExpired);
  }, [refreshSession]);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await adminApi.post("/auth/login", { email, password });
      setUser(data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: formatApiError(e.response?.data?.detail) || e.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.post("/auth/logout");
    } finally {
      setUser(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
