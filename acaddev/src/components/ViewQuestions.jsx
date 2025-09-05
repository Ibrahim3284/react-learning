import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const testServiceBaseURL = import.meta.env.VITE_TEST_SERVICE_BASE_URL;

export default function ViewQuestions() {
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const title = searchParams.get("title");
  const date = searchParams.get("date");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `${testServiceBaseURL}/test/get/questions?title=${encodeURIComponent(
            title
          )}&date=${encodeURIComponent(date)}`,
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
        setQuestions(data);
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 px-6 py-16 text-white">
        <div className="max-w-6xl mx-auto bg-gray-800 p-10 rounded-3xl border border-gray-700 shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 opacity-10 blur-3xl -z-10"></div>

          <h1 className="text-4xl font-bold mb-10 text-center">📝 Questions for "{title}"</h1>

          {loading ? (
            <p className="text-center text-white">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-400">Error: {error}</p>
          ) : (
            Object.entries(questions).map(([subject, questionList], index) => (
              <div key={index} className="mb-10">
                <h2 className="text-2xl font-semibold text-purple-400 mb-4">{subject}</h2>
                {questionList.map((q, i) => (
                  <div
                    key={q.id}
                    className="mb-6 border border-gray-600 p-6 rounded-xl bg-gray-700 shadow"
                  >
                    <h3 className="text-lg font-semibold mb-2">
                      Q{i + 1}: {q.questionTitle || "(Image Only)"}
                    </h3>

                    {q.hasImage && q.questionImageData && (
                      <img
                        src={`data:${q.questionImageType};base64,${q.questionImageData}`}
                        alt="Question"
                        className="mb-4 rounded-lg shadow w-64"
                      />
                    )}

                    <ul className="list-disc ml-6 text-gray-300 space-y-1">
                      <li>Option 1: {q.option1}</li>
                      <li>Option 2: {q.option2}</li>
                      <li>Option 3: {q.option3}</li>
                      <li>Option 4: {q.option4}</li>
                    </ul>

                    <p className="mt-2 text-green-400 font-semibold">
                      ✅ Correct: {q[q.rightOption]}
                    </p>

                    <div className="text-sm mt-3 text-gray-400">
                      <span className="mr-4">📚 Category: {q.category}</span>
                      <span>🎯 Difficulty: {q.difficultyLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
