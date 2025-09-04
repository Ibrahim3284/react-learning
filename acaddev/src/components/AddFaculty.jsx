import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

function todayLocalDate() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d;
}

export default function AddFaculty() {
  const today = todayLocalDate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    qualification: "",
    department: "",
    dateOfBirth: null,
    dateOfJoining: today,
    gender: "",
    isActive: true,
    linkedInProfileURL: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? formData.dateOfBirth.toISOString().split("T")[0]
          : null,
        dateOfJoining: formData.dateOfJoining
          ? formData.dateOfJoining.toISOString().split("T")[0]
          : null,
      };

      const token = localStorage.getItem("authToken");

      const res = await axios.post("http://localhost:8080/faculty/add", payload, {
        headers: {
          Authorization: token ? `${token}` : "",
        },
        withCredentials: true,
      });

      Swal.fire({
        title: "✅ Faculty Added",
        text: res.data || "Faculty registered successfully.",
        icon: "success",
        confirmButtonColor: "#16a34a",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        qualification: "",
        department: "",
        dateOfBirth: null,
        dateOfJoining: today,
        gender: "",
        isActive: true,
        linkedInProfileURL: "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "❌ Error",
        text: err?.response?.data || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-16">
        <div className="relative w-full max-w-4xl bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-purple-600 to-blue-500 opacity-10 blur-3xl -z-10"></div>

          <div className="p-10">
            <h2 className="text-4xl font-extrabold text-center text-white mb-12">
              👨‍🏫 Faculty Registration
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Qualification"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500"
              />

              <DatePicker
                selected={formData.dateOfBirth}
                onChange={(date) => setFormData((prev) => ({ ...prev, dateOfBirth: date }))}
                dateFormat="yyyy-MM-dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={today}
                placeholderText="Date of Birth"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
              />

              <DatePicker
                selected={formData.dateOfJoining}
                onChange={(date) => setFormData((prev) => ({ ...prev, dateOfJoining: date }))}
                dateFormat="yyyy-MM-dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                placeholderText="Date of Joining"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              <input
                type="url"
                name="linkedInProfileURL"
                value={formData.linkedInProfileURL}
                onChange={handleChange}
                placeholder="LinkedIn Profile URL"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-5 w-5 text-pink-500"
                />
                <label className="text-white">Active</label>
              </div>
            </form>

            <div className="mt-10 text-center">
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform"
              >
                ✅ Submit Faculty
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
