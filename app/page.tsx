"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const SUGGESTED = [
  "What AI projects has Andrey built?",
  "Tell me about his RAG and Claude API experience",
  "What is Rus Maktabi?",
  "How does the job hunter automation work?",
  "What n8n workflows has he built?",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.answer, sources: data.sources }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Error — try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-2xl px-4 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Andrey Orlov — AI Portfolio</h1>
            <p className="text-xs text-gray-400">Claude API · RAG · Next.js · Supabase · n8n</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Ask me anything about Andrey&apos;s skills, projects, and experience.
        </p>
      </header>

      {/* Chat area */}
      <section className="w-full max-w-2xl flex-1 px-4 space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="mt-6 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">Suggested questions</p>
            {SUGGESTED.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="block w-full text-left text-sm px-4 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-violet-700 text-gray-300 hover:text-white transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-violet-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
            >
              {m.role === "assistant" ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5 my-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5 my-1">{children}</ol>,
                    code: ({ children }) => <code className="bg-gray-700 px-1 rounded text-xs font-mono">{children}</code>,
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              ) : (
                m.content
              )}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.sources.map((s) => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </section>

      {/* Input */}
      <div className="w-full max-w-2xl px-4 pb-8 pt-2 sticky bottom-0 bg-gray-950/90 backdrop-blur">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about skills, projects, experience..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium text-white transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
