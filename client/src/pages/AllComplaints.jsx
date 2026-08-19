// import { useEffect, useState, Fragment } from "react";
// import axios from "axios";
// import { Listbox, Transition } from "@headlessui/react";
// import { useAuth } from "../context/AuthContext";
// import toast from "react-hot-toast";

// export default function AllComplaints() {
//   const { token, user } = useAuth();
//   const [complaints, setComplaints] = useState([]);
//   const [updates, setUpdates] = useState({});
//   const API_URL = import.meta.env.VITE_API_URL;

//   const statusOptions = ["Pending", "In Progress", "Resolved", "Rejected"];

//   const statusColors = {
//     Pending: "bg-yellow-600 text-white",
//     "In Progress": "bg-blue-600 text-white",
//     Resolved: "bg-green-600 text-white",
//     Rejected: "bg-red-600 text-white",
//   };

//   useEffect(() => {
//     if (!token || user?.role !== "admin") return;

//     axios
//       .get(`${API_URL}/complaints/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setComplaints(res.data);
//         const initial = {};
//         res.data.forEach((c) => {
//           initial[c._id] = { status: c.status };
//         });
//         setUpdates(initial);
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Failed to load complaints");
//       });
//   }, [token, user]);

//   const handleUpdate = async (id) => {
//     try {
//       const { status } = updates[id];
//       const res = await axios.put(
//         `${API_URL}/complaints/${id}`,
//         { status },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setComplaints((prev) =>
//         prev.map((c) => (c._id === id ? res.data : c))
//       );
//       toast.success("Complaint updated successfully!");
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Update failed");
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4 text-pink-400">All Complaints (Admin)</h1>

