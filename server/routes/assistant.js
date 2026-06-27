import express from "express";
import Ticket from "../models/Ticket.js";
import { getAnthropicClient, AI_MODEL } from "../utils/anthropicClient.js";

const router = express.Router();

const SYSTEM_PROMPT = `You are the CivicDesk Assistant, a helpful civic-issue concierge embedded in a
community issue-reporting app. You help citizens:
- understand how to report potholes, water leakage, streetlight, and waste issues
- find out the status of issues near them using the ticket data provided
- understand what "community verification" and the points/leaderboard system mean
- get a short, plain-language summary of what's open in their area

You are given a snapshot of current tickets as JSON context. Use it to answer
questions about specific issues, counts, or status. If the answer isn't in the
data, say so plainly rather than guessing. Keep replies concise (3-5 sentences
max unless the user asks for a list). Never invent ticket numbers or statuses
that aren't in the provided context.`;

function staticFallback(message, tickets) {
  const text = message.toLowerCase();
  if (text.includes("report")) {
    return "Tap \"Report Issue\", attach a photo, describe what's wrong, and drop a pin on the map. Our AI suggests a category automatically — you can change it before submitting.";
  }
  if (text.includes("point") || text.includes("leaderboard")) {
    return "You earn 25 points for filing a report and 5 points for confirming someone else's report. Points show up on the Leaderboard tab.";
  }
  if (text.includes("status") || text.includes("near") || text.includes("open")) {
    const open = tickets.filter((t) => t.status !== "Resolved").length;
    return `There are currently ${open} open issue(s) out of ${tickets.length} total. Check the Feed or Map tab for details on each one.`;
  }
  return "I can help with reporting issues, checking statuses, or explaining how points and verification work. Try asking something like \"how do I report a pothole\" or \"what's still open near me\".";
}

// POST /api/assistant/chat  { message, history? }
router.post("/chat", async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: "message is required" });

  const tickets = await Ticket.find().sort({ createdAt: -1 }).limit(30).lean();
  const context = tickets.map((t) => ({
    ticketNumber: t.ticketNumber,
    category: t.category,
    status: t.status,
    area: t.area,
    votes: t.votes,
  }));

  const anthropic = getAnthropicClient();
  if (!anthropic) {
    return res.json({ reply: staticFallback(message, tickets), source: "fallback" });
  }

  try {
    const msg = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 400,
      system: `${SYSTEM_PROMPT}\n\nCurrent tickets:\n${JSON.stringify(context)}`,
      messages: [
        ...history.slice(-6).map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: message },
      ],
    });
    const reply = msg.content.find((b) => b.type === "text")?.text?.trim() || "Sorry, I couldn't generate a reply.";
    res.json({ reply, source: "ai" });
  } catch (err) {
    console.warn("[civicdesk] assistant chat failed, using fallback:", err.message);
    res.json({ reply: staticFallback(message, tickets), source: "fallback" });
  }
});

export default router;
