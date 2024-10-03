import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "Application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: localStorage.getItem("token")
      ? `Bearer ${localStorage.getItem("token")}`
      : undefined,
  },
  withCredentials: true,
});

export default api;
