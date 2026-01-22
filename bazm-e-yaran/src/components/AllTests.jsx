import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useNavigate } from "react-router-dom";

const testServiceBaseURL = import.meta.env.VITE_TEST_SERVICE_BASE_URL;

export default function AllTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTests = async () => {
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
        throw new Error(`Failed to fetch tests. Status: ${response.status}`);
      }

      const data = await response.json();
      setTests(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Attempt test API call + navigation
  const handleAttempt = async (test) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const titleEncoded = encodeURIComponent(test.title);
      const date = test.date?.split("T")[0];
      const dateEncoded = encodeURIComponent(date);

      const res = await fetch(
        `${testServiceBaseURL}/test/attempt?title=${titleEncoded}&date=${dateEncoded}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to attempt test");
      }

      const data = await res.json();

      // Navigate passing data in state
      navigate("/attemptTest", {
        state: { questionsBySubject: data, title: test.title, date },
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-16">
        <div className="relative w-full max-w-7xl bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-pink-500 opacity-10 blur-3xl -z-10" />

          <div className="p-10">
            <h2 className="text-4xl font-extrabold text-center text-white mb-12">
              📚 Available Tests
            </h2>

            {loading && (
              <p className="text-center text-white text-lg">Loading tests...</p>
            )}

            {error && (
              <p className="text-center text-red-400 font-semibold">{error}</p>
            )}

            {!loading && !error && tests.length === 0 && (
              <p className="text-center text-gray-400 mt-6">No tests found.</p>
            )}

            {!loading && !error && tests.length > 0 && (
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
                        "Attempt",
                      ].map((header) => (
                        <th key={header} className="px-6 py-3 font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tests.map((test, i) => (
                      <tr
                        key={test.id}
                        className={`${
                          i % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                        } hover:bg-gray-700 transition cursor-pointer`}
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
                            onClick={() => handleAttempt(test)}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-5 rounded-lg font-semibold shadow"
                          >
                            Attempt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
