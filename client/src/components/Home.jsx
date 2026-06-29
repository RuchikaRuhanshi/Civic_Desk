import React from "react";
import { ArrowRight, MapPin, Award, Activity, Camera } from "lucide-react";
import { motion } from "framer-motion";

export default function Home({ setTab, onReport }) {
  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 text-center overflow-hidden pb-20">
      
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-blue/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-16 mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium"
      >
        <Sparkles size={14} /> Empower Your Neighborhood
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 z-10"
      >
        Report Issues. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent2">
          Transform Your City.
        </span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="max-w-2xl text-lg text-muted mb-10 leading-relaxed z-10"
      >
        CivicDesk is your direct line to local authorities. Drop a pin, snap a photo, and track real-time resolution of potholes, streetlights, and more. Join the community and make an impact.
      </motion.p>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        className="flex flex-col sm:flex-row items-center gap-4 mb-20 z-10"
      >
        <button
          onClick={onReport}
          className="flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent2 text-white font-semibold rounded-xl transition-all shadow-glow hover:-translate-y-1"
        >
          <Camera size={20} />
          Report an Issue Now
        </button>
        <button
          onClick={() => setTab("feed")}
          className="flex items-center gap-2 px-8 py-4 glass text-white font-semibold rounded-xl hover:bg-panel transition-all hover:-translate-y-1"
        >
          View Live Feed
          <ArrowRight size={20} />
        </button>
      </motion.div>

      {/* Hero Visual Showcase */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-5xl mb-24 flex flex-col md:flex-row gap-6 justify-center items-center z-10"
      >
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full md:w-1/2 rounded-2xl overflow-hidden shadow-glow border border-line"
        >
          <img src="/smart_city.png" alt="Smart City" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full md:w-1/2 rounded-2xl overflow-hidden shadow-glow border border-line"
        >
          <img src="/map_pins.png" alt="Map Pins" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
        </motion.div>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-10"
      >
        <div className="glass p-8 rounded-2xl border border-line text-left hover:border-blue/50 transition-colors group">
          <div className="w-12 h-12 bg-blue/10 rounded-xl flex items-center justify-center text-blue mb-6 group-hover:scale-110 transition-transform">
            <MapPin size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-display">Hyperlocal Pinning</h3>
          <p className="text-muted text-sm leading-relaxed">
            Instantly map issues with precise geolocation. We use smart routing to alert the right municipal department.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl border border-line text-left hover:border-accent/50 transition-colors group">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
            <Activity size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-display">Live Tracking</h3>
          <p className="text-muted text-sm leading-relaxed">
            Monitor the status of your reports in real-time, from "Reported" to "Resolved," right on your dashboard.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl border border-line text-left hover:border-green/50 transition-colors group">
          <div className="w-12 h-12 bg-green/10 rounded-xl flex items-center justify-center text-green mb-6 group-hover:scale-110 transition-transform">
            <Award size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 font-display">Community Rewards</h3>
          <p className="text-muted text-sm leading-relaxed">
            Earn civic points by reporting and verifying issues. Climb the leaderboard and become a top contributor.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Sparkles({ size = 24, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
