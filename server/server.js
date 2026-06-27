import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db.js";
import ticketRoutes from "./routes/tickets.js";
import userRoutes from "./routes/users.js";
import assistantRoutes from "./routes/assistant.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assistant", assistantRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true, service: "civicdesk-api" }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`[civicdesk] API running on http://localhost:${PORT}`));
});
