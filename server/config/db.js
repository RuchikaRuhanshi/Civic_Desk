import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/civicdesk";
  try {
    await mongoose.connect(uri);
    console.log("[civicdesk] MongoDB connected:", uri);
  } catch (err) {
    console.error("[civicdesk] MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
