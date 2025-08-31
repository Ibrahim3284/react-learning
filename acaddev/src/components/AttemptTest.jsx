import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AttemptTest() {
  const { id } = useParams();
  const location = useLocation();
  const { questions } = location.state || { questions: [] };

  // Track answers
  const [answers, setAnswers] = useState({});

  const handleSelect = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            📝 Attempt Test (ID: {id})
          </h1>

          {questions.length === 0 ? (
            <p className="text-gray-600">No questions received.</p>
          ) : (
            <div className="space-y-8">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="border border-gray-200 rounded-xl shadow-sm p-6 bg-gray-50"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Question {idx + 1}
                  </h2>

                  {q.question && (
                    <img
                      src={`data:image/png;base64,${q.question}`}
                      alt="Question"
                      className="rounded-lg shadow mb-4 max-w-full"
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
                          name={`question-${q.id}`}
                          value={q[opt]}
                          checked={answers[q.id] === q[opt]}
                          onChange={() => handleSelect(q.id, q[opt])}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <span className="text-gray-700">{q[opt]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
