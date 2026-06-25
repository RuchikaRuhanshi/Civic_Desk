import React from "react";
import TicketCard from "./TicketCard";
import { CATEGORY_META } from "../meta";

export default function Feed({ tickets, filter, setFilter, onVerify, onAdvance, loading }) {
  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {["All", ...Object.keys(CATEGORY_META)].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`text-[12.5px] font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
              filter === c
                ? "bg-white text-ink border-white"
                : "border-line text-muted hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-muted text-sm">Loading issues…</div>
      ) : tickets.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted text-sm">
          No issues here yet — be the first to file a report.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((t) => (
            <TicketCard key={t._id} t={t} onVerify={onVerify} onAdvance={onAdvance} />
          ))}
        </div>
      )}
    </div>
  );
}
