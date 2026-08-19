// src/pages/ForgotPassword.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      if (res.success) {
        toast.success(res.message || "Password reset email sent!");
        setEmail("");
      } else {
        toast.error(res.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset email.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur space-y-4 animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-center text-pink-400">
          Forgot Password
        </h2>

        <p className="text-gray-300 text-center">
          Enter your email and we’ll send you instructions to reset your password.
        </p>

        <div className="relative">
          <Mail className="absolute left-3 top-3 opacity-70" />
          <input
            type="email"
            className="w-full pl-10 p-3 rounded bg-white/10 border border-white/10 placeholder-gray-400 text-white"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-600 to-pink-400 py-3 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="text-center text-gray-300 mt-4">
          Remember your password?{" "}
          <Link to="/login" className="text-pink-400 hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}
