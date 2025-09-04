import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_BASE_URL;

export default function AdminPage() {
  const [error, setError] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken"); // get the token

  // Fetch student details on page load
  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!token) {
        setError("No token found. Please login first.");
        return;
      }

      try {
        const res = await fetch(userServiceBaseURL + "/student/getStudentDetails", {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setStudentDetails(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchStudentDetails();
  }, [token]);

  return (
    <>
      <Navbar />
      {/* Main Container */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-24 px-6 text-white">
        
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-400 to-purple-500 mb-6 tracking-wide drop-shadow-lg">
          Student Dashboard
        </h1>

        {/* Welcome Message */}
        {studentDetails && (
          <h2 className="text-2xl text-center font-semibold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-lime-500">
            Welcome, {studentDetails.firstName} 👋
          </h2>
        )}

        {/* Dashboard Card */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/allTests")}
            className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white font-bold text-lg px-10 py-5 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            🚀 View Tests
          </button>
        </div>

        {/* Error Box */}
        <div className="mt-12 max-w-4xl mx-auto">
          {error && (
            <div className="p-4 bg-red-900/70 text-red-300 rounded-lg shadow-md mb-4 border border-red-500 backdrop-blur-sm">
              <span className="font-semibold">⚠ Error:</span> {error}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
