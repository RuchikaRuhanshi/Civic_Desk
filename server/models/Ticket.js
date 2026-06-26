import mongoose from "mongoose";

const STAGES = ["Reported", "Verified", "In Progress", "Resolved"];
const CATEGORIES = ["Pothole", "Water Leakage", "Streetlight", "Waste", "Other"];

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, unique: true },
    category: { type: String, enum: CATEGORIES, default: "Other" },
    aiSuggestedCategory: { type: String },
    aiConfidence: { type: Number },
    aiReason: { type: String },
    aiSource: { type: String, enum: ["ai", "heuristic"], default: "heuristic" },
    description: { type: String, required: true },
    area: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    photoUrl: { type: String },
    status: { type: String, enum: STAGES, default: "Reported" },
    votes: { type: Number, default: 0 },
    verifiedBy: [{ type: String }], // user names/ids who confirmed
    reporter: { type: String, default: "Anonymous" },
    statusHistory: [
      {
        status: String,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

ticketSchema.pre("save", async function (next) {
  if (!this.ticketNumber) {
    const count = await mongoose.model("Ticket").countDocuments();
    const year = new Date().getFullYear();
    this.ticketNumber = `CTZ-${year}-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

export const STATUS_STAGES = STAGES;
export const ISSUE_CATEGORIES = CATEGORIES;
export default mongoose.model("Ticket", ticketSchema);
