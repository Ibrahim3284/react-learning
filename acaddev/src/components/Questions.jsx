import React, { useEffect, useState } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8081/question/getAllQuestions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, []);

  const handleOptionChange = (questionId, optionValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionValue,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading questions...</p>;
  }

  if (questions.length === 0) {
    return <p className="text-center mt-10">No questions available.</p>;
  }

  const q = questions[currentIndex];

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 py-10">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-xl p-8 relative">
        {/* Progress */}
        <p className="text-sm text-gray-400 mb-4 text-center">
          Question {currentIndex + 1} of {questions.length}
        </p>

        {/* Question Image */}
        {q.question && (
          <img
            src={`data:image/png;base64,${q.question}`}
            alt={`Question ${currentIndex + 1}`}
            className="w-full h-72 object-contain mb-6 rounded-lg border cursor-pointer bg-gray-700"
            onClick={() =>
              setSelectedImage(`data:image/png;base64,${q.question}`)
            }
          />
        )}

        {/* Options */}
        <div className="space-y-3">
          {[q.option1, q.option2, q.option3, q.option4].map((opt, i) => (
            <label
              key={i}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition border ${
                answers[q.id] === opt
                  ? "bg-blue-600 border-blue-400 text-white"
                  : "bg-gray-700 border-gray-600 hover:bg-gray-600"
              }`}
            >
              <input
                type="radio"
                name={`question-${q.id}`}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={() => handleOptionChange(q.id, opt)}
                className="mr-3 accent-blue-500"
              />
              {opt}
            </label>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              currentIndex === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              currentIndex === questions.length - 1
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative">
            <button
              className="absolute -top-6 -right-6 bg-white text-black rounded-full px-3 py-1 font-bold shadow-lg"
              onClick={() => setSelectedImage(null)}
            >
              ✖
            </button>
            <img
              src={selectedImage}
              alt="Enlarged Question"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
}
