"use client";

import { useRouter } from "next/navigation";
import { Star, Users, CalendarCheck, Briefcase, CloudLightning } from "lucide-react";
import { motion } from "framer-motion";

export default function ProComingSoon() {
  const router = useRouter();

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const features = [
    {
      icon: <CloudLightning size={28} className="text-yellow-400" />,
      title: "Early Access Beta Features",
      description: "Be the first to try all upcoming tools before anyone else.",
    },
    {
      icon: <Users size={28} className="text-green-400" />,
      title: "Connect with Innovators",
      description: "Network with industry experts and potential collaborators.",
    },
    {
      icon: <CalendarCheck size={28} className="text-blue-400" />,
      title: "Meetings & Training",
      description: "Get guided sessions to start and grow your business effectively.",
    },
    {
      icon: <Briefcase size={28} className="text-pink-400" />,
      title: "Business Launch Support",
      description: "Access resources and mentorship for launching your own company.",
    },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white px-4 overflow-hidden">

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-bounce"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="text-center space-y-4 mb-12 relative z-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }}>
          <Star className="mx-auto text-yellow-400" size={48} />
        </motion.div>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold"
        >
          Pro Edition Coming Soon
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto"
        >
          Unlock upcoming features, beta tools, and exclusive access to connect with innovators, get business training, and launch your company.
        </motion.p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl w-full relative z-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={featureVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4"
          >
            {feature.icon}
            <div>
              <h3 className="font-semibold text-xl">{feature.title}</h3>
              <p className="text-gray-200 text-sm">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/upgrade-pro")}
        className="px-8 py-4 bg-yellow-400 text-purple-800 font-bold rounded-xl shadow-lg transition transform"
      >
        Get Pro Early Access
      </motion.button>

      {/* Footer Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-gray-300 text-sm mt-6 max-w-md text-center relative z-10"
      >
        Pro Edition coming soon. Stay tuned and upgrade to enjoy all the new features and exclusive perks.
      </motion.p>
    </div>
  );
}
