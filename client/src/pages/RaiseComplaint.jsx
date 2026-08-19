// // src/components/RaiseComplaint.jsx
// import { useState } from "react";
// import toast from "react-hot-toast";
// import API from "../services/api";
// import { useAuth } from "../context/AuthContext"; // get logged-in user and token

// export default function RaiseComplaint({ onSuccess }) {
//   const { token } = useAuth();

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     department: "general",
//     urgency: "low",
//   });

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       toast.error("You must be logged in to raise a complaint");
//       return;
//     }

//     try {
//       // Send token in headers
//       await API.post("/complaints", form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Complaint submitted!");

//       // Clear form
//       setForm({
//         title: "",
//         description: "",
//         department: "general",
//         urgency: "low",
//       });

//       // Notify parent to refresh complaints list
//       if (onSuccess) onSuccess();
//     } catch (err) {
//       console.error(err);
//       toast.error("Submission failed");
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
//       <form
//         onSubmit={submit}
//         className="max-w-2xl w-full bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur space-y-6 shadow-xl"
//       >
//         <h2 className="text-3xl font-bold text-center text-pink-400">
//           Raise a Complaint
//         </h2>

//         <input
//           className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
//           placeholder="Complaint Title"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//           required
//         />

//         <textarea
//           className="w-full h-32 p-3 rounded-lg bg-white/10 border border-white/20 resize-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
//           placeholder="Describe your issue..."
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//           required
//         />

//         <div className="grid md:grid-cols-2 gap-4">
//           <div className="relative">
//             <select
//               className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-pink-400 focus:border-pink-400 appearance-none relative cursor-pointer"
//               value={form.department}
//               onChange={(e) => setForm({ ...form, department: e.target.value })}
//             >
//               {/* <option value="general" className="bg-gray-900">📋 General</option>
//               <option value="administration" className="bg-gray-900">🏢 Administration</option>
//               <option value="electrical" className="bg-gray-900">💡 Electrical</option>
//               <option value="plumbing" className="bg-gray-900">🔧 Plumbing</option>
//               <option value="it" className="bg-gray-900">💻 IT Services</option>
//               <option value="maintenance" className="bg-gray-900">⚙️ Maintenance</option>
//               <option value="housekeeping" className="bg-gray-900">🧹 Housekeeping</option>
//               <option value="library" className="bg-gray-900">📚 Library</option>
//               <option value="other" className="bg-gray-900">❓ Other</option> */}
//               <option value="general" className="bg-gray-900">📋 General</option>
//               <option value="administration" className="bg-gray-900">🏢 Administration</option>
//               <option value="electrical" className="bg-gray-900">💡 Electrical</option>
//               <option value="plumbing" className="bg-gray-900">🔧 Plumbing</option>
//               <option value="it" className="bg-gray-900">💻 IT Services</option>
//               <option value="maintenance" className="bg-gray-900">⚙️ Maintenance</option>
//               <option value="housekeeping" className="bg-gray-900">🧹 Housekeeping</option>
//               <option value="library" className="bg-gray-900">📚 Library</option>

//               {/* Newly Added */}
//               <option value="academic" className="bg-gray-900">🏫 Academic Affairs</option>
//               <option value="computer-center" className="bg-gray-900">🖥 Computer Center</option>
//               <option value="cafeteria" className="bg-gray-900">🍴 Cafeteria / Mess</option>
//               <option value="health" className="bg-gray-900">🏥 Health Center</option>
//               <option value="hostel" className="bg-gray-900">🏠 Hostel / Accommodation</option>
//               <option value="transport" className="bg-gray-900">🚍 Transport</option>
//               <option value="examinations" className="bg-gray-900">🎓 Examinations</option>
//               <option value="sports" className="bg-gray-900">🏋️ Sports / Gym</option>
//               <option value="cultural" className="bg-gray-900">🎭 Cultural Activities</option>
//               <option value="gardening" className="bg-gray-900">🌱 Gardening / Landscaping</option>
//               <option value="security" className="bg-gray-900">🛡 Security</option>

