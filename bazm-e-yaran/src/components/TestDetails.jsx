import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
const testServiceBaseURL = import.meta.env.VITE_TEST_SERVICE_BASE_URL;

export default function TestDetails() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    axios
      .get(testServiceBaseURL + `/test/get/${id}`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch test details");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-6">Loading test details...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <>
    <Navbar />
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Test {id} - Questions
      </h2>

      <div className="space-y-6">
        {questions.map((q, index) => {
          // Prepare options array
          const options = [q.option1, q.option2, q.option3, q.option4].filter(Boolean);

          return (
            <div
              key={q.questionId || index}
              className="p-4 border border-gray-200 rounded-lg shadow bg-white"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Q{index + 1}. {q.questionText}
              </h3>
              <h5 className="text-lg font-semibold text-gray-700 mb-2">
                QuestionId: {q.id}
              </h5>

              {q.questionImageData && (
                <img
                  src={`data:${q.questionImageType};base64,${q.questionImageData}`}
                  alt="Question"
                  className="w-64 h-auto rounded-md border mt-2"
                />
              )}

              <ul className="list-disc pl-5 mt-3 text-gray-600">
                {options.map((opt, idx) => (
                  <li
                    key={idx}
                    className={`mb-1 ${
                      opt === q.rightOption ? "font-bold text-green-600" : ""
                    }`}
                  >
                    {opt}
                  </li>
                ))}
              </ul>

              <p className="mt-3 text-sm text-gray-500">
                <span className="font-medium">Category:</span> {q.category || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium">Difficulty:</span>{" "}
                {q.difficultyLevel || "N/A"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
    <Footer />
    </>
  );
}
