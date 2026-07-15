import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  TrendingUp,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Trophy,
  BarChart3,
  Flame
} from "lucide-react";
import { CATEGORY_META, STATUS_META, STAGES } from "../meta";

export default function Dashboard({ stats }) {
  if (!stats) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center text-slate-400 text-sm font-mono">
        <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping mr-2.5" />
        Loading public docket analytics...
      </div>
    );
  }

  const categoryData = Object.keys(CATEGORY_META).map((c) => ({
    name: c,
    value: stats.byCategory?.[c] || 0,
    color: CATEGORY_META[c].color,
  }));

  const topCategory = [...categoryData].sort(
    (a, b) => b.value - a.value
  )[0];

  // Align colors of stat cards to carbon & gold gradient themes
  const statusCards = [
    {
      title: "Total Registered Reports",
      value: stats.total || 0,
      icon: AlertTriangle,
      glow: "hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]",
      borderColor: "border-[rgba(212,175,55,0.15)]",
      iconColor: "text-[#D4AF37]"
    },
    {
      title: "Successfully Resolved",
      value: stats.byStatus?.Resolved || 0,
      icon: CheckCircle2,
      glow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
      borderColor: "border-[rgba(16,185,129,0.15)]",
      iconColor: "text-emerald-400"
    },
    {
      title: "Active Under Review",
      value: (stats.byStatus?.["Pending"] || 0) + (stats.byStatus?.["In Progress"] || 0),
      icon: Clock3,
      glow: "hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]",
      borderColor: "border-[rgba(56,189,248,0.15)]",
      iconColor: "text-sky-400"
    },
    {
      title: "Community Resolution Rate",
      value: `${Math.min(
        100,
        Math.round(
          ((stats.byStatus?.Resolved || 0) /
            (stats.total || 1)) *
            100
        )
      )}%`,
      icon: Trophy,
      glow: "hover:shadow-[0_0_20px_rgba(251,191,36,0.15)]",
      borderColor: "border-[rgba(251,191,36,0.15)]",
      iconColor: "text-amber-400"
    },
  ];

  return (
    <div className="space-y-8 relative w-full pb-20">
      
      {/* Background glow orb to prevent empty space */}
      <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 blur-[130px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />

      {/* Header Info */}
      <div className="flex justify-between items-end flex-wrap gap-4 border-b border-[rgba(212,175,55,0.08)] pb-6 mb-8">
        <div>
          <span className="text-[#D4AF37] font-serif italic text-base font-semibold block mb-1">Ward Stats</span>
          <h2 className="text-3xl font-serif font-black uppercase tracking-tight flex items-center gap-2.5">
            <BarChart3 size={24} className="text-[#D4AF37]" /> Municipal Docket Analytics
          </h2>
        </div>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statusCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`glass-panel rounded-xl p-5 border ${card.borderColor} ${card.glow} flex flex-col justify-between h-[130px] transition-all`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h2 className="text-3xl font-bold text-white tracking-tight mt-2 font-mono">
                    {card.value}
                  </h2>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-[#17181F] border border-[rgba(255,255,255,0.05)] flex items-center justify-center ${card.iconColor}`}>
                  <Icon size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Chart */}
        <div className="glass-panel rounded-xl p-6 flex flex-col">
          <h3 className="font-serif font-bold text-white text-md uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-[#D4AF37] rounded-sm" /> Issues by Category
          </h3>
          <div className="flex-1 w-full min-h-[260px]">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#8A8F9C", fontSize: 10, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8A8F9C", fontSize: 10, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(212, 175, 55, 0.05)" }}
                  contentStyle={{
                    background: "#111217",
                    border: "1px solid rgba(212, 175, 55, 0.2)",
                    borderRadius: 8,
                    color: "#fff",
                    fontFamily: "monospace",
                    fontSize: 12
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {categoryData.map((d, i) => (
                    <Cell key={i} fill={d.color || "#D4AF37"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Chart */}
        <div className="glass-panel rounded-xl p-6 flex flex-col">
          <h3 className="font-serif font-bold text-white text-md uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-1.5 h-3 bg-[#D4AF37] rounded-sm" /> Status Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="w-full h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STAGES.map((s) => ({
                      name: s,
                      value: stats.byStatus?.[s] || 0,
                    }))}
                    dataKey="value"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={3}
                  >
                    {STAGES.map((s, i) => (
                      <Cell key={i} fill={STATUS_META[s].color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#111217",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      borderRadius: 8,
                      color: "#fff",
                      fontSize: 12
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-4">
              {STAGES.map((s) => {
                const count = stats.byStatus?.[s] || 0;
                const pct = stats.total ? (count / stats.total) * 100 : 0;
                const color = STATUS_META[s].color;

                return (
                  <div key={s} className="bg-[#17181F] p-3 rounded-lg border border-[rgba(255,255,255,0.03)]">
                    <div className="flex justify-between text-xs font-mono mb-2">
                      <span className="text-slate-400 font-semibold">{s.toUpperCase()}</span>
                      <span className="text-white font-bold">{count}</span>
                    </div>
                    <div className="h-1.5 bg-[#0F1115] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* RECENT CATEGORY DOCKET counts */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="font-serif font-bold text-white text-md uppercase tracking-wider mb-6 flex items-center gap-2">
          <span className="w-1.5 h-3 bg-[#D4AF37] rounded-sm" /> Registered Ward Records
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(stats.byCategory || {}).map(([key, value], i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-[#17181F] rounded-lg px-4 py-3.5 border border-[rgba(212,175,55,0.05)] hover:border-[#D4AF37] transition-all"
            >
              <div>
                <p className="text-white text-sm font-semibold">{key}</p>
                <p className="text-[10px] text-slate-500 font-mono">LIVE TRACKING ACTIVE</p>
              </div>
              <div className="text-xl font-black font-mono text-[#D4AF37]">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI ANALYTIC INSIGHT - Styled with golden glows */}
      <div className="rounded-xl p-6 flex items-start gap-4 bg-gradient-to-r from-[rgba(212,175,55,0.15)] to-[rgba(17,18,23,0.5)] border border-[rgba(212,175,55,0.2)] shadow-[0_0_20px_rgba(212,175,55,0.05)] relative overflow-hidden">
        <div className="absolute right-0 bottom-[-20%] text-[80px] font-black text-[rgba(212,175,55,0.02)] pointer-events-none font-serif">AI</div>
        <Flame size={22} className="text-[#D4AF37] shrink-0 mt-0.5 animate-pulse" />
        <div className="text-xs leading-relaxed text-slate-300">
          <strong className="text-[#D4AF37] font-serif italic text-sm block mb-1">Predictive Insight Docket</strong>
          <span className="text-white font-bold">{topCategory?.name || "Other"}</span> reports are trending highest this period ({topCategory?.value || 0} active). Historical municipal data suggests this distribution pattern correlates with seasonal ward bottlenecks. Proactive warden inspection scheduling is recommended for maximum resolution rates.
        </div>
      </div>

    </div>
  );
}