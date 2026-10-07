import axios from "axios";

const API = "/api";

export const adminApi = axios.create({
  baseURL: API,
  withCredentials: true,
});

export const getToken = () => null;
export const setToken = () => {};
export const clearToken = () => {};

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // The server owns the session now; the browser keeps the HttpOnly cookie.
      window.dispatchEvent(new Event("nsv:auth-expired"));
    }
    return Promise.reject(error);
  }
);

// FastAPI 422 returns an array of error objects — never render it raw.
export function formatApiError(detail) {
  if (detail == null) return "Ocorreu um erro. Tente novamente.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}
