import { Construction, Droplets, Lightbulb, Trash2, Wrench } from "lucide-react";

export const CATEGORY_META = {
  Pothole: { icon: Construction, color: "#FF6B35" },
  "Water Leakage": { icon: Droplets, color: "#4F8FE0" },
  Streetlight: { icon: Lightbulb, color: "#FFC640" },
  Waste: { icon: Trash2, color: "#34C788" },
  Other: { icon: Wrench, color: "#8A8F9C" },
};

export const STATUS_META = {
  Reported: { color: "#FF5A5F", label: "Reported" },
  Verified: { color: "#4F8FE0", label: "Verified" },
  "In Progress": { color: "#FFC640", label: "In Progress" },
  Resolved: { color: "#34C788", label: "Resolved" },
};

export const STAGES = ["Reported", "Verified", "In Progress", "Resolved"];
