// App.jsx
// ============================================================
// Main application component for OrgMind.
// Manages 4 views: loading → welcome/onboarding → demo-select → dashboard
// Handles: WelcomeTour (first visit only), Onboarding (3-step),
// personalized data generation, interactive dashboard with
// team directory, ITIL ticket creation, blocker resolution,
// localStorage persistence, and demo mode with scenario switching.
// ============================================================

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
import TicketModal from './components/TicketModal'
import LogUpdateModal from './components/LogUpdateModal'
import DemoScenarioBar from './components/DemoScenarioBar'
import WelcomeTour from './components/WelcomeTour'
import TeamMemberModal from './components/TeamMemberModal'
import { generatePersonalizedData } from './lib/dataGenerator'
import { buildScenarioData, DEMO_SCENARIOS } from './lib/demoScenarios'
import { loadSession, saveSession, clearSession } from './lib/storage'

const API_BASE = import.meta.env.VITE_API_URL || ''

// Default team member names pool for generating team directory
const NAMES_BY_TEAM = [
  ['Priya Kumar', 'Raj Mehta', 'Sarah Chen', 'Alex Rivera', 'David Park'],
  ['Emma Wilson', 'Mike Johnson', 'Lisa Zhang', 'Tom Anderson', 'Nina Patel'],
  ['James Lee', 'Maria Garcia', 'Chris Brown', 'Yuki Tanaka', 'Sam Williams'],
  ['Anna Kim', 'Ben Taylor', 'Diana Moss', 'Carlos Ruiz', 'Fatima Hassan'],
  ['Liam O\'Brien', 'Sophia Adams', 'Ethan Hall', 'Olivia Scott', 'Noah Clark'],
  ['Ava Martinez', 'Lucas White', 'Mia Robinson', 'Jack Lewis', 'Chloe Walker'],
  ['Ryan Young', 'Zoe King', 'Owen Wright', 'Ella Green', 'Leo Baker'],
]

// Skill sets per industry for generating team member profiles
const SKILLS_BY_ROLE = {
  Backend: ['Python', 'FastAPI', 'PostgreSQL', 'OAuth', 'Redis', 'Docker'],
  Frontend: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'GraphQL'],
  DevOps: ['Docker', 'K8s', 'CI/CD', 'AWS', 'Terraform', 'Monitoring'],
  QA: ['Selenium', 'Postman', 'Testing', 'Cypress', 'Jest'],
  Engineering: ['Python', 'React', 'PostgreSQL', 'Docker', 'TypeScript'],
  Product: ['Roadmap', 'Analytics', 'User Research', 'Jira', 'Strategy'],
  default: ['Python', 'React', 'SQL', 'Docker'],
}

const ROLE_TITLES = [
  'Senior Developer', 'Developer', 'Tech Lead', 'Junior Developer', 'DevOps Engineer',
]

// Generate default team directory from onboarding config
function generateTeamDirectory(config) {
  const members = []
  const teamNames = config.teamNames || []
  teamNames.forEach((teamName, teamIdx) => {
    const namePool = NAMES_BY_TEAM[teamIdx % NAMES_BY_TEAM.length]
    const memberCount = Math.min(3, namePool.length)
    const skills = SKILLS_BY_ROLE[teamName] || SKILLS_BY_ROLE.default
    for (let i = 0; i < memberCount; i++) {
      const utilization = Math.floor(Math.random() * 60) + 30
      members.push({
        name: namePool[i],
        role: ROLE_TITLES[i % ROLE_TITLES.length],
        team: teamName,
        skills: skills.slice(0, 3),
        utilization,
        ticketCount: Math.floor(utilization / 20),
      })
    }
  })
  return members
}

