"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Lock } from "lucide-react";

const navItems = [
  { name: "Explore", path: "/home" },
  { name: "Connect with Expert", path: "/expertForm" },
  { name: "Notifications", path: "/notifications" },
  { name: "Profile", path: "/profile" },
  { name: "Settings", path: "/settings" },
  { name: "About Us", path: "/about" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);

  return (
    <div className="flex">
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 h-screen w-64 bg-black text-white flex flex-col shadow-lg z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <div className="flex items-center gap-2">
                <Lock
                  className={`cursor-pointer ${
                    isLocked ? "text-white" : "text-gray-500"
                  }`}
                  onClick={() => setIsLocked(!isLocked)}
                />
                {!isLocked && (
                  <X
                    className="cursor-pointer text-gray-400 hover:text-white"
                    onClick={() => !isLocked && setIsOpen(false)}
                  />
                )}
              </div>
            </div>

            <nav className="flex flex-col mt-6 space-y-2 px-4">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={item.path}
                    className="block px-4 py-2 rounded hover:bg-gray-800 transition"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {/* Add Option */}
              <motion.div
                key="add"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navItems.length * 0.1 }}
              >
                <button
                  onClick={() => setShowAddPopup(true)}
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition"
                >
                  + Add
                </button>
              </motion.div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Menu button */}
      {!isOpen && !isLocked && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 bg-black p-2 rounded-full text-white shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Add Popup Modal */}
      <AnimatePresence>
        {showAddPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white text-black p-6 rounded-lg shadow-xl w-80"
            >
              <h2 className="text-xl font-bold mb-4 text-center">
                Add New
              </h2>
              <div className="flex flex-col gap-4">
                <Link
                  href="/project/add"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition text-center"
                >
                  Project
                </Link>
                <Link
                href="/blog/add"
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition text-center"
                >
                  Blog
                </Link>
              </div>
              <button
                onClick={() => setShowAddPopup(false)}
                className="mt-6 w-full py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
