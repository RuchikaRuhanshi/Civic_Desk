import React from "react";
import { MapPin, ThumbsUp, ChevronRight, Sparkles, User, HelpCircle } from "lucide-react";
import { CATEGORY_META, STATUS_META } from "../meta";

export default function TicketCard({ t, onVerify, onAdvance }) {
  const cat = CATEGORY_META[t.category] || CATEGORY_META.Other;
  const Icon = cat.icon || HelpCircle;
  const status = STATUS_META[t.status] || { label: t.status, color: "#8A8F9C" };

  return (
    <div
      className="glass-panel glow-card rounded-xl p-5 flex flex-col gap-4 group transition-all duration-300 relative"
      style={{ borderTop: `2px solid ${cat.color}` }}
    >
      {/* 1. Card Image (with overlay and hover scale) */}
      {t.photoUrl && (
        <div className="image-zoom-container rounded-lg overflow-hidden h-36 bg-[#17181F] border border-[rgba(255,255,255,0.05)]">
          <img src={t.photoUrl} alt={t.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}

      {/* 2. Top row info: Icon, Ticket ID, Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center border border-[rgba(255,255,255,0.05)]"
            style={{ background: `${cat.color}15` }}
          >
            <Icon size={13} color={cat.color} />
          </span>
          <span className="text-[10px] font-mono text-slate-500">{t.ticketNumber}</span>
        </div>
        <span
          className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded tracking-wider uppercase border"
          style={{ 
            background: `${status.color}12`, 
            color: status.color,
            borderColor: `${status.color}25`
          }}
        >
          {status.label.toUpperCase()}
        </span>
      </div>

      {/* 3. Title & Description */}
      <div className="flex flex-col gap-1.5">
        <div className="font-serif font-bold text-white text-[16px] group-hover:text-[#D4AF37] transition-colors leading-snug">
          {t.category}
        </div>
        <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-3">
          {t.description}
        </p>
      </div>

      {/* 4. AI Tag suggestion (if applicable) */}
      {t.aiSuggestedCategory && (
        <div className="flex items-start gap-1.5 text-[10px] text-amber-400 bg-amber-400/5 border border-amber-400/10 px-2.5 py-1.5 rounded">
          <Sparkles size={11} className="mt-0.5 flex-shrink-0 animate-pulse" />
          <div className="leading-tight">
            <span className="font-bold">AI Autocat:</span> {t.aiSuggestedCategory} ({Math.round((t.aiConfidence || 0) * 100)}%)
            {t.aiReason ? <span className="text-slate-500"> — {t.aiReason}</span> : null}
          </div>
        </div>
      )}

      {/* 5. Geolocation / User Meta */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-[rgba(212,175,55,0.05)] pt-3 mt-1">
        <span className="flex items-center gap-1">
          <MapPin size={11} className="text-[#D4AF37]" />
          <span className="text-slate-400 font-semibold">{t.area}</span>
        </span>
        <span className="flex items-center gap-1 font-mono">
          <User size={11} />
          <span className="text-slate-400">{t.reporter}</span>
        </span>
      </div>

      {/* 6. Action Row: Verify & Advance buttons */}
      <div className="flex items-center gap-2 mt-1">
        {/* Confirm / Upvote Button */}
        <button
          onClick={() => onVerify(t._id)}
          className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300 bg-[#17181F] border border-[rgba(212,175,55,0.15)] rounded-lg py-2 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all hover:bg-black/20"
        >
          <ThumbsUp size={11} /> Confirm ({t.votes})
        </button>

        {/* Admin Advance Button */}
        {t.status !== "Resolved" && (
          <button
            onClick={() => onAdvance(t._id)}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#0A0B0E] bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#E5C158] hover:to-[#C5A880] rounded-lg px-3 py-2 transition-all hover:shadow-[0_0_10px_rgba(212,175,55,0.25)]"
          >
            <span>Next</span>
            <ChevronRight size={12} className="stroke-[2.5]" />
          </button>
        )}
      </div>

    </div>
  );
}
