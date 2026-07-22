import React, { useState } from "react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid login credentials");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h2 style={styles.title}>FMDS Login</h2>
        <p style={styles.subtitle}>Welcome back! Please sign in.</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email Address"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.footerText}>
          Forgot password? <span style={styles.link}>Reset here</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2E3192, #1BFFFF)",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#fff",
    padding: "40px 30px",
    borderRadius: 15,
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    animation: "fadeIn 0.8s ease",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    marginBottom: 5,
    color: "#2E3A59",
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 25,
    color: "#555",
  },
  error: {
    background: "#ffdddd",
    color: "#b30000",
    padding: "8px 10px",
    fontSize: 13,
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },
  input: {
    padding: "12px 15px",
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 15,
    outline: "none",
    transition: "0.3s",
  },
  button: {
    padding: "12px 15px",
    borderRadius: 8,
    border: "none",
    background: "#2E3192",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },
  footerText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
    color: "#444",
  },
  link: {
    color: "#2E3192",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

// Add animation globally
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`);
