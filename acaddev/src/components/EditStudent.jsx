import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:8080/student/${id}`, {
          credentials: "include",
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
      const response = await fetch(`http://localhost:8080/student/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(student),
      });

      if (!response.ok) throw new Error("Failed to update student");

      alert("✅ Student updated successfully!");
      navigate("/studentList");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading student...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (!student) return null;

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Student</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl space-y-4"
        >
          {/* ID (Read-only) */}
          <div>
            <label className="block font-semibold">ID</label>
            <input
              type="text"
              name="id"
              value={student.id}
              readOnly
              className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block font-semibold">First Name</label>
            <input
              type="text"
              name="firstName"
              value={student.firstName || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block font-semibold">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={student.lastName || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={student.email || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold">Phone</label>
            <input
              type="text"
              name="phoneNo"
              value={student.phoneNo || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block font-semibold">Gender</label>
            <select
              name="gender"
              value={student.gender || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="block font-semibold">Section</label>
            <input
              type="text"
              name="section"
              value={student.section || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block font-semibold">Year of Study</label>
            <input
              type="number"
              name="yearOfStudy"
              value={student.yearOfStudy || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block font-semibold">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={student.dateOfBirth || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Enrollment Date */}
          <div>
            <label className="block font-semibold">Enrollment Date</label>
            <input
              type="date"
              name="enrollmentDate"
              value={student.enrollmentDate || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Active */}
          <div className="flex items-center space-x-2">
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
            />
            <label className="font-semibold">Active</label>
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate("/studentList")}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
