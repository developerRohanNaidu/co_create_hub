"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Skull, Code, Flame } from "lucide-react";

export default function ComingSoon() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background spooky animation */}
      <div className="absolute inset-0 animate-pulse opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-700 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600 blur-3xl rounded-full"></div>
      </div>

      {/* Floating icons */}
      <motion.div
        className="absolute top-20 left-20 text-gray-400"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Skull size={40} />
      </motion.div>
      <motion.div
        className="absolute bottom-24 right-20 text-gray-400"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Flame size={40} />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="z-10"
      >
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 flex justify-center items-center gap-2">
          <Sparkles className="text-purple-400" />
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Something’s Cooking
          </span>
          <Sparkles className="text-pink-400" />
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          The developers are deep in the dungeon... brewing code potions 🧪 and
          summoning pixels into life.
          <br />
          <span className="text-purple-400 font-semibold">
            Special things take time{dots}
          </span>
        </p>

        <motion.div
          className="mt-12 flex justify-center"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Code size={48} className="text-pink-500" />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-16 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-pink-500/50 transition"
        >
          Notify Me When It’s Live
        </motion.button>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} CoCreateHub India. Brewing innovation ⚙️
      </footer>
    </main>
  );
}
