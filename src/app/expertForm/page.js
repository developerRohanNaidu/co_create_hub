"use client";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";

// ✅ Utility to escape special characters
const sanitizeInput = (str) => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export default function ExpertForm() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [formData, setFormData] = useState({
    needExpert: "",
    query: "",
    category: "",
    level: "basic",
  });

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/project/get/getCategories", "GET");
        if (data.success) setCategories(data.data);
        console.log("duiwfewf", data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Call API to create request appointment
      const body = {
        userId: 1, // Replace with logged-in user ID
        techType: formData.category, // or formData.level if needed
        preferredDate: new Date(), // or a date picker value
        meetingLinkType: "Zoom", // optional, can add input field
        notes: formData.query,
      };
  
      const res = await apiRequest("/home/request", "POST", body);
  
      if (res.success) {
        console.log("Request created:", res.data);
        setStep(4); // move to thank you page
      } else {
        alert(res.message || "Failed to create request appointment");
      }
    } catch (err) {
      console.error("Error creating appointment request:", err);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div className="max-w-xl w-full space-y-6 p-6 bg-black text-white rounded-lg shadow-lg">
        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-2 rounded ${
                step >= s ? "bg-white" : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Connect with Experts</h2>
            <p className="text-gray-300">
              One platform for all your problems. Get top-industry experts to
              answer your questions quickly. If you can&apos;t find a solution,
              connect with an expert to solve it in minutes.
            </p>
            <button
              onClick={handleNext}
              className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">What do you need?</h2>
            <p className="text-gray-300">Choose the type of expert help:</p>
            <div className="flex flex-col space-y-2">
              {["Solve a Question", "Discussion", "Mentorship"].map((option) => (
                <label
                  key={option}
                  className={`border px-4 py-2 rounded cursor-pointer ${
                    formData.needExpert === option
                      ? "border-white"
                      : "border-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="needExpert"
                    value={option}
                    checked={formData.needExpert === option}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="bg-gray-700 px-6 py-2 rounded hover:bg-gray-600 transition"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.needExpert}
                className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Your Query</h2>
            <textarea
              name="query"
              value={formData.query}
              onChange={handleChange}
              placeholder="Write your query..."
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-white"
              required
            />

            {/* Show preview of query with special characters escaped */}
            {formData.query && (
              <div className="bg-gray-900 text-gray-300 p-2 rounded text-sm">
                Preview:{" "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: sanitizeInput(formData.query),
                  }}
                />
              </div>
            )}

            {/* Category Dropdown with Loading */}
            {loading ? (
              <div className="text-center py-2 text-gray-400">
                Loading categories...
              </div>
            ) : (
              <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-white"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {sanitizeInput(cat.name)} {/* ✅ using name since API has "name" */}
                </option>
              ))}
            </select>
            
            )}

            {/* Level Selection */}
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-white"
            >
              {["Basic", "Advanced", "Pro"].map((lvl) => (
                <option key={lvl} value={lvl.toLowerCase()}>
                  {lvl}
                </option>
              ))}
            </select>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-700 px-6 py-2 rounded hover:bg-gray-600 transition"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
              >
                Submit
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Thank You */}
        {step === 4 && (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Thank You!</h2>
            <p className="text-gray-300">
              We are finding the right expert for you. You will be notified via
              email shortly. Note: These are industry-level experts, please be
              respectful. Misconduct may result in your account being banned.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
