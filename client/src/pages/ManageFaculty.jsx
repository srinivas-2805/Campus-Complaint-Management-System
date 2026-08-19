

// src/pages/ManageFaculty.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ManageFaculty() {
  const { token } = useAuth(); 
  const [faculty, setFaculty] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_URL}/auth/faculty`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFaculty(res.data))
      .catch((error) => {
        console.error("Error loading faculty:", error);
        toast.error("Failed to load faculty");
      });
  }, [token]);

  // ✅ Remove faculty
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this faculty member?")) return;

    try {
      await axios.delete(`${API_URL}/auth/faculty/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFaculty((prev) => prev.filter((f) => f._id !== id));
      toast.success("Faculty removed successfully!");
    } catch (error) {
      console.error("Error deleting faculty:", error);
      toast.error("Failed to remove faculty");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Faculty</h1>
      {faculty.length === 0 ? (
        <p>No faculty members found.</p>
      ) : (
        <div className="space-y-4">
          {faculty.map((f) => (
            <div
              key={f._id}
              className="p-4 border rounded bg-white/5 border-white/10 flex justify-between items-center"
            >
              <div>
                <p><strong>Name:</strong> {f.name}</p>
                <p><strong>Email:</strong> {f.email}</p>
                <p><strong>Department:</strong> {f.department}</p>
              </div>
              <button
                onClick={() => handleDelete(f._id)}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
