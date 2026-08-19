import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

export default function MyComplaints({ refetchTrigger }) {
  const [list, setList] = useState([]);
  const { token } = useAuth();

  const fetchComplaints = async () => {
    if (!token) return;
    try {
      const res = await API.get("/complaints/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [token, refetchTrigger]);

  const deleteComplaint = async (id) => {
    try {
      await API.delete(`/complaints/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Complaint deleted!");
      fetchComplaints(); // refresh the list
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete complaint");
    }
  };

  const badge = (status) => {
    const map = {
      Pending: "bg-yellow-500",
      "In Progress": "bg-blue-500",
      Resolved: "bg-green-600",
      Rejected: "bg-red-600",
    };
    return map[status] || "bg-gray-500";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-pink-400 text-center mb-8">
        My Complaints
      </h1>

      {list.length === 0 ? (
        <p className="text-center text-gray-300">No complaints yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {list.map((c) => (
            <div key={c._id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{c.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${badge(c.status)}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-gray-300 mt-2">{c.description}</p>
                <div className="text-xs text-gray-400 mt-3 flex justify-between">
                  <span>📁 {c.department}</span>
                  <span>⚡ {c.urgency}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-right">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Delete Button - only if status is 'Pending' */}
              {c.status === "Pending" && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => deleteComplaint(c._id)}
                    className="text-red-500 hover:text-red-400 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
