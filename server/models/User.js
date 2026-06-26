import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    points: { type: Number, default: 0 },
    reportsFiled: { type: Number, default: 0 },
    verificationsGiven: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
