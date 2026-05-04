import { generatePersonalizedData } from './dataGenerator'

const today = new Date()
const in10Days = new Date(today)
in10Days.setDate(in10Days.getDate() + 4)
const in14Days = new Date(today)
in14Days.setDate(in14Days.getDate() + 14)
const in7Days = new Date(today)
in7Days.setDate(in7Days.getDate() + 7)

function fmt(d) { return d.toISOString().split('T')[0] }

export const DEMO_SCENARIOS = [
  {
    id: 'acme',
    name: 'Acme Corp — Tech MNC under pressure',
    description: 'Large tech company with blocked sprint and declining morale',
    config: {
      companyName: 'Acme Corp',
      userName: 'Demo User',
      userRole: 'Delivery Head',
      industry: 'Technology',
      companySize: '201-1000',
      projectName: 'Project Phoenix',
      teamNames: ['Backend', 'Frontend', 'DevOps'],
      sprintDuration: '2',
      sprintDeadline: fmt(in10Days),
      totalPoints: 84,
      completedPoints: 31,
    },
  },
  {
    id: 'startupx',
    name: 'StartupX — Fast-moving team',
    description: 'Small startup shipping fast with some emerging risks',
    config: {
      companyName: 'StartupX',
      userName: 'Demo User',
      userRole: 'CEO',
      industry: 'Technology',
      companySize: '11-50',
      projectName: 'Launchpad',
      teamNames: ['Engineering', 'Product'],
      sprintDuration: '1',
      sprintDeadline: fmt(in7Days),
      totalPoints: 40,
      completedPoints: 22,
    },
  },
  {
    id: 'globalbank',
    name: 'GlobalBank — Stable delivery',
    description: 'Large bank with strong processes and healthy teams',
    config: {
      companyName: 'GlobalBank',
      userName: 'Demo User',
      userRole: 'Product Manager',
      industry: 'Finance',
      companySize: '1000+',
      projectName: 'NextGen Banking',
      teamNames: ['Core Banking', 'Compliance', 'Digital Channels', 'Risk'],
      sprintDuration: '3',
      sprintDeadline: fmt(in14Days),
      totalPoints: 120,
      completedPoints: 95,
    },
  },
]

export function buildScenarioData(scenarioId) {
  const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId)
  if (!scenario) return null
  return { ...scenario.config, _generatedData: generatePersonalizedData(scenario.config) }
}
