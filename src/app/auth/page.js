"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { apiRequest } from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    referral: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setShowResend(false);

    // Validate passwords
    if (!isLogin && form.password !== form.confirmPassword) {
      setMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? "/login" : "/register";
    const body = isLogin
      ? { email: form.email, phone: form.phone, password: form.password }
      : {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          referral: form.referral,
        };

    const res = await apiRequest(`/user${endpoint}`, "POST", body);

    if (res.success) {
      if (isLogin) {
        if (res.user?.isVerified) {
          // ✅ Login success
          setMessage("Login successful!");
          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(res.user));
          router.push("/home");
        } else {
          // ❌ Not verified
          setMessage("Your email is not verified. Please verify before logging in.");
          setShowResend(true);
        }
      } else {
        // ✅ Registration success
        setMessage("Registration successful! A verification link has been sent to your email.");
        setIsLogin(true);
      }
    } else {
      setMessage(res.message || "Failed, try again!");
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!form.email) {
      setMessage("Enter your email to reset password.");
      setLoading(false);
      return;
    }

    const res = await apiRequest("/user/forget-password", "POST", {
      email: form.email,
    });

    if (res.success) {
      setMessage("Temporary password sent to your email.");
      setShowForgot(false);
    } else {
      setMessage(res.message || "Failed to reset password.");
    }

    setLoading(false);
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setMessage("");
    const res = await apiRequest("/user/resend-verification", "POST", {
      email: form.email,
    });
    if (res.success) {
      setMessage("Verification link resent to your email.");
    } else {
      setMessage(res.message || "Failed to resend verification link.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-6 bg-gray-900 rounded-xl shadow-xl"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Logo" width={80} height={80} />
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">
          {showForgot ? "Forgot Password" : isLogin ? "Login" : "Register"}
        </h1>

        {/* Forms */}
        {!showForgot ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.input
                  key="name"
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500"
                />
              )}
            </AnimatePresence>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500"
            />

            {!isLogin && (
              <>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500"
                />
                <input
                  type="text"
                  name="referral"
                  placeholder="Referral Code (optional)"
                  value={form.referral}
                  onChange={handleChange}
                  className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500"
                />
              </>
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500"
            />

            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition duration-300"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
          </form>
        ) : (
          // ✅ Forgot Password Form
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your registered email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition duration-300"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {/* Forgot Password Toggle */}
        {isLogin && !showForgot && (
          <p
            onClick={() => setShowForgot(true)}
            className="mt-3 text-sm text-right text-gray-400 hover:underline cursor-pointer"
          >
            Forgot Password?
          </p>
        )}

        {/* Back to Login */}
        {showForgot && (
          <p
            onClick={() => setShowForgot(false)}
            className="mt-3 text-sm text-center text-gray-400 hover:underline cursor-pointer"
          >
            Back to Login
          </p>
        )}

        {/* Response Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
        )}

        {/* Resend Verification Button */}
        {showResend && (
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="mt-4 w-full py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
          >
            {loading ? "Resending..." : "Resend Verification Link"}
          </button>
        )}

        {/* Switch */}
        {!showForgot && (
          <p
            onClick={() => setIsLogin(!isLogin)}
            className="mt-6 text-center text-gray-400 cursor-pointer hover:underline"
          >
            {isLogin
              ? "Don’t have an account? Register"
              : "Already have an account? Login"}
          </p>
        )}
      </motion.div>

      {/* Footer Text */}
      <p className="mt-6 text-xs text-gray-500">Made in India with ❤️</p>
    </div>
  );
}
