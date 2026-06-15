export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { embed } from "@/lib/embeddings";

const KNOWLEDGE_BASE = [
  {
    source: "skills",
    content: `Andrey Orlov — AI specialist and business builder.
Core technical skills: Claude Code, Claude API, Python, Next.js, TypeScript, Supabase (PostgreSQL + pgvector), n8n workflow automation, RAG systems, HeyGen AI avatars, ElevenLabs TTS, Stripe subscriptions, Vercel deployment, Docker.
He builds AI-powered products from scratch: from architecture and backend to frontend deployment.`,
  },
  {
    source: "claude-rag",
    content: `RAG (Retrieval-Augmented Generation) experience: built this portfolio assistant using pgvector in Supabase for vector similarity search, OpenAI text-embedding-3-small for embeddings, and Claude claude-sonnet-4-6 for answers.
Also built an AI job hunter that processes HH.ru and LinkedIn vacancies daily using Claude API for scoring and personalization.`,
  },
  {
    source: "n8n-automation",
    content: `n8n expertise: automated YouTube competitor analysis workflow (YouTube API → n8n → Google Sheets), Telegram bots, webhook integrations. n8n instance runs on Docker locally.
Built a job-hunting automation pipeline: scraping vacancies → Claude scoring → ranked digest → Telegram notification daily at 9:00.`,
  },
  {
    source: "project-rusmaktabi",
    content: `Rus Maktabi — EdTech SaaS MVP for Uzbek families relocating to Russia.
Stack: Netlify landing, Telegram channel @RusMaktabi, Telegraph articles, n8n Telegram bot for publishing.
Business metrics: CAC $11, LTV $730, LTV/CAC 64x, break-even at 5 students. Course price $200/month (4 weeks, Zoom groups).
AI contributions: generated FB/Instagram video ads using moviepy + Ken Burns effect + PIL, wrote Uzbek copy as market expert.`,
  },
  {
    source: "project-cartback",
    content: `CartBack — SaaS for e-commerce abandoned cart recovery (Telegram notifications).
Stack: FastAPI backend, PostgreSQL, Telegram Bot API, deployed on VPS.
Claude Code used to build and iterate on the backend architecture.`,
  },
  {
    source: "project-job-hunter",
    content: `Job Hunter — personal AI automation for daily job search.
Scrapes HH.ru and LinkedIn every morning, scores each vacancy with Claude API (0–100 fit score), filters by criteria, sends ranked digest to Telegram.
Stack: Python, Claude API, Telegram Bot API, cron. Saves 2–3 hours/day of manual searching.`,
  },
  {
    source: "ai-video",
    content: `AI video production: proficient with moviepy (Python) for automated video generation — Ken Burns zoom effects, text overlays with fade-in/out, Pillow for image processing.
Experience with DaVinci AI (Veo 3.1 by Google), Kling AI for AI-generated video. Produced 7 marketing videos for Facebook/Telegram ads.`,
  },
  {
    source: "stripe-heygen-elevenlabs",
    content: `Additional AI tools experience: HeyGen for AI avatar video generation, ElevenLabs for text-to-speech voice cloning, Stripe for subscription payment integration.
Ready to integrate all three into a production product within a sprint.`,
  },
  {
    source: "approach",
    content: `Work approach: ships MVPs fast, measures with numbers, iterates on data. Prefers 80/20: build what drives revenue first.
Comfortable working solo (full stack) or leading small AI product teams. Experience: analytics, business development, AI product building.
Timeline awareness: launched Rus Maktabi from zero to deployed landing + TG channel + 6 posts + ad creatives in 10 days.`,
  },
];

export async function POST(req: NextRequest) {
  // Simple auth guard
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = [];

  for (const doc of KNOWLEDGE_BASE) {
    const embedding = await embed(doc.content);

    const { error } = await supabaseAdmin.from("documents").upsert(
      { source: doc.source, content: doc.content, embedding },
      { onConflict: "source" }
    );

    if (error) {
      results.push({ source: doc.source, status: "error", error: error.message });
    } else {
      results.push({ source: doc.source, status: "ok" });
    }
  }

  return NextResponse.json({ seeded: results.length, results });
}
