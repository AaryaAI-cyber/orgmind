import { useState, useEffect } from 'react'
import { DEMO_SCENARIOS } from '../lib/demoScenarios'

const ROLES = ['CEO', 'Delivery Head', 'Product Manager', 'AI Architect', 'HR Head', 'Team Lead', 'Developer', 'Other']
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Consulting', 'Other']
const SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+']
const TEAM_COUNTS = ['1', '2-3', '4-6', '7+']
const SPRINT_DURATIONS = ['1', '2', '3', '4']

function teamCountToNumber(val) {
  if (val === '1') return 1
  if (val === '2-3') return 2
  if (val === '4-6') return 4
  return 6
}

function defaultDeadline() {
  const d = new Date()
  d.setDate(d.getDate() + 10)
  return d.toISOString().split('T')[0]
}

export default function Onboarding({ onComplete, onDemoSelect }) {
  const [step, setStep] = useState(1)
  const [fade, setFade] = useState(true)

  // Step 1
  const [companyName, setCompanyName] = useState('')
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('Product Manager')
  const [industry, setIndustry] = useState('Technology')
  const [companySize, setCompanySize] = useState('51-200')

  // Step 2
  const [projectName, setProjectName] = useState('')
  const [teamCount, setTeamCount] = useState('2-3')
  const [teamNames, setTeamNames] = useState(['', ''])
  const [sprintDuration, setSprintDuration] = useState('2')
  const [sprintDeadline, setSprintDeadline] = useState(defaultDeadline)
  const [totalPoints, setTotalPoints] = useState(80)
  const [completedPoints, setCompletedPoints] = useState(24)

  // Step 3
  const [connectedTools, setConnectedTools] = useState({ jira: false, slack: false, github: false })
  const [showModal, setShowModal] = useState(null)

  useEffect(() => {
    const n = teamCountToNumber(teamCount)
    setTeamNames(prev => {
      const next = [...prev]
      while (next.length < n) next.push('')
      return next.slice(0, n)
    })
  }, [teamCount])

  useEffect(() => {
    setCompletedPoints(Math.round(totalPoints * 0.3))
  }, [totalPoints])

  const goToStep = (s) => {
    setFade(false)
    setTimeout(() => { setStep(s); setFade(true) }, 200)
  }

  const handleLaunch = () => {
    const finalTeams = teamNames.map((t, i) => t.trim() || `Team ${i + 1}`)
    onComplete({
      companyName: companyName || 'My Company',
      userName: userName || 'User',
      userRole,
      industry,
      companySize,
      projectName: projectName || 'My Project',
      teamNames: finalTeams,
      sprintDuration,
      sprintDeadline,
      totalPoints,
      completedPoints,
    })
  }

  const stepValid = () => {
    if (step === 1) return true
    if (step === 2) return true
    return true
  }

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-4 py-8">
      {/* Progress bar */}
      <div className="w-full max-w-[560px] mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                s < step ? 'bg-green-500 text-white' :
                s === step ? 'bg-amd-purple text-white' :
                'bg-navy-700 text-gray-500'
              }`}>{s < step ? '✓' : s}</div>
              <span className={`text-xs hidden sm:block ${s === step ? 'text-white' : 'text-gray-500'}`}>
                {s === 1 ? 'Company' : s === 2 ? 'Project' : 'Connect'}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-navy-700 rounded-full h-1.5">
          <div className="bg-amd-purple h-1.5 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
        </div>
      </div>

      {/* Card */}
      <div className={`w-full max-w-[560px] bg-navy-800 rounded-2xl border border-navy-700 p-8 transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-white mb-1">Tell us about your company</h2>
            <p className="text-gray-400 text-sm mb-6">We'll personalize OrgMind for your organization</p>
            <div className="space-y-4">
              <Field label="Company Name">
                <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Acme Corp"
                  className="input-field" />
              </Field>
              <Field label="Your Name">
                <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Priya Kumar"
                  className="input-field" />
              </Field>
              <Field label="Your Role">
                <select value={userRole} onChange={e => setUserRole(e.target.value)} className="input-field">
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Industry">
                  <select value={industry} onChange={e => setIndustry(e.target.value)} className="input-field">
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </Field>
                <Field label="Company Size">
                  <select value={companySize} onChange={e => setCompanySize(e.target.value)} className="input-field">
                    {SIZES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={() => goToStep(2)} className="btn-primary">Next →</button>
            </div>
            <div className="mt-6 text-center">
              <button onClick={onDemoSelect} className="text-amd-purple-light hover:text-white text-sm transition-colors">
                ⚡ Skip setup — try instant demo
              </button>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-white mb-1">Tell us about your project</h2>
            <p className="text-gray-400 text-sm mb-6">OrgMind will generate analysis based on your actual data</p>
            <div className="space-y-4">
              <Field label="Project Name">
                <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Project Phoenix"
                  className="input-field" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Number of Teams">
                  <select value={teamCount} onChange={e => setTeamCount(e.target.value)} className="input-field">
                    {TEAM_COUNTS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Sprint Duration">
                  <select value={sprintDuration} onChange={e => setSprintDuration(e.target.value)} className="input-field">
                    {SPRINT_DURATIONS.map(d => <option key={d} value={d}>{d} week{d !== '1' ? 's' : ''}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Team Names">
                <div className="space-y-2">
                  {teamNames.map((name, i) => (
                    <input key={i} value={name} onChange={e => {
                      const next = [...teamNames]; next[i] = e.target.value; setTeamNames(next)
                    }} placeholder={`Team ${i + 1}`} className="input-field" />
                  ))}
                </div>
              </Field>
              <Field label="Current Sprint Deadline">
                <input type="date" value={sprintDeadline} onChange={e => setSprintDeadline(e.target.value)}
                  className="input-field" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Total Story Points Planned">
                  <input type="number" value={totalPoints} onChange={e => setTotalPoints(+e.target.value || 0)} min={1}
                    className="input-field" />
                </Field>
                <Field label="Story Points Completed">
                  <input type="number" value={completedPoints} onChange={e => setCompletedPoints(+e.target.value || 0)} min={0}
                    className="input-field" />
                </Field>
              </div>
            </div>
            <div className="mt-8 flex justify-between">
              <button onClick={() => goToStep(1)} className="btn-secondary">← Back</button>
              <button onClick={() => goToStep(3)} className="btn-primary">Next →</button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold text-white mb-1">Connect your tools</h2>
            <p className="text-gray-400 text-sm mb-6">Or use smart simulation for now</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {[
                { key: 'jira', icon: '📋', name: 'Jira', desc: "We'll analyze your tickets for silent blockers" },
                { key: 'slack', icon: '💬', name: 'Slack', desc: "We'll read team sentiment from your channels" },
                { key: 'github', icon: '🔧', name: 'GitHub', desc: "We'll track commit velocity and PR patterns" },
              ].map(tool => (
                <div key={tool.key} className="bg-navy-900/60 rounded-xl border border-navy-700 p-4 text-center">
                  <div className="text-3xl mb-2">{tool.icon}</div>
                  <h3 className="text-white font-semibold mb-1">{tool.name}</h3>
                  <p className="text-gray-500 text-xs mb-3">{tool.desc}</p>
                  {connectedTools[tool.key] ? (
                    <div className="text-green-400 text-sm font-medium">✓ Connected</div>
                  ) : (
                    <button onClick={() => { setShowModal(tool.name); setTimeout(() => {
                      setConnectedTools(p => ({ ...p, [tool.key]: true })); setShowModal(null)
                    }, 1500) }} className="px-3 py-1.5 bg-amd-purple/20 border border-amd-purple/50 rounded-lg text-amd-purple-light text-xs hover:bg-amd-purple/30 transition-colors">
                      Connect {tool.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs text-center mb-6">
              OrgMind uses your inputs to generate realistic analysis. Real integrations coming soon.
            </p>
            <div className="flex justify-between items-center">
              <button onClick={() => goToStep(2)} className="btn-secondary">← Back</button>
              <button onClick={handleLaunch} className="px-8 py-3 bg-amd-purple hover:bg-amd-purple-dark text-white font-bold rounded-lg transition-colors text-lg">
                Launch My OrgMind →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Connection modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-navy-800 rounded-xl border border-navy-700 p-6 max-w-sm mx-4 text-center">
            <div className="text-2xl mb-3 pulse-glow">⚡</div>
            <p className="text-white font-medium mb-2">{showModal} OAuth coming soon</p>
            <p className="text-gray-400 text-sm">Using smart simulation for now...</p>
            <div className="mt-4 text-green-400 text-sm">Connecting...</div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  )
}
