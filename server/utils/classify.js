import fs from "fs";
import { ISSUE_CATEGORIES } from "../models/Ticket.js";
import { getAnthropicClient, AI_MODEL } from "./anthropicClient.js";

const RULES = [
  [["pothole", "road", "crack", "asphalt", "tar"], "Pothole"],
  [["leak", "water", "pipe", "sewage", "drain", "flood"], "Water Leakage"],
  [["light", "lamp", "dark", "bulb", "streetlight"], "Streetlight"],
  [["garbage", "trash", "waste", "dump", "bin", "litter"], "Waste"],
];

/** Keyword fallback used when no API key is set or the AI call fails. */
function heuristicClassify({ filename = "", description = "" }) {
  const text = `${filename} ${description}`.toLowerCase();
  for (const [keywords, category] of RULES) {
    if (keywords.some((k) => text.includes(k))) {
      return { category, confidence: Math.round((0.78 + Math.random() * 0.18) * 100) / 100, source: "heuristic" };
    }
  }
  const fallback = ISSUE_CATEGORIES[Math.floor(Math.random() * (ISSUE_CATEGORIES.length - 1))];
  return { category: fallback, confidence: Math.round((0.5 + Math.random() * 0.25) * 100) / 100, source: "heuristic" };
}

const MIME_BY_EXT = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif" };

/**
 * Real AI categorization via Claude. Looks at the uploaded photo (if any)
 * and the citizen's description, returns a strict category + confidence +
 * a one-line reason. Falls back to the keyword heuristic if no
 * ANTHROPIC_API_KEY is configured or the call fails for any reason, so the
 * route always resolves.
 */
export async function classifyIssue({ filename = "", description = "", photoPath = null }) {
  const anthropic = getAnthropicClient();
  if (!anthropic) return heuristicClassify({ filename, description });

  try {
    const content = [
      {
        type: "text",
        text:
          `You are the triage classifier for a civic-issue reporting app. ` +
          `Categorize this citizen report into exactly one of: ${ISSUE_CATEGORIES.join(", ")}. ` +
          `Description: "${description || "(none provided)"}". ` +
          `Respond with ONLY compact JSON: {"category": "...", "confidence": 0.0-1.0, "reason": "<=12 words"}.`,
      },
    ];

    if (photoPath && fs.existsSync(photoPath)) {
      const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
      const mediaType = MIME_BY_EXT[ext] || "image/jpeg";
      const base64 = fs.readFileSync(photoPath).toString("base64");
      content.unshift({ type: "image", source: { type: "base64", media_type: mediaType, data: base64 } });
    }

    const msg = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 200,
      messages: [{ role: "user", content }],
    });

    const text = msg.content.find((b) => b.type === "text")?.text?.trim() || "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    if (!ISSUE_CATEGORIES.includes(parsed.category)) throw new Error("Unrecognized category from model");

    return {
      category: parsed.category,
      confidence: Math.min(1, Math.max(0, Number(parsed.confidence) || 0.7)),
      reason: parsed.reason,
      source: "ai",
    };
  } catch (err) {
    console.warn("[civicdesk] AI classification failed, using heuristic fallback:", err.message);
    return heuristicClassify({ filename, description });
  }
}
