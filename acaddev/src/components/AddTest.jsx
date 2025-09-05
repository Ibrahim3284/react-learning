import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Upload, Image as ImageIcon, PlusCircle, Trash2 } from "lucide-react";

const testServiceBaseURL = import.meta.env.VITE_TEST_SERVICE_BASE_URL;

export default function AddTest() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [testWindow, setTestWindow] = useState("");
  const [questions, setQuestions] = useState([
    {
      questionTitle: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      rightOption: "",
      category: "",
      difficulty: "",
      hasImage: false,
    },
  ]);
  const [images, setImages] = useState([null]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionTitle: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        rightOption: "",
        category: "",
        difficulty: "",
        hasImage: false,
      },
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

    const updatedQuestions = [...questions];
    updatedQuestions[index].hasImage = !!file;
    setImages(updatedImages);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionTitle && !images[i]) {
        Swal.fire({
          title: "⚠ Validation Error",
          text: `Question ${i + 1} must have either a title or an image.`,
          icon: "warning",
          confirmButtonColor: "#f59e0b",
        });
        return;
      }
    }

    try {
      const formattedDate = startTime.split("T")[0]; // yyyy-MM-dd
      const authToken = localStorage.getItem("authToken");

      const formattedQuestions = questions.map((q, index) => ({
        questionTitle: q.questionTitle,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4,
        rightOption: q.rightOption,
        category: q.category,
        difficultyLevel: q.difficulty,
        hasImage: !!images[index],
      }));

      const formData = new FormData();
      formData.append(
        "questions",
        new Blob([JSON.stringify(formattedQuestions)], {
          type: "application/json",
        })
      );

      images.forEach((file) => {
        if (file) formData.append("images", file);
      });

      await axios.post(
        `${testServiceBaseURL}/test/add?title=${encodeURIComponent(
          title
        )}&date=${encodeURIComponent(formattedDate)}&subject=${encodeURIComponent(
          subject
        )}`,
        formData,
        {
          headers: {
            Authorization: authToken || "",
            "Content-Type": "multipart/form-data",
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

      // Reset form
      setTitle("");
      setSubject("");
      setStartTime("");
      setDuration("");
      setTestWindow("");
      setQuestions([
        {
          questionTitle: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          rightOption: "",
          category: "",
          difficulty: "",
          hasImage: false,
        },
      ]);
      setImages([null]);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-12">
        <div className="relative w-full max-w-5xl bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 opacity-10 blur-3xl -z-10"></div>

          <div className="p-10">
            <h2 className="text-4xl font-extrabold text-center text-white mb-12">
              ✨ Create a New Test
            </h2>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Test Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Test Title"
                  required
                  className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  required
                  className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                />
              </div>

              {/* Date Only */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <input
                  type="date"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white"
                />
              </div>

              {/* Questions */}
              {questions.map((q, i) => (
                <div
                  key={i}
                  className="relative border border-gray-600 rounded-2xl p-6 bg-gray-700 shadow-md"
                >
                  <span className="absolute -top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full shadow">
                    Q{i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(i)}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={20} />
                  </button>

                  <input
                    type="text"
                    placeholder="Question Title"
                    value={q.questionTitle}
                    onChange={(e) =>
                      handleQuestionChange(i, "questionTitle", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {["option1", "option2", "option3", "option4"].map(
                      (opt, idx) => (
                        <input
                          key={idx}
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          value={q[opt]}
                          onChange={(e) =>
                            handleQuestionChange(i, opt, e.target.value)
                          }
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                        />
                      )
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Correct Answer (e.g., option3)"
                    value={q.rightOption}
                    onChange={(e) =>
                      handleQuestionChange(i, "rightOption", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 mb-4"
                  />

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Category"
                      value={q.category}
                      onChange={(e) =>
                        handleQuestionChange(i, "category", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Difficulty"
                      value={q.difficulty}
                      onChange={(e) =>
                        handleQuestionChange(i, "difficulty", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-gray-500 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-600 transition">
                    <label className="cursor-pointer flex flex-col items-center">
                      <Upload className="text-pink-500 mb-2" size={24} />
                      <span className="text-sm text-gray-300">
                        {images[i] ? "Change Image" : "Upload Image"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(i, e.target.files[0] || null)
                        }
                        accept="image/*"
                      />
                    </label>

                    {images[i] && (
                      <div className="mt-3 flex items-center justify-center gap-3">
                        <ImageIcon className="text-gray-400" size={20} />
                        <span className="text-sm text-gray-300 truncate max-w-xs">
                          {images[i].name}
                        </span>
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

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-10">
                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:scale-105 transition-transform"
                >
                  <PlusCircle size={18} /> Add Question
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform"
                >
                  ✅ Submit Test
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
