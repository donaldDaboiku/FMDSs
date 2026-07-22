import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "/api";

const api = axios.create({
  baseURL,
});

export const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default api;
