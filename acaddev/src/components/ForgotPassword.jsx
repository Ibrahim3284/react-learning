import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8087/forgot-password?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to request password reset");
      }

      navigate("/resetPassword", { state: { email } }); // Pass email to next page
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
              Forgot Password
            </h2>

            {error && (
              <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              >
                {loading ? "Sending..." : "Send Reset OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
