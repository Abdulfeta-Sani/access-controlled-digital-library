import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { setToken, setRole } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    setToken(data.access_token);
    setRole(data.role);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white p-2 w-full"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}

export default Login;