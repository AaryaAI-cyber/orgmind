import { useState, useCallback, useEffect, useRef } from 'react'
import axios from 'axios'
import Header from './components/Header'
import OrgHealthCard from './components/OrgHealthCard'
import BlockerFeed from './components/BlockerFeed'
import SentimentGraph from './components/SentimentGraph'
import DeadlineCard from './components/DeadlineCard'
import AskOrgMind from './components/AskOrgMind'
import Onboarding from './components/Onboarding'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import AddTicketModal from './components/AddTicketModal'
import LogUpdateModal from './components/LogUpdateModal'
import DemoScenarioBar from './components/DemoScenarioBar'
import { generatePersonalizedData } from './lib/dataGenerator'
import { buildScenarioData, DEMO_SCENARIOS } from './lib/demoScenarios'
import { loadSession, saveSession, clearSession } from './lib/storage'

const API_BASE = import.meta.env.VITE_API_URL || ''
const NAMES_BY_TEAM = [
  ['Priya Kumar', 'Raj Mehta', 'Sarah Chen', 'Alex Rivera', 'David Park'],
  ['Emma Wilson', 'Mike Johnson', 'Lisa Zhang', 'Tom Anderson', 'Nina Patel'],
  ['James Lee', 'Maria Garcia', 'Chris Brown', 'Yuki Tanaka', 'Sam Williams'],
  ['Anna Kim', 'Ben Taylor', 'Diana Moss', 'Carlos Ruiz', 'Fatima Hassan'],
  ['Liam O\'Brien', 'Sophia Adams', 'Ethan Hall', 'Olivia Scott', 'Noah Clark'],
  ['Ava Martinez', 'Lucas White', 'Mia Robinson', 'Jack Lewis', 'Chloe Walker'],
  ['Ryan Young', 'Zoe King', 'Owen Wright', 'Ella Green', 'Leo Baker'],
]

