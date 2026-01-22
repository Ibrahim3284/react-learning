import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const userServiceBaseURL = import.meta.env.VITE_USER_SERVICE_BASE_URL;

export default function AddAlumni() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    batchNumber: "",
    batchPassingYear: "",
    permanentAddressCity: "",
    permanentAddressState: "",
    permanentAddressCountry: "",
    currentAddressCity: "",
    currentAddressState: "",
    currentAddressCountry: "",
    graduationCollegeName: "",
    graduationCollegeCity: "",
    graduationCollegeState: "",
    graduationCollegeCountry: "",
    graduationBranch: "",
    organization: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        phoneNo: Number(formData.phoneNo),
        batchNumber: Number(formData.batchNumber),
        batchPassingYear: Number(formData.batchPassingYear),
      };

      const token = localStorage.getItem("authToken");

      await axios.post(`${userServiceBaseURL}/alumni/add`, payload, {
        headers: { Authorization: token },
        withCredentials: true,
      });

      Swal.fire({
        title: "✅ Alumni Added",
        text: "Alumni registered successfully",
        icon: "success",
        confirmButtonColor: "#16a34a",
      });

      setFormData({
        fullName: "",
        email: "",
        phoneNo: "",
        batchNumber: "",
        batchPassingYear: "",
        permanentAddressCity: "",
        permanentAddressState: "",
        permanentAddressCountry: "",
        currentAddressCity: "",
        currentAddressState: "",
        currentAddressCountry: "",
        graduationCollegeName: "",
        graduationCollegeCity: "",
        graduationCollegeState: "",
        graduationCollegeCountry: "",
        graduationBranch: "",
        organization: "",
        role: "",
      });
    } catch (err) {
      Swal.fire({
        title: "❌ Error",
        text: err?.response?.data || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-900 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-extrabold text-center text-white mb-12">
            🎓 Alumni Registration
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Personal Info */}
            <Section title="Personal Information">
              <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
              <Input label="Phone Number" name="phoneNo" value={formData.phoneNo} onChange={handleChange} />
              <Input label="Batch Number" name="batchNumber" value={formData.batchNumber} onChange={handleChange} />
              <Input label="Batch Passing Year" name="batchPassingYear" value={formData.batchPassingYear} onChange={handleChange} />
            </Section>

            {/* Address */}
            <Section title="Permanent Address">
              <Input label="City" name="permanentAddressCity" value={formData.permanentAddressCity} onChange={handleChange} />
              <Input label="State" name="permanentAddressState" value={formData.permanentAddressState} onChange={handleChange} />
              <Input label="Country" name="permanentAddressCountry" value={formData.permanentAddressCountry} onChange={handleChange} />
            </Section>

            <Section title="Current Address">
              <Input label="City" name="currentAddressCity" value={formData.currentAddressCity} onChange={handleChange} />
              <Input label="State" name="currentAddressState" value={formData.currentAddressState} onChange={handleChange} />
              <Input label="Country" name="currentAddressCountry" value={formData.currentAddressCountry} onChange={handleChange} />
            </Section>

            {/* Education */}
            <Section title="Education">
              <Input label="College Name" name="graduationCollegeName" value={formData.graduationCollegeName} onChange={handleChange} />
              <Input label="Branch" name="graduationBranch" value={formData.graduationBranch} onChange={handleChange} />
              <Input label="College City" name="graduationCollegeCity" value={formData.graduationCollegeCity} onChange={handleChange} />
              <Input label="College State" name="graduationCollegeState" value={formData.graduationCollegeState} onChange={handleChange} />
              <Input label="College Country" name="graduationCollegeCountry" value={formData.graduationCollegeCountry} onChange={handleChange} />
            </Section>

            {/* Work */}
            <Section title="Professional Details">
              <Input label="Organization" name="organization" value={formData.organization} onChange={handleChange} />
              <Input label="Role" name="role" value={formData.role} onChange={handleChange} />
            </Section>

            {/* Submit */}
            <div className="text-center pt-8">
              <button
                type="submit"
                className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600
                text-white text-lg font-semibold rounded-xl shadow-lg
                hover:scale-105 transition-transform"
              >
                ✅ Submit Alumni
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* ---------- Reusable Components ---------- */

function Section({ title, children }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg
        text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
