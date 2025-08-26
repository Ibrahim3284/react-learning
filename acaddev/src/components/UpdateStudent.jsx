import React, { useState, useEffect } from "react";

export default function UpdateStudent({ studentId }) {
  const [student, setStudent] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    yearOfStudy: "",
    dateOfBirth: "",
    gender: "",
    section: "",
    isActive: true,
    enrollmentDate: "",
  });

  // Fetch existing student details by ID
  useEffect(() => {
    if (studentId) {
      fetch(`http://localhost:8080/student/${studentId}`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setStudent(data))
        .catch((err) => console.error("Error fetching student:", err));
    }
  }, [studentId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit update request
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8080/student/update/${student.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(student),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update student");
        return res.json();
      })
      .then((data) => {
        alert("Student updated successfully!");
        console.log("Updated Student:", data);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Update Student
        </h2>

        {/* ID Field (readonly) */}
        <div className="mb-4">
          <label className="block font-medium mb-1">ID</label>
          <input
            type="text"
            name="id"
            value={student.id}
            readOnly
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Grid for fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={student.firstName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={student.lastName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={student.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Phone No</label>
            <input
              type="text"
              name="phoneNo"
              value={student.phoneNo}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Year of Study</label>
            <input
              type="number"
              name="yearOfStudy"
              value={student.yearOfStudy}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={student.dateOfBirth}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={student.gender}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Section</label>
            <input
              type="text"
              name="section"
              value={student.section}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Enrollment Date</label>
            <input
              type="date"
              name="enrollmentDate"
              value={student.enrollmentDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              name="isActive"
              checked={student.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="font-medium">Active</label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Update Student
        </button>
      </form>
    </div>
  );
}
