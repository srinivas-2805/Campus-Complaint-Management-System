
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(
  `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
  { newPassword }
  
);

      toast.success(res.data.message || "Password reset successful!");
      setNewPassword("");
      navigate("/login");
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <form onSubmit={submit} className="max-w-lg w-full bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur space-y-4">
        <h2 className="text-2xl font-bold text-center text-pink-400">Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-3 rounded bg-white/10 border border-white/10"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 text-white py-3 rounded hover:bg-pink-400 transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

