import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function TestQuestions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:8081/test/get/questionWrapper/${id}`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchQuestions();
  }, [id, token]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 pt-24 px-6 text-white">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-green-400 mb-10 tracking-wide">
          Test {id} - Question Paper
        </h1>

        {error && (
          <div className="p-4 bg-red-900 text-red-400 rounded-lg shadow-md mb-6 border border-red-600 max-w-3xl mx-auto">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-700">
          {questions.length > 0 ? (
            <div className="space-y-8">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className="p-6 bg-gray-900 rounded-lg shadow-md border border-gray-700"
                >
                  <h3 className="text-xl font-semibold mb-4 text-red-400">
                    Q{index + 1}.
                  </h3>
                  {q.question && (
                    <img
                      src={`data:image/jpeg;base64,${q.question}`}
                      alt={`Question ${index + 1}`}
                      className="max-w-full h-auto mb-4 rounded-lg border border-gray-600 shadow-md"
                    />
                  )}
                  <ul className="space-y-2">
                    <li className="p-3 bg-gray-800 rounded-md border border-gray-700 hover:bg-gray-700 transition">
                      A) {q.option1}
                    </li>
                    <li className="p-3 bg-gray-800 rounded-md border border-gray-700 hover:bg-gray-700 transition">
                      B) {q.option2}
                    </li>
                    <li className="p-3 bg-gray-800 rounded-md border border-gray-700 hover:bg-gray-700 transition">
                      C) {q.option3}
                    </li>
                    <li className="p-3 bg-gray-800 rounded-md border border-gray-700 hover:bg-gray-700 transition">
                      D) {q.option4}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No questions found.</p>
          )}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-200"
          >
            Back to Tests
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
