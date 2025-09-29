"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Layout from "@/components/Layout";
import Image from "next/image";
import { Flame, Megaphone, Grid, BookOpen, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { messaging, getToken, onMessage } from "@/lib/firebaseConfig";

export default function HomePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]); // <-- Added state

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      initFirebaseMessaging();
    }
  }, []);

  const fetchData = async () => {
    const res = await apiRequest("/home/home", "GET");
    if (res.success) setData(res.data);
  };

  // --- Initialize Firebase Messaging ---
  const initFirebaseMessaging = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("Notification permission denied.");
        return;
      }
      console.log("Notification permission granted.");

      // Register service worker
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      // Get FCM token
      const fcmToken = await getToken(messaging, {
        vapidKey:
          "BMnZ6Uhu7PhYqGsRWSfHeX9qgtnQ11SNKn1jbpwlg8XtYSC5mRzezSS6wSEidaIH8zAQAelxM9VquyO_XQkudwg",
        serviceWorkerRegistration: registration,
      });

      if (fcmToken) {
        console.log("FCM Token:", fcmToken);
        await apiRequest("/user/updateFcmToken", "POST", { fcmToken });
      } else {
        console.log("No registration token available.");
      }

      // Listen for foreground messages
      onMessage(messaging, (payload) => {
        if (payload.notification) {
          const { title, body } = payload.notification;
          showNotification({ title, body });
        }
      });
    } catch (err) {
      console.error("Firebase messaging error:", err);
    }
  };

  // --- Show notification in-page ---
  const showNotification = (notification) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { ...notification, id }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const handleProjectClick = (id) => router.push(`/project/view/${id}`);
  const handleBlogClick = (id) => router.push(`/blog/view/${id}`);

  const getImageUrl = (imageObj) =>
    imageObj?.url
      ? imageObj.url.startsWith("http")
        ? imageObj.url
        : `http://localhost:5000${imageObj.url}`
      : null;

  return (
    <Layout>
      {/* --- Notification Container --- */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="min-w-[250px] bg-white dark:bg-gray-800 border-l-4 border-blue-500 shadow-lg rounded-lg p-4 animate-slide-in"
          >
            <h4 className="font-bold text-gray-900 dark:text-white">{n.title}</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">{n.body}</p>
          </div>
        ))}
      </div>

      <div className="space-y-12 px-4 md:px-8">
        {/* 🔥 Trending Projects */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Flame className="text-red-500" size={28} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trending Projects
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.projects?.map((p) => {
              const imageUrl = getImageUrl(p.images?.[0]);
              return (
                <div
                  key={p.id}
                  onClick={() => handleProjectClick(p.id)}
                  className="cursor-pointer bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform overflow-hidden"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={p.title}
                      className="h-40 w-full object-cover rounded-xl mb-3"
                    />
                  ) : (
                    <div className="h-40 w-full bg-gray-200 flex items-center justify-center rounded-xl mb-3">
                      <span className="text-gray-500 text-sm">No image available</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Likes: {p.likeCount} | Comments: {p.commentCount || 0}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 📢 Announcements */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Megaphone className="text-yellow-500" size={28} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Announcements
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.announcements?.map((a) => (
              <div
                key={a.id}
                className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg hover:scale-105 transition transform cursor-pointer"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {a.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {a.shortDescription}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 🗂 Categories */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Grid className="text-green-500" size={28} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Explore Categories
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {data?.categories?.map((c) => (
              <span
                key={c.id}
                onClick={() => router.push(`/category/${c.id}`)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full shadow cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {c.name}
              </span>
            ))}
          </div>
        </section>

        {/* 📖 Blogs */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="text-blue-500" size={28} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Read Blogs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.blogs?.map((b) => {
              const imageUrl = getImageUrl(b.images?.[0]);
              return (
                <div
                  key={b.id}
                  onClick={() => handleBlogClick(b.id)}
                  className="cursor-pointer bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition transform overflow-hidden"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={b.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No image available</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {b.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                      {b.shortDescription || "Read the full blog"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 👥 Connect with Expert */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-purple-500" size={28} />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Connect with Expert
            </h2>
          </div>
          <div className="relative group">
            <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-xl shadow-lg text-center transition-transform transform hover:scale-105 cursor-pointer">
              <p className="mb-4">
                Have a question? Connect with industry experts and get answers.
              </p>
              <button
                onClick={() => router.push("/expertForm")}
                className="px-6 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Connect Now
              </button>
            </div>
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 bg-white transition"></div>
          </div>
        </section>
      </div>

      {/* --- Tailwind slide-in animation --- */}
      <style jsx>{`
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </Layout>
  );
}
