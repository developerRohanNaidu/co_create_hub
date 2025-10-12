"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Layout from "@/components/Layout";
import Image from "next/image";
import { Heart, MessageCircle, Users } from "lucide-react";
import ReportModal from "@/components/ReportModal";

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [commentsPage, setCommentsPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // ✅ Load logged-in user (assuming stored in localStorage after login)
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    const res = await apiRequest(`/project/${id}`, "GET");
    if (res.success) {
      setProject(res.project);
      setTotalCommentPages(res.project.commentsPages || 1);
    }
  };

  const handleLike = async () => {
    if (!project) return;
    const res = await apiRequest(`/home/projects/${project.id}/like`, "POST");
    if (res.success) fetchProject();
  };

  const handleCollabRequest = async () => {
    if (!project) return;
    const res = await apiRequest(`/home/projects/${project.id}/collaborate`, "POST");
    if (res.success) fetchProject();
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const res = await apiRequest(`/home/projects/${project.id}/comment`, "POST", {
      comment: newComment,
    });
    if (res.success) {
      setNewComment("");
      fetchProject();
    }
  };

  const loadMoreComments = async () => {
    if (commentsPage >= totalCommentPages) return;
    const nextPage = commentsPage + 1;
    const res = await apiRequest(
      `/projects/comments?id=${project.id}&page=${nextPage}&limit=5`,
      "GET"
    );
    if (res.success) {
      setProject((prev) => ({
        ...prev,
        comments: [...prev.comments, ...res.data],
      }));
      setCommentsPage(nextPage);
    }
  };

  if (!project)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );

  // ✅ Determine user relationships
  const isOwner = currentUser?.id === project.ownerId;
  const isCollaborator = project.collaborators?.some(
    (c) => c.id === currentUser?.id
  );
  const hasCollaborators = project.collaborators?.length > 0;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 space-y-6 text-white">
        {/* Title */}
        <h1 className="text-3xl font-bold">{project.title}</h1>

        {/* Images */}
        {project.images?.length > 0 && (
          <div className="flex overflow-x-auto gap-4 py-2">
            {project.images.map((img) => (
              <div
                key={img.id}
                className="relative w-80 h-48 flex-shrink-0 rounded-lg overflow-hidden"
              >
                <Image
                  src={img.url}
                  alt="Project Image"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        {/* Project Details */}
        <div className="text-gray-300 space-y-2">
          <p>{project.description}</p>
          <p>Goal Amount: ${project.goalAmount}</p>
          <p>Raised Amount: ${project.raisedAmount}</p>
          <p>Status: {project.status}</p>
          <p>Visibility: {project.visibility}</p>

          {project.categories?.length > 0 && (
            <p>Category: {project.categories.map((c) => c.name).join(", ")}</p>
          )}

          {project.hashtags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-700 rounded text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Project Owner */}
        {project.owner && (
          <div
            onClick={() => router.push(`/userProfile/${project.owner.id}`)}
            className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800 transition"
          >
            {project.owner.profile_image ? (
              <Image
                src={project.owner.profile_image}
                alt={project.owner.name}
                width={50}
                height={50}
                className="rounded-full border-2 border-gray-700"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                {project.owner.name?.[0] || "U"}
              </div>
            )}
            <div>
              <p className="font-semibold">{project.owner.name}</p>
              <p className="text-gray-400">Project Owner</p>
            </div>
          </div>
        )}

        {/* Collaborators */}
        {project.collaborators?.length > 0 && (
          <div className="flex items-center gap-4 mt-2">
            <Users className="text-white" size={20} />
            <div className="flex -space-x-3">
              {project.collaborators.map((c) => (
                <Image
                  key={c.id}
                  src={c.profile_image || "/default-avatar.png"}
                  alt={c.name}
                  width={35}
                  height={35}
                  className="rounded-full border-2 border-gray-900"
                />
              ))}
            </div>
          </div>
        )}

        {/* Like & Collaboration / Chat Room */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded-lg font-semibold ${
              project.likedByUser
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            <Heart size={16} className="inline mr-1" />{" "}
            {project.likesCount || 0} Like
          </button>

          {/* Collaboration / Chat Room logic */}
          {isOwner ? (
            hasCollaborators && (
              <button
                onClick={() => router.push(`/chat/${project.id}`)}
                className="px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700"
              >
                Chat Room
              </button>
            )
          ) : isCollaborator ? (
            <button
              onClick={() => router.push(`/chat/${project.id}`)}
              className="px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700"
            >
              Chat Room
            </button>
          ) : (
            <button
              onClick={handleCollabRequest}
              disabled={
                project.requestStatus === "pending" ||
                project.requestStatus === "approved"
              }
              className={`px-4 py-2 rounded-lg font-semibold text-white ${
                project.requestStatus
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Request Collaboration
            </button>
          )}
        </div>

        {/* Report Button */}
        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Report Project
        </button>

        {/* Comment Section */}
        <section className="mt-6">
          <h2 className="text-xl font-bold mb-2">Comments</h2>

          {/* Add Comment */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-900 border border-gray-700 text-white"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
            >
              Post
            </button>
          </div>

          {/* Comment List */}
          {project.comments?.length > 0 ? (
            <ul className="space-y-2">
              {project.comments.map((c) => (
                <li
                  key={c.id}
                  className="p-3 bg-gray-900 rounded-lg flex flex-col"
                >
                  <p className="font-semibold">{c.user?.name || "Unknown"}</p>
                  <p className="text-gray-400 text-sm">{c.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No comments yet</p>
          )}

          {/* Load more */}
          {commentsPage < totalCommentPages && (
            <button
              onClick={loadMoreComments}
              className="mt-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Load More Comments
            </button>
          )}
        </section>

        {/* Report Modal */}
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          referenceId={project.id}
          referenceType="project"
        />
      </div>
    </Layout>
  );
}
