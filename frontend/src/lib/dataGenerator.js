const INDUSTRY_TICKETS = {
  Technology: [
    { title: 'Implement OAuth2 flow for SSO', labels: ['auth', 'integration'] },
    { title: 'Fix race condition in payment API', labels: ['payments', 'critical'] },
    { title: 'Database migration for user schema v3', labels: ['database', 'migration'] },
    { title: 'API rate limiting implementation', labels: ['security', 'api'] },
    { title: 'Microservice health check dashboard', labels: ['devops', 'monitoring'] },
    { title: 'WebSocket real-time notification service', labels: ['realtime', 'notifications'] },
    { title: 'CI/CD pipeline optimization', labels: ['devops', 'ci-cd'] },
    { title: 'Search index rebuild and optimization', labels: ['search', 'performance'] },
    { title: 'Mobile app push notification integration', labels: ['mobile', 'notifications'] },
    { title: 'User analytics event tracking', labels: ['analytics', 'frontend'] },
  ],
  Finance: [
    { title: 'Regulatory reporting module', labels: ['compliance', 'reporting'] },
    { title: 'Audit trail implementation', labels: ['audit', 'security'] },
    { title: 'Transaction reconciliation engine', labels: ['transactions', 'critical'] },
    { title: 'KYC verification workflow', labels: ['kyc', 'compliance'] },
    { title: 'Risk scoring algorithm update', labels: ['risk', 'ml'] },
    { title: 'PCI-DSS compliance audit fixes', labels: ['security', 'compliance'] },
    { title: 'Multi-currency support', labels: ['payments', 'i18n'] },
    { title: 'Fraud detection model retraining', labels: ['fraud', 'ml'] },
    { title: 'Statement generation service', labels: ['reporting', 'backend'] },
    { title: 'Interest calculation engine fix', labels: ['finance', 'critical'] },
  ],
  Healthcare: [
    { title: 'HIPAA compliance audit remediation', labels: ['compliance', 'hipaa'] },
    { title: 'Patient data encryption at rest', labels: ['security', 'encryption'] },
    { title: 'EHR integration with HL7 FHIR', labels: ['integration', 'ehr'] },
    { title: 'Appointment scheduling optimization', labels: ['scheduling', 'ux'] },
    { title: 'Telehealth video service stability', labels: ['telehealth', 'critical'] },
    { title: 'Prescription management workflow', labels: ['clinical', 'workflow'] },
    { title: 'Lab results notification system', labels: ['notifications', 'clinical'] },
    { title: 'Patient portal redesign', labels: ['frontend', 'ux'] },
    { title: 'Insurance claim processing', labels: ['billing', 'integration'] },
    { title: 'Medical imaging upload service', labels: ['imaging', 'storage'] },
  ],
  Retail: [
    { title: 'Inventory sync service across warehouses', labels: ['inventory', 'sync'] },
    { title: 'Checkout flow optimization', labels: ['checkout', 'ux'] },
    { title: 'Product recommendation engine', labels: ['ml', 'recommendations'] },
    { title: 'Order tracking real-time updates', labels: ['tracking', 'realtime'] },
    { title: 'Loyalty program points calculation', labels: ['loyalty', 'backend'] },
    { title: 'Return/refund processing automation', labels: ['returns', 'automation'] },
    { title: 'Price comparison tool integration', labels: ['pricing', 'integration'] },
    { title: 'Warehouse management system API', labels: ['warehouse', 'api'] },
    { title: 'Customer review moderation system', labels: ['reviews', 'moderation'] },
    { title: 'Promotional campaign engine', labels: ['marketing', 'promotions'] },
  ],
  Manufacturing: [
    { title: 'IoT sensor data pipeline', labels: ['iot', 'data'] },
    { title: 'Quality control automation', labels: ['quality', 'automation'] },
    { title: 'Supply chain tracking dashboard', labels: ['supply-chain', 'dashboard'] },
    { title: 'Production line monitoring alerts', labels: ['monitoring', 'alerts'] },
    { title: 'Predictive maintenance model', labels: ['ml', 'maintenance'] },
    { title: 'Material requirements planning', labels: ['planning', 'erp'] },
    { title: 'Safety incident reporting system', labels: ['safety', 'compliance'] },
    { title: 'Batch tracking and traceability', labels: ['tracking', 'compliance'] },
    { title: 'Equipment calibration scheduler', labels: ['maintenance', 'scheduling'] },
    { title: 'Warehouse automation integration', labels: ['automation', 'integration'] },
  ],
  Consulting: [
    { title: 'Client engagement portal', labels: ['portal', 'frontend'] },
    { title: 'Resource allocation optimizer', labels: ['resource', 'optimization'] },
    { title: 'Project milestone tracking', labels: ['tracking', 'pm'] },
    { title: 'Time tracking integration', labels: ['time', 'integration'] },
    { title: 'Client feedback survey system', labels: ['feedback', 'surveys'] },
    { title: 'Knowledge base search engine', labels: ['knowledge', 'search'] },
    { title: 'Proposal generation automation', labels: ['proposals', 'automation'] },
    { title: 'Invoice and billing automation', labels: ['billing', 'automation'] },
    { title: 'Consultant skills matrix', labels: ['hr', 'skills'] },
    { title: 'Client data room security', labels: ['security', 'data'] },
  ],
  Other: [
    { title: 'User authentication service', labels: ['auth', 'security'] },
    { title: 'API gateway configuration', labels: ['api', 'infrastructure'] },
    { title: 'Data export functionality', labels: ['data', 'export'] },
    { title: 'Email notification service', labels: ['email', 'notifications'] },
    { title: 'Dashboard performance optimization', labels: ['performance', 'frontend'] },
    { title: 'Search functionality improvements', labels: ['search', 'ux'] },
    { title: 'Reporting module development', labels: ['reporting', 'analytics'] },
    { title: 'Mobile responsive design', labels: ['mobile', 'frontend'] },
    { title: 'Third-party API integration', labels: ['integration', 'api'] },
    { title: 'Automated testing framework', labels: ['testing', 'quality'] },
  ],
}