//               <option value="other" className="bg-gray-900">❓ Other</option>

//             </select>
//             <svg
//               className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </div>

//           <div className="relative">
//             <select
//               className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-pink-400 focus:border-pink-400 appearance-none relative cursor-pointer"
//               value={form.urgency}
//               onChange={(e) => setForm({ ...form, urgency: e.target.value })}
//             >
//               <option value="low" className="bg-gray-900">🟢 Low</option>
//               <option value="medium" className="bg-gray-900">🟡 Medium</option>
//               <option value="high" className="bg-gray-900">🟠 High</option>
//               <option value="critical" className="bg-gray-900">🔴 Critical</option>
//             </select>
//             <svg
//               className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//             </svg>
//           </div>
//         </div>

//         <button className="w-full bg-gradient-to-r from-pink-600 to-pink-400 py-3 rounded-xl font-bold hover:scale-105 transition duration-200 shadow-lg">
//           Submit Complaint
//         </button>
//       </form>
//     </div>
//   );
// }

// src/components/RaiseComplaint.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import { useAuth } from "../context/AuthContext"; // get logged-in user and token

export default function RaiseComplaint({ onSuccess }) {
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "general",
    urgency: "low",
  });

  const [loading, setLoading] = useState(false); // NEW

  const submit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("You must be logged in to raise a complaint");
      return;
    }

    if (loading) return; // prevent multiple clicks

    try {
      setLoading(true);

      // Send token in headers
      await API.post("/complaints", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Complaint submitted!");

      // Clear form
      setForm({
        title: "",
        description: "",
        department: "general",
        urgency: "low",
      });

      // Notify parent to refresh complaints list
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Submission failed");
    } finally {
      setLoading(false); // reset button state
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="max-w-2xl w-full bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur space-y-6 shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center text-pink-400">
          Raise a Complaint
        </h2>

        <input
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Complaint Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          className="w-full h-32 p-3 rounded-lg bg-white/10 border border-white/20 resize-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Describe your issue..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <div className="grid md:grid-cols-2 gap-4">
          {/* Department Dropdown */}
          <div className="relative">
            <select
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-pink-400 focus:border-pink-400 appearance-none relative cursor-pointer"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
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
              <option value="computer-center" className="bg-gray-900">🖥 Computer Center</option>
              <option value="cafeteria" className="bg-gray-900">🍴 Cafeteria / Mess</option>
              <option value="health" className="bg-gray-900">🏥 Health Center</option>
              <option value="hostel" className="bg-gray-900">🏠 Hostel / Accommodation</option>
              <option value="transport" className="bg-gray-900">🚍 Transport</option>
              {/* <option value="examinations" className="bg-gray-900">🎓 Examinations</option> */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Urgency Dropdown */}
          <div className="relative">
            <select
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-pink-400 focus:border-pink-400 appearance-none relative cursor-pointer"
              value={form.urgency}
              onChange={(e) => setForm({ ...form, urgency: e.target.value })}
            >
              <option value="low" className="bg-gray-900">🟢 Low</option>
              <option value="medium" className="bg-gray-900">🟡 Medium</option>
              <option value="high" className="bg-gray-900">🟠 High</option>
              <option value="critical" className="bg-gray-900">🔴 Critical</option>
            </select>
            <svg
              className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <button
  type="submit"
  disabled={loading}
  className={`w-full py-3 rounded-xl font-bold transition duration-200 shadow-lg ${
    loading
      ? "bg-pink-500 cursor-not-allowed text-white"
      : "bg-gradient-to-r from-pink-600 to-pink-400 hover:scale-105"
  }`}
>
  {loading ? "Submitting..." : "Submit Complaint"}
</button>

      </form>
    </div>
  );
}
