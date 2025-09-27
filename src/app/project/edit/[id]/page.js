"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Layout from "@/components/Layout";
import Image from "next/image";

export default function ProjectEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [form, setForm] = useState({});
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    const res = await apiRequest(`/project/${id}`, "GET");
    if (res.success) {
      const data = res.project;
      setProject(data);
      setForm({
        title: data.title || "",
        description: data.description || "",
        goalAmount: data.goalAmount || "",
        status: data.status || "draft",
        visibility: data.visibility || "public",
      });
      setImages(data.images || []);
    }
  };

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await apiRequest(`/project/${id}/upload-image`, "POST", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.success) setImages([...images, res.data]);
  };

  const handleImageRemove = async (imgId) => {
    const res = await apiRequest(`/project/${id}/delete-image/${imgId}`, "DELETE");
    if (res.success) setImages(images.filter(img => img.id !== imgId));
  };

  const handleSubmit = async () => {
    const res = await apiRequest(`/project/${id}`, "PUT", {
      ...form,
      images,
    });
    setMessage(res.message);
    if (res.success) router.push(`/project/view/${id}`);
  };

  if (!project)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Edit Project</h1>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Project Title"
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Project Description"
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white h-32"
        />

        <input
          type="number"
          name="goalAmount"
          value={form.goalAmount}
          onChange={handleChange}
          placeholder="Goal Amount"
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <select
          name="visibility"
          value={form.visibility}
          onChange={handleChange}
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        {/* Images Section */}
        <div>
          <h2 className="font-semibold mb-2">Project Images</h2>
          <div className="flex gap-4 overflow-x-auto py-2">
            {images.map((img) => (
              <div key={img.id} className="relative w-40 h-28 flex-shrink-0 rounded overflow-hidden">
                <Image src={img.url} alt="Project Image" fill className="object-cover" />
                <button
                  onClick={() => handleImageRemove(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded px-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            onChange={handleImageUpload}
            className="mt-2 text-white"
          />
        </div>

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
