import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function TestPage() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(
          `http://localhost:8081/test/get/questionWrapper/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch questions");

        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  if (loading) return <div className="p-6 text-center text-lg">Loading questions...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            📝 Test ID: {id}
          </h1>

          {questions.length === 0 ? (
            <p className="text-gray-600">No questions available.</p>
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

                  <ul className="space-y-2">
                    <li className="p-3 bg-white rounded-lg shadow hover:bg-gray-100">
                      {q.option1}
                    </li>
                    <li className="p-3 bg-white rounded-lg shadow hover:bg-gray-100">
                      {q.option2}
                    </li>
                    <li className="p-3 bg-white rounded-lg shadow hover:bg-gray-100">
                      {q.option3}
                    </li>
                    <li className="p-3 bg-white rounded-lg shadow hover:bg-gray-100">
                      {q.option4}
                    </li>
                  </ul>
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
