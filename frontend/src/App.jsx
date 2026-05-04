import { useState, useCallback } from 'react'
import axios from 'axios'
import Header from './components/Header'
import OrgHealthCard from './components/OrgHealthCard'
import BlockerFeed from './components/BlockerFeed'
import SentimentGraph from './components/SentimentGraph'
import DeadlineCard from './components/DeadlineCard'
import AskOrgMind from './components/AskOrgMind'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [agentStatus, setAgentStatus] = useState({
    blocker: 'idle',
    sentiment: 'idle',
    velocity: 'idle',
    orchestrator: 'idle',
  })
  const [error, setError] = useState(null)

  const runAnalysis = useCallback(async () => {
    setLoading(true)
    setError(null)
    setAgentStatus({ blocker: 'running', sentiment: 'idle', velocity: 'idle', orchestrator: 'idle' })

    // Simulate sequential agent status updates for visual effect
    setTimeout(() => setAgentStatus(s => ({ ...s, blocker: 'done', sentiment: 'running' })), 800)
    setTimeout(() => setAgentStatus(s => ({ ...s, sentiment: 'done', velocity: 'running' })), 1600)
    setTimeout(() => setAgentStatus(s => ({ ...s, velocity: 'done', orchestrator: 'running' })), 2400)

    try {
      const response = await axios.post(`${API_BASE}/analyze`)
      setAnalysisData(response.data)
      setAgentStatus({ blocker: 'done', sentiment: 'done', velocity: 'done', orchestrator: 'done' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Check backend connection.')
      setAgentStatus({ blocker: 'error', sentiment: 'error', velocity: 'error', orchestrator: 'error' })
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-navy-900">
      <Header
        demoMode={analysisData?.demo_mode ?? true}
        lastAnalyzed={analysisData?.timestamp}
        onRunAnalysis={runAnalysis}
        loading={loading}
        agentStatus={agentStatus}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Agent Status Bar (visible during analysis) */}
        {loading && (
          <div className="mb-6 p-4 bg-navy-800 rounded-lg border border-navy-700">
            <p className="text-sm text-gray-400 mb-3 font-medium">Running Multi-Agent Analysis...</p>
            <div className="grid grid-cols-4 gap-3">
              <AgentStatusBadge name="Blocker Scout" status={agentStatus.blocker} />
              <AgentStatusBadge name="Sentiment Pulse" status={agentStatus.sentiment} />
              <AgentStatusBadge name="Velocity Tracker" status={agentStatus.velocity} />
              <AgentStatusBadge name="Orchestrator" status={agentStatus.orchestrator} />
            </div>
          </div>
        )}

        {!analysisData && !loading && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amd-purple to-amd-purple-light bg-clip-text text-transparent">
              Welcome to OrgMind
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Real-time AI organizational intelligence. Click "Run Analysis" to scan
              your organization for silent blockers, team sentiment shifts, and delivery risks.
            </p>
            <button
              onClick={runAnalysis}
              className="px-8 py-3 bg-amd-purple hover:bg-amd-purple-dark text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Run Analysis
            </button>
          </div>
        )}

        {analysisData && (
          <>
            {/* Top row: Health Score + Deadline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <OrgHealthCard
                score={analysisData.org_health_score}
                summary={analysisData.executive_summary}
                criticalAction={analysisData.critical_action}
                sentimentHistory={analysisData.sentiment_data?.weekly_sentiment_history}
              />
              <DeadlineCard velocityData={analysisData.velocity_data} />
            </div>

            {/* Middle row: Blockers + Sentiment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <BlockerFeed blockerData={analysisData.blocker_data} />
              <SentimentGraph sentimentData={analysisData.sentiment_data} />
            </div>

            {/* Bottom: Ask OrgMind */}
            <AskOrgMind apiBase={API_BASE} demoMode={analysisData.demo_mode} />
          </>
        )}
      </main>
    </div>
  )
}

function AgentStatusBadge({ name, status }) {
  const statusConfig = {
    idle: { icon: '○', color: 'text-gray-500' },
    running: { icon: '◌', color: 'text-amd-purple pulse-glow' },
    done: { icon: '●', color: 'text-green-400' },
    error: { icon: '✕', color: 'text-red-400' },
  }
  const config = statusConfig[status] || statusConfig.idle
  return (
    <div className={`flex items-center gap-2 text-sm ${config.color}`}>
      <span className="text-lg">{config.icon}</span>
      <span>{name}</span>
      {status === 'running' && <span className="text-xs text-gray-500">analyzing...</span>}
      {status === 'done' && <span className="text-xs text-green-500">complete</span>}
    </div>
  )
}

export default App
