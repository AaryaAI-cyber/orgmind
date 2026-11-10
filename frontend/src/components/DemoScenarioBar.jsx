import { DEMO_SCENARIOS } from '../lib/demoScenarios'

export default function DemoScenarioBar({ activeId, onSwitch }) {
  return (
    <div className="bg-navy-800 border-b border-navy-700 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3 py-2 overflow-x-auto">
        <span className="text-gray-500 text-xs whitespace-nowrap">Demo Scenarios:</span>
        {DEMO_SCENARIOS.map(s => (
          <button key={s.id} onClick={() => onSwitch(s.id)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
              activeId === s.id
                ? 'bg-amd-purple text-white'
                : 'bg-navy-900/60 border border-navy-700 text-gray-400 hover:border-amd-purple/50'
            }`}>
            {s.name}
          </button>
        ))}
      </div>
    </div>
  )
}
