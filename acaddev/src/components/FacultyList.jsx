import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_BASE_URL;

export default function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(false);
  const [deleteFacultyId, setDeleteFacultyId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  const fetchFaculty = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        userServiceBaseURL + `/faculty/allFaculties?page_size=${pageSize}&page_no=${pageNo}`,
        {
          credentials: "include",
          headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setFaculty(data.content || []);
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
    fetchFaculty();
  }, [pageNo, pageSize]);

  const handlePrev = () => {
    if (!first) setPageNo(pageNo - 1);
  };

  const handleNext = () => {
    if (!last) setPageNo(pageNo + 1);
  };

  const handleEdit = (id) => {
    navigate(`/editFaculty/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteFacultyId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(userServiceBaseURL + `/faculty/${deleteFacultyId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Authorization": `${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete faculty");

      setShowDeleteModal(false);
      setDeleteFacultyId(null);
      fetchFaculty(); // refresh list
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen p-6 bg-gray-50">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          👨‍🏫 Faculty List
        </h1>

        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && faculty.length > 0 && (
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
                    "Qualification",
                    "Department",
                    "DOB",
                    "Joining Date",
                    "Gender",
                    "Active",
                    "LinkedIn",
                    "Actions",
                  ].map((header) => (
                    <th key={header} className="px-6 py-3 font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {faculty.map((f, i) => (
                  <tr
                    key={f.id}
                    className={`transition duration-200 ${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50`}
                  >
                    <td className="px-6 py-3">{f.id}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {f.firstName}
                    </td>
                    <td className="px-6 py-3">{f.lastName}</td>
                    <td className="px-6 py-3">{f.email}</td>
                    <td className="px-6 py-3">{f.phoneNo}</td>
                    <td className="px-6 py-3">{f.qualification}</td>
                    <td className="px-6 py-3">{f.department}</td>
                    <td className="px-6 py-3">{f.dateOfBirth}</td>
                    <td className="px-6 py-3">{f.dateOfJoining}</td>
                    <td className="px-6 py-3">{f.gender}</td>
                    <td className="px-6 py-3 text-center">
                      {f.active || f.isActive ? (
                        <span className="text-green-500 text-lg">✔</span>
                      ) : (
                        <span className="text-red-500 text-lg">✖</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <a
                        href={f.linkedInProfileURL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Profile
                      </a>
                    </td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => handleEdit(f.id)}
                        className="px-4 py-1.5 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition shadow-sm"
                      >
                        ✏ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(f.id)}
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
                Are you sure you want to delete this faculty? This action cannot be undone.
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
