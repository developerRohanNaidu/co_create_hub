// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { Calendar, FileText, Folder, Pencil } from "lucide-react";
// import Sidebar from "@/components/Sidebar";
// import { apiRequest } from "@/lib/api";

// export default function ProfilePage() {
//   const router = useRouter();
//   const [data, setData] = useState(null);
//   const [editProfileOpen, setEditProfileOpen] = useState(false);
//   const [changePasswordOpen, setChangePasswordOpen] = useState(false);
//   const [profileForm, setProfileForm] = useState({});
//   const [passwordForm, setPasswordForm] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [message, setMessage] = useState("");

//   // Refs for hidden file inputs
//   const coverInputRef = useRef(null);
//   const profileInputRef = useRef(null);

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const fetchUser = async () => {
//     const res = await apiRequest("/user/getUserProfile", "GET");
//     if (res.success) setData(res.data);
//   };

//   const handleProfileChange = (e) =>
//     setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

//   const handlePasswordChange = (e) =>
//     setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

//   const updateProfile = async () => {
//     const res = await apiRequest("/user/edit", "PUT", profileForm);
//     if (res.success) {
//       fetchUser();
//       setMessage("Profile updated!");
//       setEditProfileOpen(false);
//     } else setMessage(res.message || "Update failed");
//   };

//   const changePassword = async () => {
//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       setMessage("Passwords do not match!");
//       return;
//     }

//     const res = await apiRequest("/user/change-password", "POST", {
//       oldPassword: passwordForm.oldPassword,
//       newPassword: passwordForm.newPassword,
//     });

//     setMessage(res.message);
//     if (res.success) setChangePasswordOpen(false);
//   };

//   // Upload profile or cover image
//   const uploadImage = async (e, type) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);
//     formData.append("type", type); // "profile" or "cover"

//     const res = await apiRequest("/user/upload-image", "POST", formData, true);
//     if (res.success) {
//       fetchUser();
//       setMessage(`${type} image updated!`);
//     } else {
//       setMessage(res.message || "Image upload failed");
//     }
//   };

//   if (!data)
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-black text-white">
//         <p>Loading profile...</p>
//       </div>
//     );

//   const { user, projects, blogs, appointments } = data;

//   return (
//     <div className="flex min-h-screen bg-black text-white">
//       <Sidebar active="Profile" />
//       <main className="flex-1 p-6">
//         {/* Cover */}
//         <div className="relative h-48 w-full bg-gray-800 rounded-lg overflow-hidden">
//           {user.cover_image ? (
//             <Image
//               src={user.cover_image}
//               alt="Cover"
//               fill
//               className="object-cover"
//             />
//           ) : (
//             <div className="flex items-center justify-center h-full text-gray-400">
//               No cover photo
//             </div>
//           )}

//           {/* Hidden input for cover */}
//           <input
//             type="file"
//             ref={coverInputRef}
//             className="hidden"
//             accept="image/*"
//             onChange={(e) => uploadImage(e, "cover")}
//           />
//           <button
//             onClick={() => coverInputRef.current.click()}
//             className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-2 rounded-full"
//           >
//             <Pencil size={16} />
//           </button>
//         </div>

//         {/* Profile Info */}
//         <div className="max-w-4xl mx-auto px-4 -mt-16">
//           <div className="flex items-end gap-6 relative">
//             {/* Profile Picture */}
//             <div className="relative w-32 h-32 rounded-full border-4 border-black overflow-hidden">
//               {user.profile_image ? (
//                 <Image
//                   src={user.profile_image}
//                   alt="Profile"
//                   width={128}
//                   height={128}
//                   className="object-cover"
//                 />
//               ) : (
//                 <div className="flex items-center justify-center w-full h-full bg-gray-700 text-gray-400">
//                   No photo
//                 </div>
//               )}

//               {/* Hidden input for profile */}
//               <input
//                 type="file"
//                 ref={profileInputRef}
//                 className="hidden"
//                 accept="image/*"
//                 onChange={(e) => uploadImage(e, "profile")}
//               />
//               <button
//                 onClick={() => profileInputRef.current.click()}
//                 className="absolute bottom-2 right-2 bg-black/60 hover:bg-black text-white p-2 rounded-full"
//               >
//                 <Pencil size={14} />
//               </button>
//             </div>

//             {/* Name */}
//             <div className="flex-1">
//               <h1 className="text-2xl font-bold">{user.name}</h1>
//               <p className="text-gray-400">@{user.username || "No username"}</p>
//             </div>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
//             <div>
//               <p className="text-xl font-bold">{user.followersCount || 0}</p>
//               <p className="text-gray-400">Followers</p>
//             </div>
//             <div>
//               <p className="text-xl font-bold">{user.followingCount || 0}</p>
//               <p className="text-gray-400">Following</p>
//             </div>
//             <div>
//               <p className="text-xl font-bold">{projects?.length || 0}</p>
//               <p className="text-gray-400">Projects</p>
//             </div>
//             <div>
//               <p className="text-xl font-bold">{blogs?.length || 0}</p>
//               <p className="text-gray-400">Blogs</p>
//             </div>
//           </div>

//           {/* Joined Date */}
//           <div className="flex items-center gap-2 mt-4 text-gray-400">
//             <Calendar size={16} />
//             <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
//           </div>

//           {/* Projects */}
//           <section className="mt-8">
//             <h2 className="text-lg font-semibold flex items-center gap-2">
//               <Folder size={18} /> Projects
//             </h2>
//             {projects?.length > 0 ? (
//               <div className="mt-3 grid gap-4 md:grid-cols-2">
//                 {projects.map((p) => (
//                   <div
//                     key={p.id}
//                     className="relative bg-gray-900 p-4 rounded-lg border border-gray-700"
//                   >
//                     {p.images?.[0] && (
//                       <Image
//                         src={p.images[0].url}
//                         alt={p.title}
//                         width={400}
//                         height={200}
//                         className="rounded-lg mb-2"
//                       />
//                     )}
//                     <h3 className="font-semibold">{p.title}</h3>
//                     <p className="text-gray-400 text-sm">
//                       Likes: {p.likeCount} | Comments: {p.commentCount || 0}
//                     </p>
//                     <button
//                       onClick={() => router.push(`/project/edit/${p.id}`)}
//                       className="absolute top-2 right-2 p-1 bg-black text-white rounded hover:bg-white hover:text-black"
//                     >
//                       <Pencil size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="mt-3 text-gray-500 italic">No projects yet</p>
//             )}
//           </section>

//           {/* Blogs */}
//           <section className="mt-8">
//             <h2 className="text-lg font-semibold flex items-center gap-2">
//               <FileText size={18} /> Blogs
//             </h2>
//             {blogs?.length > 0 ? (
//               <div className="mt-3 grid gap-4 md:grid-cols-2">
//                 {blogs.map((b) => (
//                   <div
//                     key={b.id}
//                     className="relative bg-gray-900 p-4 rounded-lg border border-gray-700"
//                   >
//                     {b.images?.[0] && (
//                       <Image
//                         src={b.images[0].url}
//                         alt={b.title}
//                         width={400}
//                         height={200}
//                         className="rounded-lg mb-2"
//                       />
//                     )}
//                     <h3 className="font-semibold">{b.title}</h3>
//                     <p className="text-gray-400 text-sm line-clamp-2">
//                       {b.shortDescription || b.content.slice(0, 80)}
//                     </p>
//                     <button
//                       onClick={() => router.push(`/blog/edit/${b.id}`)}
//                       className="absolute top-2 right-2 p-1 bg-black text-white rounded hover:bg-white hover:text-black"
//                     >
//                       <Pencil size={16} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="mt-3 text-gray-500 italic">No blogs yet</p>
//             )}
//           </section>

//           {/* Appointments */}
//           <section className="mt-8">
//             <h2 className="text-lg font-semibold">Appointments</h2>
//             {appointments?.length > 0 ? (
//               <ul className="mt-3 bg-gray-900 rounded-lg p-4 space-y-2">
//                 {appointments.map((a) => (
//                   <li
//                     key={a.id}
//                     className="flex justify-between border-b border-gray-700 pb-2"
//                   >
//                     <span>{a.title}</span>
//                     <span>{a.date}</span>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="mt-3 text-gray-500 italic">No appointments yet</p>
//             )}
//           </section>

//           {/* Actions */}
//           <div className="flex gap-4 mt-6">
//             <button
//               onClick={() => setEditProfileOpen(!editProfileOpen)}
//               className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
//             >
//               Edit Profile
//             </button>
//             <button
//               onClick={() => setChangePasswordOpen(!changePasswordOpen)}
//               className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
//             >
//               Change Password
//             </button>
//           </div>

//           {/* Edit Profile */}
//           {editProfileOpen && (
//             <div className="mt-4 p-4 bg-gray-900 rounded-lg space-y-3">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 value={profileForm.name || user.name}
//                 onChange={handleProfileChange}
//                 className="w-full p-2 bg-black border border-gray-700 rounded"
//               />
//               <input
//                 type="date"
//                 name="dob"
//                 placeholder="DOB"
//                 value={profileForm.dob || user.dob || ""}
//                 onChange={handleProfileChange}
//                 className="w-full p-2 bg-black border border-gray-700 rounded"
//               />
//               <input
//                 type="text"
//                 name="bio"
//                 placeholder="Bio"
//                 value={profileForm.bio || user.bio || ""}
//                 onChange={handleProfileChange}
//                 className="w-full p-2 bg-black border border-gray-700 rounded"
//               />
//               <button
//                 onClick={updateProfile}
//                 className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
//               >
//                 Save
//               </button>
//             </div>
//           )}

//           {/* Change Password */}
//           {changePasswordOpen && (
//             <div className="mt-4 p-4 bg-gray-900 rounded-lg space-y-3">
//               <input
//                 type="password"
//                 name="oldPassword"
//                 placeholder="Old Password"
//                 value={passwordForm.oldPassword}
//                 onChange={handlePasswordChange}
//                 className="w-full p-2 bg-black border border-gray-700 rounded"
//               />
//               <input
//                 type="password"
//                 name="newPassword"
//                 placeholder="New Password"
//                 value={passwordForm.newPassword}
//                 onChange={handlePasswordChange}
//                 className="w-full p-2 bg-black border border-gray-700 rounded"
//               />
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 placeholder="Confirm Password"
//                 value={passwordForm.confirmPassword}
//                 onChange={handlePasswordChange}
//                 className="w-full p-2 bg-black border border-gray-700 rounded"
//               />
//               <button
//                 onClick={changePassword}
//                 className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
//               >
//                 Update Password
//               </button>
//             </div>
//           )}

//           {message && <p className="mt-4 text-gray-300">{message}</p>}
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, FileText, Folder, Pencil, Ticket } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { apiRequest } from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [events, setEvents] = useState([]);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [profileForm, setProfileForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  // Refs for hidden file inputs
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  useEffect(() => {
    fetchUser();
    fetchEvents();
  }, []);

  const fetchUser = async () => {
    const res = await apiRequest("/user/getUserProfile", "GET");
    if (res.success) setData(res.data);
  };

  const fetchEvents = async () => {
    const res = await apiRequest("/home/event-user/my-events", "GET");
    if (res.success) setEvents(res.data || []);
  };

  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const updateProfile = async () => {
    const res = await apiRequest("/user/edit", "PUT", profileForm);
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

    const res = await apiRequest("/user/change-password", "POST", {
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });

    setMessage(res.message);
    if (res.success) setChangePasswordOpen(false);
  };

  const uploadImage = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    const res = await apiRequest("/user/upload-image", "POST", formData, true);
    if (res.success) {
      fetchUser();
      setMessage(`${type} image updated!`);
    } else {
      setMessage(res.message || "Image upload failed");
    }
  };

  const downloadTicket = () => {
    const ticketElement = document.getElementById("ticket-card");
    if (!ticketElement) return;

    html2canvas(ticketElement, { backgroundColor: "#000" }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `ticket-${selectedEvent.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading profile...</p>
      </div>
    );

  const { user, projects, blogs, appointments } = data;

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar active="Profile" />
      <main className="flex-1 p-6">
        {/* Cover */}
        <div className="relative h-48 w-full bg-gray-800 rounded-lg overflow-hidden">
          {user.cover_image ? (
            <Image
              src={user.cover_image}
              alt="Cover"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No cover photo
            </div>
          )}

          <input
            type="file"
            ref={coverInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => uploadImage(e, "cover")}
          />
          <button
            onClick={() => coverInputRef.current.click()}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-2 rounded-full"
          >
            <Pencil size={16} />
          </button>
        </div>

        {/* Profile Info */}
        <div className="max-w-4xl mx-auto px-4 -mt-16">
          <div className="flex items-end gap-6 relative">
            <div className="relative w-32 h-32 rounded-full border-4 border-black overflow-hidden">
              {user.profile_image ? (
                <Image
                  src={user.profile_image}
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

              <input
                type="file"
                ref={profileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => uploadImage(e, "profile")}
              />
              <button
                onClick={() => profileInputRef.current.click()}
                className="absolute bottom-2 right-2 bg-black/60 hover:bg-black text-white p-2 rounded-full"
              >
                <Pencil size={14} />
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-400">@{user.username || "No username"}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
            <div>
              <p className="text-xl font-bold">{user.followersCount || 0}</p>
              <p className="text-gray-400">Followers</p>
            </div>
            <div>
              <p className="text-xl font-bold">{user.followingCount || 0}</p>
              <p className="text-gray-400">Following</p>
            </div>
            <div>
              <p className="text-xl font-bold">{projects?.length || 0}</p>
              <p className="text-gray-400">Projects</p>
            </div>
            <div>
              <p className="text-xl font-bold">{blogs?.length || 0}</p>
              <p className="text-gray-400">Blogs</p>
            </div>
          </div>

          {/* Joined Date */}
          <div className="flex items-center gap-2 mt-4 text-gray-400">
            <Calendar size={16} />
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Projects */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Folder size={18} /> Projects
            </h2>
            {projects?.length > 0 ? (
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="relative bg-gray-900 p-4 rounded-lg border border-gray-700"
                  >
                    {p.images?.[0] && (
                      <Image
                        src={p.images[0].url}
                        alt={p.title}
                        width={400}
                        height={200}
                        className="rounded-lg mb-2"
                      />
                    )}
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-gray-400 text-sm">
                      Likes: {p.likeCount} | Comments: {p.commentCount || 0}
                    </p>
                    <button
                      onClick={() => router.push(`/project/edit/${p.id}`)}
                      className="absolute top-2 right-2 p-1 bg-black text-white rounded hover:bg-white hover:text-black"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-gray-500 italic">No projects yet</p>
            )}
          </section>

          {/* Blogs */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={18} /> Blogs
            </h2>
            {blogs?.length > 0 ? (
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {blogs.map((b) => (
                  <div
                    key={b.id}
                    className="relative bg-gray-900 p-4 rounded-lg border border-gray-700"
                  >
                    {b.images?.[0] && (
                      <Image
                        src={b.images[0].url}
                        alt={b.title}
                        width={400}
                        height={200}
                        className="rounded-lg mb-2"
                      />
                    )}
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {b.shortDescription || b.content.slice(0, 80)}
                    </p>
                    <button
                      onClick={() => router.push(`/blog/edit/${b.id}`)}
                      className="absolute top-2 right-2 p-1 bg-black text-white rounded hover:bg-white hover:text-black"
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-gray-500 italic">No blogs yet</p>
            )}
          </section>

          {/* Appointments */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold">Appointments</h2>
            {appointments?.length > 0 ? (
              <ul className="mt-3 bg-gray-900 rounded-lg p-4 space-y-2">
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
              <p className="mt-3 text-gray-500 italic">No appointments yet</p>
            )}
          </section>

          {/* 🔹 Booked Events Section */}
          <section className="mt-8">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Ticket size={18} /> My Booked Events
            </h2>

            {events.length > 0 ? (
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col cursor-pointer hover:bg-gray-800"
                    onClick={() => setSelectedEvent(ev)}
                  >
                    {ev.image && (
                      <Image
                        src={ev.image}
                        alt={ev.title}
                        width={400}
                        height={200}
                        className="rounded-lg mb-3"
                      />
                    )}
                    <h3 className="font-semibold">{ev.title}</h3>
                    <p className="text-gray-400 text-sm">{ev.date}</p>
                    <p className="text-gray-400 text-sm">{ev.location}</p>
                    <p className="mt-2 text-gray-400 text-sm italic">
                      Click to view/download ticket
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-gray-500 italic">No booked events yet</p>
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
        </div>
      </main>

      {/* Modal for Ticket */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black text-white p-6 rounded-lg w-[400px] relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              ✖
            </button>

            {/* Ticket Card */}
            <div
              id="ticket-card"
              className="bg-black text-white border border-gray-700 rounded-lg p-6 space-y-4 text-center"
            >
              <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
              <p className="text-gray-400">Booked by: {user.name}</p>

              <div className="flex justify-center">
                <QRCodeSVG value={selectedEvent.qrCode || selectedEvent.id} size={150} fgColor="#fff" bgColor="#000" />
              </div>

              <div className="border-t border-gray-700 pt-2 mt-2 text-sm">
                Powered by <span className="font-bold">CCHI</span>
              </div>
            </div>

            <button
              onClick={downloadTicket}
              className="mt-4 w-full bg-white text-black font-semibold py-2 rounded hover:bg-gray-200"
            >
              ⬇ Download Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