//       {complaints.length === 0 ? (
//         <p className="text-gray-400">No complaints found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto border-collapse border border-gray-600 text-white text-sm">
//             <thead className="bg-gray-800 text-gray-200">
//               <tr>
//                 <th className="border border-gray-600 px-4 py-2">Title</th>
//                 <th className="border border-gray-600 px-4 py-2">Raised By</th>
//                 <th className="border border-gray-600 px-4 py-2">Department</th>
//                 <th className="border border-gray-600 px-4 py-2">Raised Date</th>
//                 <th className="border border-gray-600 px-4 py-2">Last Updated</th>
//                 <th className="border border-gray-600 px-4 py-2">Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {complaints.map((c) => {
//                 const currentStatus = updates[c._id]?.status || c.status;
//                 return (
//                   <tr key={c._id} className="even:bg-gray-700">
//                     <td className="border border-gray-600 px-4 py-2">{c.title}</td>
//                     <td className="border border-gray-600 px-4 py-2">{c.student?.name || "Unknown"}</td>
//                     <td className="border border-gray-600 px-4 py-2">{c.department}</td>
//                     <td className="border border-gray-600 px-4 py-2">
//                       {new Date(c.createdAt).toLocaleDateString("en-IN", {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </td>
//                     <td className="border border-gray-600 px-4 py-2">
//                       {c.updatedAt
//                         ? new Date(c.updatedAt).toLocaleDateString("en-IN", {
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })
//                         : "Not Updated"}
//                     </td>
//                     <td className="border border-gray-600 px-4 py-2">
//                       <div className="flex items-center space-x-2">
//                         <Listbox
//                           value={currentStatus}
//                           onChange={(value) =>
//                             setUpdates((prev) => ({
//                               ...prev,
//                               [c._id]: { ...prev[c._id], status: value },
//                             }))
//                           }
//                         >
//                           <div className="relative w-40">
//                             <Listbox.Button
//                               className={`w-full p-2 rounded border bg-white/10 text-gray-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 ${statusColors[currentStatus]}`}
//                             >
//                               {currentStatus}
//                             </Listbox.Button>
//                             <Transition
//                               as={Fragment}
//                               leave="transition ease-in duration-100"
//                               leaveFrom="opacity-100"
//                               leaveTo="opacity-0"
//                             >
//                               <Listbox.Options className="fixed top-0 left-0 mt-2 ml-2 w-48 bg-gray-800 rounded shadow-lg z-50 overflow-auto max-h-96">
//                                 {statusOptions.map((status) => (
//                                   <Listbox.Option
//                                     key={status}
//                                     value={status}
//                                     className={({ active }) =>
//                                       `cursor-pointer select-none p-2 ${
//                                         active ? "bg-gray-700" : ""
//                                       } ${statusColors[status]}`
//                                     }
//                                   >
//                                     {status}
//                                   </Listbox.Option>
//                                 ))}
//                               </Listbox.Options>
//                             </Transition>
//                           </div>
//                         </Listbox>
//                         <button
//                           onClick={() => handleUpdate(c._id)}
//                           className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-400 transition"
//                         >
//                           Update
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { Listbox, Transition } from "@headlessui/react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function AllComplaints() {
  const { token, user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [updates, setUpdates] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  const statusOptions = ["Pending", "In Progress", "Resolved", "Rejected"];
  const [updatingIds, setUpdatingIds] = useState([]);

  const statusColors = {
    Pending: "bg-yellow-600 text-white",
    "In Progress": "bg-blue-600 text-white",
    Resolved: "bg-green-600 text-white",
    Rejected: "bg-red-600 text-white",
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") return;

    axios
      .get(`${API_URL}/complaints`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setComplaints(res.data);
        const initial = {};
        res.data.forEach((c) => {
          initial[c._id] = { status: c.status };
        });
        setUpdates(initial);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load complaints");
      });
  }, [token, user]);

  // const handleUpdate = async (id) => {
  //   try {
  //     const { status } = updates[id];
  //     const res = await axios.put(
  //       `${API_URL}/complaints/${id}`,
  //       { status },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     setComplaints((prev) =>
  //       prev.map((c) => (c._id === id ? res.data : c))
  //     );
  //     toast.success("Complaint updated successfully!");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.response?.data?.message || "Update failed");
  //   }
  // };

  const handleUpdate = async (id) => {
  try {
    setUpdatingIds((prev) => [...prev, id]); // Mark as updating

    const { status } = updates[id];
    const res = await axios.put(
      `${API_URL}/complaints/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setComplaints((prev) =>
      prev.map((c) => (c._id === id ? res.data : c))
    );
    toast.success("Complaint updated successfully!");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Update failed");
  } finally {
    setUpdatingIds((prev) => prev.filter((updId) => updId !== id)); // Remove updating flag
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints((prev) => prev.filter((c) => c._id !== id));
      toast.success("Complaint deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-pink-400">
        All Complaints (Admin)
      </h1>

      {complaints.length === 0 ? (
        <p className="text-gray-400">No complaints found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-600 text-white text-sm">
            <thead className="bg-gray-800 text-gray-200">
              <tr>
                <th className="border border-gray-600 px-4 py-2">Title</th>
                <th className="border border-gray-600 px-4 py-2">Raised By</th>
                <th className="border border-gray-600 px-4 py-2">Department</th>
                <th className="border border-gray-600 px-4 py-2">Raised Date</th>
                <th className="border border-gray-600 px-4 py-2">Last Updated</th>
                <th className="border border-gray-600 px-4 py-2">Status</th>
                <th className="border border-gray-600 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => {
                const currentStatus = updates[c._id]?.status || c.status;
                return (
                  <tr key={c._id} className="even:bg-gray-700">
                    <td className="border border-gray-600 px-4 py-2">
                      {c.title}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {c.student?.name || "Unknown"}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {c.department}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      {c.updatedAt
                        ? new Date(c.updatedAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Not Updated"}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <Listbox
                          value={currentStatus}
                          onChange={(value) =>
                            setUpdates((prev) => ({
                              ...prev,
                              [c._id]: { ...prev[c._id], status: value },
                            }))
                          }
                        >
                          <div className="relative w-40">
                            <Listbox.Button
                              className={`w-full p-2 rounded border bg-white/10 text-gray-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 ${statusColors[currentStatus]}`}
                            >
                              {currentStatus}
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="fixed top-0 left-0 mt-2 ml-2 w-48 bg-gray-800 rounded shadow-lg z-50 overflow-auto max-h-96">
                                {statusOptions.map((status) => (
                                  <Listbox.Option
                                    key={status}
                                    value={status}
                                    className={({ active }) =>
                                      `cursor-pointer select-none p-2 ${
                                        active ? "bg-gray-700" : ""
                                      } ${statusColors[status]}`
                                    }
                                  >
                                    {status}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                        <button
                          onClick={() => handleUpdate(c._id)}
                          disabled={updatingIds.includes(c._id)}
                          className={`px-4 py-2 rounded transition ${
                            updatingIds.includes(c._id)
                              ? "bg-pink-300 cursor-not-allowed"
                              : "bg-pink-500 hover:bg-pink-400 text-white"
                          }`}
                        >
                          {updatingIds.includes(c._id) ? "Updating..." : "Update"}
                        </button>
                      </div>
                    </td>
                    <td className="border border-gray-600 px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
