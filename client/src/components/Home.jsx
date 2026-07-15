import React, { useState } from "react";
import { 
  ArrowRight, 
  ArrowLeft,
  AlertTriangle, 
  Droplet, 
  Lightbulb, 
  Trash2, 
  Wrench, 
  HelpCircle, 
  Camera, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600",
    subtitle: "Community Hero Initiative",
    title: "Hyperlocal Problem Solver",
    desc: "Enabling citizens to identify, report, validate, track, and resolve community issues through collaboration, data, and intelligent AI automation."
  },
  {
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1600",
    subtitle: "Encouraging Transparency & Accountability",
    title: "Collaborative Civic Action",
    desc: "Connect with local municipal departments to report issues like potholes, streetlights, and water leaks. Join hands to build a safer neighborhood."
  }
];

const CATEGORIES = [
  { key: "Pothole", label: "Potholes", icon: AlertTriangle },
  { key: "Water Leakage", label: "Water Leaks", icon: Droplet },
  { key: "Streetlight", label: "Streetlights", icon: Lightbulb },
  { key: "Waste", label: "Waste", icon: Trash2 },
  { key: "Infrastructure", label: "Infrastructure", icon: Wrench },
  { key: "Other", label: "Other Issues", icon: HelpCircle },
];

export default function Home({ setTab, onReport }) {
  const [slideIndex, setSlideIndex] = useState(0);

  const nextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div className="w-full flex flex-col pb-24 text-white overflow-hidden relative">
      
      {/* Background ambient glows */}
      <div className="absolute top-[20%] left-[-15%] w-[45%] h-[45%] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[-15%] w-[40%] h-[40%] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" />

      {/* 1. HERO SLIDER SECTION */}
      <div className="relative h-[650px] w-full rounded-2xl overflow-hidden border border-[rgba(212,175,55,0.08)] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_SLIDES[slideIndex].image})` }}
          >
            {/* Ambient Dark Overlay with Golden Tint */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-transparent to-transparent opacity-90" />

            {/* Slide Content */}
            <div className="absolute inset-y-0 left-0 max-w-2xl px-12 md:px-20 flex flex-col justify-center items-start z-10">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-[#D4AF37] font-serif italic text-base md:text-lg tracking-wider mb-3 font-semibold flex items-center gap-1.5"
              >
                <Sparkles size={14} className="animate-pulse" /> {HERO_SLIDES[slideIndex].subtitle}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="font-serif text-4xl md:text-6xl font-black tracking-tight leading-none mb-6 uppercase"
              >
                {HERO_SLIDES[slideIndex].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 max-w-lg"
              >
                {HERO_SLIDES[slideIndex].desc}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <button
                  onClick={onReport}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#E5C158] hover:to-[#C5A880] text-[#0A0B0E] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all hover:-translate-y-0.5"
                >
                  <Camera size={14} className="stroke-[2.5]" /> Report an Issue
                </button>
                <button
                  onClick={() => setTab("feed")}
                  className="bg-[#111217]/80 hover:bg-[#17181F] text-white border border-[rgba(212,175,55,0.2)] hover:border-[#D4AF37] px-6 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5"
                >
                  View Active Docket
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Slider Controls */}
        <div className="absolute bottom-10 right-12 flex items-center gap-3 z-20">
          <button 
            onClick={prevSlide}
            className="p-3 bg-black/40 hover:bg-[#D4AF37] border border-[rgba(212,175,55,0.2)] hover:border-[#D4AF37] text-white hover:text-[#0A0B0E] rounded-full transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            onClick={nextSlide}
            className="p-3 bg-black/40 hover:bg-[#D4AF37] border border-[rgba(212,175,55,0.2)] hover:border-[#D4AF37] text-white hover:text-[#0A0B0E] rounded-full transition-all"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 2. OVERLAPPING CATEGORIES GRID (Potholes, Water Leaks, etc.) */}
      <div className="w-full max-w-5xl mx-auto px-6 -mt-16 z-20 mb-28">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {CATEGORIES.map(({ key, label, icon: Icon }, idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              onClick={() => {
                setTab("feed");
              }}
              className="group cursor-pointer bg-[#111217] border border-[rgba(212,175,55,0.1)] hover:border-[#D4AF37] rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_25px_rgba(212,175,55,0.08)] relative"
            >
              <div className="w-12 h-12 rounded-full bg-[#17181F] border border-[rgba(212,175,55,0.06)] group-hover:border-[#D4AF37] flex items-center justify-center mb-4 transition-colors">
                <Icon size={20} className="text-slate-400 group-hover:text-[#D4AF37] transition-colors" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
                {label}
              </span>
              {/* Sliding gold underline */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#D4AF37] group-hover:w-1/2 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. THREE-COLUMN HIGHLIGHTS SECTION (Evaluation Focus Elements) */}
      <div className="w-full max-w-6xl mx-auto px-6 mb-28">
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] font-serif italic text-base font-semibold block mb-2">Solution Blueprint</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight uppercase">Platform Architecture</h2>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Item 01 - AI Categorization */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group flex flex-col bg-[#111217] rounded-xl overflow-hidden border border-[rgba(212,175,55,0.08)] hover:border-[rgba(212,175,55,0.2)] shadow-lg transition-all"
          >
            <div className="image-zoom-container h-52 relative">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600" 
                alt="AI-Powered Categorization"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111217] to-transparent opacity-85" />
              <span className="absolute top-4 left-6 text-5xl font-black text-transparent stroke-gold font-serif" style={{ WebkitTextStroke: "1.5px rgba(212, 175, 55, 0.35)" }}>01</span>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors uppercase">AI Categorization</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-1">
                Attach pictures or files. Our backend leverages Anthropic client modules to dynamically classify issue descriptions, confidence margins, and route categories instantly.
              </p>
              <button 
                onClick={onReport} 
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] group-hover:text-white transition-colors"
              >
                Launch Reporter <ChevronRight size={12} />
              </button>
            </div>
          </motion.div>

          {/* Item 02 - Community Verification */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group flex flex-col bg-[#111217] rounded-xl overflow-hidden border border-[rgba(212,175,55,0.08)] hover:border-[rgba(212,175,55,0.2)] shadow-lg transition-all"
          >
            <div className="image-zoom-container h-52 relative">
              <img 
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600" 
                alt="Community Verification"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111217] to-transparent opacity-85" />
              <span className="absolute top-4 left-6 text-5xl font-black text-transparent stroke-gold font-serif" style={{ WebkitTextStroke: "1.5px rgba(212, 175, 55, 0.35)" }}>02</span>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors uppercase">Citizen Verify</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-1">
                Crowd-sourced validation ensures transparency. Neighboring citizens upvote local reports to authorize dispatch, preventing spam and establishing record integrity.
              </p>
              <button 
                onClick={() => setTab("feed")} 
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] group-hover:text-white transition-colors"
              >
                Open Verify Feed <ChevronRight size={12} />
              </button>
            </div>
          </motion.div>

          {/* Item 03 - Real-Time Resolution */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group flex flex-col bg-[#111217] rounded-xl overflow-hidden border border-[rgba(212,175,55,0.08)] hover:border-[rgba(212,175,55,0.2)] shadow-lg transition-all"
          >
            <div className="image-zoom-container h-52 relative">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600" 
                alt="Real-Time Issue Tracking"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111217] to-transparent opacity-85" />
              <span className="absolute top-4 left-6 text-5xl font-black text-transparent stroke-gold font-serif" style={{ WebkitTextStroke: "1.5px rgba(212, 175, 55, 0.35)" }}>03</span>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors uppercase">Real-Time Auditing</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-1">
                Track issues from validation checks, through active ward technician dispatches, all the way to complete resolution, ensuring full civic accountability.
              </p>
              <button 
                onClick={() => setTab("feed")} 
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] group-hover:text-white transition-colors"
              >
                Track Tickets <ChevronRight size={12} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4. TWO-COLUMN FEATURES SECTION */}
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column (Impact Analytics Dashboard) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-xl overflow-hidden border border-[rgba(212,175,55,0.1)] hover:border-[#D4AF37] shadow-xl min-h-[480px] flex flex-col justify-end p-10 transition-all duration-500"
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent opacity-90" />

            <div className="relative z-10">
              <span className="text-[#D4AF37] font-mono text-xs font-bold uppercase tracking-widest mb-2 block">Live Statistics</span>
              <h3 className="text-3xl font-serif font-black uppercase text-white mb-4">Impact Dashboards</h3>
              <p className="text-slate-300 text-xs leading-relaxed max-w-md mb-6">
                Monitor resolution rates, categories, status breakdown splits, and AI-driven predictive insights. Remove empty grey spaces with ambient grid models.
              </p>
              <button 
                onClick={() => setTab("dashboard")}
                className="w-10 h-10 rounded-full border border-white hover:border-[#D4AF37] hover:bg-[#D4AF37] text-white hover:text-[#0A0B0E] flex items-center justify-center transition-all group-hover:translate-x-2"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          {/* Right Column (Stacked Cards) */}
          <div className="flex flex-col gap-8 justify-between">
            {/* Top Right Card (Gamification for Citizens) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-xl overflow-hidden border border-[rgba(212,175,55,0.08)] hover:border-[#D4AF37] shadow-lg h-[225px] flex flex-col justify-end p-8 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-85" />

              <div className="relative z-10">
                <h4 className="text-xl font-serif font-bold text-white mb-1 uppercase tracking-tight">Gamified Citizen Score</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed max-w-sm mb-4">
                  Earn verify points (+25 pts per report/confirm) and establish top ranking contributor levels on community leaderboards.
                </p>
                <button 
                  onClick={() => setTab("leaderboard")}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] group-hover:text-white transition-colors"
                >
                  View Leaderboard <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>

            {/* Bottom Right Card (Geo-location Mapping) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-xl overflow-hidden border border-[rgba(212,175,55,0.08)] hover:border-[#D4AF37] shadow-lg h-[225px] flex flex-col justify-end p-8 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600')" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-85" />

              <div className="relative z-10">
                <h4 className="text-xl font-serif font-bold text-white mb-1 uppercase tracking-tight">Geo-location & Maps</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed max-w-sm mb-4">
                  Pins are geo-tagged with latitude and longitude coordinate accuracy to automatically alert the matching ward officer.
                </p>
                <button 
                  onClick={() => setTab("map")}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] group-hover:text-white transition-colors"
                >
                  Open Interactive Map <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

    </div>
  );
}
