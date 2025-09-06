import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const testServiceBaseURL = import.meta.env.VITE_TEST_SERVICE_BASE_URL;

export default function AttemptTest() {
  const location = useLocation();
  const navigate = useNavigate();

  const { questionsBySubject, title, date } = location.state || {};

  // Redirect if no data
  useEffect(() => {
    if (!questionsBySubject) {
      navigate("/");
    }
  }, [questionsBySubject, navigate]);

  if (!questionsBySubject) return null;

  const subjects = Object.keys(questionsBySubject);
  const savedSubject = localStorage.getItem("attemptTest_selectedSubject");
  const initialSubject =
    savedSubject && subjects.includes(savedSubject) ? savedSubject : subjects[0];
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);

  const getSavedIndex = (subject) => {
    const saved = localStorage.getItem(`attemptTest_currentQuestionIndex_${subject}`);
    const parsed = parseInt(saved, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed < (questionsBySubject[subject]?.length || 0)) {
      return parsed;
    }
    return 0;
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    getSavedIndex(initialSubject)
  );

  const savedAnswers = localStorage.getItem("attemptTest_answers");
  const [answers, setAnswers] = useState(savedAnswers ? JSON.parse(savedAnswers) : {});

  // Update current question index when subject changes
  useEffect(() => {
    const index = getSavedIndex(selectedSubject);
    setCurrentQuestionIndex(index);
    localStorage.setItem("attemptTest_selectedSubject", selectedSubject);
  }, [selectedSubject]);

  // Save question index per subject
  useEffect(() => {
    if (selectedSubject) {
      localStorage.setItem(
        `attemptTest_currentQuestionIndex_${selectedSubject}`,
        currentQuestionIndex.toString()
      );
    }
  }, [currentQuestionIndex, selectedSubject]);

  // Save answers in local storage
  useEffect(() => {
    localStorage.setItem("attemptTest_answers", JSON.stringify(answers));
  }, [answers]);

  // Fetch saved responses on mount
  useEffect(() => {
    const fetchSavedResponses = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const titleEncoded = encodeURIComponent(title);
      const dateEncoded = encodeURIComponent(date);

      try {
        const res = await fetch(
          `${testServiceBaseURL}/test/responses?title=${titleEncoded}&date=${dateEncoded}`,
          {
            method: "GET",
            headers: {
              Authorization: token,
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = {};
          for (const { questionId, optionSelected } of data) {
            if (questionId && optionSelected) {
              formatted[questionId] = optionSelected.toLowerCase();
            }
          }

          setAnswers((prev) => {
            const merged = { ...prev, ...formatted };
            localStorage.setItem("attemptTest_answers", JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.error("Error fetching saved responses:", err);
      }
    };

    fetchSavedResponses();
  }, [title, date]);

  const saveAnswer = async (questionId, optionSelected) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const titleEncoded = encodeURIComponent(title);
    const dateEncoded = encodeURIComponent(date);

    const updatedAnswers = {
      ...answers,
      [questionId]: optionSelected,
    };

    const payload = Object.entries(updatedAnswers).map(([id, option]) => ({
      questionId: Number(id),
      optionSelected: option,
    }));

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

      setAnswers(updatedAnswers);
    } catch (error) {
      Swal.fire("Error", `Error saving answer: ${error.message}`, "error");
    }
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    const optionSelected = String.fromCharCode(97 + optionIndex); // a, b, c, d
    saveAnswer(questionId, optionSelected);
  };

  const submitTest = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      Swal.fire("Unauthorized", "You must be logged in to submit the test.", "error");
      return;
    }

    const titleEncoded = encodeURIComponent(title);
    const dateEncoded = encodeURIComponent(date);

    const payload = Object.entries(answers).map(([questionId, optionSelected]) => ({
      questionId: Number(questionId),
      optionSelected,
    }));

    if (payload.length === 0) {
      Swal.fire("No Answers", "No answers selected to submit!", "warning");
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

      await Swal.fire("Success", "Test submitted successfully!", "success");

      // Cleanup localStorage
      localStorage.removeItem("attemptTest_answers");
      subjects.forEach((subject) => {
        localStorage.removeItem(`attemptTest_currentQuestionIndex_${subject}`);
      });
      localStorage.removeItem("attemptTest_selectedSubject");

      navigate("/");
    } catch (error) {
      Swal.fire("Error", `Error submitting test: ${error.message}`, "error");
    }
  };

  const questions = questionsBySubject[selectedSubject] || [];
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
                onClick={() => setSelectedSubject(subject)}
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

          {/* Question Block */}
          {currentQuestion ? (
            <div className="flex flex-col items-center text-center p-6 bg-gray-700 rounded-lg shadow-md">
              {currentQuestion.questionTitle && (
                <h3 className="text-2xl font-semibold mb-4">
                  {currentQuestion.questionTitle}
                </h3>
              )}

              {currentQuestion.question && currentQuestion.questionImageType && (
                <img
                  src={`data:${currentQuestion.questionImageType};base64,${currentQuestion.question}`}
                  alt="Question"
                  className="mb-6 max-w-full rounded"
                  onError={(e) => {
                    console.error("Failed to load question image", e);
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}

              {!currentQuestion.questionTitle &&
                !(currentQuestion.question && currentQuestion.questionImageType) && (
                  <p className="text-gray-400 italic mb-4">
                    No question title or image available
                  </p>
                )}

              <ul className="list-none space-y-3 w-full max-w-md">
                {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4].map(
                  (opt, i) => {
                    if (!opt) return null;
                    const optionLetter = String.fromCharCode(97 + i);
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
              onClick={() => setCurrentQuestionIndex((idx) => Math.max(0, idx - 1))}
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
                setCurrentQuestionIndex((idx) => Math.min(questions.length - 1, idx + 1))
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
