import React from "react";
import { Home as HomeIcon, Camera, Award, MapPin, BarChart3, Trophy, ListFilter } from "lucide-react";

const TABS = [
  { key: "home", label: "Home", icon: HomeIcon },
  { key: "feed", label: "Feed", icon: ListFilter },
  { key: "map", label: "Map", icon: MapPin },
  { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  { key: "leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Navbar({ tab, setTab, points, onReport, stats }) {
  return (
    <div className="sticky top-0 z-40">
      {/* live ticker */}
      <div className="bg-ink/90 text-muted text-[11px] font-mono tracking-wide border-b border-line overflow-hidden">
        <div className="flex gap-10 px-6 py-1.5 whitespace-nowrap animate-[scroll_30s_linear_infinite]">
          <span className="text-accent">● {stats?.total ?? "—"} ACTIVE WORK ORDERS</span>
          <span>● {stats?.byStatus?.Resolved ?? 0} RESOLVED</span>
          <span>● {stats?.resolutionRate ?? 0}% RESOLUTION RATE</span>
          <span>● LIVE COMMUNITY VERIFICATION ENABLED</span>
        </div>
      </div>

      <div className="glass px-6 py-3 flex items-center justify-between gap-4 flex-wrap border-b border-line">
        <div className="font-display font-bold text-xl tracking-tight text-white">
          Civic<span className="text-accent">Desk</span>
        </div>

        <div className="flex bg-panel rounded-xl p-1 gap-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                tab === key
                  ? "bg-accent text-white shadow-glow"
                  : "text-muted hover:text-white hover:bg-panel2"
              }`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-sm text-white bg-panel px-3 py-1.5 rounded-lg border border-line">
            <Award size={14} className="text-accent2" /> {points}
          </div>
          <button
            onClick={onReport}
            className="flex items-center gap-2 bg-accent hover:bg-accent2 transition-colors text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-glow"
          >
            <Camera size={15} /> Report Issue
          </button>
        </div>
      </div>
    </div>
  );
}
