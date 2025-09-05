import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const testServiceBaseURL = import.meta.env.VITE_TEST_SERVICE_BASE_URL;

export default function AttemptTest() {
  const location = useLocation();
  const navigate = useNavigate();

  const { questionsBySubject, title, date } = location.state || {};

  if (!questionsBySubject) {
    navigate("/");
    return null;
  }

  const subjects = Object.keys(questionsBySubject);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

  // Track current question index within selected subject
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Answers stored as { [questionId]: optionSelected }
  const [answers, setAnswers] = useState({});

  const questions = questionsBySubject[selectedSubject] || [];

  // Save API call for one question
  const saveAnswer = async (questionId, optionSelected) => {
    const token = localStorage.getItem("authToken");
    const titleEncoded = encodeURIComponent(title);
    const dateEncoded = encodeURIComponent(date);

    const payload = [
      {
        questionId,
        optionSelected,
      },
    ];

    try {
      const res = await fetch(
        `${testServiceBaseURL}/test/save?title=${titleEncoded}&date=${dateEncoded}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to save answer");
      }
    } catch (error) {
      alert(`Error saving answer: ${error.message}`);
    }
  };

  // Handle option selection
  const handleOptionSelect = (questionId, optionIndex) => {
    const optionSelected = String.fromCharCode(97 + optionIndex);

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionSelected,
    }));

    saveAnswer(questionId, optionSelected);
  };

  // Submit API call for all answers
  const submitTest = async () => {
    const token = localStorage.getItem("authToken");
    const titleEncoded = encodeURIComponent(title);
    const dateEncoded = encodeURIComponent(date);

    const payload = Object.entries(answers).map(([questionId, optionSelected]) => ({
      questionId: Number(questionId),
      optionSelected,
    }));

    if (payload.length === 0) {
      alert("No answers selected to submit!");
      return;
    }

    try {
      const res = await fetch(
        `${testServiceBaseURL}/test/submit?title=${titleEncoded}&date=${dateEncoded}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to submit test");
      }

      alert("Test submitted successfully!");
      navigate("/");
    } catch (error) {
      alert(`Error submitting test: ${error.message}`);
    }
  };

  // When user switches subject, reset current question index
  const onSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
  };

  // Current question object
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Attempt Test: {title} ({date})
          </h1>

          {/* Subject Tabs */}
          <div className="mb-6 flex space-x-4 overflow-x-auto justify-center">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => onSelectSubject(subject)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap ${
                  selectedSubject === subject
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Current Question */}
          {currentQuestion ? (
            <div className="flex flex-col items-center text-center p-6 bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">
                {currentQuestion.questionTitle}
              </h3>

              {currentQuestion.hasImage && currentQuestion.questionImageData && (
                <img
                  src={`data:${currentQuestion.questionImageType};base64,${currentQuestion.questionImageData}`}
                  alt="Question"
                  className="mb-6 max-w-full rounded"
                />
              )}

              <ul className="list-none space-y-3 w-full max-w-md">
                {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4].map(
                  (opt, i) => {
                    if (!opt) return null;

                    const optionLetter = String.fromCharCode(97 + i); // a,b,c,d
                    const isSelected = answers[currentQuestion.id] === optionLetter;

                    return (
                      <li
                        key={i}
                        className={`cursor-pointer rounded px-4 py-2 border ${
                          isSelected
                            ? "bg-indigo-500 border-indigo-400 text-white font-semibold"
                            : "border-gray-600 text-gray-300 hover:bg-gray-600"
                        }`}
                        onClick={() => handleOptionSelect(currentQuestion.id, i)}
                      >
                        <span className="mr-3 font-bold uppercase">{optionLetter}.</span> {opt}
                      </li>
                    );
                  }
                )}
              </ul>
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-6">No questions available.</p>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 max-w-md mx-auto w-full">
            <button
              onClick={() =>
                setCurrentQuestionIndex((idx) => Math.max(0, idx - 1))
              }
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                currentQuestionIndex === 0
                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              Previous
            </button>

            <button
              onClick={() =>
                setCurrentQuestionIndex((idx) =>
                  Math.min(questions.length - 1, idx + 1)
                )
              }
              disabled={currentQuestionIndex === questions.length - 1}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                currentQuestionIndex === questions.length - 1
                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              Next
            </button>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-10">
            <button
              onClick={submitTest}
              className="px-8 py-3 bg-green-600 rounded-lg font-bold hover:bg-green-700 transition"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
