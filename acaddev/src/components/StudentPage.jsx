import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { GraduationCap, ListChecks, FileText, UserCheck } from "lucide-react";

const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_BASE_URL;

export default function StudentPage() {
  const [error, setError] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

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
          throw new Error(`Failed to fetch student details, status: ${res.status}`);
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
      <div className="min-h-screen bg-gray-900 pt-24 px-6 text-white">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <GraduationCap className="mx-auto h-14 w-14 text-pink-400 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-400 tracking-wide">
            {studentDetails
              ? `Welcome, ${studentDetails.firstName}!`
              : "Student Dashboard"}
          </h1>
          <p className="text-gray-400 mt-2">
            Quick actions to manage your student activities
          </p>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/allTests")}
            className="bg-gray-800 hover:bg-gray-700 transition duration-300 shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center text-blue-300 font-bold text-lg hover:scale-105 transform"
          >
            <ListChecks className="h-10 w-10 text-green-400 mb-4" />
            View Tests
          </button>

          <button
            onClick={() => navigate("/allTests")}
            className="bg-gray-800 hover:bg-gray-700 transition duration-300 shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center text-blue-300 font-bold text-lg hover:scale-105 transform"
          >
            <FileText className="h-10 w-10 text-indigo-400 mb-4" />
            My Results
          </button>

          <button
            onClick={() => navigate("/allTests")}
            className="bg-gray-800 hover:bg-gray-700 transition duration-300 shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center text-blue-300 font-bold text-lg hover:scale-105 transform"
          >
            <UserCheck className="h-10 w-10 text-orange-400 mb-4" />
            Profile
          </button>
        </div>

        {/* Error Message */}
        <div className="mt-12 max-w-4xl mx-auto">
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
