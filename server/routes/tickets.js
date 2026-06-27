import express from "express";
import Ticket, { STATUS_STAGES } from "../models/Ticket.js";
import User from "../models/User.js";
import upload from "../middleware/upload.js";
import { classifyIssue } from "../utils/classify.js";

const router = express.Router();

// GET /api/tickets?category=&status=
router.get("/", async (req, res) => {
  const { category, status } = req.query;
  const filter = {};
  if (category && category !== "All") filter.category = category;
  if (status && status !== "All") filter.status = status;
  const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
  res.json(tickets);
});

// POST /api/tickets  (multipart: photo, fields: description, area, lat, lng, reporter, category?)
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { description, area, lat, lng, reporter, category } = req.body;
    if (!description || !area || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: "description, area, lat and lng are required" });
    }

    const ai = await classifyIssue({
      filename: req.file?.originalname || "",
      description,
      photoPath: req.file?.path || null,
    });

    const ticket = await Ticket.create({
      description,
      area,
      location: { lat: Number(lat), lng: Number(lng) },
      photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
      category: category || ai.category,
      aiSuggestedCategory: ai.category,
      aiConfidence: ai.confidence,
      aiReason: ai.reason,
      aiSource: ai.source,
      reporter: reporter || "Anonymous",
      statusHistory: [{ status: "Reported" }],
    });

    if (reporter) {
      await User.findOneAndUpdate(
        { name: reporter },
        { $inc: { points: 25, reportsFiled: 1 } },
        { upsert: true }
      );
    }

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tickets/:id/verify  { user }
router.post("/:id/verify", async (req, res) => {
  const { user = "Anonymous" } = req.body;
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  if (ticket.verifiedBy.includes(user)) {
    return res.status(409).json({ error: "You've already confirmed this issue" });
  }

  ticket.votes += 1;
  ticket.verifiedBy.push(user);
  if (ticket.status === "Reported" && ticket.votes >= 5) {
    ticket.status = "Verified";
    ticket.statusHistory.push({ status: "Verified" });
  }
  await ticket.save();

  await User.findOneAndUpdate(
    { name: user },
    { $inc: { points: 5, verificationsGiven: 1 } },
    { upsert: true }
  );

  res.json(ticket);
});

// PATCH /api/tickets/:id/advance  -> moves to next status stage
router.patch("/:id/advance", async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });

  const idx = STATUS_STAGES.indexOf(ticket.status);
  const next = STATUS_STAGES[Math.min(idx + 1, STATUS_STAGES.length - 1)];
  ticket.status = next;
  ticket.statusHistory.push({ status: next });
  await ticket.save();

  res.json(ticket);
});

// GET /api/tickets/stats/summary -> dashboard aggregates
router.get("/stats/summary", async (req, res) => {
  const tickets = await Ticket.find();
  const byStatus = {};
  STATUS_STAGES.forEach((s) => (byStatus[s] = 0));
  const byCategory = {};

  tickets.forEach((t) => {
    byStatus[t.status] = (byStatus[t.status] || 0) + 1;
    byCategory[t.category] = (byCategory[t.category] || 0) + 1;
  });

  const resolved = byStatus["Resolved"] || 0;
  const resolutionRate = tickets.length ? Math.round((resolved / tickets.length) * 100) : 0;

  res.json({ total: tickets.length, byStatus, byCategory, resolutionRate });
});

export default router;
