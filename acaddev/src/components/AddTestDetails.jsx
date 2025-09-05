import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const testServiceBaseURL = import.meta.env.VITE_TEST_SERVICE_BASE_URL;

function getTodayLocalDate() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now;
}

export default function AddTestDetails() {
  const today = getTodayLocalDate();

  const [formData, setFormData] = useState({
    title: "",
    date: today,
    startTime: today,
    duration: "",
    testWindow: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      Swal.fire("Unauthorized", "Please login first.", "error");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        date: formData.date.toISOString().split("T")[0],
        duration: parseInt(formData.duration),
        testWindow: parseInt(formData.testWindow),
        startTime: formData.startTime.toISOString(), // Keep full timestamp
      };

      const res = await axios.post(`${testServiceBaseURL}/testDetails/add`, payload, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      Swal.fire("✅ Test Details Added", res.data || "Test details added successfully.", "success");

      // Reset form
      setFormData({
        title: "",
        date: today,
        startTime: today,
        duration: "",
        testWindow: "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", err?.response?.data || "Something went wrong!", "error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-16">
        <div className="relative w-full max-w-3xl bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-pink-500 opacity-10 blur-3xl -z-10"></div>

          <div className="p-10">
            <h2 className="text-4xl font-extrabold text-center text-white mb-12">
              📝 Add Test Details
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Test Title"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />

              <DatePicker
                selected={formData.date}
                onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
                dateFormat="yyyy-MM-dd"
                placeholderText="Test Date"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
              />

              <DatePicker
                selected={formData.startTime}
                onChange={(date) => setFormData((prev) => ({ ...prev, startTime: date }))}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText="Start Time"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
              />

              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Duration (in minutes)"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="testWindow"
                value={formData.testWindow}
                onChange={handleChange}
                placeholder="Test Window (in minutes)"
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </form>

            <div className="mt-10 text-center">
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform"
              >
                ✅ Submit Test Details
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
