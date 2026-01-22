import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_BASE_URL;

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(userServiceBaseURL + `/student/${id}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch student");
        const data = await response.json();
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(userServiceBaseURL + `/student/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        credentials: "include",
        body: JSON.stringify(student),
      });

      if (!response.ok) throw new Error("Failed to update student");

      Swal.fire({
        title: "✅ Student Updated",
        icon: "success",
        confirmButtonColor: "#16a34a",
      });

      navigate("/studentList");
    } catch (err) {
      Swal.fire({
        title: "❌ Error",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (loading)
    return <p className="text-center text-white mt-6">Loading student...</p>;
  if (error)
    return <p className="text-center text-red-400 mt-6">{error}</p>;
  if (!student) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-16">
        <div className="relative w-full max-w-4xl bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-purple-600 to-blue-500 opacity-10 blur-3xl -z-10"></div>

          <div className="p-10">
            <h2 className="text-4xl font-extrabold text-center text-white mb-12">
              ✏ Edit Student
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* ID (Read-only) */}
              <div>
                <label className="text-white font-medium">ID</label>
                <input
                  type="text"
                  name="id"
                  value={student.id}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-white font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={student.firstName || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-white font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={student.lastName || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-white font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={student.email || ""}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-white font-medium">Phone Number</label>
                <input
                  type="text"
                  name="phoneNo"
                  value={student.phoneNo || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-white font-medium">Gender</label>
                <select
                  name="gender"
                  value={student.gender || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="text-white font-medium">Section</label>
                <input
                  type="text"
                  name="section"
                  value={student.section || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-white font-medium">Year of Study</label>
                <input
                  type="number"
                  name="yearOfStudy"
                  value={student.yearOfStudy || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-white font-medium">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={student.dateOfBirth || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-white font-medium">Enrollment Date</label>
                <input
                  type="date"
                  name="enrollmentDate"
                  value={student.enrollmentDate || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="active"
                  checked={student.active || student.isActive || false}
                  onChange={(e) =>
                    setStudent((prev) => ({
                      ...prev,
                      active: e.target.checked,
                    }))
                  }
                  className="h-5 w-5 text-green-500"
                />
                <label className="text-white font-medium">Active</label>
              </div>
            </form>

            <div className="mt-10 text-center flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform"
              >
                💾 Update Student
              </button>
              <button
                onClick={() => navigate("/studentList")}
                className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
