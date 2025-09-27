"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState(null); // will store user + projects + blogs + appointments
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await apiRequest("/user/getUserProfile", "GET");
    if (res.success) {
      setData(res.data); // set the full response data
    }
  };

  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const updateProfile = async () => {
    const res = await apiRequest("/edit", "PUT", profileForm);
    if (res.success) {
      fetchUser();
      setMessage("Profile updated!");
      setEditProfileOpen(false);
    } else setMessage(res.message || "Update failed");
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const res = await apiRequest("/change-password", "POST", {
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });

    setMessage(res.message);
    if (res.success) setChangePasswordOpen(false);
  };

  if (!data)
    return (
      <div className="flex justify-center items-center h-screen text-white bg-black">
        Loading...
      </div>
    );

  const { user, projects, blogs, appointments } = data;

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar active="Profile" />
      <main className="flex-1 p-6 space-y-6">
        {/* Cover & Profile */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6">
          {user.cover_image && (
            <Image
              src={user.cover_image}
              alt="Cover"
              width={1200}
              height={300}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="absolute bottom-0 left-6 transform translate-y-1/2 flex items-center gap-4">
            {user.profile_image && (
              <Image
                src={user.profile_image}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full border-2 border-white"
              />
            )}
            <h1 className="text-2xl font-bold">{user.name}</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-center">
          <div>
            <p className="font-bold">{projects?.length || 0}</p>
            <p className="text-gray-400">Projects</p>
          </div>
          <div>
            <p className="font-bold">{blogs?.length || 0}</p>
            <p className="text-gray-400">Blogs</p>
          </div>
          <div>
            <p className="font-bold">{user.followersCount || 0}</p>
            <p className="text-gray-400">Followers</p>
          </div>
          <div>
            <p className="font-bold">{user.followingCount || 0}</p>
            <p className="text-gray-400">Following</p>
          </div>
        </div>

        {/* Projects */}
        <section>
          <h2 className="text-xl font-bold mb-2">Projects</h2>
          <div className="flex overflow-x-auto gap-4 py-2">
            {projects?.map((p) => (
              <div
                key={p.id}
                className="relative min-w-[250px] bg-gray-900 p-4 rounded-lg shadow hover:shadow-md cursor-pointer"
                onClick={() => router.push(`/project/${p.id}`)}
              >
                {p.images?.[0] && (
                  <Image
                    src={p.images[0].url}
                    alt={p.title}
                    width={250}
                    height={150}
                    className="rounded-lg mb-2"
                  />
                )}
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-gray-400 text-sm">
                  Likes: {p.likeCount} | Comments: {p.commentCount || 0}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/project/edit/${p.id}`);
                  }}
                  className="absolute top-2 right-2 p-1 bg-black text-white rounded hover:bg-white hover:text-black"
                >
                  <Pencil size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Blogs */}
        <section>
          <h2 className="text-xl font-bold mb-2">Blogs</h2>
          <div className="flex overflow-x-auto gap-4 py-2">
            {blogs?.map((b) => (
              <div
                key={b.id}
                className="relative min-w-[250px] bg-gray-900 p-4 rounded-lg shadow hover:shadow-md cursor-pointer"
                onClick={() => router.push(`/blog/${b.id}`)}
              >
                {b.images?.[0] && (
                  <Image
                    src={b.images[0].url}
                    alt={b.title}
                    width={250}
                    height={150}
                    className="rounded-lg mb-2"
                  />
                )}
                <h3 className="font-semibold">{b.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {b.shortDescription || b.content.slice(0, 50)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/blog/edit/${b.id}`);
                  }}
                  className="absolute top-2 right-2 p-1 bg-black text-white rounded hover:bg-white hover:text-black"
                >
                  <Pencil size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Appointments */}
        <section>
          <h2 className="text-xl font-bold mb-2">Appointments</h2>
          {appointments?.length > 0 ? (
            <ul className="bg-gray-900 rounded-lg p-4 space-y-2">
              {appointments.map((a) => (
                <li
                  key={a.id}
                  className="flex justify-between border-b border-gray-700 pb-2"
                >
                  <span>{a.title}</span>
                  <span>{a.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No appointments yet</p>
          )}
        </section>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setEditProfileOpen(!editProfileOpen)}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setChangePasswordOpen(!changePasswordOpen)}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
          >
            Change Password
          </button>
        </div>

        {/* Edit Profile */}
        {editProfileOpen && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={profileForm.name || user.name}
              onChange={handleProfileChange}
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />
            <input
              type="date"
              name="dob"
              placeholder="DOB"
              value={profileForm.dob || user.dob || ""}
              onChange={handleProfileChange}
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />
            <input
              type="text"
              name="bio"
              placeholder="Bio"
              value={profileForm.bio || user.bio || ""}
              onChange={handleProfileChange}
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />
            <button
              onClick={updateProfile}
              className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
            >
              Save
            </button>
          </div>
        )}

        {/* Change Password */}
        {changePasswordOpen && (
          <div className="mt-4 p-4 bg-gray-900 rounded-lg space-y-3">
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 bg-black border border-gray-700 rounded"
            />
            <button
              onClick={changePassword}
              className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
            >
              Update Password
            </button>
          </div>
        )}

        {message && <p className="mt-4 text-gray-300">{message}</p>}
      </main>
    </div>
  );
}
