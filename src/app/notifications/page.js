"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { apiRequest } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await apiRequest("/home/getNotification", "GET");
    if (res.success) setNotifications(res.data);
  };

  const handleJoinRequest = async (notification) => {
    const { projectId, senderId } = notification; // from your notification object
  
    const res = await apiRequest(
      "/home/collaboration/respond",
      "POST",
      {
        action: notification.actionType, // e.g., "accept" or "cancel"
        projectId,
        senderId,
      }
    );
  
    setMessage(res.message);
    if (res.success) fetchNotifications();
  };
  

  const typeColors = {
    like: "bg-green-600",
    comment: "bg-blue-600",
    follow: "bg-purple-600",
    join_request: "bg-yellow-600",
    join_request_accepted: "bg-teal-600",
    system: "bg-gray-700",
    custom: "bg-pink-600",
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar active="Notifications" />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>

        {notifications.length === 0 ? (
          <p className="text-gray-400">No notifications yet</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center ${typeColors[n.type] || "bg-gray-800"}`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-gray-100">{n.message}</p>
                  <p className="text-gray-300 text-xs mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                {n.type === "join_request" && (
  <div className="flex gap-2 mt-2 md:mt-0">
    <button
      onClick={() =>
        handleJoinRequest({
          ...n,
          actionType: "accept",
        })
      }
      className="px-3 py-1 bg-green-500 text-black rounded hover:bg-green-400"
    >
      Accept
    </button>
    <button
      onClick={() =>
        handleJoinRequest({
          ...n,
          actionType: "cancel",
        })
      }
      className="px-3 py-1 bg-red-500 text-black rounded hover:bg-red-400"
    >
      Cancel
    </button>
  </div>
)}

              </li>
            ))}
          </ul>
        )}

        {message && <p className="mt-4 text-gray-300">{message}</p>}
      </main>
    </div>
  );
}
