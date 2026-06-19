export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { searchKnowledgeBase } from "@/lib/rag";

// Groq — OpenAI-compatible, free tier, Llama 3.3 70B
// Switch to Claude: change baseURL to https://api.anthropic.com and model to claude-sonnet-4-6
const llm = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function notifyN8N(question: string, answer: string) {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, answer: answer.slice(0, 300), ts: new Date().toISOString() }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // non-blocking
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const userQuestion = messages[messages.length - 1]?.content ?? "";

    // RAG: find relevant chunks
    const chunks = await searchKnowledgeBase(userQuestion);
    const context = chunks.length
      ? chunks.map((c) => `[${c.source}]\n${c.content}`).join("\n\n---\n\n")
      : "No specific context found.";

    const systemPrompt = `You are an AI assistant representing Andrey Orlov's professional portfolio.
Answer questions about his skills, projects, and experience based on the provided context.
Be concise, specific, and use numbers/facts where available. Answer in the language the user writes in.

<context>
${context}
</context>`;

    const response = await llm.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const answer = response.choices[0]?.message?.content ?? "";

    notifyN8N(userQuestion, answer);

    return NextResponse.json({ answer, sources: chunks.map((c) => c.source) });
  } catch (err) {
    console.error("[chat] error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
