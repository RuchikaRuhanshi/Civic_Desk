import React from "react";
import TicketCard from "./TicketCard";
import { CATEGORY_META } from "../meta";
import { ListFilter, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function Feed({ tickets, filter, setFilter, onVerify, onAdvance, loading }) {
  return (
    <div className="w-full relative min-h-[70vh]">
      {/* Background glow orb to prevent empty space */}
      <div className="absolute top-[-5%] right-[10%] w-[35%] h-[35%] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />

      {/* Header Info */}
      <div className="mb-10 flex justify-between items-end flex-wrap gap-4 border-b border-[rgba(212,175,55,0.08)] pb-6">
        <div>
          <span className="text-[#D4AF37] font-serif italic text-base font-semibold block mb-1">Live Feed</span>
          <h2 className="text-3xl font-serif font-black uppercase tracking-tight flex items-center gap-2.5">
            <ListFilter size={24} className="text-[#D4AF37]" /> Community Work Orders
          </h2>
        </div>
        <div className="text-slate-400 font-mono text-[11px] uppercase tracking-wider bg-[#111217] px-3.5 py-2 rounded-lg border border-[rgba(212,175,55,0.1)]">
          Total: <span className="text-white font-bold">{tickets.length}</span> issues loaded
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2.5 mb-8 flex-wrap">
        {["All", ...Object.keys(CATEGORY_META)].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`text-xs font-semibold px-4 py-2 rounded-full border tracking-wide uppercase transition-all duration-300 ${
              filter === c
                ? "bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A0B0E] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                : "border-[rgba(212,175,55,0.15)] text-slate-400 hover:text-white hover:border-[#D4AF37] hover:bg-[#111217]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm font-mono p-10 bg-[#111217]/50 rounded-2xl border border-[rgba(212,175,55,0.05)]">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" /> Loading active docket...
        </div>
      ) : tickets.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111217] border border-[rgba(212,175,55,0.08)] rounded-2xl p-16 text-center text-slate-400 text-sm max-w-xl mx-auto shadow-xl"
        >
          <ShieldAlert size={40} className="text-[#D4AF37] mx-auto mb-4 animate-bounce" />
          <p className="font-serif font-bold text-white text-lg mb-2">No Active Tickets Found</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            There are currently no active issues reported under this category. Be the first to report an issue in your ward!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((t, idx) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <TicketCard t={t} onVerify={onVerify} onAdvance={onAdvance} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
