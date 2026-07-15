import React from "react";
import { Users, Trophy, Award, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard({ users, currentUser, currentPoints }) {
  const merged = users.some((u) => u.name === currentUser)
    ? users
    : [...users, { name: currentUser, points: currentPoints }];

  const sorted = [...merged].sort((a, b) => b.points - a.points);

  return (
    <div className="w-full relative min-h-[75vh]">
      {/* Background glow orb to prevent empty space */}
      <div className="absolute top-[-5%] left-[20%] w-[35%] h-[35%] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />

      {/* Header Info */}
      <div className="flex justify-between items-end flex-wrap gap-4 border-b border-[rgba(212,175,55,0.08)] pb-6 mb-10">
        <div>
          <span className="text-[#D4AF37] font-serif italic text-base font-semibold block mb-1">Standings</span>
          <h2 className="text-3xl font-serif font-black uppercase tracking-tight flex items-center gap-2.5">
            <Trophy size={24} className="text-[#D4AF37]" /> Top Civic Contributors
          </h2>
        </div>
        <div className="text-slate-400 font-mono text-[11px] uppercase tracking-wider bg-[#111217] px-3.5 py-2 rounded-lg border border-[rgba(212,175,55,0.1)]">
          Live Contributor Leaderboard
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {sorted.map((u, i) => {
          const isMe = u.name === currentUser;
          const isTop3 = i < 3;
          
          let medalColor = "text-slate-400";
          if (i === 0) medalColor = "text-yellow-400 gold-text-glow"; // Gold
          if (i === 1) medalColor = "text-slate-300";  // Silver
          if (i === 2) medalColor = "text-amber-600";  // Bronze

          return (
            <motion.div
              key={u.name}
              initial={{ opacity: 0, x: isMe ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className={`flex items-center gap-4 px-6 py-4.5 rounded-xl border transition-all duration-300 ${
                isMe 
                  ? "bg-gradient-to-r from-[rgba(212,175,55,0.15)] to-[#111217] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.1)] scale-[1.01]" 
                  : "bg-[#111217]/80 hover:bg-[#111217] border-[rgba(212,175,55,0.08)] hover:border-[rgba(212,175,55,0.2)] shadow-md"
              }`}
            >
              {/* Rank */}
              <div className={`font-serif font-black text-lg w-8 flex items-center justify-center ${medalColor}`}>
                {i === 0 ? (
                  <Trophy size={18} className="stroke-[2.5]" />
                ) : i === 1 || i === 2 ? (
                  <Award size={18} className="stroke-[2.5]" />
                ) : (
                  <span className="font-mono text-sm font-semibold text-slate-500">{i + 1}</span>
                )}
              </div>

              {/* User Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isMe ? "bg-[#D4AF37]/10 border-[#D4AF37]/30" : "bg-[#17181F] border-[rgba(255,255,255,0.05)]"}`}>
                <Users size={14} className={isMe ? "text-[#D4AF37]" : "text-slate-500"} />
              </div>

              {/* Username */}
              <div className="flex-1 min-w-0">
                <span className={`text-sm tracking-wide flex items-center gap-1.5 ${isMe ? "font-bold text-white" : "font-semibold text-slate-300"}`}>
                  {u.name}
                  {isMe && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#D4AF37] px-1.5 py-0.5 rounded">
                      You
                    </span>
                  )}
                  {isTop3 && (
                    <ShieldCheck size={13} className="text-[#D4AF37]" />
                  )}
                </span>
                <p className="text-[10px] text-slate-500 font-mono">VERIFIED CITIZEN DOCKET ENTRY</p>
              </div>

              {/* Points */}
              <div className="font-mono text-sm text-right flex flex-col justify-center">
                <span className={`font-bold ${isMe ? "text-[#D4AF37] text-base" : "text-slate-300"}`}>{u.points}</span>
                <span className="text-[8.5px] uppercase text-slate-500 font-sans tracking-widest font-medium">points</span>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
