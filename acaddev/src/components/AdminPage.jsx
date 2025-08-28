import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function AdminPage() {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const handleApiCall = async (endpoint) => {
    setError("");
    setResponse("");

    if (!token) {
      setError("No token found. Please login first.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/${endpoint}`, {
        method: "GET",
        headers: { Authorization: token },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.text();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const actions = [
    { name: "List Students", route: "/studentList", icon: "📋" },
    { name: "List Faculties", route: "/facultyList", icon: "👨‍🏫" },
    { name: "Add Student", route: "/addStudent", icon: "➕" },
    { name: "Add Faculty", route: "/addFaculty", icon: "🧑‍🏫" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-24 px-6 text-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-red-500 mb-12 tracking-wide drop-shadow-lg">
          Admin Dashboard
        </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {actions.map((action, idx) => (
              <div
                key={idx}
                onClick={() =>
                  action.route
                    ? navigate(action.route)
                    : handleApiCall(action.endpoint)
                }
                className="cursor-pointer bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition transform hover:scale-105 hover:shadow-2xl hover:bg-gray-700/90 duration-300"
              >
                <div className="text-5xl mb-4">{action.icon}</div>
                <div className="text-lg font-semibold text-red-400">{action.name}</div>
              </div>
            ))}
          </div>

        {/* API Response */}
        <div className="mt-12 max-w-4xl mx-auto space-y-4">
          {response && (
            <div className="flex items-center gap-3 p-4 bg-green-900/80 border border-green-600 rounded-lg shadow-lg">
              <FiCheckCircle className="text-green-400 text-2xl" />
              <span className="text-green-300 font-medium">{response}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-900/80 border border-red-600 rounded-lg shadow-lg">
              <FiAlertCircle className="text-red-400 text-2xl" />
              <span className="text-red-300 font-medium">{error}</span>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
