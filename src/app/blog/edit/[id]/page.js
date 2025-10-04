"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Layout from "@/components/Layout";

export default function BlogEditPage() {
  const router = useRouter();
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    isPublished: false,
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Fetch blog when ID changes
  useEffect(() => {
    const fetchBlog = async () => {
      const res = await apiRequest(`/blog/${id}`, "GET");
      if (res.success && res.data) {
        setBlog(res.data);
        setForm({
          title: res.data.title || "",
          content: res.data.content || "",
          isPublished: res.data.isPublished || false,
          image: res.data.image || null,
        });
        setPreview(res.data.image || null);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  // ✅ Handle image upload + preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);

      setForm((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  // ✅ Handle form submit
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("isPublished", form.isPublished);

    if (form.image instanceof File) {
      formData.append("image", form.image);
    }

    const res = await apiRequest(`/blog/${id}`, "PUT", formData, true);
    setMessage(res.message);

    if (res.success) router.push(`/blog/view/${id}`);
  };

  // ✅ Loading state
  if (!blog)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );

  // ✅ UI
  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Edit Blog</h1>

        {/* Blog Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Blog Title"
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        {/* Blog Content */}
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content"
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white h-40"
        />

        {/* Blog Image Upload */}
        <div className="space-y-2">
          <label className="block font-medium">Blog Image</label>

          {preview && (
            <img
              src={preview}
              alt="Blog Preview"
              className="w-full max-h-60 object-cover rounded border border-gray-700"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-white file:text-black
              hover:file:bg-gray-200"
          />
        </div>

        {/* Published Toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublished"
            checked={form.isPublished}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span>Published</span>
        </label>

        {/* Save Button */}
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        >
          Save Changes
        </button>

        {message && (
          <p className="text-gray-300 text-sm mt-2 border-t border-gray-700 pt-2">
            {message}
          </p>
        )}
      </div>
    </Layout>
  );
}
