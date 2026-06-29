import React, { useRef, useState } from "react";
import { X, Camera, MapPin, Sparkles, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { CATEGORY_META } from "../meta";
import { createTicket } from "../api";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl w-full max-w-md p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-white">Report an issue</h2>
          <button onClick={onClose} className="text-muted hover:text-white">
            <X size={18} />
          </button>
        </div>

        <button
          onClick={() => fileRef.current.click()}
          className="w-full h-32 rounded-xl border-2 border-dashed border-line hover:border-accent flex items-center justify-center mb-3 overflow-hidden text-muted hover:text-accent transition-colors"
        >
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" alt="preview" />
          ) : (
            <span className="flex items-center gap-2 text-sm"><Camera size={16} /> Attach a photo</span>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />

        <textarea
          placeholder="What's wrong here?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-panel border border-line rounded-lg p-3 text-sm text-white placeholder:text-muted mb-3 resize-none h-20 focus:outline-none focus:border-accent"
        />

        <input
          placeholder="Area / landmark"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full bg-panel border border-line rounded-lg p-3 text-sm text-white placeholder:text-muted mb-3 focus:outline-none focus:border-accent"
        />

        <div className="w-full bg-panel border border-line rounded-lg mb-3 overflow-hidden relative" style={{ height: 180 }}>
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
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[20] pointer-events-none">
              <span className="bg-black/60 px-3 py-1 rounded-full text-xs text-white">Click map to drop pin</span>
            </div>
          )}
        </div>

        <button
          onClick={useMyLocation}
          className="w-full flex items-center justify-center gap-2 text-sm text-blue border border-line rounded-lg py-2.5 mb-3 hover:border-blue transition-colors"
        >
          <MapPin size={14} /> {coords ? `Pinned (${coords?.lat?.toFixed(3) || coords[0]?.toFixed(3)}, ${coords?.lng?.toFixed(3) || coords[1]?.toFixed(3)})` : "Use my current location"}
        </button>

        {aiPreview && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 text-[12px] text-blue mb-2">
              <Sparkles size={12} /> AI suggests <strong className="text-white">{aiPreview}</strong> — adjust if needed
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(CATEGORY_META).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-[12px] px-3 py-1 rounded-full border transition-colors ${
                    category === c
                      ? "border-accent text-accent bg-accent/10"
                      : "border-line text-muted hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && <div className="text-red text-[12px] mb-3">{error}</div>}

        <button
          onClick={submit}
          disabled={submitting}
          className="w-full bg-accent hover:bg-accent2 disabled:opacity-60 text-white font-semibold rounded-lg py-3 text-sm flex items-center justify-center gap-2 transition-colors"
        >
          {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
          {submitting ? "Submitting…" : "Submit report · +25 pts"}
        </button>
      </div>
    </div>
  );
}