const NAMES_BY_TEAM = [
  ['Priya Kumar', 'Raj Mehta', 'Sarah Chen', 'Alex Rivera', 'David Park'],
  ['Emma Wilson', 'Mike Johnson', 'Lisa Zhang', 'Tom Anderson', 'Nina Patel'],
  ['James Lee', 'Maria Garcia', 'Chris Brown', 'Yuki Tanaka', 'Sam Williams'],
  ['Anna Kim', 'Ben Taylor', 'Diana Moss', 'Carlos Ruiz', 'Fatima Hassan'],
  ['Liam O\'Brien', 'Sophia Adams', 'Ethan Hall', 'Olivia Scott', 'Noah Clark'],
  ['Ava Martinez', 'Lucas White', 'Mia Robinson', 'Jack Lewis', 'Chloe Walker'],
  ['Ryan Young', 'Zoe King', 'Owen Wright', 'Ella Green', 'Leo Baker'],
]

const SLACK_TEMPLATES_FRUSTRATED = [
  "Still blocked on {ticket}. Day {days} of waiting. Can someone please help?",
  "I've been stuck on this for {days} days now. Nothing I can do without {dep}.",
  "Anyone know who owns the {dep} service? We're completely blocked.",
  "The {ticket} issue is killing our velocity. Nobody seems to care.",
  "Frustrated that {ticket} hasn't moved. We're going to miss the deadline.",
  "{dep} team hasn't responded in {days} days. This is unacceptable.",
  "We need to escalate {ticket}. The PM doesn't even know about this blocker.",
  "Migration script keeps failing. Can't proceed without fixing this first.",
]

const SLACK_TEMPLATES_MODERATE = [
  "Making some progress on {ticket} but hitting a few snags.",
  "Need a quick review on my PR for {ticket}. Anyone available?",
  "Sprint is challenging but we're pushing through. {ticket} almost done.",
  "Had a productive session on {ticket}. Should wrap up tomorrow.",
  "Can someone sync with me on {dep}? Want to avoid blockers.",
  "Demo went okay but {ticket} still needs work before release.",
]

const SLACK_TEMPLATES_POSITIVE = [
  "Just shipped {ticket}! Feels great to close this one out.",
  "Great standup today. Team is aligned and moving fast.",
  "PR for {ticket} merged! On to the next one.",
  "Really enjoying the collaboration on this sprint. Good energy.",
  "{ticket} is ahead of schedule. Might even add stretch goals.",
  "Awesome code review from the team. Quality is improving every sprint.",
]

function pickRandom(arr, n = 1) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return n === 1 ? shuffled[0] : shuffled.slice(0, n)
}

function formatDate(d) { return d.toISOString().split('T')[0] }

