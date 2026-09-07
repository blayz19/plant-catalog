import axios from "axios";

// Определяем базовый URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5001";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// ⭐ Функция для получения полного URL фото (работает и локально, и на сервере)
export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // Убираем двойной слеш, если он есть
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
};
