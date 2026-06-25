import React, { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import TicketCard from "./TicketCard";
import { CATEGORY_META } from "../meta";

export default function MapView({ tickets, onVerify, onAdvance }) {
  const [selected, setSelected] = useState(null);
  const center = tickets[0]?.location
    ? [tickets[0].location.lat, tickets[0].location.lng]
    : [22.7508, 88.3426];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
      <div className="rounded-2xl overflow-hidden border border-line" style={{ height: 420 }}>
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
                radius={9}
                pathOptions={{ color: cat.color, fillColor: cat.color, fillOpacity: 0.85, weight: 2 }}
                eventHandlers={{ click: () => setSelected(t) }}
              >
                <Popup>{t.category} — {t.area}</Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
      <div>
        {selected ? (
          <TicketCard t={selected} onVerify={onVerify} onAdvance={onAdvance} />
        ) : (
          <div className="glass rounded-2xl p-6 text-sm text-muted h-full flex items-center justify-center text-center">
            Click a pin on the map to view that report's details.
          </div>
        )}
      </div>
    </div>
  );
}
