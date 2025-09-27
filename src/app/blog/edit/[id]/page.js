"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Layout from "@/components/Layout";

export default function BlogEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    const res = await apiRequest(`/blog/${id}`, "GET");
    if (res.success) {
      setBlog(res.data);
      setForm({
        title: res.data.title || "",
        content: res.data.content || "",
        isPublished: res.data.isPublished || false,
      });
    }
  };

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const handleSubmit = async () => {
    const res = await apiRequest(`/blog/${id}`, "PUT", form);
    setMessage(res.message);
    if (res.success) router.push(`/blog/view/${id}`);
  };

  if (!blog)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Edit Blog</h1>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Blog Title"
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content"
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white h-40"
        />

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

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        >
          Save Changes
        </button>

        {message && <p className="text-gray-300">{message}</p>}
      </div>
    </Layout>
  );
}
