"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Layout from "@/components/Layout";
import Image from "next/image";
import { Heart, MessageCircle, Flag } from "lucide-react";
import ReportModal from "@/components/ReportModal"; // ✅ make sure you have this component

export default function BlogDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // ✅ Fetch blog when ID changes
  useEffect(() => {
    const fetchBlog = async () => {
      const res = await apiRequest(`/blog/${id}`, "GET");
      if (res.success) setBlog(res.data);
    };

    if (id) fetchBlog();
  }, [id]);

  // ✅ Like handler
  const handleLike = async () => {
    if (isLiking || !blog) return;
    setIsLiking(true);
    try {
      const res = await apiRequest(`/home/blogs/${id}/like`, "POST");
      if (res.success) {
        setBlog((prev) => ({
          ...prev,
          liked: !prev.liked,
          likeCount: prev.liked
            ? Math.max((prev.likeCount || 1) - 1, 0)
            : (prev.likeCount || 0) + 1,
        }));
      }
    } finally {
      setIsLiking(false);
    }
  };

  if (!blog)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold">{blog.title}</h1>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="relative w-full h-72 rounded-lg overflow-hidden">
            <Image
              src={blog.coverImage}
              alt="Blog Cover"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        {/* Additional Images */}
        {blog.images?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blog.images.map((img, i) => (
              <div
                key={i}
                className="relative w-full h-56 rounded-lg overflow-hidden"
              >
                <Image
                  src={img.url}
                  alt={`Blog image ${i + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="text-gray-200 space-y-4">
          <p>{blog.content}</p>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
          {blog.author?.profile_image && (
            <Image
              src={blog.author.profile_image}
              alt={blog.author.name}
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-semibold">{blog.author?.name}</p>
            <p className="text-gray-400 text-sm">Author</p>
          </div>
        </div>

        {/* Like / Comment / Report */}
        <div className="flex items-center gap-6 mt-2">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center gap-1 hover:text-red-500 transition"
          >
            <Heart
              className={`${
                isLiking ? "animate-pulse" : ""
              } ${blog.liked ? "fill-red-500 text-red-500" : "text-white"}`}
              size={22}
            />
            <span>{blog.likeCount || 0}</span>
          </button>

          <div className="flex items-center gap-1">
            <MessageCircle className="text-white" size={20} />
            <span>{blog.commentCount || 0}</span>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-1 hover:text-yellow-500 transition"
          >
            <Flag size={20} />
            <span>Report</span>
          </button>
        </div>

        {/* ✅ Report Modal */}
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          referenceId={blog.id}
          referenceType="blog"
        />
      </div>
    </Layout>
  );
}
