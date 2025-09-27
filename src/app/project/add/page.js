"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { multipartRequest, apiRequest } from "@/lib/api"; 
import Loader from "@/components/Loader";

export default function AddProjectPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ loader state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    linkedinLink: "",
    instagramLink: "",
    gitLink: "",
    projectWebSite: "",
    goalAmount: "",
    location: "",
    startDate: "",
    endDate: "",
    categories: [],
    hashtags: [],
    project_image: [],
  });

  // fetch categories + hashtags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await apiRequest("/project/get/getCategories", "GET"); 
        const catData = await catRes.json();
        setCategories(catData.data);

        const tagRes = await apiRequest("/project/get/getHashtags", "GET"); 
        const tagData = await tagRes.json();
        setHashtags(tagData.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, project_image: e.target.files }));
  };

  const toggleSelect = (type, id) => {
    setFormData((prev) => {
      const arr = prev[type];
      if (arr.includes(id)) {
        return { ...prev, [type]: arr.filter((i) => i !== id) };
      } else {
        return { ...prev, [type]: [...arr, id] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ show loader

    const body = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "categories" || key === "hashtags") {
        formData[key].forEach((id) => body.append(key, id));
      } else if (key === "project_image") {
        Array.from(formData.project_image).forEach((file) => body.append("project_image", file));
      } else {
        body.append(key, formData[key]);
      }
    });

    try {
      const res = await multipartRequest("/project/createProject", body, "POST");

      if (res.success) {
        alert("Project created successfully!");
        setFormData({
          title: "",
          description: "",
          shortDescription: "",
          linkedinLink: "",
          instagramLink: "",
          gitLink: "",
          projectWebSite: "",
          goalAmount: "",
          location: "",
          startDate: "",
          endDate: "",
          categories: [],
          hashtags: [],
          project_image: [],
        });

        // ✅ navigate to profile after success
        router.push("/profile");
      } else {
        alert(res.message || "Failed to create project");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false); // ✅ hide loader
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 relative">
      {loading && <Loader />} {/* ✅ show loader */}
      <h1 className="text-2xl font-bold mb-4">Add Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="shortDescription" placeholder="Short Description" value={formData.shortDescription} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="linkedinLink" placeholder="LinkedIn" value={formData.linkedinLink} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="instagramLink" placeholder="Instagram" value={formData.instagramLink} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="gitLink" placeholder="GitHub" value={formData.gitLink} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="projectWebSite" placeholder="Website" value={formData.projectWebSite} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="goalAmount" type="number" placeholder="Goal Amount" value={formData.goalAmount} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="endDate" type="date" value={formData.endDate} onChange={handleChange} className="w-full p-2 border rounded" />

        <h3 className="font-semibold mt-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-1">
              <input type="checkbox" checked={formData.categories.includes(cat.id)} onChange={() => toggleSelect("categories", cat.id)} />
              {cat.name}
            </label>
          ))}
        </div>

        <h3 className="font-semibold mt-4">Hashtags</h3>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-1">
              <input type="checkbox" checked={formData.hashtags.includes(tag.id)} onChange={() => toggleSelect("hashtags", tag.id)} />
              #{tag.name}
            </label>
          ))}
        </div>

        <h3 className="font-semibold mt-4">Upload Images</h3>
        <input type="file" multiple onChange={handleFileChange} />

        <button type="submit" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
          Create Project
        </button>
      </form>
    </div>
  );
}
