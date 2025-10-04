"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Layout from "@/components/Layout";
import { Flame, Megaphone, Grid, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnnouncementModal from "@/components/AnnouncementModal";

export default function HomePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await apiRequest("/home/home", "GET");
    if (res.success) setData(res.data);
  };

  const getImageUrl = (img) =>
    img?.url
      ? img.url.startsWith("http")
        ? img.url
        : `http://localhost:5000${img.url}`
      : null;

  const handleProjectClick = (id) => router.push(`/project/view/${id}`);
  const handleBlogClick = (id) => router.push(`/blog/view/${id}`);

  return (
    <Layout>
      <div className="space-y-12 px-4 md:px-8">
        {/* 🔥 Trending Projects */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Flame className="text-red-500" size={28} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trending Projects
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.projects?.map((p) => (
              <div
                key={p.id}
                onClick={() => handleProjectClick(p.id)}
                className="cursor-pointer bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform overflow-hidden"
              >
                {getImageUrl(p.images?.[0]) ? (
                  <img
                    src={getImageUrl(p.images?.[0])}
                    alt={p.title}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No image</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Likes: {p.likeCount} | Comments: {p.commentCount || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 📢 Announcements */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Megaphone className="text-yellow-500" size={28} />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Announcements
              </h2>
            </div>
            <Link
              href="/announcements"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View More →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.announcements?.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedAnnouncement(a)}
                className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg hover:scale-105 transition transform cursor-pointer"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {a.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {a.shortDescription}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 🗂 Categories */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Grid className="text-green-500" size={28} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Explore Categories
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {data?.categories?.map((c) => (
              <span
                key={c.id}
                onClick={() => router.push(`/category/${c.id}`)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full shadow cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {c.name}
              </span>
            ))}
          </div>
        </section>

        {/* 📖 Blogs */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="text-blue-500" size={28} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Read Blogs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.blogs?.map((b) => (
              <div
                key={b.id}
                onClick={() => handleBlogClick(b.id)}
                className="cursor-pointer bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform overflow-hidden"
              >
                {b.images?.[0]?.url ? (
                  <img
                    src={getImageUrl(b.images?.[0])}
                    alt={b.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No image</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {b.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                    {b.shortDescription || "Read the full blog"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 📢 Modal */}
      {selectedAnnouncement && (
        <AnnouncementModal
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </Layout>
  );
}
