/**
 * Axios instance pre-configured for the AgriLink backend.
 * - Reads VITE_API_URL from env (falls back to localhost:5000)
 * - Attaches JWT from localStorage on every request
 * - On 401 clears the token so the app can redirect to login
 */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request: attach token ─────────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrilink_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: surface error message cleanly ───────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('agrilink_token');
      localStorage.removeItem('agrilink_user');
    }
    return Promise.reject(err);
  }
);

export default api;
