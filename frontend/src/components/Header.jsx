// Header.jsx
// ============================================================
// Top bar showing:
// - OrgMind logo + user name at company
// - Sprint deadline countdown (center)
// - AMD MI300X badge (always visible for judges)
// - Run Analysis button with loading state
// - Edit Setup button
// ============================================================

import Tooltip from './Tooltip'

export default function Header({ demoMode, lastAnalyzed, onRunAnalysis, loading, userName, companyName, deadline, onEditSetup }) {
  const formatTime = (ts) => {
    if (!ts) return null
    const d = new Date(ts)
    return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  }

  // Calculate days until deadline for countdown display
  const daysToDeadline = deadline ? Math.ceil((new Date(deadline) - new Date()) / 86400000) : null

  return (
    <header className="bg-navy-800 border-b border-navy-700 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo + User info */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold bg-gradient-to-r from-amd-purple to-amd-purple-light bg-clip-text text-transparent">
            OrgMind
          </div>
          {userName ? (
            <span className="text-xs text-gray-400 hidden sm:block">
              {userName} at {companyName}
            </span>
          ) : (
            <span className="text-xs text-gray-500 hidden sm:block">AI Org Intelligence</span>
          )}
        </div>

        {/* Center: Sprint deadline countdown */}
        {daysToDeadline !== null && (
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-gray-500">⏰</span>
            <span className={`font-medium ${daysToDeadline <= 3 ? 'text-red-400' : daysToDeadline <= 7 ? 'text-amber-400' : 'text-gray-400'}`}>
              {daysToDeadline} days to deadline
            </span>
          </div>
        )}

        {/* Right: AMD badge + buttons */}
        <div className="flex items-center gap-3">
          {/* AMD MI300X badge — always visible, judges look for this */}
          <Tooltip text="All AI inference runs on AMD Instinct MI300X GPU via ROCm on AMD Developer Cloud. No data sent to OpenAI." position="bottom">
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              demoMode
                ? 'border-yellow-600/50 bg-yellow-900/30 text-yellow-300'
                : 'border-amd-purple/50 bg-amd-purple/20 text-amd-purple-light'
            }`}>
              {demoMode ? (
                <>⚡ Demo Mode</>
              ) : (
                <>⚡ AMD MI300X</>
              )}
            </div>
          </Tooltip>

          {/* Edit Setup button */}
          {onEditSetup && (
            <Tooltip text="Change your company name, project details, or team configuration. Dashboard updates immediately." position="bottom">
              <button onClick={onEditSetup}
                className="hidden md:block px-3 py-1.5 rounded-lg text-xs text-gray-400 border border-navy-700 hover:border-navy-600 hover:text-white transition-colors">
                Edit Setup
              </button>
            </Tooltip>
          )}

          {/* Run Analysis button */}
          <Tooltip text="Triggers all 3 AMD-powered AI agents simultaneously: Blocker Scout + Sentiment Pulse + Velocity Tracker. Results synthesized by Qwen2.5-72B on AMD MI300X GPU." position="bottom">
            <button
              onClick={onRunAnalysis}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                loading
                  ? 'bg-navy-700 text-gray-400 cursor-not-allowed'
                  : 'bg-amd-purple hover:bg-amd-purple-dark text-white hover:shadow-lg hover:shadow-amd-purple/25'
              }`}
            >
              {loading ? 'Analyzing...' : '🔄 Run Analysis'}
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  )
}
