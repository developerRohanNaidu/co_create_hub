"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api"; // your helper for API calls

export default function AdminDashboard() {
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    image: "",
    targetType: "all", // can be "all", "users", "experts"
    targetId: "",
    expiresAt: "",
  });

  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  // ✅ Fetch all announcements
  const fetchAdminData = async () => {
    try {
      const res = await apiRequest("/admin/announcements", "GET");
      if (res.success) {
        setAnnouncements(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching admin dashboard:", err);
    }
  };

  // ✅ Create new announcement
  const createAnnouncement = async () => {
    if (!announcementForm.title) {
      setAnnouncementMessage("⚠️ Title is required.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        ...announcementForm,
        createdBy: user?.id || 1, // fallback admin ID if not found
      };

      const res = await apiRequest("/admin/createAnnouncement", "POST", payload);

      if (res.success) {
        setAnnouncementMessage("✅ Announcement created successfully!");
        setAnnouncementForm({
          title: "",
          shortDescription: "",
          longDescription: "",
          image: "",
          targetType: "all",
          targetId: "",
          expiresAt: "",
        });
        fetchAdminData(); // refresh list
      } else {
        setAnnouncementMessage(res.message || "❌ Failed to create announcement.");
      }
    } catch (err) {
      console.error("Error creating announcement:", err);
      setAnnouncementMessage("❌ Something went wrong.");
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* ===== Header ===== */}
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2">🛠 Admin Dashboard</h1>
          <p className="text-gray-400">Manage announcements and platform updates</p>
        </header>

        {/* ===== Create Announcement Section ===== */}
        <section className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">📢 Create Announcement</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              className="p-3 rounded bg-gray-700 border border-gray-600 text-white"
              value={announcementForm.title}
              onChange={(e) =>
                setAnnouncementForm({ ...announcementForm, title: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Short Description"
              className="p-3 rounded bg-gray-700 border border-gray-600 text-white"
              value={announcementForm.shortDescription}
              onChange={(e) =>
                setAnnouncementForm({ ...announcementForm, shortDescription: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Image URL"
              className="p-3 rounded bg-gray-700 border border-gray-600 text-white"
              value={announcementForm.image}
              onChange={(e) =>
                setAnnouncementForm({ ...announcementForm, image: e.target.value })
              }
            />

            <select
              className="p-3 rounded bg-gray-700 border border-gray-600 text-white"
              value={announcementForm.targetType}
              onChange={(e) =>
                setAnnouncementForm({ ...announcementForm, targetType: e.target.value })
              }
            >
              <option value="all">All Users</option>
              <option value="user">Regular Users</option>
              <option value="project">Projects</option>
              <option value="group">Groups</option>
            </select>

            <input
              type="datetime-local"
              placeholder="Expires At"
              className="p-3 rounded bg-gray-700 border border-gray-600 text-white"
              value={announcementForm.expiresAt}
              onChange={(e) =>
                setAnnouncementForm({ ...announcementForm, expiresAt: e.target.value })
              }
            />
          </div>

          <textarea
            placeholder="Long Description"
            rows={5}
            className="w-full mt-4 p-3 rounded bg-gray-700 border border-gray-600 text-white"
            value={announcementForm.longDescription}
            onChange={(e) =>
              setAnnouncementForm({ ...announcementForm, longDescription: e.target.value })
            }
          />

          <button
            onClick={createAnnouncement}
            className="mt-5 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
          >
            ➕ Create Announcement
          </button>

          {announcementMessage && (
            <p className="mt-3 text-sm text-gray-300">{announcementMessage}</p>
          )}
        </section>

        {/* ===== List of Announcements ===== */}
        <section className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">📜 All Announcements</h2>

          {announcements.length === 0 ? (
            <p className="text-gray-400">No announcements yet.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-lg border border-gray-700 hover:bg-gray-750 transition"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{a.title}</h3>
                    <span className="text-sm text-gray-400">
                      {new Date(a.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-gray-300 mt-1">{a.shortDescription}</p>
                  {a.image && (
                    <img
                      src={a.image}
                      alt={a.title}
                      className="mt-2 w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <p className="text-gray-400 mt-2 text-sm">
                    {a.longDescription?.slice(0, 200)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
