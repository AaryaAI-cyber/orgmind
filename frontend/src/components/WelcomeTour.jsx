// WelcomeTour.jsx
// ============================================================
// First-time user welcome overlay + guided product tour.
// Shows ONLY on first visit. Checks localStorage key
// 'orgmind_seen_welcome'. After dismissal, sets the key
// so it never shows again.
// Two CTAs: Quick Demo (loads Acme Corp + guided tour) and
// Set Up My Company (goes to Onboarding Step 1).
// ============================================================

import { useState, useEffect, useCallback } from 'react'

const TOUR_STEPS = [
  { id: 'health', label: 'Org Health Score', desc: "This is your org's pulse — a real-time composite of blockers, sentiment, and velocity." },
  { id: 'blockers', label: 'Blocker Feed', desc: 'Silent ITIL blockers killing your sprint — stuck tickets nobody escalated.' },
  { id: 'sentiment', label: 'Sentiment Graph', desc: 'Team morale, week over week — privacy-first, team level only.' },
  { id: 'deadline', label: 'Deadline Card', desc: 'Will you make the date? Math says... based on actual velocity data.' },
  { id: 'ask', label: 'Ask OrgMind', desc: 'Ask anything in plain English. Get truth, not generic advice.' },
]

export default function WelcomeTour({ onQuickDemo, onSetup, onTourStep }) {
  const [tourActive, setTourActive] = useState(false)
  const [tourStepIndex, setTourStepIndex] = useState(0)

  // Run guided product tour: highlight each dashboard component
  const startTour = useCallback(() => {
    onQuickDemo()
    setTourActive(true)
    setTourStepIndex(0)
  }, [onQuickDemo])

  // Advance tour to next step, or finish
  useEffect(() => {
    if (!tourActive) return
    const timer = setTimeout(() => {
      if (tourStepIndex < TOUR_STEPS.length - 1) {
        setTourStepIndex(prev => prev + 1)
      } else {
        setTourActive(false)
        localStorage.setItem('orgmind_seen_welcome', 'true')
      }
    }, 2500)
    return () => clearTimeout(timer)
  }, [tourActive, tourStepIndex])

  // Notify parent about current tour step for highlighting
  useEffect(() => {
    if (tourActive && onTourStep) {
      onTourStep(TOUR_STEPS[tourStepIndex]?.id || null)
    } else if (!tourActive && onTourStep) {
      onTourStep(null)
    }
  }, [tourActive, tourStepIndex, onTourStep])

  const handleSetup = () => {
    localStorage.setItem('orgmind_seen_welcome', 'true')
    onSetup()
  }

  const handleDismissTour = () => {
    setTourActive(false)
    localStorage.setItem('orgmind_seen_welcome', 'true')
    if (onTourStep) onTourStep(null)
  }

  // Guided tour overlay (shown during dashboard tour)
  if (tourActive) {
    const step = TOUR_STEPS[tourStepIndex]
    return (
      <div className="fixed inset-0 z-[60] pointer-events-none">
        {/* Tour info card at top */}
        <div className="pointer-events-auto absolute top-4 left-1/2 -translate-x-1/2 bg-navy-800 border-2 border-amd-purple rounded-xl p-4 shadow-2xl shadow-amd-purple/20 max-w-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-amd-purple flex items-center justify-center text-white text-xs font-bold">
              {tourStepIndex + 1}
            </div>
            <span className="text-amd-purple-light font-semibold text-sm">{step.label}</span>
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">{step.desc}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-1">
              {TOUR_STEPS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i <= tourStepIndex ? 'bg-amd-purple' : 'bg-navy-700'}`} />
              ))}
            </div>
            <button onClick={handleDismissTour} className="text-xs text-gray-500 hover:text-white transition-colors">
              Skip Tour
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Welcome overlay modal
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-navy-800 rounded-2xl border border-navy-700 p-8 max-w-[600px] w-full shadow-2xl">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-white mb-2 text-center">
          Welcome to <span className="bg-gradient-to-r from-amd-purple to-amd-purple-light bg-clip-text text-transparent">OrgMind</span>
        </h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Real-time AI organizational intelligence<br />
          Powered by AMD Instinct MI300X GPU + ROCm
        </p>

        {/* 3 feature highlights */}
        <div className="space-y-4 mb-8">
          <FeatureRow
            icon="🔍"
            title="Detect Silent Blockers"
            desc="Find ITIL tickets stuck for days that nobody escalated. P1 incidents breaching SLA before leadership knows."
          />
          <FeatureRow
            icon="📊"
            title="Read Team Sentiment"
            desc="Understand how your teams really feel — not what they say in standups. Privacy-first: team level only."
          />
          <FeatureRow
            icon="🎯"
            title="Predict Deadlines"
            desc="Mathematical sprint velocity analysis tells you 2 weeks early if your delivery will miss the date."
          />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={startTour}
            className="flex-1 px-6 py-3 rounded-xl bg-navy-900 border border-navy-700 text-gray-200 font-medium hover:border-amd-purple/50 hover:text-white transition-all text-sm"
          >
            ⚡ Quick Demo — Show Me Around
          </button>
          <button
            onClick={handleSetup}
            className="flex-1 px-6 py-3 rounded-xl bg-amd-purple text-white font-medium hover:bg-amd-purple-dark hover:shadow-lg hover:shadow-amd-purple/25 transition-all text-sm"
          >
            Set Up My Company →
          </button>
        </div>
      </div>
    </div>
  )
}

// Feature row used in the welcome modal
function FeatureRow({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 bg-navy-900/40 rounded-xl p-4 border border-navy-700/50">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
        <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
