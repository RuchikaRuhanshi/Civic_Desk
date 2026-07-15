import React from "react";
import { 
  Home as HomeIcon, 
  Camera, 
  Award, 
  MapPin, 
  BarChart3, 
  Trophy, 
  ListFilter, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Instagram, 
  Search, 
  Clock 
} from "lucide-react";

const TABS = [
  { key: "home", label: "Home", icon: HomeIcon },
  { key: "feed", label: "Feed", icon: ListFilter },
  { key: "map", label: "Map", icon: MapPin },
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Navbar({ tab, setTab, points, onReport, stats }) {
  return (
    <div className="w-full flex flex-col z-40 bg-[#0A0B0E]">
      
      {/* 1. Live Stats Scroll Ticker */}
      <div className="bg-[#111217] border-b border-[rgba(212,175,55,0.1)] text-[11px] font-mono tracking-wider overflow-hidden py-2 text-slate-400">
        <div className="w-full flex whitespace-nowrap overflow-hidden">
          <div className="animate-scroll-ticker flex gap-12">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              <span className="text-[#D4AF37] font-semibold">{stats?.total ?? "—"} ACTIVE WORK ORDERS</span>
            </span>
            <span className="text-slate-300">● {stats?.byStatus?.Resolved ?? 0} RESOLVED ISSUES</span>
            <span className="text-slate-300">● {stats?.resolutionRate ?? 0}% WARD RESOLUTION RATE</span>
            <span className="text-[#D4AF37]">● NEIGHBORHOOD VERIFICATION SYSTEM ONLINE</span>
            <span className="text-slate-300">● MUNICIPAL DISPATCH DOCKET SYNCD</span>
            {/* Repeat for continuous scroll */}
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
              <span className="text-[#D4AF37] font-semibold">{stats?.total ?? "—"} ACTIVE WORK ORDERS</span>
            </span>
            <span className="text-slate-300">● {stats?.byStatus?.Resolved ?? 0} RESOLVED ISSUES</span>
            <span className="text-slate-300">● {stats?.resolutionRate ?? 0}% WARD RESOLUTION RATE</span>
            <span className="text-[#D4AF37]">● NEIGHBORHOOD VERIFICATION SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Bar (The Govern Style aligned with Community Hero) */}
      <div className="border-b border-[rgba(212,175,55,0.08)] bg-[#0C0D12] px-6 py-3 flex items-center justify-between gap-4 flex-wrap text-xs text-slate-400">
        {/* Open Hours / Hackathon Challenge text */}
        <div className="flex items-center gap-2 font-medium">
          <Clock size={13} className="text-[#D4AF37]" />
          <span>Active Response Hours Mon - Fri: 8.00 am - 6.00 pm | Community Hero Initiative</span>
        </div>

        {/* Search and Socials */}
        <div className="flex items-center gap-6 flex-wrap">
          {/* Search Input */}
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Search of here"
              className="bg-[#111217] border border-[rgba(212,175,55,0.15)] rounded-l-md px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] w-48 transition-colors"
            />
            <button className="bg-[#D4AF37] hover:bg-[#AA7C11] text-[#0A0B0E] p-2 rounded-r-md transition-colors">
              <Search size={12} className="stroke-[3]" />
            </button>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-2">
            <a href="#" className="p-1.5 hover:text-[#D4AF37] transition-colors"><Twitter size={13} /></a>
            <a href="#" className="p-1.5 hover:text-[#D4AF37] transition-colors"><Facebook size={13} /></a>
            <a href="#" className="p-1.5 hover:text-[#D4AF37] transition-colors"><Linkedin size={13} /></a>
            <a href="#" className="p-1.5 hover:text-[#D4AF37] transition-colors"><Instagram size={13} /></a>
          </div>

          {/* Top Contact Button */}
          <button className="bg-white hover:bg-slate-200 text-[#0A0B0E] px-4 py-1.5 rounded font-bold transition-all text-[11px] uppercase tracking-wider">
            Contact
          </button>
        </div>
      </div>

      {/* 3. Main Navigation Header (Logo & Tabs) */}
      <div className="glass-panel sticky top-0 px-6 py-4 flex items-center justify-between gap-4 flex-wrap border-b border-[rgba(212,175,55,0.1)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        {/* Ribbon/Banner Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-[#111217] border border-[#D4AF37] px-3 py-2 rounded shadow-[0_0_15px_rgba(212,175,55,0.1)] flex flex-col items-center">
            <span className="font-serif font-black text-white leading-none tracking-tighter text-xs">Community</span>
            <span className="font-serif font-black text-[#D4AF37] leading-none tracking-widest text-[10px] mt-0.5 uppercase">Hero</span>
            <span className="text-[7px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">.org</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base text-white leading-tight">Civic<span className="text-[#D4AF37]">Desk</span></span>
            <span className="text-[9px] text-slate-500 font-mono tracking-wider">HYPERLOCAL PROBLEM SOLVER</span>
          </div>
        </div>

        {/* Tab Links */}
        <div className="flex bg-[#111217] rounded-xl p-1 border border-[rgba(212,175,55,0.06)]">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-300 ${
                tab === key
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A0B0E] shadow-[0_0_15px_rgba(212,175,55,0.25)] scale-[1.03]"
                  : "text-slate-400 hover:text-white hover:bg-[#17181F]"
              }`}
            >
              <Icon size={14} className={tab === key ? "stroke-[2.5]" : ""} /> {label}
            </button>
          ))}
        </div>

        {/* User Stats & Main Button */}
        <div className="flex items-center gap-4">
          {/* Points */}
          <div className="flex items-center gap-1.5 font-mono text-sm text-[#D4AF37] bg-[#111217] px-3.5 py-2 rounded-lg border border-[rgba(212,175,55,0.15)] shadow-inner">
            <Award size={15} className="text-[#D4AF37] animate-pulse" /> 
            <span className="font-bold text-white">{points}</span>
            <span className="text-[10px] text-slate-500 font-sans font-medium uppercase ml-0.5">pts</span>
          </div>

          {/* Report Button */}
          <button
            onClick={onReport}
            className="flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#E5C158] hover:to-[#C5A880] text-[#0A0B0E] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_20px_rgba(212,175,55,0.35)] transition-all hover:-translate-y-0.5"
          >
            <Camera size={14} className="stroke-[2.5]" /> Report Issue
          </button>
        </div>
      </div>

    </div>
  );
}
