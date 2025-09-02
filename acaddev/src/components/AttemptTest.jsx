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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            📝 Attempt Test (ID: {id})
          </h1>

          {questions.length === 0 ? (
            <p className="text-gray-600">No questions received.</p>
          ) : (
            <>
              <div className="border border-gray-200 rounded-xl shadow-sm p-6 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Question {currentIndex + 1} of {questions.length}
                </h2>

                {/* Show question title if available */}
                {currentQuestion?.questionTitle && (
                  <p className="text-gray-900 text-base font-medium mb-4">
                    {currentQuestion.questionTitle}
                  </p>
                )}

                {/* Show question image (supports multiple formats) */}
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
                    className="w-full max-h-[400px] object-contain rounded-md border mb-4"
                  />
                )}

                <div className="space-y-3">
                  {["option1", "option2", "option3", "option4"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={currentQuestion[opt]}
                        checked={
                          answers.find((a) => a.questionId === currentQuestion.id)
                            ?.optionSelected === currentQuestion[opt]
                        }
                        onChange={() =>
                          handleSelect(currentQuestion.id, currentQuestion[opt])
                        }
                        className="h-4 w-4 text-indigo-600"
                      />
                      <span className="text-gray-700">{currentQuestion[opt]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow hover:bg-gray-400 disabled:opacity-50"
                >
                  ⬅ Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                  >
                    Next ➡
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Test"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
