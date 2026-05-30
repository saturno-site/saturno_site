"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, Brain } from "lucide-react";
import { type QuizResult } from "@/lib/scoring-engine";
import { useSound } from "@/components/analyzer/SoundProvider";
import AnimatedIcon from "@/components/analyzer/icons/AnimatedIcon";

interface AiChatSessionProps {
  quizData: QuizResult;
  onComplete: (history: ChatHistoryItem[]) => void;
}

type ChatPart = { text: string };
type ChatHistoryItem = { role: string; parts: ChatPart[] };

export default function AiChatSession({ quizData, onComplete }: AiChatSessionProps) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  // Initialize the session
  useEffect(() => {
    async function startSession() {
      try {
        const res = await fetch("/api/analyzer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "start", quizData }),
        });
        const data = await res.json();
        setMessages([{ role: "model", text: data.text }]);
        setHistory(data.history);
        play("message");
      } catch (error) {
        console.error("Failed to start AI session", error);
      } finally {
        setIsLoading(false);
      }
    }
    startSession();
  }, [quizData, play]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    play("message");
    setIsLoading(true);

    try {
      const res = await fetch("/api/analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          message: userMessage,
          history: [...history, { role: "user", parts: [{ text: userMessage }] }],
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "model", text: data.text }]);
      play("message");
      setHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ text: userMessage }] },
        { role: "model", parts: [{ text: data.text }] },
      ]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[600px] w-full max-w-3xl flex-col overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-2xl shadow-indigo-500/10 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 p-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ boxShadow: ["0 0 0 rgba(99,102,241,0)", "0 0 28px rgba(99,102,241,0.35)", "0 0 0 rgba(99,102,241,0)"] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400"
          >
            <AnimatedIcon icon={Brain} className="h-6 w-6" spin />
          </motion.div>
          <div>
            <h3 className="font-semibold text-slate-100">The Analyzer</h3>
            <p className="text-xs text-slate-400 uppercase tracking-widest">Act II: Deep Dive</p>
          </div>
        </div>
        <button
          onClick={() => {
            play("advance");
            onComplete(history);
          }}
          className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          Generate Report
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[85%] gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${
                    msg.role === "user" ? "bg-slate-700" : "bg-indigo-900/50 text-indigo-300"
                  }`}
                >
                  {msg.role === "user" ? <AnimatedIcon icon={User} className="h-4 w-4" /> : <AnimatedIcon icon={Sparkles} className="h-4 w-4" spin />}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-900 border border-slate-800 text-slate-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="ml-11 flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-2">
                <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.12 }} className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.24 }} className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-6 bg-slate-900/30 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your response..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 pr-14 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Send message"
          >
            <AnimatedIcon icon={Send} className="h-5 w-5" decorative={false} label="Send message" />
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-500 uppercase tracking-[0.2em]">
          Gemini-powered psychological analysis
        </p>
      </div>
    </div>
  );
}
