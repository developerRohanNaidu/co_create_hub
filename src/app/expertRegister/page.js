"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function ExpertRegister() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "", // ✅ added phone
    bio: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiRequest("/user/register", "POST", {
        ...formData,
        userType: "expert",
      });

      if (res.success) {
        alert("Registration successful! Please login.");
        router.push("/login");
      } else {
        alert(res.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="max-w-lg w-full space-y-6 p-6 bg-gray-900 rounded-lg shadow-lg">
        {/* Step Indicator */}
        <div className="flex justify-between mb-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`w-8 h-2 rounded ${step >= s ? "bg-white" : "bg-gray-600"}`}
            />
          ))}
        </div>

        {/* Step 1: Choose Account Option */}
        {step === 1 && (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Register as Expert</h2>
            <p className="text-gray-300">
              Choose whether to continue with your current account or create a new expert account.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => alert("Upgrading current account to Expert coming soon!")}
                className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition"
              >
                Use Current Account
              </button>
              <button
                onClick={() => setStep(2)}
                className="bg-gray-700 text-white px-6 py-2 rounded font-semibold hover:bg-gray-600 transition"
              >
                Create New Expert Account
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Expert Registration Form */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Expert Details</h2>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-white"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-white"
              required
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-white"
              required
            />

            {/* ✅ New Phone Number Field */}
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-white"
              required
            />

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Short Bio"
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-white"
              rows={3}
            />

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Skills (comma separated, e.g. Flutter, ML, Blockchain)"
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <a href="/auth" className="text-white underline">
                Login
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
