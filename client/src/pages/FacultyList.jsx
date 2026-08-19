import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function FacultyList() {
  const { token } = useAuth();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    const fetchFaculty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/admin/faculty`, {
  headers: { Authorization: `Bearer ${token}` },
});

        setFaculty(response.data);
      } catch (err) {
        console.error("Error fetching faculty:", err);
        const message = err.response?.data?.message || "Failed to fetch faculty list";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [token]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Faculty List</h1>
        <p className="text-gray-500">Loading faculty list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Faculty List</h1>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (faculty.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Faculty List</h1>
        <p className="text-gray-500">No faculty members found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Faculty List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {faculty.map((staff) => (
              <tr key={staff._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {staff.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {staff.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {staff.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(staff.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}