import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
const authServiceBaseURL = import.meta.env.VITE_AUTH_SERVICE_BASE_URL;

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isValidAdmin = await fetch(authServiceBaseURL + "/isAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if(isValidAdmin.ok){
        const responseVal = await isValidAdmin.json()
        if(responseVal == false) {
          throw new Error("You are not an admin");
        }
      } else {
        throw new Error("You are not an admin");
      }
      const response = await fetch(authServiceBaseURL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Login failed");
      }

      const tokenString = await response.text();
      localStorage.setItem("authToken", tokenString);
      navigate("/adminPage");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="relative w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-purple-600 to-pink-500 opacity-10 blur-3xl -z-10"></div>

          <div className="p-10">
            <h2 className="text-3xl font-extrabold text-center text-white mb-8">
              Admin Login
            </h2>

            {error && (
              <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400 transition"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-gray-400 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm">
              Forgot your password?{" "}
              <span className="text-pink-400 underline cursor-pointer">
                Reset here
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
