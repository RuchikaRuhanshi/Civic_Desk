import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { chatWithAssistant } from "../api";
import { motion, AnimatePresence } from "framer-motion";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm the CivicDesk assistant. Ask me how to report an issue, what's open near you, or how points work." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setSending(true);
    try {
      const { reply } = await chatWithAssistant(text, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble reaching the assistant right now." }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-[#111217] border border-[rgba(212,175,55,0.2)] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-50 overflow-hidden" 
            style={{ height: 440 }}
          >
            {/* Ambient gold glow line on top of chat */}
            <div className="h-1 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11]" />

            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(212,175,55,0.08)] bg-[#17181F]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                <Sparkles size={14} className="text-[#D4AF37] animate-pulse" /> CivicDesk Assistant
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="text-slate-400 hover:text-[#D4AF37] p-1 bg-[#111217] rounded border border-[rgba(255,255,255,0.05)] transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] text-xs leading-relaxed px-3.5 py-2.5 rounded-xl ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-[#0A0B0E] self-end rounded-br-none font-bold"
                      : "bg-[#17181F] text-slate-300 self-start rounded-bl-none border border-[rgba(255,255,255,0.03)]"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {sending && (
                <div className="self-start flex items-center gap-1.5 text-slate-500 font-mono text-[10px] px-3.5 py-2 bg-[#17181F] rounded-xl border border-[rgba(255,255,255,0.03)]">
                  <Loader2 size={11} className="animate-spin text-[#D4AF37]" /> thinking...
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-[rgba(212,175,55,0.08)] bg-[#17181F] flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about local tickets or points..."
                className="flex-1 bg-[#111217] border border-[rgba(212,175,55,0.15)] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <button
                onClick={send}
                disabled={sending}
                className="bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#E5C158] hover:to-[#C5A880] text-[#0A0B0E] rounded-lg p-2.5 shadow transition-all"
              >
                <Send size={14} className="stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:from-[#E5C158] hover:to-[#C5A880] text-[#0A0B0E] rounded-full w-14 h-14 flex items-center justify-center shadow-[0_5px_20px_rgba(212,175,55,0.3)] hover:scale-105 transition-all"
        aria-label="Open AI assistant"
      >
        <Sparkles size={22} className="stroke-[2]" />
      </button>
    </>
  );
}
