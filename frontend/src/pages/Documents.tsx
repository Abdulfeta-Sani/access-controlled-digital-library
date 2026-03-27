import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

function Documents() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext must be used within AuthProvider");
  const { token, role, logout } = context;
  const [docs, setDocs] = useState<any[]>([]);

  const fetchDocs = () => {
    fetch(`${API_BASE}/documents`)
      .then((res) => res.json())
      .then(setDocs);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const deleteDoc = async (id: number) => {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      fetchDocs(); // Refresh list
    } else {
      alert("Delete failed: " + res.statusText);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Documents</h2>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to logout?")) {
              logout();
            }
          }}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Logout
        </button>
      </div>

      {(role === "admin" || role === "editor") && (
        <button className="bg-green-500 text-white p-2 mb-4">
          Upload Document
        </button>
      )}

      {docs.map((doc) => (
        <div key={doc.id} className="border p-4 mb-4 rounded">
          <h3 className="font-semibold">{doc.title}</h3>
          <p className="text-sm text-gray-600">Uploaded by: {doc.uploaded_by}</p>
          <p className="text-sm text-gray-600">Access roles: {doc.role_access.join(", ")}</p>
          <p className="text-sm text-gray-600">Uploaded at: {new Date(doc.uploaded_at).toLocaleString()}</p>

          {role === "admin" && (
            <button
              onClick={() => deleteDoc(doc.id)}
              className="bg-red-500 text-white p-2 mt-2 rounded"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Documents;