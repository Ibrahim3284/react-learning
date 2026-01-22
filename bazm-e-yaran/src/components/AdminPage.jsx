import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FiChevronLeft, FiChevronRight, FiAlertCircle } from "react-icons/fi";

const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_BASE_URL;

export default function AdminPage() {
  const [alumni, setAlumni] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pageSize = 10;
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchAlumni();
  }, [pageNo]);

  const fetchAlumni = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${userServiceBaseURL}/alumni/allAlumni?page_size=${pageSize}&page_no=${pageNo}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (!res.ok) throw new Error(`Failed to load alumni`);

      const data = await res.json();
      setAlumni(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-900 text-white pt-24 px-6">
        <h1 className="text-4xl font-extrabold text-center text-red-500 mb-10">
          Alumni Directory
        </h1>

        {error && (
          <div className="max-w-4xl mx-auto mb-6 flex items-center gap-3 bg-red-900/70 border border-red-600 p-4 rounded-lg">
            <FiAlertCircle className="text-red-400 text-xl" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        <div className="overflow-x-auto max-w-7xl mx-auto bg-gray-800 rounded-xl shadow-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-700 text-red-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Batch</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Current Location</th>
                <th className="px-4 py-3">College</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-8">
                    Loading alumni...
                  </td>
                </tr>
              ) : (
                alumni.map((a) => (
                  <tr
                    key={a.id}
                    className="border-t border-gray-700 hover:bg-gray-700/60"
                  >
                    <td className="px-4 py-3 font-medium">{a.fullName}</td>
                    <td className="px-4 py-3">
                      {a.batchNumber} ({a.batchPassingYear})
                    </td>
                    <td className="px-4 py-3">{a.email}</td>
                    <td className="px-4 py-3">{a.phoneNo}</td>
                    <td className="px-4 py-3">
                      {a.currentAddressCity},{" "}
                      {a.currentAddressState || "-"},{" "}
                      {a.currentAddressCountry}
                    </td>
                    <td className="px-4 py-3">
                      {a.graduationCollegeName}
                    </td>
                    <td className="px-4 py-3">{a.graduationBranch}</td>
                    <td className="px-4 py-3">
                      {a.organization || "-"}
                    </td>
                    <td className="px-4 py-3">{a.role || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            disabled={pageNo === 1}
            onClick={() => setPageNo((p) => p - 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 disabled:opacity-40"
          >
            <FiChevronLeft /> Prev
          </button>

          <span className="text-gray-300">
            Page <span className="font-semibold">{pageNo}</span> of{" "}
            {totalPages}
          </span>

          <button
            disabled={pageNo === totalPages}
            onClick={() => setPageNo((p) => p + 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 disabled:opacity-40"
          >
            Next <FiChevronRight />
          </button>
        </div>

        <Footer />
      </div>
    </>
  );
}
