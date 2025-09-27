"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { apiRequest } from "@/lib/api";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [message, setMessage] = useState("");

  const toggleNotifications = async () => {
    // Simulate API request to toggle notifications
    const res = await apiRequest("/user/toggleNotifications", "POST", {
      enabled: !notificationsEnabled,
    });
    if (res.success) {
      setNotificationsEnabled(!notificationsEnabled);
      setMessage(res.message || "Notification setting updated!");
    } else {
      setMessage(res.message || "Failed to update setting");
    }
  };

  const handleLogout = async () => {
    // Call your logout API or remove token
    await apiRequest("/auth/logout", "POST");
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar active="Settings" />
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Notifications Toggle */}
        <div className="flex justify-between items-center p-4 bg-gray-900 rounded-lg">
          <span className="font-semibold">Enable Notifications</span>
          <button
            onClick={toggleNotifications}
            className={`w-14 h-8 rounded-full p-1 transition-colors ${
              notificationsEnabled ? "bg-green-500" : "bg-gray-700"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                notificationsEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Logout */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-black font-semibold rounded hover:bg-red-500"
          >
            Logout
          </button>
        </div>

        {message && <p className="mt-4 text-gray-300">{message}</p>}
      </main>
    </div>
  );
}
