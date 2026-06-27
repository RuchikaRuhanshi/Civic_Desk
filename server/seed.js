import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Ticket from "./models/Ticket.js";
import User from "./models/User.js";

dotenv.config();

const SEED_TICKETS = [
  { category: "Pothole", description: "Deep pothole near bus stop, two-wheelers swerving dangerously.", area: "Sector 4, Main Rd", location: { lat: 22.7508, lng: 88.3426 }, status: "In Progress", votes: 14, reporter: "Anika R." },
  { category: "Water Leakage", description: "Pipe burst flooding the lane, water wasted for 2 days.", area: "Lake View Colony", location: { lat: 22.7531, lng: 88.3465 }, status: "Reported", votes: 5, reporter: "Suresh P." },
  { category: "Streetlight", description: "Streetlight outage near school gate, fixed by ward team.", area: "Sector 4, School Ln", location: { lat: 22.7489, lng: 88.3440 }, status: "Resolved", votes: 9, reporter: "Meera K." },
  { category: "Waste", description: "Overflowing bin attracting strays, uncollected for a week.", area: "Market Square", location: { lat: 22.7520, lng: 88.3502 }, status: "Verified", votes: 21, reporter: "Devika S." },
  { category: "Pothole", description: "Cluster of small potholes after monsoon, widening fast.", area: "Sector 4, Ring Rd", location: { lat: 22.7475, lng: 88.3412 }, status: "Reported", votes: 8, reporter: "Imran A." },
];

const SEED_USERS = [
  { name: "Devika S.", email: "devika@example.com", points: 460, reportsFiled: 12, verificationsGiven: 40 },
  { name: "Anika R.", email: "anika@example.com", points: 380, reportsFiled: 9, verificationsGiven: 35 },
  { name: "Suresh P.", email: "suresh@example.com", points: 95, reportsFiled: 3, verificationsGiven: 8 },
  { name: "Imran A.", email: "imran@example.com", points: 70, reportsFiled: 2, verificationsGiven: 6 },
];

async function run() {
  await connectDB();
  await Ticket.deleteMany({});
  await User.deleteMany({});
  await User.insertMany(SEED_USERS);
  for (const t of SEED_TICKETS) {
    await Ticket.create(t);
  }
  console.log("[civicdesk] Seed data inserted.");
  process.exit(0);
}

run();
