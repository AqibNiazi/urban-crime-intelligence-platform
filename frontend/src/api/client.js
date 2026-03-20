import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

export const checkHealth  = ()          => api.get("/health");
export const predictCrime = (payload)   => api.post("/predict", payload);
export const classifyNLP  = (desc)      => api.post("/nlp-classify", { description: desc });
export const getForecast  = (days = 30) => api.get(`/forecast?days=${days}`);
export const getHotspot   = (lat, lon)  => api.post("/hotspot", { latitude: lat, longitude: lon });

export default api;
