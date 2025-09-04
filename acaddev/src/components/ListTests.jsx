import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
const testServiceBaseURL = import.meta.env.VITE_TEST_SERVICE_BASE_URL;

export default function ListTests() {
  const [tests, setTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get(testServiceBaseURL + "/test/getAll", {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => setTests(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tests.length / itemsPerPage);

  return (
    <>
    <Navbar />
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Tests</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm tracking-wider">
              <th className="py-3 px-6 border-b">Test ID</th>
              <th className="py-3 px-6 border-b">Title</th>
              <th className="py-3 px-6 border-b">Subject</th>
              <th className="py-3 px-6 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((test) => (
              <tr key={test.testId} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6 border-b">{test.testId}</td>
                <td className="py-3 px-6 border-b">{test.testTitle}</td>
                <td className="py-3 px-6 border-b">{test.subjectName}</td>
                <td className="py-3 px-6 border-b text-center">
                  <button
                    onClick={() => navigate(`/test/${test.testId}`)}
                    className="px-4 py-1 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {currentItems.length === 0 && (
              <tr>
                <td colSpan="4" className="py-3 px-6 text-center text-gray-500">
                  No tests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded-md ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
}
