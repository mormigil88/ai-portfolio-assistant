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
Found and fixed a production bug where the OpenRouter fallback path (triggered when Groq's shared daily rate limit is hit) silently dropped the tools parameter entirely, leaving every tool-calling agent unable to call any tool during fallback — added a full tool-calling loop for OpenRouter matching the existing Groq/OpenAI pattern, verified live with curl before shipping.
Built a dedicated managerial agent ("Тимур") for a sister project (Rus Maktabi), reusing the same DB/orchestrator instead of a separate build — answers admin questions in natural language over a 349-chunk knowledge base of that project's own documentation.
Legal/compliance automation (Russian 152-FZ personal-data law): generate_legal_docs.py auto-generates 5 documents per client (privacy policy, processing consent, cross-border-transfer consent, terms of service, B2B data-processing agreement) from DB fields, publishes them to Yandex Disk via WebDAV + REST API, and embeds the public links in the bot's in-chat consent gate. Consent flow tested end-to-end live; Roskomnadzor (RKN) registration filed for the platform.
Also shipped a one-way Notion↔Obsidian sync script (Obsidian as source of truth) and per-client BYO-LLM-key onboarding, where the client attaches their own Groq/Claude/OpenAI key instead of paying per token.
Orchestrator: spawns and monitors bot subprocesses per client agent. Super Agent Bot: 5-step onboarding → auto-generates skills via LLM → deploys instantly.
Security: Fernet AES-128 encryption of client tokens, monthly token usage dashboard with cost estimates. Database migrated from Railway-managed Postgres to a dedicated RUVDS server in Moscow for 152-FZ data-localization compliance, with automated backups to Yandex Disk.
Stack: Python, PostgreSQL 17, pgvector, sentence-transformers, python-telegram-bot v21, Groq/Claude API, Railway. Business: 30,000₽/month per AI employee (matches competitor pricing), ~90,000₽/month average at 3 agents per client.`,
  },
  {
    source: "project-ashet-channels",
    content: `Ashet (Ашет) — a second NeuroStaff product line, built July 2026: instead of a custom bot on a platform API key, this wraps Claude Code itself through its official Channels mechanism (claude --channels plugin:telegram), running headless on the client's own Claude Pro/Max subscription rather than a per-token platform key.
First client is a personal-brand growth consultant; Ashet acts as her content assistant for Instagram/Telegram (case breakdowns, story ideas, voice-note processing), with publication gated behind explicit human approval — no autopublish, per the client's own requirement.
Deployed on Railway (US West — required, since Anthropic blocks RU-origin servers) as a Docker container running Claude Code under a non-root Linux user with a persistent volume so login/session state survives redeploys. Voice notes are transcribed via the Groq Whisper API. Live in production since July 2026, verified answering real client questions in her tone with follow-up clarifying questions.
Added episodic + semantic memory (levels 2–3 of the platform's 4-level memory model) for this untrusted, third-party-facing container via an isolated Postgres database reached only through an HTTP memory-gateway — the agent itself never receives database credentials, only a URL and a shared secret.`,
  },
  {
    source: "capability-claude-code-channels-deploy",
    content: `Reusable technical recipe for deploying Claude Code Channels (a client's personal AI assistant running under their own Pro/Max subscription) as a persistent headless process on Railway — the deployment backbone of the Ashet product line.
Solved three non-obvious Docker/Linux bugs: (1) --dangerously-skip-permissions is refused when Claude Code runs as root, requiring a non-root user; (2) su -p preserves the parent shell's $HOME, silently resolving Claude's config path into /root instead of the target user's home unless HOME is set explicitly — breaks plugin auth invisibly, with claude mcp list misleadingly reporting success; (3) Claude Code needs a real pty even in a bare container, solved by wrapping the launch command in script -qec "..." /dev/null.
Defined a mandatory "maturity standard" enforced for every new Channels client via a one-shot provisioning script: git-versioned config from the first commit, a sidecar Node.js process (companion.js) for token-usage transparency and text-corruption detection reading Claude Code's own JSONL transcript, orchestrator health/quality monitoring jobs, a hard technical approval-gateway (the agent's shell never holds real social-media or database credentials — it POSTs a request that a human approves via Telegram buttons before anything goes live), and an isolated Postgres database for memory reached only through a gateway API.`,
  },
  {
    source: "capability-instagram-buffer-publishing",
    content: `Instagram automation research and shipped integration for AI-agent clients: browser automation (Playwright) was tested and rejected — Meta detects the navigator.webdriver/CDP fingerprint and can ban the account even on manual login, an unacceptable risk for a personal-brand account meant to last years.
Buffer API chosen instead as the legal path: Buffer is an OAuth-approved Meta partner that already passed its own Meta App Review, fully sidestepping the developer's own Business Verification requirement.
Built buffer_publish.py, a reusable module supporting post/story/reel content types and image/video media with per-client credential conventions, plus a companion media-relay HTTP endpoint (Buffer requires a public URL, not inline file bytes) — wired into the approval-gateway so a human's "Apply" click triggers the actual publish call and updates request status in the database.`,
  },
  {
    source: "capability-vector-kb-local",
    content: `Built a local, file-based (no database) semantic search knowledge base for a Claude Code subagent: chunks and embeds a Reels-marketing course plus two Alex Hormozi books ($100M Offers / $100M Leads) — 1,340 chunks total — using the same multilingual sentence-transformer model (paraphrase-multilingual-MiniLM-L12-v2) used elsewhere in the AI-agent platform, stored as flat files (chunks.jsonl + embeddings.npy) since the agent itself is stateless with no process of its own.
The agent calls a search_kb.py CLI script at runtime to ground offer/CTA/lead-magnet writing in real source material instead of a static prompt summary.`,
  },
  {
    source: "capability-telegram-mtproto",
    content: `Built a Telegram MTProto client (via Telethon, not the Bot API) for reading and testing: reads DM and group history as a real user account, transcribes voice messages (OGG→WAV via ffmpeg, then offline VOSK speech recognition for Russian), and can drive a bot's UI by pressing its inline buttons like a live user — used to audit and test bots that only expose a Bot API surface to end users.`,
  },
  {
    source: "project-instagram-gate-bot",
    content: `Instagram Highlights lead-magnet funnel bot for Rus Maktabi: a Flask webhook app on the Instagram Messaging/Graph API that delivers PDF lead magnets by DM keyword after a user follows the account and taps a Highlight, ending each delivery with a CTA to a free diagnostic call.
Built as an intentional "soft gate": the Instagram API has no reliable equivalent of Telegram's getChatMember to hard-verify a follow, so the MVP asks for the follow and fulfills on keyword instead of blocking non-followers.`,
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
