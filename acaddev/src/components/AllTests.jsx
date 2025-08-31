import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AllTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:8081/test/getAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch tests");

        const data = await res.json();
        setTests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // ✅ Attempt API handler
  const handleAttempt = async (testId) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:8081/test/attempt/${testId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to attempt test");
      }

      const data = await res.json();
      // ✅ Navigate with testId and response data
      navigate(`/attempt/${testId}`, { state: { questions: data } });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <div className="p-6 text-center text-lg">Loading...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">
            📚 Available Tests
          </h1>

          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-md">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Test ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">View</th>
                  <th className="px-6 py-4">Attempt</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test, index) => (
                  <tr
                    key={test.testId}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50 transition duration-200`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">{test.testId}</td>
                    <td className="px-6 py-4 text-gray-700">{test.testTitle}</td>
                    <td className="px-6 py-4 text-gray-600">{test.subjectName}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/testPage/${test.testId}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleAttempt(test.testId)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                      >
                        Attempt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
