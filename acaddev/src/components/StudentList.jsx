import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null); // id to delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(
        `http://localhost:8080/student/allStudents?page_size=${pageSize}&page_no=${pageNo}`,
        {
          credentials: "include",
          headers: {
            "Authorization": `${token}`, // add token to header
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setStudents(data.content || []);
      setTotalPages(data.totalPages || 0);
      setFirst(data.first);
      setLast(data.last);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [pageNo, pageSize]);

  const handlePrev = () => {
    if (!first) setPageNo(pageNo - 1);
  };

  const handleNext = () => {
    if (!last) setPageNo(pageNo + 1);
  };

  const handleEdit = (id) => {
    navigate(`/editStudent/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteStudentId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8080/student/${deleteStudentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete student");

      setShowDeleteModal(false);
      setDeleteStudentId(null);
      fetchStudents(); // refresh list
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen p-6 bg-gray-50">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          📚 Student List
        </h1>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && students.length > 0 && (
          <div className="overflow-x-auto shadow-xl rounded-2xl border border-gray-200 bg-white">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs uppercase sticky top-0 z-10">
                <tr>
                  {[
                    "ID",
                    "First Name",
                    "Last Name",
                    "Email",
                    "Phone",
                    "Gender",
                    "Section",
                    "Year",
                    "DOB",
                    "Enrollment",
                    "Active",
                    "Actions",
                  ].map((header) => (
                    <th key={header} className="px-6 py-3 font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`transition duration-200 ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50`}
                  >
                    <td className="px-6 py-3">{s.id}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {s.firstName}
                    </td>
                    <td className="px-6 py-3">{s.lastName}</td>
                    <td className="px-6 py-3">{s.email}</td>
                    <td className="px-6 py-3">{s.phoneNo}</td>
                    <td className="px-6 py-3">{s.gender}</td>
                    <td className="px-6 py-3">{s.section}</td>
                    <td className="px-6 py-3">{s.yearOfStudy}</td>
                    <td className="px-6 py-3">{s.dateOfBirth}</td>
                    <td className="px-6 py-3">{s.enrollmentDate}</td>
                    <td className="px-6 py-3 text-center">
                      {s.active || s.isActive ? (
                        <span className="text-green-500 text-lg">✔</span>
                      ) : (
                        <span className="text-red-500 text-lg">✖</span>
                      )}
                    </td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => handleEdit(s.id)}
                        className="px-4 py-1.5 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition shadow-sm"
                      >
                        ✏ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(s.id)}
                        className="px-4 py-1.5 rounded-full text-white bg-red-500 hover:bg-red-600 transition shadow-sm"
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePrev}
            disabled={first}
            className={`px-5 py-2 rounded-full font-medium shadow-md transition ${
              first
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            ◀ Previous
          </button>
          <span className="text-gray-700">
            Page <strong>{pageNo}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            onClick={handleNext}
            disabled={last}
            className={`px-5 py-2 rounded-full font-medium shadow-md transition ${
              last
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            Next ▶
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg text-center">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete this student? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
