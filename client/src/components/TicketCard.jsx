import React from "react";
import { MapPin, ThumbsUp, ChevronRight, Sparkles } from "lucide-react";
import { CATEGORY_META, STATUS_META } from "../meta";

export default function TicketCard({ t, onVerify, onAdvance }) {
  const cat = CATEGORY_META[t.category] || CATEGORY_META.Other;
  const Icon = cat.icon;
  const status = STATUS_META[t.status];

  return (
    <div
      className="glass rounded-2xl p-4 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-card transition-all duration-200"
      style={{ borderLeft: `3px solid ${cat.color}` }}
    >
      {t.photoUrl && (
        <div className="rounded-xl overflow-hidden h-32 bg-panel2">
          <img src={t.photoUrl} alt={t.category} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${cat.color}22` }}
          >
            <Icon size={14} color={cat.color} />
          </span>
          <span className="text-[11px] font-mono text-muted">{t.ticketNumber}</span>
        </div>
        <span
          className="text-[10.5px] font-mono font-semibold px-2 py-1 rounded-md tracking-wide"
          style={{ background: `${status.color}1A`, color: status.color }}
        >
          {status.label.toUpperCase()}
        </span>
      </div>

      <div className="font-display font-semibold text-white text-[15px]">{t.category}</div>
      <p className="text-[13px] text-muted leading-relaxed">{t.description}</p>

      {t.aiSuggestedCategory && (
        <div className="flex items-center gap-1.5 text-[11px] text-blue">
          <Sparkles size={12} /> AI suggested {t.aiSuggestedCategory} ({Math.round((t.aiConfidence || 0) * 100)}%)
          {t.aiReason ? <span className="text-muted">— {t.aiReason}</span> : null}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-[11.5px] text-muted">
        <MapPin size={12} /> {t.area}
        <span className="opacity-40">·</span> {t.reporter}
      </div>

      <div className="flex items-center justify-between mt-1">
        <button
          onClick={() => onVerify(t._id)}
          className="flex items-center gap-1.5 text-[12px] font-medium text-white border border-line rounded-full px-3 py-1.5 hover:border-accent hover:text-accent transition-colors"
        >
          <ThumbsUp size={12} /> Confirm · {t.votes}
        </button>
        {t.status !== "Resolved" && (
          <button
            onClick={() => onAdvance(t._id)}
            className="flex items-center gap-1 text-[12px] font-semibold text-blue hover:text-white transition-colors"
          >
            Advance <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
