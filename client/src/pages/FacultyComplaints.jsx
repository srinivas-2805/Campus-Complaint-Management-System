
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function FacultyComplaints() {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [updates, setUpdates] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  const statusOptions = ["Pending", "In Progress", "Resolved", "Rejected"];

  // ✅ Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-white";
      case "In Progress":
        return "bg-blue-500 text-white";
      case "Resolved":
        return "bg-green-600 text-white";
      case "Rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_URL}/complaints/department`, {
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
  }, [token]);

  const handleUpdate = async (id) => {
    try {
      const { status } = updates[id];
      const res = await axios.put(
        `${API_URL}/complaints/faculty-update/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? res.data : c))
      );
      toast.success("Complaint updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Department Complaints</h1>
      {complaints.length === 0 ? (
        <p>No complaints found for your department.</p>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div
              key={c._id}
              className="p-4 border rounded bg-white/5 border-white/10 space-y-2"
            >
              <p><strong>Title:</strong> {c.title}</p>
              <p><strong>Description:</strong> {c.description}</p>
              <p><strong>Student:</strong> {c.student.name} ({c.student.email})</p>
              <p><strong>Urgency:</strong> {c.urgency}</p>

              {/* Status Badge */}
              <p>
                <strong>Status: </strong>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                    updates[c._id]?.status || c.status
                  )}`}
                >
                  {updates[c._id]?.status || c.status}
                </span>
              </p>

              {/* Update controls */}
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                <select
                  value={updates[c._id]?.status || c.status}
                  onChange={(e) =>
                    setUpdates((prev) => ({
                      ...prev,
                      [c._id]: { ...prev[c._id], status: e.target.value },
                    }))
                  }
                  className="p-2 rounded border bg-white/10 text-gray-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status} className="bg-white text-black">
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleUpdate(c._id)}
                  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-400 transition"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
