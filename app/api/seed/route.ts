export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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
    source: "project-rusmaktabi-lms",
    content: `Rus Maktabi LMS — full EdTech learning platform for the Rus Maktabi school, evolving from a single-course landing page into a multi-course LMS.
Stack: Next.js 16 (App Router), Supabase (Auth + PostgreSQL + Row-Level-Security), Tailwind CSS v4, TypeScript.
Built in one continuous cycle: course catalog, student dashboard, lesson player with progress tracking, Payme (Uzbekistan) and YooKassa (Russia) payment webhooks with automatic enrollment activation, and an admin panel with a revenue dashboard (per-day/per-course breakdown) plus full CRUD for courses/modules/lessons.
Solved an RLS-recursion bug with a security-definer get_my_role() Postgres function, and used a service-role Supabase client to bypass RLS for webhook and admin operations.
Deployed to Vercel (rusmaktabi-lms.vercel.app) with Yandex.Metrica analytics, mobile-first layout (375px+), and security headers (X-Frame-Options, Referrer-Policy).
Design system: "Trust & Authority" — Trust Teal (#0F766E) + CTA Blue (#0369A1), Lexend + Source Sans 3 fonts — saved as a reusable design-system spec for future client projects.`,
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
    content: `Additional AI tools hands-on:
HeyGen — created a talking avatar video using Quick Create (script + stock photo → 17s rendered video). Familiar with the API for programmatic video generation.
TTS / Voice — generated voice narration using Microsoft Edge TTS (edge-tts, 300+ neural voices). ElevenLabs API is on the roadmap; architecture is identical — swap endpoint and add voice_id. Also familiar with OpenAI TTS (tts-1 model).
Stripe — integrated subscription payments (checkout sessions, webhooks) in SaaS projects.
All can be wired into a product within a sprint.`,
  },
  {
    source: "approach",
    content: `Work approach: ships MVPs fast, measures with numbers, iterates on data. Prefers 80/20: build what drives revenue first.
Comfortable working solo (full stack) or leading small AI product teams. Experience: analytics, business development, AI product building.
Timeline awareness: launched Rus Maktabi from zero to deployed landing + TG channel + 6 posts + ad creatives in 10 days.`,
  },
  {
    source: "project-neurostaff",
    content: `NeuroStaff — AI Agent Platform: Telegram bots as role-based AI employees ("neuro-staff") for businesses. Moved from local Mac development to production on Railway (US West, managed Postgres) in July 2026 — the local machine is now dev-only.
4-level memory architecture: Buffer (last 10 messages in LLM context), Episodic (LLM summaries every 20 messages), Semantic (pgvector MiniLM-384 cosine search), Procedural (versioned skills from DB).
Supervisor Agent: detects negative feedback and implicit failure signals → LLM rewrites skill instructions → saves versioned history with reasons. Also runs a text-quality detector (regex over Unicode script ranges) that catches script-mixing corruption (CJK/Vietnamese/Hangul/Thai/Arabic/Devanagari) and triggers automatic regeneration through a fallback chain (primary LLM → free OpenRouter Qwen → Claude, up to 2 retries).
Tool-calling agents (agent_type='tools'): an SEO agent with 6 tools (page audit, PageSpeed, robots.txt/sitemap checks, broken-link detection), and an image-generation tool via Pollinations.ai (free Flux backend) wired through the full tool-calling loop including regeneration and fallbacks.
Built a dedicated managerial agent ("Тимур") for a sister project (Rus Maktabi), reusing the same DB/orchestrator instead of a separate build — answers admin questions in natural language over a 349-chunk knowledge base of that project's own documentation.
Also shipped a one-way Notion↔Obsidian sync script (Obsidian as source of truth) and per-client BYO-LLM-key onboarding, where the client attaches their own Groq/Claude/OpenAI key instead of paying per token.
Orchestrator: spawns and monitors bot subprocesses per client agent. Super Agent Bot: 5-step onboarding → auto-generates skills via LLM → deploys instantly.
Security: Fernet AES-128 encryption of client tokens, monthly token usage dashboard with cost estimates.
Stack: Python, PostgreSQL 17, pgvector, sentence-transformers, python-telegram-bot v21, Groq/Claude API, Railway. Business: 30,000₽/month per AI employee (matches competitor pricing), ~90,000₽/month average at 3 agents per client.`,
  },
  {
    source: "project-ecoclub",
    content: `EcoClub Bot — inherited and audited a broken TypeScript/Node.js monorepo (Telegram + MAX Messenger bots with Bitrix24 CRM integration).
In 1 day of code audit identified the root cause of "4 months, zero results": BITRIX_MOCK=true in .env — all CRM leads were silently discarded, never reaching Bitrix24. The fix is one line in .env.
Revised readiness from 35% to 65% — the core FSM, Redis sessions, Bitrix24 real integration and MAX bot code were all already written.
Stack: TypeScript, Node.js, Grammy (Telegram), MAX Messenger SDK, Redis FSM, BullMQ queues, Bitrix24 CRM webhooks.`,
  },
  {
    source: "skills-2026-update",
    content: `Extended skills (July 2026): pgvector with sentence-transformers (MiniLM-384, multilingual, Russian-capable local embeddings), Fernet symmetric encryption for secrets management, APScheduler for cron jobs inside Python apps, subprocess-based multi-agent orchestration, Supervisor pattern (auto-improvement loops driven by user feedback), ConversationHandler FSM in python-telegram-bot v21, Groq API (llama-3.3-70b-versatile), PostgreSQL 17.
Also: TypeScript/Node.js monorepo auditing, code archaeology (finding critical hidden bugs like BITRIX_MOCK).
Business skills: SaaS pricing at 30k₽/month, LTV/CAC calculation (achieved 64x ratio in EdTech), margin analysis for AI service businesses.`,
  },
  {
    source: "skill-delegate",
    content: `Delegate — a cost-optimization routing skill that automatically sends trivial/low/medium-complexity generation tasks (translation, docstrings, boilerplate CRUD/REST, simple regex, JSON/YAML/Markdown formatting, basic unit tests) to free-tier models (Groq Llama 3.3 70B, Gemini) instead of running everything on the primary paid model.
Classifies each incoming task against a fixed complexity-tier table before execution; debugging of complex issues, architectural decisions, multi-file/multi-system integration, and security-sensitive work always stay on the primary model.
Implemented as a Python CLI router (ask.py) with --auto-tier or explicit --tier flags, reading API keys from environment variables — secrets and credentials are never passed into delegated prompts.
Reduced primary-model token usage by roughly 60% across a real multi-project workflow without sacrificing output quality on complex tasks.`,
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
    const { error } = await supabaseAdmin.from("documents").upsert(
      { source: doc.source, content: doc.content },
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