function App() {
  // View routing: loading → onboarding/welcome → demo-select → dashboard
  const [view, setView] = useState('loading')
  const [showWelcome, setShowWelcome] = useState(false)
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
  const [showAddMember, setShowAddMember] = useState(false)
  const [demoScenario, setDemoScenario] = useState(null)
  const [autoSaved, setAutoSaved] = useState(false)
  const [teamDirectory, setTeamDirectory] = useState([])
  const [tourHighlight, setTourHighlight] = useState(null)
  const saveTimer = useRef(null)

  // Load from localStorage on mount, check if first visit
  useEffect(() => {
    const saved = loadSession()
    if (saved?.config && saved?.generatedData) {
      setUserConfig(saved.config)
      setGeneratedData(saved.generatedData)
      setAnalysisData(saved.analysisData || null)
      setDemoScenario(saved.demoScenario || null)
      setTeamDirectory(saved.teamDirectory || generateTeamDirectory(saved.config))
      setView('dashboard')
    } else {
      // Check if first visit (never seen welcome)
      const seenWelcome = localStorage.getItem('orgmind_seen_welcome')
      if (!seenWelcome) {
        setShowWelcome(true)
      }
      setView('onboarding')
    }
  }, [])

  // Auto-save to localStorage on every change (1s debounce)
  useEffect(() => {
    if (!userConfig || view !== 'dashboard') return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveSession({ config: userConfig, generatedData, analysisData, demoScenario, teamDirectory })
      setAutoSaved(true)
      setTimeout(() => setAutoSaved(false), 2000)
    }, 1000)
  }, [userConfig, generatedData, analysisData, view, demoScenario, teamDirectory])

  // Handle onboarding completion: generate personalized data + auto-run analysis
  const handleOnboardingComplete = useCallback((config) => {
    const data = generatePersonalizedData(config)
    setUserConfig(config)
    setGeneratedData(data)
    setDemoScenario(null)
    setAnalysisData(null)
    setTeamDirectory(generateTeamDirectory(config))
    setView('dashboard')
    setTimeout(() => runAnalysisWithData(data), 300)
  }, [])

  // Navigate to demo scenario selection screen
  const handleDemoSelect = useCallback(() => {
    setView('demo-select')
  }, [])

  // Load a pre-built demo scenario
  const handleDemoScenario = useCallback((scenarioId) => {
    const scenarioData = buildScenarioData(scenarioId)
    if (!scenarioData) return
    const data = scenarioData._generatedData
    setUserConfig(scenarioData)
    setGeneratedData(data)
    setDemoScenario(scenarioId)
    setAnalysisData(null)
    setTeamDirectory(generateTeamDirectory(scenarioData))
    setView('dashboard')
    setTimeout(() => runAnalysisWithData(data), 300)
  }, [])

  // Build the payload to send to /analyze endpoint
  const buildAnalysisPayload = (data) => ({
    jira_tickets: data.jira_tickets,
    slack_messages: data.slack_messages,
    sprint_data: data.sprint_data,
    company: data.company,
    project: data.project,
    computed: data._computed,
  })

  // Run full multi-agent analysis with animated status
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

  // Re-run analysis with current data
  const runAnalysis = useCallback(() => {
    if (generatedData) runAnalysisWithData(generatedData)
  }, [generatedData])

  // Resolve a blocker: remove from list, +5 health score, show toast
  const handleResolveBlocker = useCallback((ticketId) => {
    if (!analysisData) return
    const newBlockers = (analysisData.blocker_data?.critical_blockers || []).filter(b => b.ticket_id !== ticketId)
    const newScore = Math.min(100, (analysisData.org_health_score || 0) + 5)
    setAnalysisData(prev => ({
      ...prev,
      org_health_score: newScore,
      blocker_data: { ...prev.blocker_data, critical_blockers: newBlockers, severity_score: Math.max(0, (prev.blocker_data?.severity_score || 0) - 20) },
    }))
    setToast({ message: 'Blocker resolved! Health score improved by 5 points.', type: 'success' })
  }, [analysisData])

  // Add a new ITIL ticket and re-run analysis
  const handleAddTicket = useCallback((ticket) => {
    if (!generatedData) return
    const newData = { ...generatedData, jira_tickets: [...generatedData.jira_tickets, ticket] }
    setGeneratedData(newData)
    setShowAddTicket(false)
    setToast({ message: `Ticket ${ticket.ticket_id} added. Re-running analysis...`, type: 'info' })
    setTimeout(() => runAnalysisWithData(newData), 500)
  }, [generatedData])

  // Log a team update (Slack simulation) and re-run sentiment analysis
  const handleLogUpdate = useCallback((update) => {
    if (!generatedData) return
    const newData = { ...generatedData, slack_messages: [update, ...generatedData.slack_messages] }
    setGeneratedData(newData)
    setShowLogUpdate(false)
    setToast({ message: 'Team update logged. Re-running sentiment analysis...', type: 'info' })
    setTimeout(() => runAnalysisWithData(newData), 500)
  }, [generatedData])

  // Add a new team member to the directory
  const handleAddMember = useCallback((member) => {
    setTeamDirectory(prev => [...prev, member])
    setShowAddMember(false)
    setToast({ message: `${member.name} added to Team Directory.`, type: 'success' })
  }, [])

  // Share dashboard: generate a shareable URL
  const handleShare = useCallback(() => {
    const shareId = Math.random().toString(36).substring(2, 8)
    const url = `${window.location.origin}/dashboard/${shareId}`
    navigator.clipboard?.writeText(url)
    setToast({ message: 'Share link copied to clipboard!', type: 'success' })
  }, [])

  // Get team members map for ticket assignee dropdown
  const getTeamMembers = () => {
    const members = {}
    ;(userConfig?.teamNames || []).forEach((team) => {
      members[team] = teamDirectory.filter(m => m.team === team).map(m => m.name)
      if (members[team].length === 0) {
        const idx = (userConfig?.teamNames || []).indexOf(team)
        members[team] = NAMES_BY_TEAM[idx % NAMES_BY_TEAM.length]
      }
    })
    return members
  }

  // Get project prefix for auto-generated ticket IDs
  const getProjectPrefix = () =>
    (userConfig?.projectName || 'PROJ').replace(/\s+/g, '').substring(0, 4).toUpperCase()

  // Filter dashboard data by active team selection
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

  // Start fresh: clear all data and return to onboarding
  const handleStartFresh = () => {
    clearSession()
    localStorage.removeItem('orgmind_seen_welcome')
    setView('onboarding')
    setShowWelcome(true)
    setAnalysisData(null)
    setUserConfig(null)
    setGeneratedData(null)
    setDemoScenario(null)
    setTeamDirectory([])
  }

  // Handle quick demo from WelcomeTour
  const handleQuickDemo = useCallback(() => {
    handleDemoScenario('acme-corp')
  }, [handleDemoScenario])

  // Loading state
  if (view === 'loading') return <div className="min-h-screen bg-navy-900" />

  // Onboarding view (with optional WelcomeTour overlay)
  if (view === 'onboarding') {
    return (
      <>
        {showWelcome && (
          <WelcomeTour
            onQuickDemo={handleQuickDemo}
            onSetup={() => { setShowWelcome(false); localStorage.setItem('orgmind_seen_welcome', 'true') }}
            onTourStep={setTourHighlight}
          />
        )}
        <Onboarding onComplete={handleOnboardingComplete} onDemoSelect={handleDemoSelect} />
      </>
    )
  }

  // Demo scenario selection screen
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
        deadline={generatedData?._computed?.originalDeadline}
        onEditSetup={() => setView('onboarding')}
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
        onStartFresh={handleStartFresh}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(p => !p)}
        teamDirectory={teamDirectory}
        onAddMember={() => setShowAddMember(true)}
      />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-0' : 'ml-64'} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6`}>
        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Agent Status Bar — shows during analysis with live progress */}
        {loading && (
          <div className="mb-6 p-4 bg-navy-800 rounded-lg border border-navy-700">
            <p className="text-sm text-gray-400 mb-3 font-medium">Running Multi-Agent Analysis on AMD MI300X...</p>
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
            {/* Action bar with team filter badge and share button */}
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

            {/* Top row: Health Score + Deadline Prediction */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <OrgHealthCard
                score={filteredData.org_health_score}
                summary={filteredData.executive_summary}
                criticalAction={filteredData.critical_action}
                sentimentHistory={filteredData.sentiment_data?.weekly_sentiment_history}
              />
              <DeadlineCard velocityData={filteredData.velocity_data} />
            </div>

            {/* Middle row: Blocker Feed + Sentiment Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <BlockerFeed
                blockerData={filteredData.blocker_data}
                onResolve={handleResolveBlocker}
                onAddTicket={() => setShowAddTicket(true)}
              />
              <SentimentGraph sentimentData={filteredData.sentiment_data} />
            </div>

            {/* Bottom: Ask OrgMind chat */}
            <AskOrgMind
              apiBase={API_BASE}
              demoMode={filteredData.demo_mode}
              projectName={userConfig?.projectName}
              teamNames={userConfig?.teamNames}
              deadline={generatedData?._computed?.originalDeadline}
              companyName={userConfig?.companyName}
              onLogUpdate={() => setShowLogUpdate(true)}
            />
          </>
        )}

        {/* Waiting state while analysis runs */}
        {!filteredData && !loading && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amd-purple to-amd-purple-light bg-clip-text text-transparent">
              Analyzing {userConfig?.projectName || 'your project'}...
            </h2>
            <p className="text-gray-400 mb-8">OrgMind is running multi-agent analysis on your data</p>
          </div>
        )}
      </main>

      {/* ITIL Ticket Creation Modal */}
      {showAddTicket && (
        <TicketModal
          teamNames={userConfig?.teamNames || []}
          teamMembers={getTeamMembers()}
          projectPrefix={getProjectPrefix()}
          onSubmit={handleAddTicket}
          onClose={() => setShowAddTicket(false)}
        />
      )}

      {/* Log Team Update Modal */}
      {showLogUpdate && (
        <LogUpdateModal
          teamNames={userConfig?.teamNames || []}
          onSubmit={handleLogUpdate}
          onClose={() => setShowLogUpdate(false)}
        />
      )}

      {/* Add Team Member Modal */}
      {showAddMember && (
        <TeamMemberModal
          teamNames={userConfig?.teamNames || []}
          onSubmit={handleAddMember}
          onClose={() => setShowAddMember(false)}
        />
      )}

      {/* Toast notification */}
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

// Agent status badge component for analysis progress display
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
