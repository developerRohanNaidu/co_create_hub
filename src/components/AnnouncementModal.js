"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/api";
import TicketModal from "@/components/TicketModal"; // ✅ Reuse your existing TicketModal

export default function AnnouncementModal({ announcement, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  if (!announcement) return null;

  const handleCountMeIn = async () => {
    try {
      setIsLoading(true);

      const body = {
        eventId: announcement.id,
        userType: "user", // you can change dynamically if admin/student etc.
      };

      const res = await apiRequest("/home/event-user/add", "POST", body);

      if (res.success && res.data) {
        setTicket(res.data); // Save ticket details from API response
      } else {
        alert(res.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error registering for event:", err);
      alert("Failed to register for event.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ If ticket generated, show TicketModal instead
  if (ticket) {
    return (
      <TicketModal
        event={announcement}
        ticket={ticket}
        onClose={() => {
          setTicket(null);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full relative p-6 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-red-500"
        >
          <X size={20} />
        </button>

        {/* Image */}
        {announcement.image && (
          <img
            src={
              announcement.image.startsWith("http")
                ? announcement.image
                : `http://localhost:5000${announcement.image}`
            }
            alt={announcement.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {announcement.title}
        </h2>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300">
          {announcement.longDescription || announcement.shortDescription}
        </p>

        {/* Footer */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Posted on:{" "}
          {announcement.createdAt
            ? new Date(announcement.createdAt).toLocaleDateString()
            : "Unknown"}
        </div>

        {/* ✅ “Count Me In” Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCountMeIn}
            disabled={isLoading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Count Me In 🎟️"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
