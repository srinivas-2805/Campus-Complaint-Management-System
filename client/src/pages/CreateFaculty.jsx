// import { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import API from "../services/api";
// import toast from "react-hot-toast";

// export default function CreateFaculty() {
//   const { token } = useAuth();
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     department: "general",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!token) return;

//     try {
//       await API.post(
//         "/auth/faculty",
//         { ...form, role: "faculty" },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Faculty created successfully");
//       setForm({ name: "", email: "", password: "", department: "general" });
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to create faculty");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-[#1e0038] rounded-xl shadow-lg mt-10 text-white">
//       <h2 className="text-2xl font-bold text-pink-400 mb-6 text-center">
//         Create Faculty
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Name"
//           className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           required
//         />
        
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           required
//         />
//         <div className="relative">
//   <select
//     className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white
//                focus:ring-2 focus:ring-pink-400 focus:border-pink-400
//                appearance-none cursor-pointer"
//     value={form.department}
//     onChange={(e) => setForm({ ...form, department: e.target.value })}
//   >
//     {/* <option value="general" className="bg-gray-900">📋 General</option>
//     <option value="administration" className="bg-gray-900">🏢 Administration</option>
//     <option value="electrical" className="bg-gray-900">💡 Electrical</option>
//     <option value="plumbing" className="bg-gray-900">🔧 Plumbing</option>
//     <option value="it" className="bg-gray-900">💻 IT Services</option>
//     <option value="maintenance" className="bg-gray-900">⚙️ Maintenance</option>
//     <option value="housekeeping" className="bg-gray-900">🧹 Housekeeping</option>
//     <option value="library" className="bg-gray-900">📚 Library</option>
//     <option value="other" className="bg-gray-900">❓ Other</option> */}

//     <option value="general" className="bg-gray-900">📋 General</option>
// <option value="administration" className="bg-gray-900">🏢 Administration</option>
// <option value="electrical" className="bg-gray-900">💡 Electrical</option>
// <option value="plumbing" className="bg-gray-900">🔧 Plumbing</option>
// <option value="it" className="bg-gray-900">💻 IT Services</option>
// <option value="maintenance" className="bg-gray-900">⚙️ Maintenance</option>
// <option value="housekeeping" className="bg-gray-900">🧹 Housekeeping</option>
// <option value="library" className="bg-gray-900">📚 Library</option>

// {/* Extra useful departments */}
// <option value="academic" className="bg-gray-900">🏫 Academic Affairs</option>
// <option value="cafeteria" className="bg-gray-900">🍴 Cafeteria / Mess</option>
// <option value="health" className="bg-gray-900">🏥 Health Center</option>
// <option value="hostel" className="bg-gray-900">🏠 Hostel / Accommodation</option>
// {/* <option value="transport" className="bg-gray-900">🚍 Transport</option> */}
// <option value="examinations" className="bg-gray-900">🎓 Examinations</option>
// <option value="sports" className="bg-gray-900">🏋️ Sports / Gym</option>
// <option value="cultural" className="bg-gray-900">🎭 Cultural Activities</option>
// <option value="gardening" className="bg-gray-900">🌱 Gardening / Landscaping</option>
// <option value="security" className="bg-gray-900">🛡 Security</option>

// <option value="other" className="bg-gray-900">❓ Other</option>

//   </select>

//   <svg
//     className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400"
//     fill="none"
//     stroke="currentColor"
//     viewBox="0 0 24 24"
//   >
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//   </svg>
// </div>


//         <button
//           type="submit"
//           className="w-full bg-gradient-to-r from-pink-600 to-pink-400 py-3 rounded-xl font-bold hover:scale-105 transition duration-200 shadow-lg"
//         >
//           Create Faculty
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

export default function CreateFaculty() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "general",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);

    try {
      await API.post(
        "/auth/faculty",
        { ...form, role: "faculty" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Faculty created successfully");
      setForm({ name: "", email: "", password: "", department: "general" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create faculty");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-[#1e0038] rounded-xl shadow-lg mt-10 text-white">
      <h2 className="text-2xl font-bold text-pink-400 mb-6 text-center">
        Create Faculty
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name Input */}
        <div className="relative">
          <User className="absolute left-3 top-3 opacity-70" />
          <input
            type="text"
            placeholder="Name"
            className="w-full pl-10 p-3 rounded-lg bg-white/10 border border-white/20"
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
            placeholder="Email"
            className="w-full pl-10 p-3 rounded-lg bg-white/10 border border-white/20"
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
            placeholder="Password"
            className="w-full pl-10 p-3 rounded-lg bg-white/10 border border-white/20"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        {/* Department Select */}
        <div className="relative">
          <select
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white
                       focus:ring-2 focus:ring-pink-400 focus:border-pink-400
                       appearance-none cursor-pointer"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
            disabled={loading}
          >
            <option value="general" className="bg-gray-900">📋 General</option>
            {/* <option value="administration" className="bg-gray-900">🏢 Administration</option> */}
            <option value="electrical" className="bg-gray-900">💡 Electrical</option>
            <option value="plumbing" className="bg-gray-900">🔧 Plumbing</option>
            <option value="it" className="bg-gray-900">💻 IT Services</option>
            <option value="maintenance" className="bg-gray-900">⚙️ Maintenance</option>
            <option value="housekeeping" className="bg-gray-900">🧹 Housekeeping</option>
            <option value="library" className="bg-gray-900">📚 Library</option>
            <option value="academic" className="bg-gray-900">🏫 Academic Affairs</option>
            <option value="cafeteria" className="bg-gray-900">🍴 Cafeteria / Mess</option>
            <option value="health" className="bg-gray-900">🏥 Health Center</option>
            <option value="hostel" className="bg-gray-900">🏠 Hostel / Accommodation</option>
            <option value="sports" className="bg-gray-900">🏋️ Sports / Gym</option>
            <option value="cultural" className="bg-gray-900">🎭 Cultural Activities</option>
            <option value="gardening" className="bg-gray-900">🌱 Gardening / Landscaping</option>
            <option value="security" className="bg-gray-900">🛡 Security</option>

            <option value="other" className="bg-gray-900">❓ Other</option>
          </select>

          <svg
            className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

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
          {loading ? "Creating..." : "Create Faculty"}
        </button>
      </form>
    </div>
  );
}
