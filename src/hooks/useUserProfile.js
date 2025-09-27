"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";

export const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/user/getUserProfile", "GET");
      if (res.success) {
        const data = res.data;
        setUser(data.user);
        setProjects(data.projects || []);
        setBlogs(data.blogs || []);
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return { user, projects, blogs, appointments, loading, refresh: fetchUserProfile };
};
