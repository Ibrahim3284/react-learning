import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom"; // 👈 Add this

const testServiceBaseURL = import.meta.env.VITE_TEST_SERVICE_BASE_URL;

export default function ListTestDetails() {
  const [testDetails, setTestDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 Add this

  const fetchTestDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const response = await fetch(`${testServiceBaseURL}/testDetails/getAll`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch. Status: ${response.status}`);
      }

      const data = await response.json();
      setTestDetails(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestDetails();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-16">
        <div className="relative w-full max-w-7xl bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-pink-500 opacity-10 blur-3xl -z-10" />

          <div className="p-10">
            <h2 className="text-4xl font-extrabold text-center text-white mb-12">
              📋 Test Details List
            </h2>

            {loading && <p className="text-center text-white">Loading test details...</p>}
            {error && (
              <p className="text-center text-red-400 font-semibold">Error: {error}</p>
            )}

            {!loading && testDetails.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-gray-600 shadow-md">
                <table className="min-w-full text-sm text-left text-white bg-gray-800">
                  <thead className="bg-gray-700 text-xs uppercase">
                    <tr>
                      {[
                        "ID",
                        "Title",
                        "Date",
                        "Start Time",
                        "Duration (min)",
                        "Test Window (min)",
                        "Actions",
                      ].map((header) => (
                        <th key={header} className="px-6 py-3 font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {testDetails.map((test, i) => (
                      <tr
                        key={test.id}
                        className={`${
                          i % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                        } hover:bg-gray-700 transition`}
                      >
                        <td className="px-6 py-3">{test.id}</td>
                        <td className="px-6 py-3">{test.title}</td>
                        <td className="px-6 py-3">
                          {test.date?.split("T")[0] || "N/A"}
                        </td>
                        <td className="px-6 py-3">
                          {new Date(test.startTime).toLocaleString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-3">{test.duration}</td>
                        <td className="px-6 py-3">{test.testWindow}</td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() =>
                              navigate(
                                `/viewQuestions?title=${encodeURIComponent(
                                  test.title
                                )}&date=${encodeURIComponent(
                                  test.date?.split("T")[0]
                                )}`
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && testDetails.length === 0 && !error && (
              <p className="text-center text-gray-400 mt-6">No test details found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
