import React from "react";
import { Users, Trophy } from "lucide-react";

export default function Leaderboard({ users, currentUser, currentPoints }) {
  const merged = users.some((u) => u.name === currentUser)
    ? users
    : [...users, { name: currentUser, points: currentPoints }];

  const sorted = [...merged].sort((a, b) => b.points - a.points);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {sorted.map((u, i) => (
        <div
          key={u.name}
          className={`flex items-center gap-4 px-5 py-3.5 border-b border-line last:border-0 ${
            u.name === currentUser ? "bg-accent/10" : ""
          }`}
        >
          <div className={`font-display font-bold text-base w-6 ${i === 0 ? "text-accent2" : "text-white"}`}>
            {i === 0 ? <Trophy size={16} /> : i + 1}
          </div>
          <Users size={15} className="text-muted" />
          <div className={`flex-1 text-sm ${u.name === currentUser ? "font-semibold text-white" : "text-white/85"}`}>
            {u.name}
          </div>
          <div className="font-mono text-sm text-accent2 font-semibold">{u.points} pts</div>
        </div>
      ))}
    </div>
  );
}
