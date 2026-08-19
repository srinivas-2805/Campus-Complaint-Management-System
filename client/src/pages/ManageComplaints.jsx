// src/pages/ManageComplaints.jsx (for staff/admin)
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function ManageComplaints() {
  const { user, token } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user || !token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/complaints`, {
  headers: { Authorization: `Bearer ${token}` },
});

        setComplaints(response.data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
        const message = err.response?.data?.message || "Failed to fetch complaints";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user, token]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Manage Complaints</h1>
        <p className="text-gray-500">Loading complaints...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Manage Complaints</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Manage Complaints</h1>
        <p className="text-gray-500">No complaints found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Complaints</h1>
      <div className="space-y-4">
        {complaints.map((complaint) => (
          <div key={complaint._id} className="p-6 border rounded-lg shadow-md bg-white">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{complaint.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><strong>Student:</strong> {complaint.student?.name || 'N/A'}</p>
                <p><strong>Email:</strong> {complaint.student?.email || 'N/A'}</p>
              </div>
              <div>
                <p><strong>Department:</strong> {complaint.department}</p>
                <p><strong>Urgency:</strong> {complaint.urgency}</p>
              </div>
              <div>
                <p><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${
                  complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>{complaint.status}</span></p>
                <p><strong>Created:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="mt-3 text-gray-700">{complaint.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
