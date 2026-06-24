import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { chatWithAssistant } from "../api";

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
      {open && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 glass rounded-2xl shadow-card flex flex-col z-50 overflow-hidden border border-line" style={{ height: 440 }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-panel2/60">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles size={15} className="text-accent" /> CivicDesk assistant
            </div>
            <button onClick={() => setOpen(false)} className="text-muted hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] text-[13px] leading-relaxed px-3 py-2 rounded-xl ${
                  m.role === "user"
                    ? "bg-accent text-white self-end rounded-br-sm"
                    : "bg-panel text-white/90 self-start rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="self-start flex items-center gap-2 text-muted text-[12px] px-3 py-2">
                <Loader2 size={13} className="animate-spin" /> thinking…
              </div>
            )}
          </div>

          <div className="p-3 border-t border-line flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about an issue or how to report…"
              className="flex-1 bg-panel border border-line rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-muted focus:outline-none focus:border-accent"
            />
            <button
              onClick={send}
              disabled={sending}
              className="bg-accent hover:bg-accent2 disabled:opacity-60 text-white rounded-lg p-2.5 transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 bg-accent hover:bg-accent2 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-glow transition-colors"
        aria-label="Open AI assistant"
      >
        <Sparkles size={22} />
      </button>
    </>
  );
}
