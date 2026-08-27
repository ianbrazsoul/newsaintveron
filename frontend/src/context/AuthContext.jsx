import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { adminApi, getToken, setToken, clearToken, formatApiError } from "@/lib/adminApi";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // null = checking, false = not authed, object = authed
  const [user, setUser] = useState(getToken() ? null : false);

  useEffect(() => {
    let active = true;
    if (!getToken()) {
      setUser(false);
      return;
    }
    adminApi
      .get("/auth/me")
      .then(({ data }) => active && setUser(data))
      .catch(() => {
        clearToken();
        if (active) setUser(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await adminApi.post("/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: formatApiError(e.response?.data?.detail) || e.message };
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
