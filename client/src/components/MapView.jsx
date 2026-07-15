import React, { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import TicketCard from "./TicketCard";
import { CATEGORY_META } from "../meta";
import { Map, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function MapView({ tickets, onVerify, onAdvance }) {
  const [selected, setSelected] = useState(null);
  const center = tickets[0]?.location
    ? [tickets[0].location.lat, tickets[0].location.lng]
    : [22.7508, 88.3426];

  return (
    <div className="w-full relative min-h-[70vh] pb-10">
      
      {/* Background glow orb to prevent empty space */}
      <div className="absolute top-[-5%] left-[10%] w-[35%] h-[35%] bg-[#D4AF37]/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />

      {/* Header Info */}
      <div className="flex justify-between items-end flex-wrap gap-4 border-b border-[rgba(212,175,55,0.08)] pb-6 mb-8">
        <div>
          <span className="text-[#D4AF37] font-serif italic text-base font-semibold block mb-1">Ward Map</span>
          <h2 className="text-3xl font-serif font-black uppercase tracking-tight flex items-center gap-2.5">
            <Map size={24} className="text-[#D4AF37]" /> Interactive Pin Registry
          </h2>
        </div>
        <div className="text-slate-400 font-mono text-[11px] uppercase tracking-wider bg-[#111217] px-3.5 py-2 rounded-lg border border-[rgba(212,175,55,0.1)]">
          Live Geo-Verification active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* Map Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl overflow-hidden border border-[rgba(212,175,55,0.15)] shadow-2xl bg-[#111217]" 
          style={{ height: 460 }}
        >
          <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap, &copy; CARTO'
            />
            {tickets.map((t) => {
              const cat = CATEGORY_META[t.category] || CATEGORY_META.Other;
              return (
                <CircleMarker
                  key={t._id}
                  center={[t.location.lat, t.location.lng]}
                  radius={10}
                  pathOptions={{ 
                    color: cat.color, 
                    fillColor: cat.color, 
                    fillOpacity: 0.85, 
                    weight: 2.5 
                  }}
                  eventHandlers={{ click: () => setSelected(t) }}
                >
                  <Popup>
                    <div className="font-sans font-bold text-xs p-1 text-slate-800">
                      {t.category} <br />
                      <span className="text-[10px] text-slate-500 font-medium font-mono">{t.ticketNumber}</span>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </motion.div>

        {/* Sidebar Info Side */}
        <div className="flex flex-col justify-start">
          {selected ? (
            <motion.div
              key={selected._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <TicketCard t={selected} onVerify={onVerify} onAdvance={onAdvance} />
            </motion.div>
          ) : (
            <div className="glass-panel rounded-xl p-8 text-center h-[260px] flex flex-col items-center justify-center border border-[rgba(212,175,55,0.08)]">
              <Info size={32} className="text-[#D4AF37] mb-4 animate-pulse" />
              <p className="font-serif font-bold text-white text-lg mb-2">No Report Selected</p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Click a ticket's circle marker on the map to show coordinates, status metadata, and community confirm controls.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
