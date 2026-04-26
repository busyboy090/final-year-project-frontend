/**
 * API origin for fetch(). Default "" uses same origin (Vite dev proxy → backend).
 * Override in production if the API is on another host, e.g. `https://api.example.com`.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";
