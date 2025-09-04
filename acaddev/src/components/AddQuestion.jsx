import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
const testServiceBaseURL = import.meta.env.VITE_TEST_SERVICE_BASE_URL;

export default function AddQuestion() {
  const emptyQuestion = {
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    rightOption: "",
    category: "",
    difficulty: "",
    image: null,
  };

  const [questions, setQuestions] = useState([emptyQuestion]);
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Handle text changes
  const handleChange = (index, e) => {
    const updated = [...questions];
    updated[index][e.target.name] = e.target.value;
    setQuestions(updated);
  };

  // Handle image upload
  const handleImageChange = (index, e) => {
    const updated = [...questions];
    updated[index].image = e.target.files[0];
    setQuestions(updated);
  };

  // Add another question block
  const addQuestionBlock = () => {
    setQuestions([...questions, { ...emptyQuestion }]);
  };

  // Submit all questions
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (let q of questions) {
        const data = new FormData();
        const { image, ...formData } = q;

        data.append(
          "question",
          new Blob([JSON.stringify(formData)], { type: "application/json" })
        );
        if (image) data.append("imageFile", image);

        const res = await fetch(testServiceBaseURL + "/question/add", {
          method: "POST",
          credentials: "include",
          body: data,
        });

        if (!res.ok) throw new Error("Failed to add question");
      }

      setPopupMessage("✅ All questions added successfully!");
      setPopupOpen(true);
      setQuestions([emptyQuestion]); // reset
    } catch (err) {
      console.error(err);
      setPopupMessage("❌ Error adding questions");
      setPopupOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Add Questions
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl p-6 shadow-md bg-white"
          >
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Question {index + 1}
            </h2>

            {["option1", "option2", "option3", "option4", "rightOption", "category", "difficulty"].map(
              (field) => (
                <div key={field} className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={q[field]}
                    onChange={(e) => handleChange(index, e)}
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              )
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Upload Image
              </label>
              <input
                type="file"
                onChange={(e) => handleImageChange(index, e)}
                accept="image/*"
                className="mt-1"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={addQuestionBlock}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ➕ Add Another Question
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Submit All"}
          </button>
        </div>
      </form>

      {/* Popup Modal */}
      <Dialog
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 max-w-sm shadow-lg">
            <Dialog.Title className="text-lg font-bold mb-2">
              Notification
            </Dialog.Title>
            <p>{popupMessage}</p>
            <button
              onClick={() => setPopupOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              OK
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
