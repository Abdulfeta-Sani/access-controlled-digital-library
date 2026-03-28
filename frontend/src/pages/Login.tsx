import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function Login() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext must be used within AuthProvider");
  const { setToken, setRole, flashMessage, setFlashMessage } = context;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!flashMessage) return;
    const timeout = setTimeout(() => setFlashMessage(null), 3000);
    return () => clearTimeout(timeout);
  }, [flashMessage, setFlashMessage]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.access_token);
        setRole(data.role);
        setFlashMessage(null);
      } else {
        setError(data.detail || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-center tracking-tight mb-6">Login</h2>

        {flashMessage && (
          <p
            className={`mb-4 p-2 rounded ${
              flashMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {flashMessage.text}
          </p>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="space-y-3">
          <input
            className="border border-slate-300 p-2 w-full rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border border-slate-300 p-2 w-full rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 w-full rounded-lg mt-4 disabled:opacity-50"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;