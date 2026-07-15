import React, { useRef, useState } from "react";
import { X, Camera, MapPin, Sparkles, Loader2, Landmark } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { CATEGORY_META } from "../meta";
import { createTicket } from "../api";
import { motion, AnimatePresence } from "framer-motion";

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function ReportModal({ onClose, onCreated, currentUser }) {
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [coords, setCoords] = useState(null);
  const [category, setCategory] = useState(null);
  const [aiPreview, setAiPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    // lightweight client-side keyword guess, server re-classifies authoritatively
    const text = `${f.name} ${description}`.toLowerCase();
    const guess =
      ["pothole", "road", "crack"].some((k) => text.includes(k)) ? "Pothole" :
      ["leak", "water", "pipe"].some((k) => text.includes(k)) ? "Water Leakage" :
      ["light", "lamp", "bulb"].some((k) => text.includes(k)) ? "Streetlight" :
      ["trash", "garbage", "waste", "bin"].some((k) => text.includes(k)) ? "Waste" : "Other";
    setAiPreview(guess);
    setCategory(guess);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setCoords({ lat: 22.7508, lng: 88.3426 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords({ lat: 22.7508, lng: 88.3426 })
    );
  };

  const submit = async () => {
    if (!description || !area || !coords) {
      setError("Please add a description, area, and location.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("description", description);
      fd.append("area", area);
      fd.append("lat", coords.lat);
      fd.append("lng", coords.lng);
      fd.append("reporter", currentUser || "Anonymous");
      if (category) fd.append("category", category);
      if (file) fd.append("photo", file);
      const ticket = await createTicket(fd);
      onCreated(ticket);
    } catch (e) {
      setError(e?.response?.data?.error || "Something went wrong submitting your report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111217] border border-[rgba(212,175,55,0.2)] rounded-xl w-full max-w-md p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden"
      >
        {/* Background glow strip */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif font-bold text-lg text-white flex items-center gap-2">
            <Landmark size={18} className="text-[#D4AF37]" /> Report an Issue
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-[#D4AF37] p-1.5 bg-[#17181F] rounded-lg border border-[rgba(255,255,255,0.05)] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Photo Upload area */}
        <button
          onClick={() => fileRef.current.click()}
          className="w-full h-32 rounded-lg border border-dashed border-[rgba(212,175,55,0.2)] hover:border-[#D4AF37] bg-[#17181F] flex flex-col items-center justify-center mb-4 overflow-hidden text-slate-400 hover:text-[#D4AF37] transition-all"
        >
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" alt="preview" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Camera size={24} className="animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider">Attach issue photo</span>
            </div>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />

        {/* Text description */}
        <textarea
          placeholder="Detailed description of the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-[#17181F] border border-[rgba(212,175,55,0.15)] rounded-lg p-3 text-xs text-white placeholder:text-slate-500 mb-3.5 resize-none h-20 focus:outline-none focus:border-[#D4AF37] transition-colors"
        />

        {/* Landmark area */}
        <input
          placeholder="Area / landmark (e.g. Ward 4 / Main Street)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full bg-[#17181F] border border-[rgba(212,175,55,0.15)] rounded-lg p-3 text-xs text-white placeholder:text-slate-500 mb-3.5 focus:outline-none focus:border-[#D4AF37] transition-colors"
        />

        {/* Leaflet map picker wrapper */}
        <div className="w-full bg-[#17181F] border border-[rgba(212,175,55,0.15)] rounded-lg mb-3.5 overflow-hidden relative" style={{ height: 160 }}>
          <MapContainer
            center={coords || [22.7508, 88.3426]}
            zoom={14}
            style={{ height: "100%", width: "100%", zIndex: 10 }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap"
            />
            <LocationMarker position={coords} setPosition={setCoords} />
          </MapContainer>
          {!coords && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-[20] pointer-events-none">
              <span className="bg-[#111217] px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] border border-[rgba(212,175,55,0.2)]">
                Click map to drop pin
              </span>
            </div>
          )}
        </div>

        {/* Pin Location button */}
        <button
          onClick={useMyLocation}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 bg-[#17181F] border border-[rgba(212,175,55,0.15)] rounded-lg py-2.5 mb-4 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
        >
          <MapPin size={13} className="text-[#D4AF37]" /> 
          {coords ? `Pinned (${coords?.lat?.toFixed(3)}, ${coords?.lng?.toFixed(3)})` : "Use my current location"}
        </button>

        {/* AI suggested categories */}
        {aiPreview && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-[10.5px] text-amber-400 mb-2 bg-amber-400/5 px-2 py-1 rounded">
              <Sparkles size={11} className="animate-pulse" /> AI suggests <strong className="text-white">{aiPreview}</strong> — modify category if needed
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(CATEGORY_META).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border transition-all ${
                    category === c
                      ? "border-[#D4AF37] text-[#0A0B0E] bg-[#D4AF37]"
                      : "border-[rgba(212,175,55,0.15)] text-slate-400 hover:text-white hover:border-[#D4AF37]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="text-red-500 font-mono text-[10.5px] mb-4 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Submit action button */}
        <button
          onClick={submit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#E5C158] hover:to-[#C5A880] disabled:opacity-60 text-[#0A0B0E] font-bold rounded-lg py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          {submitting ? <Loader2 size={13} className="animate-spin" /> : null}
          {submitting ? "Submitting..." : "Submit report · +25 pts"}
        </button>
      </motion.div>
    </div>
  );
}