export function generatePersonalizedData(config) {
  const {
    companyName, userName, userRole, industry, companySize,
    projectName, teamNames, sprintDuration, sprintDeadline,
    totalPoints, completedPoints,
  } = config

  const today = new Date()
  const deadline = new Date(sprintDeadline)
  const daysRemaining = Math.max(1, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)))
  const sprintDays = parseInt(sprintDuration) * 7
  const daysElapsed = Math.max(1, sprintDays - daysRemaining)
  const completionRatio = completedPoints / totalPoints

  // Generate tickets
  const industryTickets = INDUSTRY_TICKETS[industry] || INDUSTRY_TICKETS.Other
  const tickets = []
  let ticketCounter = 100

  const teamMembers = {}
  teamNames.forEach((team, i) => {
    teamMembers[team] = NAMES_BY_TEAM[i % NAMES_BY_TEAM.length]
  })

  // Create stuck tickets (blockers) — more if low completion
  const numBlockers = completionRatio < 0.4 ? Math.min(4, Math.ceil(teamNames.length * 1.2))
    : completionRatio < 0.7 ? Math.min(3, Math.ceil(teamNames.length * 0.8))
    : Math.min(2, teamNames.length)

  for (let i = 0; i < numBlockers && i < industryTickets.length; i++) {
    const template = industryTickets[i]
    const team = teamNames[i % teamNames.length]
    const members = teamMembers[team]
    const daysStuck = Math.floor(Math.random() * 6) + 5
    ticketCounter++
    tickets.push({
      ticket_id: `${projectName.replace(/\s+/g, '').substring(0, 4).toUpperCase()}-${ticketCounter}`,
      title: template.title,
      assignee: pickRandom(members),
      team,
      status: 'In Progress',
      priority: i < 2 ? 'HIGH' : 'MEDIUM',
      story_points: [3, 5, 8][Math.floor(Math.random() * 3)],
      created_date: formatDate(new Date(today - (daysStuck + 5) * 86400000)),
      last_updated: formatDate(new Date(today - daysStuck * 86400000)),
      sprint: 'Current Sprint',
      labels: template.labels,
      description: template.title,
    })
  }

  // Active tickets
  for (let i = numBlockers; i < numBlockers + 4 && i < industryTickets.length; i++) {
    const template = industryTickets[i]
    const team = teamNames[i % teamNames.length]
    const members = teamMembers[team]
    ticketCounter++
    tickets.push({
      ticket_id: `${projectName.replace(/\s+/g, '').substring(0, 4).toUpperCase()}-${ticketCounter}`,
      title: template.title,
      assignee: pickRandom(members),
      team,
      status: 'In Progress',
      priority: 'MEDIUM',
      story_points: [2, 3, 5][Math.floor(Math.random() * 3)],
      created_date: formatDate(new Date(today - 4 * 86400000)),
      last_updated: formatDate(new Date(today - 86400000)),
      sprint: 'Current Sprint',
      labels: template.labels,
      description: template.title,
    })
  }

  // Done tickets
  for (let i = numBlockers + 4; i < industryTickets.length; i++) {
    const template = industryTickets[i]
    const team = teamNames[i % teamNames.length]
    const members = teamMembers[team]
    ticketCounter++
    tickets.push({
      ticket_id: `${projectName.replace(/\s+/g, '').substring(0, 4).toUpperCase()}-${ticketCounter}`,
      title: template.title,
      assignee: pickRandom(members),
      team,
      status: 'Done',
      priority: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)],
      story_points: [2, 3, 5][Math.floor(Math.random() * 3)],
      created_date: formatDate(new Date(today - 10 * 86400000)),
      last_updated: formatDate(new Date(today - 2 * 86400000)),
      sprint: 'Current Sprint',
      labels: template.labels,
      description: template.title,
    })
  }

  // Generate slack messages
  const slackMessages = []
  const templates = completionRatio < 0.4 ? SLACK_TEMPLATES_FRUSTRATED
    : completionRatio < 0.7 ? SLACK_TEMPLATES_MODERATE
    : SLACK_TEMPLATES_POSITIVE
  const blockerTicketIds = tickets.filter(t => t.status === 'In Progress').map(t => t.ticket_id)

  for (let i = 0; i < 15; i++) {
    const team = teamNames[i % teamNames.length]
    const members = teamMembers[team]
    const template = pickRandom(templates)
    const ticketRef = blockerTicketIds.length > 0 ? pickRandom(blockerTicketIds) : 'the main task'
    slackMessages.push({
      author: pickRandom(members),
      team,
      channel: `#${team.toLowerCase().replace(/\s+/g, '-')}`,
      text: template.replace('{ticket}', ticketRef).replace('{days}', String(Math.floor(Math.random() * 5) + 3)).replace('{dep}', teamNames[(teamNames.indexOf(team) + 1) % teamNames.length]),
      timestamp: new Date(today - (i * 3 + Math.random() * 5) * 3600000).toISOString(),
      reactions: { thumbsup: Math.floor(Math.random() * 3), eyes: Math.floor(Math.random() * 2) },
    })
  }

  // Sprint data
  const actualVelocity = +(completedPoints / daysElapsed).toFixed(1)
  const remainingPoints = totalPoints - completedPoints
  const requiredVelocity = +(remainingPoints / daysRemaining).toFixed(1)
  const completionPct = +((completedPoints / totalPoints) * 100).toFixed(1)
  const predictedDays = requiredVelocity > 0 ? Math.ceil(remainingPoints / Math.max(actualVelocity, 0.1)) : daysRemaining
  const delayDays = Math.max(0, predictedDays - daysRemaining)
  const missProb = delayDays <= 0 ? Math.max(5, Math.round(20 * (requiredVelocity / Math.max(actualVelocity, 0.1)) - 10))
    : Math.min(99, Math.round(50 + (delayDays / daysRemaining) * 50))

  const predictedDate = new Date(deadline)
  predictedDate.setDate(predictedDate.getDate() + delayDays)

  const atRiskFeatures = tickets
    .filter(t => t.status === 'In Progress' && t.priority === 'HIGH')
    .map(t => t.title.substring(0, 30))
    .slice(0, 3)

  // Build features from high-priority active tickets
  const features = atRiskFeatures.map((name, i) => ({
    name,
    status: i === 0 ? 'At Risk' : 'In Progress',
    total_points: [16, 12, 8][i % 3],
    completed_points: [0, 3, 2][i % 3],
  }))

  const sprintData = {
    sprint_name: 'Current Sprint',
    planned_story_points: totalPoints,
    completed_story_points: completedPoints,
    in_progress_story_points: tickets.filter(t => t.status === 'In Progress').reduce((s, t) => s + (t.story_points || 0), 0),
    days_elapsed: daysElapsed,
    days_remaining: daysRemaining,
    total_days: sprintDays,
    end_date: formatDate(deadline),
    original_deadline: formatDate(deadline),
    features,
    velocity_history: [
      { sprint: 'Sprint -2', planned: totalPoints, completed: Math.round(totalPoints * 0.75) },
      { sprint: 'Sprint -1', planned: totalPoints, completed: Math.round(totalPoints * 0.65) },
      { sprint: 'Current Sprint', planned: totalPoints, completed: completedPoints },
    ],
    team_sizes: Object.fromEntries(teamNames.map(t => [t, (teamMembers[t] || []).length])),
  }

  // Sentiment per team
  const teamSentiments = teamNames.map(team => {
    const baseSentiment = completionRatio < 0.4 ? 35 + Math.random() * 25
      : completionRatio < 0.7 ? 50 + Math.random() * 25
      : 70 + Math.random() * 25
    const teamBlockers = tickets.filter(t => t.team === team && t.status === 'In Progress' &&
      (new Date(today) - new Date(t.last_updated)) / 86400000 > 4).length
    const score = Math.round(Math.max(15, Math.min(100, baseSentiment - teamBlockers * 12)))
    return {
      team_name: team,
      sentiment_score: score,
      alert_level: score < 50 ? 'HIGH' : score < 70 ? 'MEDIUM' : 'LOW',
    }
  })

  const avgSentiment = Math.round(teamSentiments.reduce((s, t) => s + t.sentiment_score, 0) / teamSentiments.length)
  const weeklyHistory = [
    Math.min(100, avgSentiment + 15),
    Math.min(100, avgSentiment + 10),
    Math.min(100, avgSentiment + 5),
    avgSentiment + 2,
    avgSentiment,
  ]
  const trendChange = weeklyHistory[4] - weeklyHistory[3]

  // Org health score: weighted from blockers, sentiment, velocity
  const blockerPenalty = numBlockers * 12
  const velocityPenalty = Math.max(0, (requiredVelocity - actualVelocity) / requiredVelocity * 30)
  const sentimentPenalty = Math.max(0, (70 - avgSentiment) * 0.5)
  const healthScore = Math.round(Math.max(5, Math.min(95, 85 - blockerPenalty - velocityPenalty - sentimentPenalty)))

  return {
    company: companyName,
    project: projectName,
    userName,
    userRole,
    industry,
    companySize,
    teamNames,
    jira_tickets: tickets,
    slack_messages: slackMessages,
    sprint_data: sprintData,
    // Pre-computed for quick dashboard rendering
    _computed: {
      healthScore,
      missProb: Math.min(99, Math.max(1, missProb)),
      actualVelocity,
      requiredVelocity,
      completedPoints,
      totalPoints,
      completionPct,
      delayDays,
      daysRemaining,
      originalDeadline: formatDate(deadline),
      predictedCompletion: formatDate(predictedDate),
      atRiskFeatures,
      teamSentiments,
      weeklyHistory,
      trendChange,
      avgSentiment,
      numBlockers,
    },
  }
}
