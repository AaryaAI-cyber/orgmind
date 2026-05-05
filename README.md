# 🧠 OrgMind — Real-Time AI Organizational Intelligence

> *"Every CEO makes decisions blind. OrgMind reads the noise and tells you the truth."*

**AMD Developer Hackathon 2026 | LabLab.ai | Built by Aarya (AaryaAI-cyber) — Student Developer, Hyderabad**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-orgmind--fafgbgfp.fly.dev-purple)](https://orgmind-fafgbgfp.fly.dev/)
[![AMD MI300X](https://img.shields.io/badge/AMD-Instinct%20MI300X-red)](https://developer.amd.com)
[![Qwen2.5-72B](https://img.shields.io/badge/Model-Qwen2.5--72B-blue)](https://huggingface.co/Qwen)
[![ROCm](https://img.shields.io/badge/Stack-ROCm-orange)](https://rocm.docs.amd.com)

---

## 🎯 The Problem

Every large company has the same invisible crisis:
- **P1 Incidents rotting for 9 days** — the Delivery Head doesn't know
- **Team morale collapsing in Slack** — HR sees it only in exit interviews
- **Sprint deadline about to be missed** — leadership finds out in the post-mortem

Status reports are theater. OrgMind tells you what's **actually** happening.

## ⚡ Live Demo

**[→ Try OrgMind Live](https://orgmind-fafgbgfp.fly.dev/)**

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   DATA SOURCES (Simulated)                    │
│  Jira Tickets │ Slack Messages │ Sprint Data │ Team Profiles  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   INGESTION LAYER (Python)                    │
│      Reads JSON → Normalizes → Feeds agents in parallel      │
└──────────┬──────────────┬──────────────┬─────────────────────┘
           ▼              ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   AGENT 1    │  │   AGENT 2    │  │   AGENT 3    │
│Blocker Scout │  │Sentiment     │  │Velocity      │
│              │  │Pulse         │  │Tracker       │
│ITIL tickets  │  │Team comm     │  │Sprint plan   │
│stuck 5+ days │  │tone, P1-P4   │  │vs reality,   │
│no escalation │  │frustration   │  │deadline math │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
┌──────────────────────────────────────────────────────────────┐
│              ORCHESTRATOR AGENT (Master Brain)                │
│  Qwen2.5-72B-Instruct on AMD Instinct MI300X via ROCm        │
│  Synthesizes all 3 agents → insight + risk score + action    │
│  Also: recommends WHO in team should fix each blocker        │
│  Stores results in MindsDB for history and trend tracking    │
└──────────────────────────┬───────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   FastAPI BACKEND (Python)                    │
│  POST /analyze   → runs all agents → returns full report     │
│  POST /chat      → Ask OrgMind conversational endpoint       │
│  GET  /history   → past analyses from MindsDB                │
│  GET  /health    → amd_connected, demo_mode status           │
│  POST /ticket    → add new ITIL ticket                       │
│  POST /member    → add team member profile                   │
└──────────────────────────┬───────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────┐
│            ORGMIND DASHBOARD (React + Tailwind)               │
│  Welcome Tour → Onboarding → Dashboard with:                 │
│  Health Score │ Blocker Feed │ Sentiment Graph │ Deadline     │
│  Team Directory │ Ask OrgMind │ ITIL Ticket Creator          │
└──────────────────────────────────────────────────────────────┘
```

## 🤖 The 4 Agents

### Agent 1 — Blocker Scout
Scans ITIL-standard tickets (Incident, Problem, Change Request, Service Request) for "silent blockers" — tickets stuck In Progress for 5+ days with SLA breaches that were never escalated. Cross-references Slack to find issues flagged by engineers but invisible to management.

### Agent 2 — Sentiment Pulse
Analyzes team communication at team level (never individual). Detects frustration signals, tracks week-over-week sentiment trends, and flags teams declining >15% before they become a retention problem.

### Agent 3 — Velocity Tracker
Compares planned vs actual sprint velocity using Fibonacci story points. Mathematically predicts deadline outcomes: `remaining_points ÷ actual_velocity`. Identifies which specific features are at risk.

### Orchestrator
Runs all 3 agents in parallel via asyncio. Sends combined output to Qwen2.5-72B on AMD MI300X GPU. Generates executive briefing with specific recommended actions and suggests which team member should own each blocker based on skills + utilization from the Team Directory.

## 🔥 AMD Integration

| Component | Detail |
|-----------|--------|
| GPU | AMD Instinct MI300X |
| Software Stack | ROCm (AMD's open-source GPU compute platform) |
| Model | Qwen2.5-72B-Instruct (AMD + Qwen partner track) |
| Serving | vLLM (ROCm build) |
| Credits | AMD AI Developer Program ($100 cloud credits) |

## 👥 Who Uses OrgMind

| Role | What They Get |
|------|--------------|
| CEO | Truth about project health, not sanitized reports |
| Delivery Head | Deadline predictions + who to call |
| Product Manager | Silent blockers before they explode |
| HR Head | Team burnout signals before resignation |
| AI Architect | Real technical debt visibility |

## 🛠️ Tech Stack

| Layer | Tools |
|-------|-------|
| GPU Compute | AMD Instinct MI300X via ROCm |
| LLM Model | Qwen2.5-72B-Instruct |
| Backend | Python 3.11+, FastAPI, Uvicorn, httpx, Pydantic v2 |
| AI/ML | AMD Developer Cloud, ROCm, LangChain |
| Memory | MindsDB (partner sponsor), local JSON fallback |
| Frontend | React 18, Tailwind CSS, Recharts, Axios, Vite |
| Deployment | Fly.dev |
| Repository | GitHub (public, main branch) |

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

*(Screenshots of the live dashboard at https://orgmind-fafgbgfp.fly.dev/)*

## 👤 Built By

**Aarya** | AI & Data Science Student | Hyderabad, India
[GitHub](https://github.com/AaryaAI-cyber) · [LinkedIn](https://linkedin.com/in/aarya-shinde-b6231427b)
AMD Developer Hackathon 2026 — Solo Participant
