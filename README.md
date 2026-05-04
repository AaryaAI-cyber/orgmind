# 🧠 OrgMind — Real-Time AI Organizational Intelligence

> "Every CEO makes decisions blind. OrgMind reads the noise and tells you the truth."

Built for the **AMD Developer Hackathon 2026** | [LabLab.ai](https://lablab.ai)

## 🎯 The Problem

Every large company has the same invisible crisis:
- **Blockers rotting in Jira for 9 days** — the PM doesn't know
- **Team morale collapsing in Slack** — HR can't see it
- **Sprint deadline about to be missed** — leadership finds out too late

Status reports are theater. OrgMind tells you what's **actually** happening.

## ⚡ Live Demo

**[Try OrgMind →](https://orgmind.vercel.app)**

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCES (Simulated)                  │
│   Jira Tickets JSON  │  Slack Messages JSON  │  Sprint Data  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    INGESTION LAYER (Python)                  │
│         Reads mock JSON → Normalizes → Feeds to agents      │
└───────────────────────┬─────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   AGENT 1    │ │   AGENT 2    │ │   AGENT 3    │
│Blocker Scout │ │Sentiment     │ │ Velocity     │
│              │ │Pulse         │ │ Tracker      │
│Finds tickets │ │Reads team    │ │Sprint plan   │
│stuck 5+ days │ │comm tone,    │ │vs reality,   │
│with no update│ │frustration   │ │predicts      │
│              │ │keywords      │ │deadline      │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              ORCHESTRATOR AGENT (Master Brain)               │
│  Receives output from all 3 agents                          │
│  Sends combined context to: Qwen2.5-72B on AMD MI300X GPU   │
│  via ROCm on AMD Developer Cloud                            │
│  Returns: natural language insight + risk score + prediction │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI BACKEND (Python)                   │
│  POST /analyze  → runs all agents → returns JSON result     │
│  POST /chat     → "Ask OrgMind" conversational endpoint     │
│  GET  /history  → past analysis runs from MindsDB           │
│  GET  /health   → system status check                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              ORGMIND DASHBOARD (React + Tailwind)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Org Health   │  │ Blocker Feed │  │ Sentiment    │      │
│  │ Score Card   │  │ (live list)  │  │ Graph        │      │
│  │  42/100      │  │ 3 blockers   │  │ (Recharts)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Deadline Prediction Card                         │       │
│  │ "71% chance of missing May 8 by 6-8 days"       │       │
│  └──────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Ask OrgMind (chat input)                         │       │
│  │ "What's actually happening with Project Phoenix?"│       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## 🤖 How the Agents Work

### Agent 1 — Blocker Scout
Scans Jira-style ticket data for "silent blockers" — tickets marked "In Progress" with no update for 5+ days. Cross-references Slack messages to identify issues flagged by engineers but never escalated to PMs. Ranks blockers by days stuck × impact weight.

### Agent 2 — Sentiment Pulse
Analyzes team communication patterns at the **team level only** (never individual). Counts frustration signals ("blocked", "waiting", "ignored") vs positive signals ("shipped", "fixed", "great"). Calculates sentiment scores (0-100) per team and flags teams with >15% week-over-week decline.

### Agent 3 — Velocity Tracker
Compares planned sprint velocity vs actual completion rate. Mathematically predicts deadline outcomes: `remaining_points / actual_velocity = days_needed`. Identifies at-risk features and calculates deadline miss probability.

### Orchestrator
The master brain. Runs all 3 agents in parallel using `asyncio.gather()`, combines outputs into a unified context, sends to Qwen2.5-72B on AMD cloud, and generates an executive briefing with actionable recommendations.

## 🔥 AMD Developer Cloud Integration

All LLM inference runs on **AMD Instinct MI300X GPU** via **ROCm** on AMD Developer Cloud.

| Component | Detail |
|-----------|--------|
| GPU | AMD Instinct MI300X |
| Software Stack | ROCm (AMD's open-source GPU compute platform) |
| Model | Qwen2.5-72B-Instruct |
| Serving | vLLM (ROCm version) |
| Why AMD | Enterprise-grade GPU compute, open-source stack, partner model support |

## 🛠️ Tech Stack

| Layer | Tools |
|-------|-------|
| Backend | Python 3.11+, FastAPI, Uvicorn, httpx, Pydantic v2 |
| AI/ML | AMD Developer Cloud, ROCm, Qwen2.5-72B, LangChain |
| Memory | MindsDB (partner sponsor), local JSON fallback |
| Frontend | React 18, Tailwind CSS, Recharts, Axios, Vite |
| Deployment | Vercel (frontend), Modal.com / Render.com (backend) |

## 🚀 Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- AMD Developer Cloud account (optional — runs in Demo Mode without it)

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Edit with your AMD credentials (or leave DEMO_MODE=true)
cd ..
python -m uvicorn backend.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Opens at http://localhost:3000
```

### Environment Variables
```
AMD_CLOUD_ENDPOINT=your_amd_endpoint    # From AMD Developer Cloud
AMD_CLOUD_API_KEY=your_amd_api_key      # From AMD Developer Cloud
DEMO_MODE=false                         # Set to true for demo without AMD
MINDSDB_HOST=your_mindsdb_host          # Optional: MindsDB Cloud
MINDSDB_USER=your_mindsdb_user
MINDSDB_PASSWORD=your_mindsdb_password
```

## 📊 Screenshots

*(Screenshots will be added after deployment)*

## 👤 Built By

Built for the AMD Developer Hackathon 2026 (LabLab.ai)
