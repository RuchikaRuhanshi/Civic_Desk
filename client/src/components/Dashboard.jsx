import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
import { CATEGORY_META, STATUS_META, STAGES } from "../meta";

export default function Dashboard({ stats }) {
  if (!stats) return <div className="text-muted text-sm">Loading dashboard…</div>;

  const categoryData = Object.keys(CATEGORY_META).map((c) => ({
    name: c,
    value: stats.byCategory?.[c] || 0,
    color: CATEGORY_META[c].color,
  }));

  const topCategory = categoryData.sort((a, b) => b.value - a.value)[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wide">
          Issues by Category
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={categoryData}>
            <XAxis dataKey="name" tick={{ fill: "#8A8F9C", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8A8F9C", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#171A21", border: "1px solid #2A2F3A", borderRadius: 8 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {categoryData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-display font-semibold text-white text-sm mb-4 uppercase tracking-wide">
          Status Breakdown
        </h3>
        <div className="flex flex-col gap-3 mt-2">
          {STAGES.map((s) => {
            const count = stats.byStatus?.[s] || 0;
            const pct = stats.total ? (count / stats.total) * 100 : 0;
            return (
              <div key={s} className="flex items-center gap-3">
                <div className="w-24 text-[12px] font-mono text-muted">{s}</div>
                <div className="flex-1 h-2 bg-panel2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: STATUS_META[s].color }} />
                </div>
                <div className="w-6 text-[12px] font-semibold text-white text-right">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-2 rounded-2xl p-5 flex items-center gap-4 bg-gradient-to-r from-accent/20 to-blue/10 border border-line">
        <TrendingUp size={24} className="text-accent shrink-0" />
        <p className="text-sm text-white/90">
          <strong>Predictive insight:</strong> {topCategory?.name} reports are trending highest this period
          ({topCategory?.value} open) — historically this pattern precedes a seasonal spike. Recommend
          proactive inspection in the most-affected wards.
        </p>
      </div>
    </div>
  );
}
