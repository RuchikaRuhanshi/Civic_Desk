import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import Feed from "./components/Feed";
import MapView from "./components/MapView";
import Dashboard from "./components/Dashboard";
import Leaderboard from "./components/Leaderboard";
import ReportModal from "./components/ReportModal";
import AIAssistant from "./components/AIAssistant";
import Home from "./components/Home";
import { getTickets, verifyTicket, advanceTicket, getStats, getLeaderboard } from "./api";

const CURRENT_USER = "You";

export default function App() {
  const [tab, setTab] = useState("home");
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [points, setPoints] = useState(120);

  const refreshTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTickets({ category: filter });
      setTickets(data);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const refreshStats = useCallback(async () => {
    try {
      setStats(await getStats());
    } catch {}
  }, []);

  const refreshLeaderboard = useCallback(async () => {
    try {
      setLeaderboard(await getLeaderboard());
    } catch {}
  }, []);

  useEffect(() => { refreshTickets(); }, [refreshTickets]);
  useEffect(() => { refreshStats(); }, [refreshStats, tickets]);
  useEffect(() => { if (tab === "leaderboard") refreshLeaderboard(); }, [tab, refreshLeaderboard]);

  const handleVerify = async (id) => {
    try {
      const updated = await verifyTicket(id, CURRENT_USER);
      setTickets((prev) => prev.map((t) => (t._id === id ? updated : t)));
      setPoints((p) => p + 5);
    } catch (e) {
      // already verified or network issue — no-op for demo
    }
  };

  const handleAdvance = async (id) => {
    const updated = await advanceTicket(id);
    setTickets((prev) => prev.map((t) => (t._id === id ? updated : t)));
  };

  const handleCreated = (ticket) => {
    setTickets((prev) => [ticket, ...prev]);
    setPoints((p) => p + 25);
    setShowReport(false);
    setTab("feed");
  };

  return (
    <div className="min-h-screen bg-surface bg-grid-fade text-white font-body">
      <Navbar tab={tab} setTab={setTab} points={points} onReport={() => setShowReport(true)} stats={stats} />

      <div className="max-w-6xl mx-auto px-6 py-6">
        {tab === "home" && <Home setTab={setTab} onReport={() => setShowReport(true)} />}
        {tab === "feed" && (
          <Feed
            tickets={tickets}
            filter={filter}
            setFilter={setFilter}
            onVerify={handleVerify}
            onAdvance={handleAdvance}
            loading={loading}
          />
        )}
        {tab === "map" && <MapView tickets={tickets} onVerify={handleVerify} onAdvance={handleAdvance} />}
        {tab === "dashboard" && <Dashboard stats={stats} />}
        {tab === "leaderboard" && (
          <Leaderboard users={leaderboard} currentUser={CURRENT_USER} currentPoints={points} />
        )}
      </div>

      {showReport && (
        <ReportModal
          onClose={() => setShowReport(false)}
          onCreated={handleCreated}
          currentUser={CURRENT_USER}
        />
      )}
      <AIAssistant />
    </div>
  );
}
