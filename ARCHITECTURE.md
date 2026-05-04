# OrgMind — Architecture Deep Dive

## System Overview

OrgMind is a **multi-agent AI system** that monitors organizational health in real-time. It uses 3 specialized AI agents running in parallel on AMD cloud infrastructure to detect problems that traditional status reports miss.

## Data Flow

1. **Ingestion**: Mock JSON data simulates Jira tickets (20), Slack messages (50), and sprint data — representing a realistic software delivery team at "Acme Corp" working on "Project Phoenix"
2. **Agent Analysis**: Three agents analyze the data concurrently using Python `asyncio`
3. **Orchestration**: Results are combined and sent to Qwen2.5-72B on AMD MI300X for synthesis
4. **Presentation**: React dashboard displays the unified intelligence report

## Agent Architecture

### Agent 1 — Blocker Scout (`blocker_scout.py`)
- **Input**: Jira tickets + Slack messages
- **Algorithm**: Filters `In Progress` tickets with `(today - last_updated) >= 5 days`. Cross-references Slack for unescalated mentions. Risk score = `days_stuck * impact_weight`
- **LLM Enhancement**: Sends blocker data to Qwen for severity assessment and action recommendations

### Agent 2 — Sentiment Pulse (`sentiment_pulse.py`)
- **Input**: Slack messages grouped by channel
- **Algorithm**: Keyword-based sentiment scoring with frustration/positive signal counting. Score = `50 + ((positive - frustration) / total * 50)`. Week-over-week trend comparison.
- **Privacy**: All analysis is team-level only — never identifies individuals
- **LLM Enhancement**: Qwen provides qualitative morale assessment and leadership recommendations

### Agent 3 — Velocity Tracker (`velocity_tracker.py`)
- **Input**: Sprint data (planned vs completed story points)
- **Algorithm**: `actual_velocity = completed / days_elapsed`. `days_needed = remaining / actual_velocity`. Miss probability calculated from velocity ratio gap.
- **LLM Enhancement**: Qwen generates risk narrative and predicts which features will slip

### Orchestrator (`orchestrator.py`)
- **Coordination**: `asyncio.gather()` runs all 3 agents concurrently
- **Health Score**: `(100 - severity) * 0.4 + sentiment * 0.3 + (100 - miss_prob) * 0.3`
- **LLM Synthesis**: Combined context → Qwen → executive briefing with actionable insights

## AMD Integration

All LLM inference calls go through `amd_client.py`:
- **Endpoint**: AMD Developer Cloud OpenAI-compatible API
- **Model**: Qwen2.5-72B-Instruct on AMD Instinct MI300X GPU
- **Stack**: ROCm + vLLM serving
- **Fallback**: `DEMO_MODE=true` returns pre-written realistic responses, UI shows "Demo Mode" badge

## Memory Layer (MindsDB)

- Every analysis run is stored with timestamp
- Enables trend analysis: "Is org health improving?"
- Local JSON fallback when MindsDB is not configured
- MindsDB is a hackathon partner sponsor (bonus prize eligibility)

## API Design

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | System status, AMD connection status |
| `/analyze` | POST | Full multi-agent analysis pipeline |
| `/chat` | POST | Natural language Q&A about org health |
| `/history` | GET | Past analysis runs for trend view |

## Frontend Architecture

React 18 + Tailwind CSS + Recharts. Dark professional theme (navy/purple/white).

6 components:
1. **Header** — Logo, AMD badge, analysis trigger
2. **OrgHealthCard** — Big score (0-100) with color coding
3. **BlockerFeed** — Silent blocker list with metadata
4. **SentimentGraph** — Recharts line graph + team breakdown
5. **DeadlineCard** — Miss probability + velocity metrics
6. **AskOrgMind** — Chat interface with suggested questions

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Python asyncio for agent coordination | Enables true parallel execution of independent agents |
| OpenAI-compatible API format for AMD | Standard interface, easy to swap providers |
| Demo Mode fallback | Ensures app works for demos even without AMD credentials |
| Team-level sentiment only | Privacy protection — never identifies individual employees |
| Local JSON fallback for MindsDB | Zero-config development experience |
| Vite + Tailwind | Fast builds, utility-first CSS, professional look |
