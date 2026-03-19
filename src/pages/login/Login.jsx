import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // Save to context
      login(token, user);

      // Role based redirect
      if (user.role === "ADMIN" || user.role === "MANAGER") {
        navigate("/dashboard");
      } else if (user.role === "RECEPTION") {
        navigate("/dashboard");
      } else if (user.role === "HOUSEKEEPING") {
        navigate("/dashboard");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          Hotel PMS Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@hotel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

      </div>
    </div>
  );
}
