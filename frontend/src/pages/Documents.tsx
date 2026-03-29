import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

type Message = {
  type: "success" | "error";
  text: string;
};

function Documents() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext must be used within AuthProvider");
  const { token, role, logout } = context;
  const canUpload = role === "admin" || role === "editor";
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<Message | null>(null);
  const [docMessages, setDocMessages] = useState<Record<number, Message | null>>({});
  const [listMessage, setListMessage] = useState<Message | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editRoles, setEditRoles] = useState<string[]>([]);

  const fetchDocs = () => {
    fetch(`${API_BASE}/documents`)
      .then((res) => res.json())
      .then(setDocs);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const showUploadMessage = (message: Message) => {
    setUploadMessage(message);
    setTimeout(() => {
      setUploadMessage((current) => (current === message ? null : current));
    }, 3000);
  };

  const showDocMessage = (id: number, message: Message) => {
    setDocMessages((prev) => ({ ...prev, [id]: message }));
    setTimeout(() => {
      setDocMessages((prev) => {
        if (prev[id] !== message) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }, 3000);
  };

  const showListMessage = (message: Message) => {
    setListMessage(message);
    setTimeout(() => {
      setListMessage((current) => (current === message ? null : current));
    }, 3000);
  };

  const deleteDoc = async (id: number) => {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      showListMessage({ type: "success", text: "Document deleted successfully" });
      fetchDocs(); // Refresh list
    } else {
      showListMessage({ type: "error", text: "Delete failed: " + res.statusText });
    }
  };

  const uploadDoc = async () => {
    if (!selectedFile) {
      showUploadMessage({ type: "error", text: "Please choose a file first" });
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("title", selectedFile.name);
      form.append("role_access", "admin");
      form.append("role_access", "editor");
      form.append("role_access", "viewer");
      form.append("file", selectedFile);

      const res = await fetch(`${API_BASE}/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const detail = data?.detail ?? res.statusText;
        showUploadMessage({ type: "error", text: `Upload failed: ${detail}` });
        return;
      }
      // Success: show transient success message and clear file input
      showUploadMessage({ type: "success", text: "Upload successful" });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchDocs();
    } finally {
      setUploading(false);
    }
  };

  const downloadDoc = async (id: number, docTitle: string) => {
    try {
      const res = await fetch(`${API_BASE}/documents/${id}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const detail = data?.detail ?? res.statusText;
        showDocMessage(id, { type: "error", text: `Download failed: ${detail}` });
        return;
      }

      const blob = await res.blob();
      // Try to get filename from Content-Disposition
      const cd = res.headers.get("content-disposition") || "";
      let filename = docTitle;
      const match = cd.match(/filename\*=UTF-8''(.+)|filename="?([^\";]+)"?/i);
      if (match) {
        filename = decodeURIComponent(match[1] || match[2]);
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || docTitle || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      showDocMessage(id, { type: "error", text: "Download failed" });
    }
  };

  const startEdit = (doc: any) => {
    setEditingId(doc.id);
    setEditTitle(doc.title);
    setEditRoles(doc.role_access ?? []);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditRoles([]);
  };

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/documents/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle, role_access: editRoles }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const detail = data?.detail ?? res.statusText;
        showDocMessage(id, { type: "error", text: `Update failed: ${detail}` });
        return;
      }

      showDocMessage(id, { type: "success", text: "Update successful" });
      cancelEdit();
      fetchDocs();
    } catch (err) {
      showDocMessage(id, { type: "error", text: "Update failed" });
    }
  };

  const toggleRole = (roleName: string) => {
    setEditRoles((prev) =>
      prev.includes(roleName) ? prev.filter((r) => r !== roleName) : [...prev, roleName]
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-3 px-3 pb-1">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative mb-6">
          <div className="absolute left-0 top-0 text-xs text-slate-500">
            {role === "admin" && "Role Admin"}
            {role === "editor" && "Role Editor"}
            {role === "viewer" && "Role Viewer"}
          </div>
          <h2 className="text-2xl font-semibold text-center tracking-tight">Document Library</h2>
          <button
            onClick={logout}
            className="absolute right-0 top-0 bg-slate-200 text-slate-800 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <div
          className={`grid gap-6 ${canUpload ? "md:grid-cols-3" : "md:grid-cols-1"} ${
            canUpload ? "" : "justify-items-center"
          }`}
        >
          {canUpload && (
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="border border-slate-200 rounded-xl p-4 w-full max-w-sm">
                <h3 className="font-semibold mb-1">Upload Files</h3>
                {uploadMessage && (
                  <div
                    className={`mb-3 p-2 rounded ${
                      uploadMessage.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {uploadMessage.text}
                  </div>
                )}
                <label className="block border-2 border-dashed border-slate-200 rounded-lg p-4 text-sm text-slate-600">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="block w-full"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                <div className="mt-4">
                  <button
                    disabled={uploading || !selectedFile}
                    onClick={uploadDoc}
                    className="bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={canUpload ? "md:col-span-2" : "md:col-span-1 w-full max-w-2xl"}>
            {listMessage && (
              <div
                className={`p-2 mb-4 rounded ${
                  listMessage.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {listMessage.text}
              </div>
            )}

            <div className="max-h-[520px] overflow-auto pr-2">
              {docs.map((doc) => {
                const message = docMessages[doc.id];
                return (
                  <div key={doc.id} className="border border-slate-200 p-4 mb-4 rounded-xl text-center">
                    {editingId === doc.id ? (
                      <div>
                        <input
                          className="border p-2 mb-2 w-full rounded"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                        <div className="mb-2 text-sm">
                          <label className="mr-3">Roles:</label>
                          {["admin", "editor", "viewer"].map((r) => (
                            <label key={r} className="mr-3">
                              <input
                                type="checkbox"
                                checked={editRoles.includes(r)}
                                onChange={() => toggleRole(r)}
                              />
                              <span className="ml-1">{r}</span>
                            </label>
                          ))}
                        </div>
                        <div>
                          <button
                            onClick={() => saveEdit(doc.id)}
                            className="bg-green-600 text-white px-4 py-2 mr-2 rounded-lg"
                          >
                            Save
                          </button>
                          <button onClick={cancelEdit} className="bg-slate-200 px-4 py-2 rounded-lg">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {message && (
                          <div
                            className={`p-2 mb-2 rounded ${
                              message.type === "success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {message.text}
                          </div>
                        )}
                        <div className="grid gap-1 text-sm text-slate-700 justify-items-center">
                          <div className="text-lg font-semibold text-slate-900">{doc.title}</div>
                          <div>
                            <span className="font-semibold">Uploaded by:</span> {doc.uploaded_by}
                          </div>
                          <div>
                            <span className="font-semibold">Access roles:</span> {doc.role_access.join(", ")}
                          </div>
                          <div>
                            <span className="font-semibold">Uploaded at:</span> {new Date(doc.uploaded_at).toLocaleString()}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 justify-center">
                          {role === "editor" && (
                            <button
                              onClick={() => startEdit(doc)}
                              className="bg-amber-500 text-white px-3 py-1.5 text-sm rounded"
                            >
                              Edit
                            </button>
                          )}

                          {role === "viewer" && (
                            <button
                              onClick={() => downloadDoc(doc.id, doc.title)}
                              className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded"
                            >
                              Download
                            </button>
                          )}

                          {role === "admin" && (
                            <button
                              onClick={() => deleteDoc(doc.id)}
                              className="bg-red-600 text-white px-3 py-1.5 text-sm rounded"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documents;