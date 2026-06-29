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
} from "lucide-react";

import { CATEGORY_META, STATUS_META, STAGES } from "../meta";

export default function Dashboard({ stats }) {
  if (!stats) {
    return (
      <div className="text-muted text-sm">
        Loading dashboard…
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
      title: "Total Reports",
      value: stats.total || 0,
      icon: AlertTriangle,
      color: "from-orange-500/20 to-orange-400/5",
    },
    {
      title: "Resolved",
      value: stats.byStatus?.Resolved || 0,
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-emerald-400/5",
    },
    {
      title: "In Progress",
      value: stats.byStatus?.["In Progress"] || 0,
      icon: Clock3,
      color: "from-yellow-500/20 to-yellow-400/5",
    },
    {
      title: "Community Score",
      value: `${Math.min(
        100,
        Math.round(
          ((stats.byStatus?.Resolved || 0) /
            (stats.total || 1)) *
            100
        )
      )}%`,
      icon: Trophy,
      color: "from-blue-500/20 to-blue-400/5",
    },
  ];

  return (
    <div className="space-y-5">

      {/* TOP STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statusCards.map((card, i) => {
          const Icon = card.icon;

          return (
            <div
              key={i}
              className={`glass rounded-2xl p-5 border border-white/5 bg-gradient-to-br ${card.color} hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-muted text-sm">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold text-white mt-2">
                    {card.value}
                  </h2>
                </div>

                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Icon className="text-white" size={22} />
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* CATEGORY CHART */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wide">
            Issues by Category
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#8A8F9C", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#8A8F9C", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  background: "#171A21",
                  border: "1px solid #2A2F3A",
                  borderRadius: 12,
                }}
              />

              <Bar
                dataKey="value"
                radius={[10, 10, 0, 0]}
              >
                {categoryData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* STATUS BREAKDOWN */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wide">
            Status Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">

            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={STAGES.map((s) => ({
                    name: s,
                    value: stats.byStatus?.[s] || 0,
                    color: STATUS_META[s].color,
                  }))}
                  dataKey="value"
                  outerRadius={85}
                  innerRadius={50}
                >
                  {STAGES.map((s, i) => (
                    <Cell
                      key={i}
                      fill={STATUS_META[s].color}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-col gap-4">
              {STAGES.map((s) => {
                const count = stats.byStatus?.[s] || 0;

                const pct = stats.total
                  ? (count / stats.total) * 100
                  : 0;

                return (
                  <div key={s}>

                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted">
                        {s}
                      </span>

                      <span className="text-white">
                        {count}
                      </span>
                    </div>

                    <div className="h-2 bg-panel2 rounded-full overflow-hidden">

                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background:
                            STATUS_META[s].color,
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

      {/* RECENT ACTIVITY */}
      <div className="glass rounded-2xl p-5">

        <div className="flex items-center justify-between mb-4">

          <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wide">
            Recent Activity
          </h3>

          <span className="text-xs text-muted">
            Live updates
          </span>

        </div>

        <div className="space-y-3">

          {Object.entries(stats.byCategory || {}).map(
            ([key, value], i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5"
              >

                <div>
                  <p className="text-white text-sm font-medium">
                    {key} reports updated
                  </p>

                  <p className="text-xs text-muted">
                    Community verification active
                  </p>
                </div>

                <div className="text-accent font-bold">
                  {value}
                </div>

              </div>
            )
          )}

        </div>
      </div>

      {/* AI INSIGHT */}
      <div className="rounded-2xl p-6 flex items-start gap-4 bg-gradient-to-r from-orange-500/20 via-orange-400/10 to-blue-500/10 border border-orange-500/20 shadow-[0_0_40px_rgba(255,120,50,0.08)]">

        <TrendingUp
          size={24}
          className="text-accent shrink-0"
        />

        <p className="text-sm text-white/90 leading-7">

          <strong>Predictive insight:</strong>{" "}
          {topCategory?.name} reports are trending
          highest this period ({topCategory?.value} open)
          — historically this pattern precedes a
          seasonal spike.

          Recommend proactive inspection in the
          most-affected wards.

        </p>
      </div>

    </div>
  );
}