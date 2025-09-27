"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";


export default function Home() {
  // Banner / Notice carousel
  const banners = [
    { id: 1, text: "🚀 Startup Meetup – Coming this November in Nashik!", link: "/events" },
    { id: 2, text: "🎉 CoCreate Hackathon – Build with us this December!", link: "/events" },
    { id: 3, text: "📢 Announcement: New partnerships launching soon.", link: "/announcements" },
  ];
  const [current, setCurrent] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(
      () => setCurrent((prev) => (prev + 1) % banners.length),
      5000
    );
    return () => clearInterval(interval);
  }, [banners.length]);

  // Background Audio
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        audioRef.current.play();
      } else {
        audioRef.current.muted = true;
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section with Video + Audio */}
      <section className="relative flex flex-col items-center justify-center text-center h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Background Audio */}
        <audio ref={audioRef} src="/sounds/intro.mp3" autoPlay loop />

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleAudio}
          className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 p-2 rounded-full"
        >
          {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>

        {/* Landing Options on Video */}
        <div className="relative z-10 px-6">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
            CoCreate Hub
          </h1>
          <p className="mt-6 text-lg max-w-3xl text-gray-200 leading-relaxed">
            Where <span className="text-white font-semibold">students</span> 
            and <span className="text-white font-semibold">innovators</span> 
            co-create the future 🚀
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 max-w-lg mx-auto">
            {/* Explore Home */}
            <a
              href="#about"
              className="px-6 py-3 bg-white text-black rounded-lg font-bold shadow-md hover:scale-105 transform transition duration-200"
            >
              Explore Home
            </a>

            {/* Login/Register for Students */}
            <Link
              href="/auth"
              className="px-6 py-3 border-2 border-white rounded-lg font-bold hover:bg-white hover:text-black hover:scale-105 transform transition duration-200"
            >
              Student Login / Register
            </Link>

            {/* Explore Pro Version */}
            <Link
              href="/pro"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-bold shadow-md hover:scale-105 transform transition duration-200"
            >
              Explore Pro Version
            </Link>

            {/* See Top Projects */}
            <a
              href="#projects"
              className="px-6 py-3 border-2 border-gray-300 text-white rounded-lg font-bold hover:bg-gray-200 hover:text-black hover:scale-105 transform transition duration-200"
            >
              See Top Projects
            </a>
          </div>
        </div>
      </section>

      {/* Announcement Banner */}
      <section className="relative bg-gradient-to-r from-purple-900 via-black to-purple-900 py-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
          <button
            onClick={() =>
              setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
            }
            className="text-gray-400 hover:text-white"
          >
            <ChevronLeft size={36} />
          </button>

          <Link
            href={banners[current].link}
            className="flex-1 text-center text-2xl md:text-3xl font-bold text-white px-6"
          >
            {banners[current].text}
          </Link>

          <button
            onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
            className="text-gray-400 hover:text-white"
          >
            <ChevronRight size={36} />
          </button>
        </div>
      </section>

      {/* Why CoCreate Section */}
      <section id="about" className="px-6 py-20 text-center bg-gray-100 text-black">
        <h2 className="text-4xl font-bold mb-10">Why CoCreate Hub?</h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-8 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-3">🚀 Faster Execution</h3>
            <p className="text-gray-600">
              Turn raw ideas into products with mentors, developers & startup experts.
            </p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-3">🤝 Meaningful Connections</h3>
            <p className="text-gray-600">
              Network with investors, entrepreneurs, and innovators who share your vision.
            </p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-3">💡 Real Impact</h3>
            <p className="text-gray-600">
              Ideas alone aren’t enough. We give you the space & support to make them real.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section id="projects" className="px-6 py-20 bg-black text-center">
        <h2 className="text-4xl font-bold mb-12">Top Projects from Students</h2>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Example Project 1 */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg group h-[420px]">
            <Image
              src="/krishi_setu.png"
              alt="Krishi Setu"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition"></div>

            <div className="relative z-10 p-8 flex flex-col justify-end h-full text-left">
              <h3 className="text-3xl font-bold">Krishi Setu</h3>
              <p className="mt-3 text-gray-300">
                Connecting farmers and investors. Support sustainable farming & empower communities.
              </p>
              <Link
                href="https://krishi-setu-landing.vercel.app/"
                className="mt-5 inline-block px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* Example Project 2 */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg group h-[420px]">
            <Image
              src="/punya_path.png"
              alt="Punya Path"
              className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition"></div>

            <div className="relative z-10 p-8 flex flex-col justify-end h-full text-left">
              <h3 className="text-3xl font-bold">Punya Path</h3>
              <p className="mt-3 text-gray-300">
                Tourism app for devotees — Seamless darshan, AI trip planning, and real-time updates.
              </p>
              <Link
                href="https://punye-path-landing.vercel.app/"
                className="mt-5 inline-block px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
              >
                Explore
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-center py-8 text-gray-400">
        <p>© {new Date().getFullYear()} CoCreateHubIndia, All rights reserved.</p>
        <div className="mt-3 flex justify-center space-x-6">
          <Link
            href="https://www.instagram.com/cocreatehubindia"
            className="hover:text-white"
          >
            Instagram
          </Link>
          <a href="mailto:cocreatehubindia@gmail.com" className="hover:text-white">
            cocreatehubindia@gmail.com
          </a>
        </div>
      </footer>
    </main>
  );
}
