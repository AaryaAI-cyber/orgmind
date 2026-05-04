/**
 * Header Component
 * OrgMind logo with gradient, "Powered by AMD MI300X + ROCm" badge,
 * last analyzed timestamp, and "Run Analysis" button.
 */
export default function Header({ demoMode, lastAnalyzed, onRunAnalysis, loading }) {
  const formatTime = (ts) => {
    if (!ts) return null
    const d = new Date(ts)
    return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  }

  return (
    <header className="bg-navy-800 border-b border-navy-700 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="text-2xl font-extrabold bg-gradient-to-r from-amd-purple to-amd-purple-light bg-clip-text text-transparent">
            OrgMind
          </div>
          <span className="text-xs text-gray-500 hidden sm:block">AI Org Intelligence</span>
        </div>

        {/* Center: last analyzed */}
        {lastAnalyzed && (
          <div className="hidden md:block text-xs text-gray-500">
            Last analyzed: {formatTime(lastAnalyzed)}
          </div>
        )}

        {/* Right: AMD badge + Run button */}
        <div className="flex items-center gap-4">
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            demoMode
              ? 'border-yellow-600/50 bg-yellow-900/30 text-yellow-300'
              : 'border-amd-purple/50 bg-amd-purple/20 text-amd-purple-light'
          }`}>
            {demoMode ? (
              <>⚡ Demo Mode</>
            ) : (
              <>⚡ Powered by AMD MI300X + ROCm</>
            )}
          </div>

          <button
            onClick={onRunAnalysis}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              loading
                ? 'bg-navy-700 text-gray-400 cursor-not-allowed'
                : 'bg-amd-purple hover:bg-amd-purple-dark text-white hover:shadow-lg hover:shadow-amd-purple/25'
            }`}
          >
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      </div>
    </header>
  )
}
