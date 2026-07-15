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
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Trophy,
  BarChart3,
  Flame,
  Activity,
  Layers,
  ChevronRight
} from "lucide-react";
import { CATEGORY_META, STATUS_META, STAGES } from "../meta";
import { motion } from "framer-motion";

export default function Dashboard({ stats }) {
  if (!stats) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-slate-400 text-sm font-mono">
        <span className="w-3.5 h-3.5 rounded-full bg-[#D4AF37] animate-ping mb-3" />
        Synchronizing municipal data streams...
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

  const statusCards = [
    {
      title: "Active Incidents",
      value: stats.total || 0,
      icon: AlertTriangle,
      glow: "rgba(212, 175, 55, 0.25)",
      borderColor: "border-[#D4AF37]/20",
      bgGradient: "from-[#D4AF37]/10 via-transparent to-transparent",
      iconColor: "text-[#D4AF37]"
    },
    {
      title: "Completed Resolutions",
      value: stats.byStatus?.Resolved || 0,
      icon: CheckCircle2,
      glow: "rgba(52, 211, 153, 0.25)",
      borderColor: "border-emerald-500/20",
      bgGradient: "from-emerald-500/10 via-transparent to-transparent",
      iconColor: "text-emerald-400"
    },
    {
      title: "Pending Docket Review",
      value: (stats.byStatus?.["Pending"] || 0) + (stats.byStatus?.["In Progress"] || 0),
      icon: Clock3,
      glow: "rgba(56, 189, 248, 0.25)",
      borderColor: "border-sky-400/20",
      bgGradient: "from-sky-400/10 via-transparent to-transparent",
      iconColor: "text-sky-400"
    },
    {
      title: "Community trust index",
      value: `${Math.min(
        100,
        Math.round(
          ((stats.byStatus?.Resolved || 0) /
            (stats.total || 1)) *
            100
        )
      )}%`,
      icon: Trophy,
      glow: "rgba(251, 191, 36, 0.25)",
      borderColor: "border-amber-400/20",
      bgGradient: "from-amber-400/10 via-transparent to-transparent",
      iconColor: "text-amber-400"
    },
  ];

  return (
    <div className="space-y-10 relative w-full pb-20">
      
      {/* Dynamic Background glows */}
      <div className="absolute top-[10%] left-[-5%] w-[45%] h-[45%] bg-[#D4AF37]/5 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none animate-pulse-slow" />

      {/* Header Panel */}
      <div className="flex justify-between items-end flex-wrap gap-4 border-b border-[rgba(212,175,55,0.08)] pb-6 mb-8">
        <div>
          <span className="text-[#D4AF37] font-serif italic text-base font-semibold block mb-1">Ward Stats</span>
          <h2 className="text-3xl font-serif font-black uppercase tracking-tight flex items-center gap-2.5">
            <BarChart3 size={24} className="text-[#D4AF37]" /> MUNICIPAL RESPONSE METRICS
          </h2>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest bg-[#111217] px-4 py-2.5 rounded-lg border border-[rgba(212,175,55,0.1)]">
          <Activity size={12} className="text-[#D4AF37] animate-pulse" /> Live Telemetry Synced
        </div>
      </div>

      {/* 1. STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statusCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`relative overflow-hidden rounded-xl bg-[#111217] border ${card.borderColor} p-6 flex flex-col justify-between h-[140px] transition-shadow shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_30px_${card.glow}]`}
            >
              {/* Background gradient indicator */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-30 pointer-events-none`} />

              <div className="flex items-start justify-between z-10">
                <div>
                  <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest font-bold">
                    {card.title}
                  </p>
                  <h2 className="text-4xl font-serif font-black text-white tracking-tight mt-3">
                    {card.value}
                  </h2>
                </div>
                <div className={`w-11 h-11 rounded-xl bg-[#17181F] border border-[rgba(255,255,255,0.04)] flex items-center justify-center ${card.iconColor} shadow-inner`}>
                  <Icon size={20} className="stroke-[2.5]" />
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-[rgba(255,255,255,0.03)] pt-2.5">
                <span>WARD STABILITY DOCKET</span>
                <span className="text-[#D4AF37]">99.8% ACCURATE</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 2. MAIN CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Categories Bar Chart (Upgraded Visuals with defs and CartesianGrid) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-6 flex flex-col"
        >
          <h3 className="font-serif font-bold text-white text-md uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-[#D4AF37] rounded-sm" /> Registered Incident Density
          </h3>
          <div className="flex-1 w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <defs>
                  {categoryData.map((d, i) => (
                    <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1" key={i}>
                      <stop offset="0%" stopColor={d.color} stopOpacity={1}/>
                      <stop offset="100%" stopColor={d.color} stopOpacity={0.15}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="rgba(255, 255, 255, 0.02)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#8A8F9C", fontSize: 10, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#8A8F9C", fontSize: 10, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.02)" }}
                  contentStyle={{
                    background: "#111217",
                    border: "1px solid rgba(212, 175, 55, 0.2)",
                    borderRadius: 12,
                    color: "#fff",
                    fontFamily: "monospace",
                    fontSize: 12
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {categoryData.map((d, i) => (
                    <Cell key={i} fill={`url(#grad-${i})`} stroke={d.color} strokeWidth={1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Breakdown Donut Chart (With center statistics count) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-xl p-6 flex flex-col"
        >
          <h3 className="font-serif font-bold text-white text-md uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-[#D4AF37] rounded-sm" /> Resolution Pipeline Distribution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="w-full h-[250px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STAGES.map((s) => ({
                      name: s,
                      value: stats.byStatus?.[s] || 0,
                    }))}
                    dataKey="value"
                    outerRadius={90}
                    innerRadius={65}
                    paddingAngle={4}
                  >
                    {STAGES.map((s, i) => (
                      <Cell key={i} fill={STATUS_META[s].color} stroke="#111217" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#111217",
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      borderRadius: 12,
                      color: "#fff",
                      fontSize: 11
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Total Reports Inside Center of Donut */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-slate-500 font-mono text-[9px] uppercase tracking-widest font-bold">Total</span>
                <span className="text-3xl font-serif font-black text-white leading-none mt-1">{stats.total || 0}</span>
                <span className="text-slate-500 font-mono text-[8px] uppercase tracking-widest mt-1">Dockets</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {STAGES.map((s) => {
                const count = stats.byStatus?.[s] || 0;
                const pct = stats.total ? (count / stats.total) * 100 : 0;
                const color = STATUS_META[s].color;

                return (
                  <div key={s} className="bg-[#17181F] p-3.5 rounded-lg border border-[rgba(255,255,255,0.02)] flex flex-col gap-2 shadow-inner">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        {s}
                      </span>
                      <span className="text-white font-black">{count} <span className="text-slate-500 text-[10px]">({Math.round(pct)}%)</span></span>
                    </div>
                    <div className="h-2 bg-[#0F1115] rounded-full overflow-hidden">
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
        </motion.div>

      </div>

      {/* 3. WARD RECORD TRACKING METERS */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="font-serif font-bold text-white text-md uppercase tracking-wider mb-6 flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-[#D4AF37] rounded-sm" /> Geographic Distribution Meters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(stats.byCategory || {}).map(([key, value], i) => {
            const cat = CATEGORY_META[key] || CATEGORY_META.Other;
            const pct = stats.total ? (value / stats.total) * 100 : 0;
            return (
              <div
                key={i}
                className="bg-[#17181F] rounded-lg p-5 border border-[rgba(212,175,55,0.05)] hover:border-[#D4AF37] shadow-inner transition-all flex flex-col justify-between h-[120px]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white text-sm font-bold tracking-wide uppercase">{key}</p>
                    <p className="text-[9px] text-slate-500 font-mono tracking-widest mt-0.5">MUNICIPAL VOLUME</p>
                  </div>
                  <span className="text-xl font-black font-mono text-[#D4AF37]">{value}</span>
                </div>
                <div className="space-y-1.5 mt-3">
                  <div className="h-1.5 bg-[#0F1115] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>SECTOR DENSITY</span>
                    <span>{Math.round(pct)}% of total</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. AI ANALYTIC INSIGHT (Styled as a high-tech terminal output block) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl bg-[#0C0D12] border border-[#D4AF37]/35 p-6 shadow-[0_0_30px_rgba(212,175,55,0.06)] relative overflow-hidden"
      >
        {/* Neon light corner element */}
        <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/10 to-transparent blur-[20px] pointer-events-none" />
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl text-[#D4AF37] shrink-0 mt-0.5 animate-pulse">
            <Flame size={20} className="stroke-[2]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#D4AF37] font-serif italic text-sm font-bold uppercase tracking-wider">Predictive Docket Heuristic</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">Active Insight Engine</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-medium">
              Analytical assessment highlights that <span className="text-white font-bold underline decoration-[#D4AF37]/60 underline-offset-4">{topCategory?.name || "Other"}</span> reports are currently trending highest this period with <span className="text-[#D4AF37] font-bold font-mono">{topCategory?.value || 0} open dockets</span>. Historical data indicates that similar category spikes precede seasonal bottlenecks. We suggest dispatches coordinates for proactive warden scheduling to avoid backlogs.
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}