import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
const authServiceBaseURL = import.meta.env.VITE_AUTH_SERVICE_BASE_URL;

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        authServiceBaseURL + `/reset-password?otp=${encodeURIComponent(otp)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, confirmPassword }),
        }
      );

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Failed to reset password");
      }

      alert("Password reset successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="relative w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-purple-600 to-pink-500 opacity-10 blur-3xl -z-10"></div>

          <div className="p-10">
            <h2 className="text-3xl font-extrabold text-center text-white mb-8">
              Reset Password
            </h2>

            {error && (
              <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
            )}

            <form className="space-y-6" onSubmit={handleReset}>
              <input
                type="email"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
                required
              />

              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
                required
              />

              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
                required
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
