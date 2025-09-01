import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // npm install sweetalert2
import "sweetalert2/dist/sweetalert2.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Upload, Image as ImageIcon } from "lucide-react";

export default function AddTest() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState(""); // datetime-local field
  const [duration, setDuration] = useState("");   // minutes
  const [questions, setQuestions] = useState([
    { option1: "", option2: "", option3: "", option4: "", rightOption: "", category: "", difficulty: "" },
  ]);
  const [images, setImages] = useState([]);

  // 🔹 Helper: format datetime-local -> yyyy-MM-dd HH:mm:ss.SSS
  // 🔹 Fix: Properly parse datetime-local string
  const formatDateTime = (dateTimeValue) => {
    if (!dateTimeValue) return "";
    // Example input: "2025-09-01T20:30"
    const [datePart, timePart] = dateTimeValue.split("T");
    if (!datePart || !timePart) return "";

    // Add seconds + milliseconds if missing
    return `${datePart} ${timePart}:00.000`;
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { option1: "", option2: "", option3: "", option4: "", rightOption: "", category: "", difficulty: "" },
    ]);
    setImages([...images, null]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    const updatedImages = images.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    setImages(updatedImages);
  };

  const handleImageUpload = (index, file) => {
    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append(
        "questionList",
        new Blob([JSON.stringify(questions)], { type: "application/json" })
      );
  
      images.forEach((file) => {
        if (file) formData.append("imageFiles", file);
      });
  
      // 🔹 Format start_time before sending
      const formattedStartTime = formatDateTime(startTime);
  
      // 🔹 Get authToken from localStorage
      const authToken = localStorage.getItem("authToken");
  
      const response = await axios.post(
        `http://localhost:8081/test/add?title=${encodeURIComponent(title)}&subject=${encodeURIComponent(subject)}&start_time=${encodeURIComponent(formattedStartTime)}&duration=${encodeURIComponent(duration)}`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: authToken ? authToken : ""  // 🔹 Add token if available
          },
          withCredentials: true,
        }
      );
  
      Swal.fire({
        title: "✅ Test Added!",
        text: "Your test has been successfully created.",
        icon: "success",
        confirmButtonColor: "#16a34a",
        confirmButtonText: "Awesome 🚀",
      });
  
      console.log("✅ Success:", response.data);
    } catch (error) {
      console.error("❌ Error:", error);
      Swal.fire({
        title: "❌ Error",
        text: "Something went wrong while adding the test.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-5xl transform transition-all duration-500 hover:shadow-3xl">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center tracking-tight">
            ➕ Create a New Test
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title & Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Test Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-3 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border p-3 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>

            {/* Start Time & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border p-3 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                required
              />
              <input
                type="number"
                placeholder="Duration (in minutes)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="border p-3 rounded-xl w-full shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                required
              />
            </div>

            {/* Questions */}
            {questions.map((q, i) => (
              <div
                key={i}
                className="border rounded-2xl p-6 space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 relative shadow-md hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg text-gray-700">📘 Question {i + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(i)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
                >
                  ✖
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Option 1" value={q.option1} onChange={(e) => handleQuestionChange(i, "option1", e.target.value)} className="border p-2 rounded-lg focus:ring focus:ring-blue-300" />
                  <input type="text" placeholder="Option 2" value={q.option2} onChange={(e) => handleQuestionChange(i, "option2", e.target.value)} className="border p-2 rounded-lg focus:ring focus:ring-blue-300" />
                  <input type="text" placeholder="Option 3" value={q.option3} onChange={(e) => handleQuestionChange(i, "option3", e.target.value)} className="border p-2 rounded-lg focus:ring focus:ring-blue-300" />
                  <input type="text" placeholder="Option 4" value={q.option4} onChange={(e) => handleQuestionChange(i, "option4", e.target.value)} className="border p-2 rounded-lg focus:ring focus:ring-blue-300" />
                </div>

                <input type="text" placeholder="Right Option" value={q.rightOption} onChange={(e) => handleQuestionChange(i, "rightOption", e.target.value)} className="border p-2 rounded-lg w-full focus:ring focus:ring-green-300" />

                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Category" value={q.category} onChange={(e) => handleQuestionChange(i, "category", e.target.value)} className="border p-2 rounded-lg focus:ring focus:ring-purple-300" />
                  <input type="text" placeholder="Difficulty" value={q.difficulty} onChange={(e) => handleQuestionChange(i, "difficulty", e.target.value)} className="border p-2 rounded-lg focus:ring focus:ring-purple-300" />
                </div>

                {/* Modern Upload Button */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">📷 Upload Image</label>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
                    <Upload size={18} />
                    <span>Choose File</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleImageUpload(i, e.target.files[0])}
                      accept="image/*"
                    />
                  </label>

                  {/* Preview */}
                  {images[i] && (
                    <div className="mt-3 flex items-center gap-3">
                      <ImageIcon className="text-gray-500" size={20} />
                      <span className="text-sm text-gray-600 truncate max-w-xs">{images[i].name}</span>
                      <img
                        src={URL.createObjectURL(images[i])}
                        alt="preview"
                        className="h-16 w-16 object-cover rounded-lg shadow"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Buttons */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={addQuestion}
                className="bg-blue-500 text-white px-5 py-2 rounded-xl shadow-md hover:bg-blue-600 active:scale-95 transition"
              >
                ➕ Add Question
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-xl shadow-md hover:bg-green-700 active:scale-95 transition font-semibold"
              >
                ✅ Submit Test
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
