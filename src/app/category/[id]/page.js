"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function CategoryPage() {
  const { id } = useParams(); // ✅ works in App Router
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCategoryProjects = async () => {
      try {
        const res = await apiRequest(`/home/getProjectsByCategory/${id}`, "GET");
        setCategory(res.data.category);
      } catch (error) {
        console.error("Error fetching category projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProjects();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!category) return <p className="text-center py-10">Category not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{category.name}</h1>

      {category.projects.length === 0 ? (
        <p className="text-gray-500">No projects in this category yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition"
            >
              {/* Project Image */}
              {project.images?.length > 0 && (
                <img
                  src={project.images[0].url}
                  alt={project.title}
                  className="h-40 w-full object-cover rounded-xl mb-3"
                />
              )}

              {/* Project Info */}
              <h2 className="text-lg font-semibold">{project.title}</h2>
              <p className="text-sm text-gray-600 line-clamp-2">
                {project.shortDescription}
              </p>

              {/* Owner */}
              <div className="flex items-center mt-3 gap-2">
                <img
                  src={project.owner?.profile_image || "/default-avatar.png"}
                  alt={project.owner?.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-700">
                  {project.owner?.name}
                </span>
              </div>

              {/* Collaborators */}
              {project.collaborators?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-500">
                    Experts:
                  </p>
                  <div className="flex -space-x-2 mt-1">
                    {project.collaborators.slice(0, 3).map((expert) => (
                      <img
                        key={expert.id}
                        src={expert.profile_image || "/default-avatar.png"}
                        alt={expert.name}
                        className="w-7 h-7 rounded-full border border-white"
                        title={expert.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
