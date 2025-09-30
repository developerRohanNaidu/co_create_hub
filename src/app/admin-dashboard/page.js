"use client";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { Pencil, Trash, Plus } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState({
    users: [],
    projects: [],
    blogs: [],
    appointments: [],
    announcements: [],
  });
  const [loading, setLoading] = useState(true);

  // Announcement Form State
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    image: "",
    targetType: "all",
    targetId: "",
    expiresAt: "",
  });

  const [announcementMessage, setAnnouncementMessage] = useState("");

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, projectsRes, blogsRes, appointmentsRes, announcementsRes] = await Promise.all([
        apiRequest("/admin/users", "GET"),
        apiRequest("/admin/projects", "GET"),
        apiRequest("/admin/blogs", "GET"),
        apiRequest("/admin/appointments", "GET"),
        apiRequest("/admin/announcements", "GET"),
      ]);

      setData({
        users: usersRes.success ? usersRes.data : [],
        projects: projectsRes.success ? projectsRes.data : [],
        blogs: blogsRes.success ? blogsRes.data : [],
        appointments: appointmentsRes.success ? appointmentsRes.data : [],
        announcements: announcementsRes.success ? announcementsRes.data : [],
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAnnouncementChange = (e) =>
    setAnnouncementForm({ ...announcementForm, [e.target.name]: e.target.value });

  const createAnnouncement = async () => {
    if (!announcementForm.title) {
      setAnnouncementMessage("Title is required");
      return;
    }

    const res = await apiRequest("/admin/announcement/create", "POST", announcementForm);

    if (res.success) {
      setAnnouncementMessage("Announcement created successfully!");
      setAnnouncementForm({
        title: "",
        shortDescription: "",
        longDescription: "",
        image: "",
        targetType: "all",
        targetId: "",
        expiresAt: "",
      });
      fetchAdminData();
    } else {
      setAnnouncementMessage(res.message || "Failed to create announcement");
    }
  };

  const toggleAnnouncementStatus = async (id, status) => {
    const res = await apiRequest(`/admin/announcement/${id}/status`, "PUT", { status });
    if (res.success) fetchAdminData();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white bg-black">
        Loading admin dashboard...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar active="Dashboard" />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="p-4 bg-gray-900 rounded-lg text-center">
            <p className="text-xl font-bold">{data.users.length}</p>
            <p className="text-gray-400">Users</p>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg text-center">
            <p className="text-xl font-bold">{data.projects.length}</p>
            <p className="text-gray-400">Projects</p>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg text-center">
            <p className="text-xl font-bold">{data.blogs.length}</p>
            <p className="text-gray-400">Blogs</p>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg text-center">
            <p className="text-xl font-bold">{data.appointments.length}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg text-center">
            <p className="text-xl font-bold">{data.announcements.length}</p>
            <p className="text-gray-400">Announcements</p>
          </div>
        </div>

        {/* Users Table */}
        <section>
          <h2 className="text-xl font-bold mb-2">Users</h2>
          {data.users.length ? (
            <ul className="bg-gray-900 rounded-lg p-4 space-y-2">
              {data.users.map((u) => (
                <li key={u.id} className="flex justify-between border-b border-gray-700 py-2">
                  <span>{u.name} ({u.email})</span>
                  <span>Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No users found.</p>
          )}
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-xl font-bold mb-2">Projects</h2>
          <div className="flex overflow-x-auto gap-4 py-2">
            {data.projects.map((p) => (
              <div
                key={p.id}
                className="relative min-w-[250px] bg-gray-900 p-4 rounded-lg shadow hover:shadow-md cursor-pointer"
              >
                {p.images?.[0] && (
                  <Image
                    src={p.images[0].url}
                    alt={p.title}
                    width={250}
                    height={150}
                    className="rounded-lg mb-2"
                  />
                )}
                <h3 className="font-semibold">{p.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Blogs */}
        <section>
          <h2 className="text-xl font-bold mb-2">Blogs</h2>
          <div className="flex overflow-x-auto gap-4 py-2">
            {data.blogs.map((b) => (
              <div key={b.id} className="relative min-w-[250px] bg-gray-900 p-4 rounded-lg shadow">
                {b.images?.[0] && (
                  <Image
                    src={b.images[0].url}
                    alt={b.title}
                    width={250}
                    height={150}
                    className="rounded-lg mb-2"
                  />
                )}
                <h3 className="font-semibold">{b.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Appointments */}
        <section>
          <h2 className="text-xl font-bold mb-2">Appointments</h2>
          {data.appointments.length ? (
            <ul className="bg-gray-900 rounded-lg p-4 space-y-2">
              {data.appointments.map((a) => (
                <li key={a.id} className="flex justify-between border-b border-gray-700 pb-2">
                  <span>{a.title}</span>
                  <span>{a.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No appointments found.</p>
          )}
        </section>

        {/* Announcement Form */}
        <section>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Plus size={18} /> Create Announcement
          </h2>
          <div className="bg-gray-900 p-4 rounded-lg space-y-3">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={announcementForm.title}
              onChange={handleAnnouncementChange}
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />
            <input
              type="text"
              name="shortDescription"
              placeholder="Short Description"
              value={announcementForm.shortDescription}
              onChange={handleAnnouncementChange}
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />
            <textarea
              name="longDescription"
              placeholder="Long Description"
              value={announcementForm.longDescription}
              onChange={handleAnnouncementChange}
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={announcementForm.image}
              onChange={handleAnnouncementChange}
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />
            <input
              type="date"
              name="expiresAt"
              value={announcementForm.expiresAt}
              onChange={handleAnnouncementChange}
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />
            <button
              onClick={createAnnouncement}
              className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
            >
              Create Announcement
            </button>
            {announcementMessage && (
              <p className="text-gray-300">{announcementMessage}</p>
            )}
          </div>
        </section>

        {/* Existing Announcements */}
        <section>
          <h2 className="text-xl font-bold mb-2">Manage Announcements</h2>
          {data.announcements.length ? (
            <ul className="bg-gray-900 rounded-lg p-4 space-y-2">
              {data.announcements.map((a) => (
                <li key={a.id} className="flex justify-between items-center border-b border-gray-700 py-2">
                  <span>{a.title} ({a.status})</span>
                  <div className="flex gap-2">
                    {a.status !== "active" && (
                      <button
                        onClick={() => toggleAnnouncementStatus(a.id, "active")}
                        className="px-2 py-1 bg-green-600 rounded text-sm"
                      >
                        Activate
                      </button>
                    )}
                    {a.status !== "archived" && (
                      <button
                        onClick={() => toggleAnnouncementStatus(a.id, "archived")}
                        className="px-2 py-1 bg-yellow-600 rounded text-sm"
                      >
                        Archive
                      </button>
                    )}
                    {a.status !== "deleted" && (
                      <button
                        onClick={() => toggleAnnouncementStatus(a.id, "deleted")}
                        className="px-2 py-1 bg-red-600 rounded text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No announcements found.</p>
          )}
        </section>
      </main>
    </div>
  );
}
