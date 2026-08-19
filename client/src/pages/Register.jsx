// import { useState } from "react";
// import toast from "react-hot-toast";
// import API from "../services/api";
// import { useNavigate, Link } from "react-router-dom";

// export default function Register() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "student" // always student by default
//   });
//   const navigate = useNavigate();

//   // ✅ Validate student email format before submitting
//   const isValidStudentEmail = (email) => {
//     if (!email.toLowerCase().endsWith("@rgukt.ac.in")) {
//       return false;
//     }
//     const id = email.split("@")[0];
//     const match = id.match(/^[bB](20|21|22|23|24|25)(\d{4})$/);
//     if (!match) return false;
//     const seq = parseInt(match[2], 10);
//     return seq >= 1 && seq <= 2000;
//   };

//   const submit = async (e) => {
//     e.preventDefault();

//     if (!isValidStudentEmail(form.email)) {
//       toast.error("Invalid student ID or email. Use id like 'b200001@rgukt.ac.in'.");
//       return;
//     }

//     try {
//       // Ensure role is student no matter what
//       await API.post("/auth/register", { ...form, role: "student" });
//       toast.success("Registered! Now login.");
//       setForm({ name: "", email: "", password: "", role: "student" });
//       navigate("/login");
//     } catch (e) {
//       toast.error(e.response?.data?.message || "Registration failed");
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
//       <form
//         onSubmit={submit}
//         className="w-full max-w-lg bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur space-y-4"
//       >
//         <h2 className="text-3xl font-bold text-pink-400 text-center">Create Your Account</h2>

//         <input
//           className="w-full p-3 rounded bg-white/10 border border-white/10"
//           placeholder="Full Name"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           required
//         />

//         <input
//           className="w-full p-3 rounded bg-white/10 border border-white/10"
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           required
//         />

//         <input
//           type="password"
//           className="w-full p-3 rounded bg-white/10 border border-white/10"
//           placeholder="Password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           required
//         />

//         {/* ✅ Role selector is hidden because all users here are students */}
//         <input type="hidden" value="student" />

//         <button
//           className="w-full bg-gradient-to-r from-pink-600 to-pink-400 py-3 rounded-xl font-bold hover:scale-105 transition"
//         >
//           Register
//         </button>

//         <p className="text-center text-gray-300">
//           Already have an account?{" "}
//           <Link to="/login" className="text-pink-400 hover:underline">
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" // always student by default
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidStudentEmail = (email) => {
    if (!email.toLowerCase().endsWith("@rgukt.ac.in")) {
      return false;
    }
    const id = email.split("@")[0];
    const match = id.match(/^[bB](20|21|22|23|24|25)(\d{4})$/);
    if (!match) return false;
    const seq = parseInt(match[2], 10);
    return seq >= 1 && seq <= 2000;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!isValidStudentEmail(form.email)) {
      toast.error("Invalid student ID or email. Use id like 'b200001@rgukt.ac.in'.");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/register", { ...form, role: "student" });
      toast.success("Registered! Now login.");
      setForm({ name: "", email: "", password: "", role: "student" });
      navigate("/login");
    } catch (e) {
      toast.error(e.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur space-y-4 animate-fade-in"
      >
        <h2 className="text-3xl font-bold text-pink-400 text-center">
          Create Your Account
        </h2>

        {/* Name Input */}
        <div className="relative">
          <User className="absolute left-3 top-3 opacity-70" />
          <input
            className="w-full pl-10 p-3 rounded bg-white/10 border border-white/10"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 opacity-70" />
          <input
            type="email"
            className="w-full pl-10 p-3 rounded bg-white/10 border border-white/10"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 opacity-70" />
          <input
            type="password"
            className="w-full pl-10 p-3 rounded bg-white/10 border border-white/10"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        {/* Hidden role input */}
        <input type="hidden" value="student" />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-pink-600 to-pink-400 py-3 rounded-xl font-bold transition ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-105"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-gray-300 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
