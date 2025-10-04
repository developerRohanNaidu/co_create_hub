"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import AnnouncementModal from "@/components/AnnouncementModal";

export default function AnnouncementListPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await apiRequest("/home/getAllAnnouncement", "GET");
    if (res.success) {
      setAnnouncements(res.data || []);
    }
  };

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Announcements & Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="bg-gray-900 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition"
            onClick={() => setSelected(a)}
          >
            {a.image && (
              <img src={a.image} alt={a.title} className="w-full h-40 object-cover rounded" />
            )}
            <h2 className="text-xl font-semibold mt-3">{a.title}</h2>
            <p className="text-gray-400">{a.shortDescription}</p>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <AnnouncementModal
          announcement={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
