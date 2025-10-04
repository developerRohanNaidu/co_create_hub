"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Layout from "@/components/Layout";
import Image from "next/image";

export default function ExpertDashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]); // if you still need projects
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // ✅ Call only the expert dashboard API
      const res = await apiRequest("/home/getExpertDashboard", "POST");

      if (res.success) {
        setAppointmentRequests(res.data.pendingRequests || []);
        setUpcomingAppointments(res.data.upcomingAppointments || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAcceptRequest = async (id) => {
    const res = await apiRequest(`/expert/appointments/accept/${id}`, "POST");
    if (res.success) fetchDashboardData();
  };

  const handleEditProject = (id) => {
    router.push(`/project/edit/${id}`);
  };

  const handleEditProfile = () => {
    router.push("/expert/profile");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Expert Dashboard</h1>
          <button
            onClick={handleEditProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>

        {/* Appointment Requests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Appointment Requests</h2>
          {appointmentRequests.length === 0 ? (
            <p className="text-gray-400">No pending requests</p>
          ) : (
            <ul className="space-y-2">
              {appointmentRequests.map((r) => (
                <li
                  key={r.id}
                  className="flex justify-between items-center p-4 bg-gray-900 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{r.User.name}</p>
                    <p className="text-gray-400">
                      {new Date(r.preferredDate).toLocaleDateString()} at{" "}
                      {new Date(r.preferredDate).toLocaleTimeString()}
                    </p>
                    <p className="text-gray-400">{r.User.email}</p>
                  </div>
                  <button
                    onClick={() => handleAcceptRequest(r.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Upcoming Appointments */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Upcoming Appointments</h2>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-400">No upcoming appointments</p>
          ) : (
            <ul className="space-y-2">
              {upcomingAppointments.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg"
                >
                  <Image
                    src={a.User.profile_image || "/default-avatar.png"}
                    alt={a.User.name}
                    width={50}
                    height={50}
                    className="rounded-full border-2 border-gray-700"
                  />
                  <div>
                    <p className="font-semibold">{a.User.name}</p>
                    <p className="text-gray-400">
                      {new Date(a.appointmentTime).toLocaleDateString()} at{" "}
                      {new Date(a.appointmentTime).toLocaleTimeString()}
                    </p>
                    <p className="text-gray-400">{a.User.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
}