function App() {
  const [view, setView] = useState('loading') // loading | onboarding | demo-select | dashboard
  const [userConfig, setUserConfig] = useState(null)
  const [generatedData, setGeneratedData] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [agentStatus, setAgentStatus] = useState({ blocker: 'idle', sentiment: 'idle', velocity: 'idle', orchestrator: 'idle' })
  const [error, setError] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTeam, setActiveTeam] = useState(null)
  const [toast, setToast] = useState(null)
  const [showAddTicket, setShowAddTicket] = useState(false)
  const [showLogUpdate, setShowLogUpdate] = useState(false)
  const [demoScenario, setDemoScenario] = useState(null)
  const [autoSaved, setAutoSaved] = useState(false)
  const [shareUrl, setShareUrl] = useState(null)
  const saveTimer = useRef(null)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadSession()
    if (saved?.config && saved?.generatedData) {
      setUserConfig(saved.config)
      setGeneratedData(saved.generatedData)
      setAnalysisData(saved.analysisData || null)
      setDemoScenario(saved.demoScenario || null)
      setView('dashboard')
    } else {
      setView('onboarding')
    }
  }, [])

  // Auto-save on changes
  useEffect(() => {
    if (!userConfig || view !== 'dashboard') return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveSession({ config: userConfig, generatedData, analysisData, demoScenario })
      setAutoSaved(true)
      setTimeout(() => setAutoSaved(false), 2000)
    }, 1000)
  }, [userConfig, generatedData, analysisData, view, demoScenario])

  const handleOnboardingComplete = useCallback((config) => {
    const data = generatePersonalizedData(config)
    setUserConfig(config)
    setGeneratedData(data)
    setDemoScenario(null)
    setAnalysisData(null)
    setView('dashboard')
    // Auto-run analysis
    setTimeout(() => runAnalysisWithData(data), 300)
  }, [])

  const handleDemoSelect = useCallback(() => {
    setView('demo-select')
  }, [])

  const handleDemoScenario = useCallback((scenarioId) => {
    const scenarioData = buildScenarioData(scenarioId)
    if (!scenarioData) return
    const data = scenarioData._generatedData
    setUserConfig(scenarioData)
    setGeneratedData(data)
    setDemoScenario(scenarioId)
    setAnalysisData(null)
    setView('dashboard')
    setTimeout(() => runAnalysisWithData(data), 300)
  }, [])

  const buildAnalysisPayload = (data) => ({
    jira_tickets: data.jira_tickets,
    slack_messages: data.slack_messages,
    sprint_data: data.sprint_data,
    company: data.company,
    project: data.project,
    computed: data._computed,
  })

  const runAnalysisWithData = async (data) => {
    setLoading(true)
    setError(null)
    setAgentStatus({ blocker: 'running', sentiment: 'idle', velocity: 'idle', orchestrator: 'idle' })
    setTimeout(() => setAgentStatus(s => ({ ...s, blocker: 'done', sentiment: 'running' })), 800)
    setTimeout(() => setAgentStatus(s => ({ ...s, sentiment: 'done', velocity: 'running' })), 1600)
    setTimeout(() => setAgentStatus(s => ({ ...s, velocity: 'done', orchestrator: 'running' })), 2400)

    try {
      const payload = buildAnalysisPayload(data)
      const response = await axios.post(`${API_BASE}/analyze`, payload)
      setAnalysisData(response.data)
      setAgentStatus({ blocker: 'done', sentiment: 'done', velocity: 'done', orchestrator: 'done' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Check backend connection.')
      setAgentStatus({ blocker: 'error', sentiment: 'error', velocity: 'error', orchestrator: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const runAnalysis = useCallback(() => {
    if (generatedData) runAnalysisWithData(generatedData)
  }, [generatedData])

  const handleResolveBlocker = useCallback((ticketId) => {
    if (!analysisData) return
    const newBlockers = (analysisData.blocker_data?.critical_blockers || []).filter(b => b.ticket_id !== ticketId)
    const newScore = Math.min(100, (analysisData.org_health_score || 0) + 5)
    setAnalysisData(prev => ({
      ...prev,
      org_health_score: newScore,
      blocker_data: { ...prev.blocker_data, critical_blockers: newBlockers, severity_score: Math.max(0, (prev.blocker_data?.severity_score || 0) - 20) },
    }))
    setToast({ message: 'Blocker resolved! Org health improved.', type: 'success' })
  }, [analysisData])

  const handleAddTicket = useCallback((ticket) => {
    if (!generatedData) return
    const newData = { ...generatedData, jira_tickets: [...generatedData.jira_tickets, ticket] }
    setGeneratedData(newData)
    setShowAddTicket(false)
    setToast({ message: `Ticket ${ticket.ticket_id} added. Re-running analysis...`, type: 'info' })
    setTimeout(() => runAnalysisWithData(newData), 500)
  }, [generatedData])

  const handleLogUpdate = useCallback((update) => {
    if (!generatedData) return
    const newData = { ...generatedData, slack_messages: [update, ...generatedData.slack_messages] }
    setGeneratedData(newData)
    setShowLogUpdate(false)
    setToast({ message: 'Team update logged. Re-running sentiment analysis...', type: 'info' })
    setTimeout(() => runAnalysisWithData(newData), 500)
  }, [generatedData])

  const handleShare = useCallback(() => {
    const shareId = Math.random().toString(36).substring(2, 8)
    const url = `${window.location.origin}/dashboard/${shareId}`
    navigator.clipboard?.writeText(url)
    setShareUrl(url)
    setToast({ message: 'Share link copied to clipboard!', type: 'success' })
  }, [])

  const getTeamMembers = () => {
    const members = {}
    ;(userConfig?.teamNames || []).forEach((team, i) => {
      members[team] = NAMES_BY_TEAM[i % NAMES_BY_TEAM.length]
    })
    return members
  }

  const getProjectPrefix = () =>
    (userConfig?.projectName || 'PROJ').replace(/\s+/g, '').substring(0, 4).toUpperCase()

  // Filter data by active team
  const filterByTeam = (data) => {
    if (!activeTeam || !data) return data
    return {
      ...data,
      blocker_data: data.blocker_data ? {
        ...data.blocker_data,
        critical_blockers: (data.blocker_data.critical_blockers || []).filter(b => b.team === activeTeam),
      } : data.blocker_data,
      sentiment_data: data.sentiment_data ? {
        ...data.sentiment_data,
        teams: (data.sentiment_data.teams || []).filter(t => t.team_name === activeTeam),
      } : data.sentiment_data,
    }
  }

  if (view === 'loading') return <div className="min-h-screen bg-navy-900" />

  if (view === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} onDemoSelect={handleDemoSelect} />
  }

  if (view === 'demo-select') {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-4">
        <h2 className="text-3xl font-bold text-white mb-2">Choose a Demo Scenario</h2>
        <p className="text-gray-400 mb-8">Explore OrgMind with pre-built company data</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {DEMO_SCENARIOS.map(s => (
            <button key={s.id} onClick={() => handleDemoScenario(s.id)}
              className="bg-navy-800 rounded-xl border border-navy-700 p-6 text-left hover:border-amd-purple/50 transition-all hover:shadow-lg hover:shadow-amd-purple/10">
              <h3 className="text-white font-bold mb-2">{s.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{s.description}</p>
              <span className="text-amd-purple-light text-sm">Launch →</span>
            </button>
          ))}
        </div>
        <button onClick={() => setView('onboarding')} className="mt-6 text-gray-400 hover:text-white text-sm transition-colors">
          ← Back to setup
        </button>
      </div>
    )
  }

  // Dashboard view
  const filteredData = filterByTeam(analysisData)
  const daysRemaining = generatedData?._computed?.daysRemaining || 0

  return (
    <div className="min-h-screen bg-navy-900">
      <Header
        demoMode={analysisData?.demo_mode ?? true}
        lastAnalyzed={analysisData?.timestamp}
        onRunAnalysis={runAnalysis}
        loading={loading}
        userName={userConfig?.userName}
        companyName={userConfig?.companyName}
      />

      {demoScenario && (
        <DemoScenarioBar activeId={demoScenario} onSwitch={handleDemoScenario} />
      )}

      <Sidebar
        config={userConfig || {}}
        daysRemaining={daysRemaining}
        activeTeam={activeTeam}
        onTeamFilter={setActiveTeam}
        onEditSetup={() => setView('onboarding')}
        onSwitchProject={() => setView('onboarding')}
        onStartFresh={() => { clearSession(); setView('onboarding'); setAnalysisData(null); setUserConfig(null); setGeneratedData(null); setDemoScenario(null) }}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(p => !p)}
      />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-64'} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6`}>
        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Agent Status Bar */}
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

        {filteredData && (
          <>
            {/* Action bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {activeTeam && (
                  <span className="text-sm text-amd-purple-light bg-amd-purple/10 px-3 py-1 rounded-full border border-amd-purple/30">
                    Filtered: {activeTeam}
                  </span>
                )}
              </div>
              <button onClick={handleShare}
                className="px-3 py-1.5 rounded-lg text-xs text-gray-400 border border-navy-700 hover:border-amd-purple/50 hover:text-white transition-colors">
                Share Dashboard
              </button>
            </div>

            {/* Top row: Health Score + Deadline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <OrgHealthCard
                score={filteredData.org_health_score}
                summary={filteredData.executive_summary}
                criticalAction={filteredData.critical_action}
                sentimentHistory={filteredData.sentiment_data?.weekly_sentiment_history}
              />
              <DeadlineCard velocityData={filteredData.velocity_data} />
            </div>

            {/* Middle row: Blockers + Sentiment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <BlockerFeed
                blockerData={filteredData.blocker_data}
                onResolve={handleResolveBlocker}
                onAddTicket={() => setShowAddTicket(true)}
              />
              <SentimentGraph sentimentData={filteredData.sentiment_data} />
            </div>

            {/* Bottom: Ask OrgMind */}
            <AskOrgMind
              apiBase={API_BASE}
              demoMode={filteredData.demo_mode}
              projectName={userConfig?.projectName}
              teamNames={userConfig?.teamNames}
              deadline={generatedData?._computed?.originalDeadline}
              onLogUpdate={() => setShowLogUpdate(true)}
            />
          </>
        )}

        {!filteredData && !loading && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amd-purple to-amd-purple-light bg-clip-text text-transparent">
              Analyzing {userConfig?.projectName || 'your project'}...
            </h2>
            <p className="text-gray-400 mb-8">OrgMind is running multi-agent analysis on your data</p>
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddTicket && (
        <AddTicketModal
          teamNames={userConfig?.teamNames || []}
          teamMembers={getTeamMembers()}
          projectPrefix={getProjectPrefix()}
          onSubmit={handleAddTicket}
          onClose={() => setShowAddTicket(false)}
        />
      )}
      {showLogUpdate && (
        <LogUpdateModal
          teamNames={userConfig?.teamNames || []}
          onSubmit={handleLogUpdate}
          onClose={() => setShowLogUpdate(false)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Auto-saved indicator */}
      {autoSaved && (
        <div className="fixed bottom-6 left-6 text-xs text-gray-500 bg-navy-800 px-3 py-1.5 rounded-lg border border-navy-700 transition-opacity">
          Auto-saved
        </div>
      )}
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
