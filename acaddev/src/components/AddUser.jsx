import { useState } from "react";
import axios from "axios";

export default function AddUser() {
  const [formData, setFormData] = useState({
    questionTitle: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    rightAnswer: "",
    difficultyLevel: "",
    category: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/question/add", formData);
      alert("Question added successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl border border-gray-100">
        
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-6">
          ➕ Add New Question
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="questionTitle"
            placeholder="Question Title"
            value={formData.questionTitle}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
            required
          />

          {[1, 2, 3, 4].map((num) => (
            <input
              key={num}
              type="text"
              name={`option${num}`}
              placeholder={`Option ${num}`}
              value={formData[`option${num}`]}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow-sm"
              required
            />
          ))}

          <input
            type="text"
            name="rightAnswer"
            placeholder="Right Answer"
            value={formData.rightAnswer}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm"
            required
          />

          <select
            name="difficultyLevel"
            value={formData.difficultyLevel}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
            required
          >
            <option value="">Select Difficulty Level</option>
            <option value="Easy">🟢 Easy</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Hard">🔴 Hard</option>
          </select>

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-400 focus:outline-none shadow-sm"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 rounded-xl shadow-md hover:scale-105 transform transition duration-300"
          >
            🚀 Submit Question
          </button>
        </form>
      </div>
    </div>
  );
}
