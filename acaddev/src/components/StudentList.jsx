import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_BASE_URL;

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(false);

  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        userServiceBaseURL + `/student/allStudents?page_size=${pageSize}&page_no=${pageNo}`,
        {
          credentials: "include",
          headers: {
            Authorization: `${token}`,
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
    if (!first) setPageNo((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!last) setPageNo((prev) => prev + 1);
  };

  const handleEdit = (id) => {
    navigate(`/editStudent/${id}`);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(userServiceBaseURL + `/student/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) throw new Error("Failed to delete student");

          Swal.fire({
            title: "Deleted!",
            text: "Student has been deleted.",
            icon: "success",
            confirmButtonColor: "#16a34a",
          });

          fetchStudents();
        } catch (err) {
          Swal.fire({
            title: "Error!",
            text: err.message,
            icon: "error",
            confirmButtonColor: "#dc2626",
          });
        }
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-16">
        <div className="relative w-full max-w-7xl bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-purple-600 to-blue-500 opacity-10 blur-3xl -z-10" />

          <div className="p-10">
            <h2 className="text-4xl font-extrabold text-center text-white mb-12">
              📚 Student List
            </h2>

            {loading && <p className="text-center text-white">Loading...</p>}
            {error && (
              <p className="text-center text-red-400 font-semibold">{error}</p>
            )}

            {!loading && students.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-gray-600 shadow-md">
                <table className="min-w-full text-sm text-left text-white bg-gray-800">
                  <thead className="bg-gray-700 text-xs uppercase">
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
                        className={`${
                          i % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                        } hover:bg-gray-700 transition`}
                      >
                        <td className="px-6 py-3">{s.id}</td>
                        <td className="px-6 py-3">{s.firstName}</td>
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
                            <span className="text-green-400">✔</span>
                          ) : (
                            <span className="text-red-400">✖</span>
                          )}
                        </td>
                        <td className="px-6 py-3 space-x-2">
                          <button
                            onClick={() => handleEdit(s.id)}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition shadow-sm"
                          >
                            ✏ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition shadow-sm"
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
            <div className="flex justify-center items-center mt-8 space-x-6">
              <button
                onClick={handlePrev}
                disabled={first}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  first
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-pink-500 text-white hover:bg-pink-600"
                }`}
              >
                ◀ Previous
              </button>
              <span className="text-white">
                Page <strong>{pageNo}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                onClick={handleNext}
                disabled={last}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  last
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-pink-500 text-white hover:bg-pink-600"
                }`}
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
