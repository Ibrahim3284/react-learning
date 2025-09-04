import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_BASE_URL;

export default function EditFaculty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(userServiceBaseURL + `/faculty/${id}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch faculty");
        const data = await response.json();
        setFaculty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFaculty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFaculty((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(userServiceBaseURL + `/faculty/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        credentials: "include",
        body: JSON.stringify(faculty),
      });

      if (!response.ok) throw new Error("Failed to update faculty");

      alert("✅ Faculty updated successfully!");
      navigate("/facultyList");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading faculty...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;
  if (!faculty) return null;

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Faculty</h1>
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
              value={faculty.id}
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
              value={faculty.firstName || ""}
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
              value={faculty.lastName || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={faculty.email || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold">Phone No</label>
            <input
              type="text"
              name="phoneNo"
              value={faculty.phoneNo || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Qualification */}
          <div>
            <label className="block font-semibold">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={faculty.qualification || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block font-semibold">Department</label>
            <input
              type="text"
              name="department"
              value={faculty.department || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block font-semibold">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={faculty.dateOfBirth || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* DOJ */}
          <div>
            <label className="block font-semibold">Date of Joining</label>
            <input
              type="date"
              name="dateOfJoining"
              value={faculty.dateOfJoining || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block font-semibold">Gender</label>
            <select
              name="gender"
              value={faculty.gender || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block font-semibold">LinkedIn Profile URL</label>
            <input
              type="url"
              name="linkedInProfileURL"
              value={faculty.linkedInProfileURL || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Active */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isActive"
              checked={faculty.isActive || false}
              onChange={(e) =>
                setFaculty((prev) => ({
                  ...prev,
                  isActive: e.target.checked,
                }))
              }
            />
            <label className="font-semibold">Active</label>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate("/facultyList")}
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
