import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

function todayLocalDate() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d;
}

export default function AddStudent() {
  const today = todayLocalDate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    yearOfStudy: "",
    dateOfBirth: null,
    gender: "",
    section: "",
    isActive: true,
    enrollmentDate: today,
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = {
        ...formData,
        yearOfStudy: Number(formData.yearOfStudy || 0),
        dateOfBirth: formData.dateOfBirth
          ? formData.dateOfBirth.toISOString().split("T")[0]
          : null,
        enrollmentDate: formData.enrollmentDate
          ? formData.enrollmentDate.toISOString().split("T")[0]
          : null,
      };
      const res = await axios.post("http://localhost:8080/student/add", payload);
      setMessage(res.data || "Student added successfully!");
      setIsError(false);
    } catch (err) {
      setMessage(err?.response?.data || "Something went wrong!");
      setIsError(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 pt-24 pb-16 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-4xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-red-600 mb-8 tracking-wide drop-shadow-md">
            Student Registration
          </h1>

          {message && (
            <div
              className={`flex items-center gap-2 mb-6 p-4 rounded-lg shadow-md border ${
                isError
                  ? "bg-red-100 text-red-700 border-red-300"
                  : "bg-green-100 text-green-700 border-green-300"
              }`}
            >
              {isError ? <FiAlertCircle className="text-red-500 text-xl" /> : <FiCheckCircle className="text-green-500 text-xl" />}
              <span className="font-medium">{message}</span>
            </div>
          )}

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
                required
              />
            </div>

            {/* Phone No */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
            </div>

            {/* Year of Study */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Year of Study</label>
              <input
                type="number"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
              <DatePicker
                selected={formData.dateOfBirth}
                onChange={(date) => setFormData(prev => ({ ...prev, dateOfBirth: date }))}
                dateFormat="yyyy-MM-dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={today}
                placeholderText="Select Date of Birth"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Section</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
            </div>

            {/* Active */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-5 w-5 text-red-600 focus:ring-red-400"
              />
              <label className="text-gray-700 font-medium">Active</label>
            </div>

            {/* Enrollment Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Enrollment Date</label>
              <DatePicker
                selected={formData.enrollmentDate}
                onChange={(date) => setFormData(prev => ({ ...prev, enrollmentDate: date }))}
                dateFormat="yyyy-MM-dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Defaults to today.</p>
            </div>

            {/* Submit */}
            <div className="col-span-2 mt-4">
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 shadow-lg hover:shadow-xl"
              >
                Submit Student
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
