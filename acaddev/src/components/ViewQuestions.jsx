import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const testServiceBaseURL = import.meta.env.VITE_TEST_SERVICE_BASE_URL;

export default function ViewQuestions() {
  const [searchParams] = useSearchParams();
  const [questionsBySubject, setQuestionsBySubject] = useState({});
  const [currentSubject, setCurrentSubject] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const title = searchParams.get("title");
  const date = searchParams.get("date");

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `${testServiceBaseURL}/test/get/questions?title=${encodeURIComponent(title)}&date=${encodeURIComponent(date)}`,
          {
            headers: {
              Authorization: token,
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load questions");
        }

        const data = await res.json();
        const subjects = Object.keys(data);
        setQuestionsBySubject(data);

        // Set current subject after questions loaded
        const savedSubject = localStorage.getItem("viewQuestions_subject");
        if (savedSubject && subjects.includes(savedSubject)) {
          setCurrentSubject(savedSubject);
        } else if (subjects.length > 0) {
          setCurrentSubject(subjects[0]);
        } else {
          setCurrentSubject("");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (title && date) {
      fetchQuestions();
    }
  }, [title, date]);

  // Load and validate currentIndex per subject, once currentSubject and questionsBySubject are set
  useEffect(() => {
    if (!currentSubject || !questionsBySubject[currentSubject]) {
      setCurrentIndex(0);
      return;
    }

    const totalQuestions = questionsBySubject[currentSubject].length;

    if (totalQuestions === 0) {
      setCurrentIndex(0);
      return;
    }

    const savedIndex = localStorage.getItem(`viewQuestions_index_${currentSubject}`);
    let indexToSet = 0;
    if (savedIndex !== null && !isNaN(savedIndex)) {
      const parsedIndex = parseInt(savedIndex, 10);
      if (parsedIndex >= 0 && parsedIndex < totalQuestions) {
        indexToSet = parsedIndex;
      }
    }
    setCurrentIndex(indexToSet);
  }, [currentSubject, questionsBySubject]);

  // Store subject in localStorage
  useEffect(() => {
    if (currentSubject) {
      localStorage.setItem("viewQuestions_subject", currentSubject);
    }
  }, [currentSubject]);

  // Store index per subject in localStorage
  useEffect(() => {
    if (currentSubject) {
      localStorage.setItem(`viewQuestions_index_${currentSubject}`, currentIndex.toString());
    }
  }, [currentIndex, currentSubject]);

  const subjectList = Object.keys(questionsBySubject);
  const currentSubjectQuestions = questionsBySubject[currentSubject] || [];
  const currentQuestion = currentSubjectQuestions[currentIndex];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 px-6 py-16 text-white">
        <div className="max-w-4xl mx-auto bg-gray-800 p-10 rounded-3xl border border-gray-700 shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 opacity-10 blur-3xl -z-10"></div>

          <h1 className="text-4xl font-bold mb-10 text-center">
            📝 Questions for "{title}"
          </h1>

          {/* Subject Selector */}
          {!loading && subjectList.length > 1 && (
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {subjectList.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setCurrentSubject(subject)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    subject === currentSubject
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <p className="text-center text-white">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-400">Error: {error}</p>
          ) : currentSubjectQuestions.length === 0 ? (
            <p className="text-center text-yellow-400">No questions found for this subject.</p>
          ) : currentQuestion ? (
            <>
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">
                  {currentSubject}
                </h2>

                <div className="mb-6 border border-gray-600 p-6 rounded-xl bg-gray-700 shadow">
                  <h3 className="text-lg font-semibold mb-2">
                    Q{currentIndex + 1}: {currentQuestion.questionTitle || "(Image Only)"}
                  </h3>

                  {currentQuestion.hasImage && currentQuestion.questionImageData && (
                    <img
                      src={`data:${currentQuestion.questionImageType};base64,${currentQuestion.questionImageData}`}
                      alt="Question"
                      className="mb-4 rounded-lg shadow w-64"
                    />
                  )}

                  <ul className="list-disc ml-6 text-gray-300 space-y-1">
                    <li>Option 1: {currentQuestion.option1}</li>
                    <li>Option 2: {currentQuestion.option2}</li>
                    <li>Option 3: {currentQuestion.option3}</li>
                    <li>Option 4: {currentQuestion.option4}</li>
                  </ul>

                  <p className="mt-2 text-green-400 font-semibold">
                    ✅ Correct: {currentQuestion[currentQuestion.rightOption]}
                  </p>

                  <div className="text-sm mt-3 text-gray-400">
                    <span className="mr-4">📚 Category: {currentQuestion.category}</span>
                    <span>🎯 Difficulty: {currentQuestion.difficultyLevel}</span>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                    disabled={currentIndex === 0}
                    className={`px-6 py-2 rounded-lg font-semibold ${
                      currentIndex === 0
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    ⬅️ Previous
                  </button>

                  <span className="text-gray-400 text-sm self-center">
                    Question {currentIndex + 1} of {currentSubjectQuestions.length}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentIndex((i) =>
                        Math.min(i + 1, currentSubjectQuestions.length - 1)
                      )
                    }
                    disabled={currentIndex === currentSubjectQuestions.length - 1}
                    className={`px-6 py-2 rounded-lg font-semibold ${
                      currentIndex === currentSubjectQuestions.length - 1
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    Next ➡️
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-yellow-300">
              Unable to load the selected question.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
