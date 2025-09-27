"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { multipartRequest, apiRequest } from "@/lib/api";
import Loader from "@/components/Loader";

export default function AddBlogPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false); // loader
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categories: [],
    images: [],
  });

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest("/blog/getCategories", "GET");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const toggleSelectCategory = (id) => {
    setFormData((prev) => {
      const arr = prev.categories;
      if (arr.includes(id)) {
        return { ...prev, categories: arr.filter((i) => i !== id) };
      } else {
        return { ...prev, categories: [...arr, id] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = new FormData();
    body.append("title", formData.title);
    body.append("content", formData.content);

    formData.categories.forEach((catId) => body.append("categories", catId));
    Array.from(formData.images).forEach((file) => body.append("blog_image", file));

    try {
      const res = await multipartRequest("/blog/createBlog", body, "POST");

      if (res.success) {
        alert("Blog created successfully!");
        setFormData({
          title: "",
          content: "",
          categories: [],
          images: [],
        });

        router.push("/profile"); // navigate to profile after success
      } else {
        alert(res.message || "Failed to create blog");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 relative">
      {loading && <Loader />}
      <h1 className="text-2xl font-bold mb-4">Add Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Blog Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleChange}
          className="w-full p-2 border rounded h-40"
        />

        <h3 className="font-semibold mt-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.categories.includes(cat.id)}
                onChange={() => toggleSelectCategory(cat.id)}
              />
              {cat.name}
            </label>
          ))}
        </div>

        <h3 className="font-semibold mt-4">Upload Images</h3>
        <input type="file" multiple onChange={handleFileChange} />

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
}
