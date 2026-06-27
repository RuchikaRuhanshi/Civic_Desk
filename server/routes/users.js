import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET /api/users/leaderboard
router.get("/leaderboard", async (req, res) => {
  const users = await User.find().sort({ points: -1 }).limit(20);
  res.json(users);
});

export default router;
