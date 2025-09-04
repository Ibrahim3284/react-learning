import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AttemptTest() {
  const { id } = useParams(); // test id
  const location = useLocation();
  const { questions } = location.state || { questions: [] };

  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSelect = async (questionId, option) => {
    const updatedAnswers = [
      ...answers.filter((ans) => ans.questionId !== questionId),
      { questionId, optionSelected: option },
    ];
    setAnswers(updatedAnswers);

    const token = localStorage.getItem("authToken");
    try {
      await fetch(`http://localhost:8081/test/save/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(updatedAnswers),
      });
      console.log("Answers saved:", updatedAnswers);
    } catch (error) {
      console.error("Error saving answers:", error);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:8081/test/submit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error(`Submit failed with status ${response.status}`);
      }

      console.log("Test submitted successfully!");
      alert("✅ Test submitted successfully!");
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("❌ Failed to submit test. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

  const currentQuestion = questions[currentIndex];

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-12">
        <div className="relative w-full max-w-4xl bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Gradient Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 opacity-10 blur-3xl -z-10"></div>

          <div className="p-10">
            <h1 className="text-3xl font-extrabold text-center text-white mb-10">
              📝 Attempt Test (ID: {id})
            </h1>

            {questions.length === 0 ? (
              <p className="text-gray-400 text-center">
                No questions received.
              </p>
            ) : (
              <>
                <div className="border border-gray-600 rounded-2xl p-6 bg-gray-700 shadow-md">
                  <h2 className="text-lg font-semibold text-purple-300 mb-4">
                    Question {currentIndex + 1} of {questions.length}
                  </h2>

                  {/* Question Title */}
                  {currentQuestion?.questionTitle && (
                    <p className="text-gray-100 text-base font-medium mb-4">
                      {currentQuestion.questionTitle}
                    </p>
                  )}

                  {/* Question Image */}
                  {(currentQuestion?.questionImageData ||
                    currentQuestion?.question) && (
                    <img
                      src={
                        currentQuestion?.questionImageData
                          ? `data:${
                              currentQuestion?.questionImageType || "image/png"
                            };base64,${currentQuestion.questionImageData}`
                          : `data:image/png;base64,${currentQuestion.question}`
                      }
                      alt="Question"
                      className="w-full max-h-[400px] object-contain rounded-lg border border-gray-600 mb-4 shadow"
                    />
                  )}

                  {/* Options */}
                  <div className="space-y-3">
                    {["option1", "option2", "option3", "option4"].map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center space-x-3 p-3 bg-gray-800 border border-gray-600 rounded-xl shadow hover:bg-gray-600 cursor-pointer transition"
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={currentQuestion[opt]}
                          checked={
                            answers.find(
                              (a) => a.questionId === currentQuestion.id
                            )?.optionSelected === currentQuestion[opt]
                          }
                          onChange={() =>
                            handleSelect(currentQuestion.id, currentQuestion[opt])
                          }
                          className="h-4 w-4 text-pink-500 focus:ring-pink-500"
                        />
                        <span className="text-gray-200">
                          {currentQuestion[opt]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-6 py-3 bg-gray-600 text-white rounded-xl shadow-md hover:bg-gray-500 disabled:opacity-50 transition"
                  >
                    ⬅ Previous
                  </button>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:scale-105 transition-transform"
                    >
                      Next ➡
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "✅ Submit Test"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
