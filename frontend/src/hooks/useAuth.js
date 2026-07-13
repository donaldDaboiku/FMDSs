import { useEffect } from "react";

export default function useAuth() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/";
  }, []);
}
