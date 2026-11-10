import { useState } from 'react'

export default function Sidebar({ config, daysRemaining, activeTeam, onTeamFilter, onEditSetup, onSwitchProject, onStartFresh, collapsed, onToggle }) {
  return (
    <>
      {/* Toggle button (always visible) */}
      <button onClick={onToggle}
        className="fixed top-20 left-0 z-40 bg-navy-800 border border-navy-700 rounded-r-lg px-2 py-3 text-gray-400 hover:text-white transition-colors"
        title={collapsed ? 'Open sidebar' : 'Close sidebar'}>
        {collapsed ? '▶' : '◀'}
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-navy-800 border-r border-navy-700 z-30 transition-all duration-300 flex flex-col ${
        collapsed ? '-translate-x-full' : 'translate-x-0 w-64'
      }`}>
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Company */}
          <div className="mb-6">
            <h3 className="text-white font-bold text-sm">{config.companyName}</h3>
            <p className="text-gray-500 text-xs mt-1">{config.industry} · {config.companySize} employees</p>
          </div>

          {/* Project */}
          <div className="mb-6 bg-navy-900/60 rounded-lg p-3">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Project</p>
            <p className="text-white text-sm font-semibold">{config.projectName}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`text-xs font-bold ${daysRemaining <= 3 ? 'text-red-400' : daysRemaining <= 7 ? 'text-amber-400' : 'text-green-400'}`}>
                {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
              </span>
            </div>
          </div>

          {/* Teams filter */}
          <div className="mb-6">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Teams</p>
            <div className="space-y-1">
              <button onClick={() => onTeamFilter(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !activeTeam ? 'bg-amd-purple/20 text-amd-purple-light border border-amd-purple/30' : 'text-gray-400 hover:bg-navy-700'
                }`}>All Teams</button>
              {config.teamNames.map(team => (
                <button key={team} onClick={() => onTeamFilter(team)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTeam === team ? 'bg-amd-purple/20 text-amd-purple-light border border-amd-purple/30' : 'text-gray-400 hover:bg-navy-700'
                  }`}>{team}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="p-4 border-t border-navy-700 space-y-2">
          <button onClick={onEditSetup} className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-400 hover:bg-navy-700 transition-colors">
            ✏️ Edit Setup
          </button>
          <button onClick={onSwitchProject} className="w-full text-left px-3 py-2 rounded-lg text-xs text-gray-400 hover:bg-navy-700 transition-colors">
            🔄 Switch Project
          </button>
          <button onClick={onStartFresh} className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-900/20 transition-colors">
            🗑️ Start Fresh
          </button>
        </div>
      </aside>
    </>
  )
}
