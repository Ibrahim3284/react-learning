import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AdminPage() {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);

  const token = localStorage.getItem("authToken"); // get the token

  // Fetch student details on page load
  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!token) {
        setError("No token found. Please login first.");
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/student/getStudentDetails", {
          method: "GET",
          headers: {
            "Authorization": token,
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
        headers: {
          "Authorization": token,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.text(); // or res.json() if API returns JSON
      setResponse(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      {/* Add top padding to avoid navbar overlap */}
      <div className="min-h-screen bg-gray-900 pt-24 px-6 text-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-red-600 mb-6 tracking-wide">
          Student Dashboard
        </h1>

        {/* Show Welcome message */}
        {studentDetails && (
          <h2 className="text-2xl text-center text-green-400 font-semibold mb-12">
            Welcome {studentDetails.firstName}
          </h2>
        )}

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Tests attempted", endpoint: "students/list" },
            { name: "List Faculties", endpoint: "faculties/list" },
            { name: "Add Student", endpoint: "students/add" },
            { name: "Add Faculty", endpoint: "faculties/add" },
            { name: "Edit Student", endpoint: "students/edit" },
            { name: "Edit Faculty", endpoint: "faculties/edit" },
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleApiCall(action.endpoint)}
              className="bg-gray-800 hover:bg-gray-700 transition duration-300 shadow-lg rounded-lg p-8 flex flex-col items-center justify-center text-red-500 font-bold text-lg hover:scale-105 transform"
            >
              {action.name}
            </button>
          ))}
        </div>

        {/* API Response */}
        <div className="mt-12 max-w-4xl mx-auto">
          {response && (
            <div className="p-4 bg-green-900 text-green-400 rounded-lg shadow-md mb-4 border border-green-600">
              <span className="font-semibold">Response:</span> {response}
            </div>
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
