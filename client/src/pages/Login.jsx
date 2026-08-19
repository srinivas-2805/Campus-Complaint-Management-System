// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Mail, Lock } from "lucide-react";
// import toast from "react-hot-toast";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   // ✅ Validate email for both students and admins
//   const isValidEmail = (email) => {
//     const lowerEmail = email.toLowerCase();

//     // --- Faculty (allow Gmail) ---
//   if (lowerEmail.endsWith("@gmail.com")) {
//     return true; // faculty can log in with Gmail
//   }

//     if (!lowerEmail.endsWith("@rgukt.ac.in")) {
//       return false;
//     } 

//     const id = lowerEmail.split("@")[0];
    

//     // Check if it's a student email
//     const studentMatch = id.match(/^[bB](20|21|22|23|24|25)(\d{4})$/);
//     if (studentMatch) {
//       const seq = parseInt(studentMatch[2], 10);
//       if (seq >= 1 && seq <= 2000) {
//         return true;
//       }
//     }

//     // Otherwise, accept as admin if it ends with @rgukt.ac.in
//     return true;
//   };

//   const submit = async (e) => {
//     e.preventDefault();

//     if (!isValidEmail(form.email)) {
//       toast.error("Invalid email! Must end with @rgukt.ac.in and follow proper format.");
//       return;
//     }

//     const res = await login(form.email, form.password);

//     if (res.success) {
//       toast.success("Logged in successfully!");
//       navigate("/"); // go to home page
//     } else {
//       toast.error(res.message);
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
//       <form
//         onSubmit={submit}
//         className="w-full max-w-lg bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur space-y-4 animate-fade-in"
//       >
//         <h2 className="text-3xl font-bold text-center text-pink-400">
//           Welcome Back
//         </h2>

//         <div className="relative">
//           <Mail className="absolute left-3 top-3 opacity-70" />
//           <input
//             className="w-full pl-10 p-3 rounded bg-white/10 border border-white/10"
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             required
//           />
//         </div>

//         <div className="relative">
//           <Lock className="absolute left-3 top-3 opacity-70" />
//           <input
//             type="password"
//             className="w-full pl-10 p-3 rounded bg-white/10 border border-white/10"
//             placeholder="Password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             required
//           />
//         </div>

//         {/* Forgot password link */}
//         <div className="text-right">
//           <Link
//             to="/forgot-password"
//             className="text-sm text-pink-400 hover:underline"
//           >
//             Forgot Password?
//           </Link>
//         </div>

//         <button className="w-full bg-gradient-to-r from-pink-600 to-pink-400 py-3 rounded-xl font-bold hover:scale-105 transition">
//           Login
//         </button>

//         <p className="text-center text-gray-300 mt-4">
//           Don't have an account?{" "}
//           <Link to="/register" className="text-pink-400 hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ Validate email for both students and admins
  const isValidEmail = (email) => {
    const lowerEmail = email.toLowerCase();

    // --- Faculty (allow Gmail) ---
    if (lowerEmail.endsWith("@gmail.com")) {
      return true; // faculty can log in with Gmail
    }

    if (!lowerEmail.endsWith("@rgukt.ac.in")) {
      return false;
    }

    const id = lowerEmail.split("@")[0];

    // Check if it's a student email
    const studentMatch = id.match(/^[bB](20|21|22|23|24|25)(\d{4})$/);
    if (studentMatch) {
      const seq = parseInt(studentMatch[2], 10);
      if (seq >= 1 && seq <= 2000) {
        return true;
      }
    }

    // Otherwise, accept as admin if it ends with @rgukt.ac.in
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent double clicks
    setLoading(true);

    if (!isValidEmail(form.email)) {
      toast.error("Invalid email! Must end with @rgukt.ac.in or Gmail (for faculty).");
      setLoading(false);
      return;
    }

    const res = await login(form.email, form.password);

    if (res.success) {
      toast.success("Logged in successfully!");
      navigate("/"); // go to home page
    } else {
      toast.error(res.message);
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
          Welcome Back
        </h2>

        <div className="relative">
          <Mail className="absolute left-3 top-3 opacity-70" />
          <input
            className="w-full pl-10 p-3 rounded bg-white/10 border border-white/10"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            disabled={loading}
          />
        </div>

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

        {/* Forgot password link */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-pink-400 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-pink-600 to-pink-400 py-3 rounded-xl font-bold transition ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-105"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-300 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-pink-400 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
