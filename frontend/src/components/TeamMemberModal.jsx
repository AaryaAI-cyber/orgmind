// TeamMemberModal.jsx
// ============================================================
// Modal to add a new team member to the Team Directory.
// Collects: name, role, team, skills (comma-separated),
// and current utilization percentage.
// ============================================================

import { useState } from 'react'

const ROLES = [
  'Senior Backend Developer',
  'Backend Developer',
  'Frontend Developer',
  'Senior Frontend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'QA Lead',
  'QA Engineer',
  'Product Manager',
  'Tech Lead',
  'Data Engineer',
  'ML Engineer',
  'Other',
]

export default function TeamMemberModal({ teamNames, onSubmit, onClose }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('Backend Developer')
  const [team, setTeam] = useState(teamNames[0] || '')
  const [skills, setSkills] = useState('')
  const [utilization, setUtilization] = useState(50)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      name: name || 'New Member',
      role,
      team,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      utilization,
      ticketCount: Math.floor(utilization / 20),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-navy-800 rounded-xl border border-navy-700 p-6 w-full max-w-md">
        <h3 className="text-white font-bold text-lg mb-4">Add Team Member</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Singh" className="input-field" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="input-field">
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400">Team</label>
            <select value={team} onChange={e => setTeam(e.target.value)} className="input-field">
              {teamNames.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400">Skills (comma-separated)</label>
            <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Python, OAuth, FastAPI" className="input-field" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Current Utilization (%)</label>
            <input type="number" value={utilization} onChange={e => setUtilization(+e.target.value)} min={0} max={100} className="input-field" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Member</button>
          </div>
        </form>
      </div>
    </div>
  )
}
