"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        router.push("/admin");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Pure CSS Background */}
      <div style={styles.background}>
        <div style={styles.blob1} />
        <div style={styles.blob2} />
        <div style={styles.grid} />
      </div>

      {/* Login Card */}
      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h1 style={styles.title}>Admin Access</h1>
          <p style={styles.subtitle}>Secure system login</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  background: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #111827 0%, #4c1d95 50%, #000000 100%)",
    zIndex: -2,
  },
  blob1: {
    position: "fixed",
    width: "400px",
    height: "400px",
    background: "rgba(139, 92, 246, 0.35)",
    borderRadius: "50%",
    filter: "blur(80px)",
    top: "20%",
    left: "20%",
    animation: "pulseBlob 6s infinite",
  },
  blob2: {
    position: "fixed",
    width: "400px",
    height: "400px",
    background: "rgba(236, 72, 153, 0.35)",
    borderRadius: "50%",
    filter: "blur(80px)",
    bottom: "20%",
    right: "20%",
    animation: "pulseBlob 6s infinite",
  },
  grid: {
    position: "fixed",
    inset: 0,
    opacity: 0.15,
    backgroundImage: `
      linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  cardContainer: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  card: {
    maxWidth: "400px",
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    borderRadius: "24px",
    padding: "2rem",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
    color: "white",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "0.5rem",
    background: "linear-gradient(135deg, #c084fc, #f472b6)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },
  subtitle: {
    textAlign: "center",
    color: "#d1d5db",
    fontSize: "0.875rem",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem 1rem",
    backgroundColor: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "0.5rem",
    color: "white",
    fontSize: "1rem",
    outline: "none",
  },
  error: {
    color: "#f87171",
    fontSize: "0.875rem",
    marginTop: "-0.5rem",
  },
  button: {
    width: "100%",
    padding: "0.5rem 1rem",
    background: "linear-gradient(135deg, #7c3aed, #db2777)",
    borderRadius: "0.5rem",
    fontWeight: "bold",
    color: "white",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
};

// Inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("admin-login-styles")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "admin-login-styles";
  styleSheet.textContent = `
    @keyframes pulseBlob {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }
    input:focus {
      border-color: #a855f7;
      box-shadow: 0 0 0 2px rgba(168,85,247,0.3);
    }
    button:hover {
      transform: scale(1.02);
    }
  `;
  document.head.appendChild(styleSheet);
}