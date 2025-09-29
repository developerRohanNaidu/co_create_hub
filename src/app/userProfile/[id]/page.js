"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Calendar, FileText, Folder, Users } from "lucide-react";

export default function UserProfile() {
  const { id } = useParams(); // profile id from route
  const [data, setData] = useState(null);

  const fetchUser = async () => {
    const res = await apiRequest(`/user/getUserProfile?id=${id}`, "GET");
    if (res.success) setData(res.data);
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cover Photo */}
      <div className="relative h-48 w-full bg-gray-800">
        {data.cover_image ? (
          <Image
            src={data.cover_image}
            alt="Cover"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No cover photo
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto px-4 -mt-16">
        <div className="flex items-end gap-6">
          {/* Profile Photo */}
          <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden">
            {data.profile_image ? (
              <Image
                src={data.profile_image}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-700 text-gray-400">
                No photo
              </div>
            )}
          </div>

          {/* Name + Follow */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p className="text-gray-400">@{data.username || "No username"}</p>
          </div>

          <button className="px-4 py-2 rounded-lg border border-white hover:bg-white hover:text-black transition">
            Follow
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
          <div>
            <p className="text-xl font-bold">{data.followersCount || 0}</p>
            <p className="text-gray-400">Followers</p>
          </div>
          <div>
            <p className="text-xl font-bold">{data.followingCount || 0}</p>
            <p className="text-gray-400">Following</p>
          </div>
          <div>
            <p className="text-xl font-bold">{data.projectsCount || 0}</p>
            <p className="text-gray-400">Projects</p>
          </div>
          <div>
            <p className="text-xl font-bold">{data.blogsCount || 0}</p>
            <p className="text-gray-400">Blogs</p>
          </div>
        </div>

        {/* Joined Date */}
        <div className="flex items-center gap-2 mt-4 text-gray-400">
          <Calendar size={16} />
          <span>Joined {new Date(data.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Projects List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Folder size={18} /> Projects
          </h2>
          {data.projects && data.projects.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {data.projects.map((p) => (
                <li
                  key={p.id}
                  className="p-3 rounded-lg bg-gray-900 border border-gray-700"
                >
                  {p.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-gray-500 italic">No projects yet</p>
          )}
        </div>

        {/* Blogs List */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText size={18} /> Blogs
          </h2>
          {data.blogs && data.blogs.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {data.blogs.map((b) => (
                <li
                  key={b.id}
                  className="p-3 rounded-lg bg-gray-900 border border-gray-700"
                >
                  {b.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-gray-500 italic">No blogs yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
