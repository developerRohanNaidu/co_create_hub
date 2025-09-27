"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Layout from "@/components/Layout";
import Image from "next/image";
import { Flame, Megaphone, Grid, BookOpen, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await apiRequest("/home/home", "GET");
    if (res.success) setData(res.data);
  };

  const handleProjectClick = (id) => router.push(`/project/view/${id}`);
  const handleBlogClick = (id) => router.push(`/blog/view/${id}`);

  const getImageUrl = (imageObj, fallbackHeight = 200) => {
    if (imageObj?.url) {
      return imageObj.url.startsWith("http")
        ? imageObj.url
        : `http://localhost:5000${imageObj.url}`;
    }
    return null;
  };

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
            {data?.projects?.map((p) => {
              const imageUrl = getImageUrl(p.images?.[0], 160);
              return (
                <div
                  key={p.id}
                  onClick={() => handleProjectClick(p.id)}
                  className="cursor-pointer bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform overflow-hidden"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={p.title}
                      className="h-40 w-full object-cover rounded-xl mb-3"
                    />
                  ) : (
                    <div className="h-40 w-full bg-gray-200 flex items-center justify-center rounded-xl mb-3">
                      <span className="text-gray-500 text-sm">No image available</span>
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
              );
            })}
          </div>
        </section>

        {/* 📢 Announcements */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Megaphone className="text-yellow-500" size={28} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Announcements
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.announcements?.map((a) => (
              <div
                key={a.id}
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
            {data?.blogs?.map((b) => {
              const imageUrl = getImageUrl(b.images?.[0], 200);
              return (
                <div
                  key={b.id}
                  onClick={() => handleBlogClick(b.id)}
                  className="cursor-pointer bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform overflow-hidden"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={b.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No image available</span>
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
              );
            })}
          </div>
        </section>

        {/* 👥 Connect with Expert */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-purple-500" size={28} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Connect with Expert
            </h2>
          </div>
          <div className="relative group">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-xl shadow-lg text-center transition-transform transform hover:scale-105 cursor-pointer">
              <p className="mb-4">
                Have a question? Connect with industry experts and get answers.
              </p>
              <button
                onClick={() => router.push("/expertForm")}
                className="px-6 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Connect Now
              </button>
            </div>
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 bg-white transition"></div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
