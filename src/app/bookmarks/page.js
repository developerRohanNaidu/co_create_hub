"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiRequest } from "@/lib/api"; // your existing helper

export default function BookmarkScreen() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/home/getBookmarks", "GET");
      if (res.success) {
        setBookmarks(res.data || []);
      } else {
        console.error("Failed to load bookmarks");
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-lg">
        Loading bookmarks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Your Bookmarked Projects</h1>

      {bookmarks.length === 0 ? (
        <p className="text-gray-400">No bookmarked projects yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((project) => (
            <div
              key={project.id}
              className="bg-gray-900 rounded-2xl overflow-hidden hover:bg-gray-800 transition"
            >
              {/* Cover Image */}
              {project.images?.[0]?.url ? (
                <div className="relative h-40 w-full">
                  <Image
                    src={project.images[0].url}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 bg-gray-700 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* Content */}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold truncate">
                  {project.title}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {project.description || "No description available"}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => router.push(`/project/${project.id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                  >
                    View Project
                  </button>
                  <span className="text-gray-500 text-xs">
                    {project.visibility?.toUpperCase() || "PUBLIC"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
