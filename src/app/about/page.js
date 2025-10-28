"use client";
import React from "react";
// import Sidebar from "@/components/Sidebar";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* <Sidebar active="About" /> */}
      <main className="flex-1 p-6 space-y-6">
        <section className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center">About Our Platform</h1>
          <p className="text-gray-400">
            Welcome! We are building a vibrant, global community dedicated to empowering the next generation of innovators. Our platform is more than just a place to post; it&apos;s a launchpad designed specifically for students to transform their ideas into reality and connect with the resources they need to succeed.
          </p>

          <h2 className="text-2xl font-semibold">What We Offer</h2>
          <p className="text-gray-400">
            Our mission is to bridge the gap between academic theory and real-world innovation. We do this by focusing on five key areas:
          </p>

          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>
              <strong>Showcase Your Vision:</strong> We provide the ultimate platform for students to showcase their projects and project ideas in any domain—from AI and robotics to sustainable energy and design. Let the world see what you&apos;re building!
            </li>
            <li>
              <strong>Forge the Right Connections:</strong> Don&apos;t work alone. Our intelligent matching system helps you connect with the right team partners or find interesting projects you want to contribute to, making collaboration effortless.
            </li>
            <li>
              <strong>Stay Ahead of the Curve:</strong> The tech world moves fast. We help you stay updated with new tech trends, tools, and methodologies through curated resources and community discussions.
            </li>
            <li>
              <strong>Gain Expert Guidance:</strong> Get the mentorship you deserve. Connect with industry-level experts for proper guidance, constructive feedback, and the help you need in building future products and navigating your career path.
            </li>
            <li>
              <strong>Attract Investment:</strong> We give you the incredible chance to showcase your project to investors and potential partners. If your idea is ready for the next level, we&apos;ll help you get in front of the people who can make it happen.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold">Our Vision</h2>
          <p className="text-gray-400">
            We believe that the most groundbreaking ideas come from passionate, ambitious students. Our vision is to create the world&apos;s leading ecosystem where student innovation is nurtured, connected to opportunity, and financially supported, ultimately building the future, one student project at a time.
          </p>

          <p className="text-gray-400 italic">
            Ready to launch your project or find your next great challenge? Join our community today!
          </p>

          <div className="mt-6 space-y-2 text-gray-400">
            <p>
              <strong>Instagram:</strong>{" "}
              <a
                href="https://www.instagram.com/cocreatehubindia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                @cocreatehubindia
              </a>
            </p>
            <p>
              <strong>Contact Email:</strong>{" "}
              <a
                href="mailto:cocreatehubindia@gmail.com"
                className="text-blue-500 hover:underline"
              >
                cocreatehubindia@gmail.com
              </a>
            </p>
            <p>
              <strong>Parent Company:</strong> Cocreatehubindia
            </p>
            <p className="text-gray-600 text-sm">© 2025 All rights reserved</p>
          </div>
        </section>
      </main>
    </div>
  );
}
