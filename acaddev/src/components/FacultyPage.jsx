import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FilePlus2, ListChecks, GraduationCap } from "lucide-react"; // ✅ icons

export default function FacultyPage() {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchFacultyDetails = async () => {
      if (!token) {
        setError("No token found. Please login first.");
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/faculty/getFacultyDetails", {
          method: "GET",
          headers: { Authorization: token },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch faculty details, status: ${res.status}`);
        }

        const data = await res.json();
        setFirstName(data.firstName || "");
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchFacultyDetails();
  }, [token]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 pt-24 px-6 text-white">
        {/* Welcome section */}
        <div className="text-center mb-12">
          <GraduationCap className="mx-auto h-14 w-14 text-pink-400 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 tracking-wide">
            {firstName ? `Welcome, ${firstName}!` : "Faculty Dashboard"}
          </h1>
          <p className="text-gray-400 mt-2">Quick actions to manage your tests</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Add Test */}
          <button
            onClick={() => navigate("/addTest")}
            className="bg-gray-800 hover:bg-gray-700 transition duration-300 shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center text-blue-300 font-bold text-lg hover:scale-105 transform"
          >
            <FilePlus2 className="h-10 w-10 text-green-400 mb-4" />
            Add Test
          </button>

          {/* List Tests */}
          <button
            onClick={() => navigate("/listTests")}
            className="bg-gray-800 hover:bg-gray-700 transition duration-300 shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center text-blue-300 font-bold text-lg hover:scale-105 transform"
          >
            <ListChecks className="h-10 w-10 text-yellow-400 mb-4" />
            List Tests
          </button>
        </div>

        {/* API Response */}
        <div className="mt-12 max-w-4xl mx-auto">
          {response && (
            <pre className="p-4 bg-green-900 text-green-300 rounded-lg shadow-md mb-4 border border-green-600 overflow-x-auto whitespace-pre-wrap">
              {response}
            </pre>
          )}

          {error && (
            <div className="p-4 bg-red-900 text-red-400 rounded-lg shadow-md mb-4 border border-red-600">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
