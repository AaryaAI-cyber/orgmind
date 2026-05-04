/**
 * Deadline Prediction Card
 * Shows deadline miss probability, predicted vs original dates,
 * delay prediction, and at-risk features.
 */
export default function DeadlineCard({ velocityData }) {
  if (!velocityData) return null

  const missProb = velocityData.deadline_miss_probability || 0

  const getProbColor = (p) => {
    if (p > 60) return 'text-red-400'
    if (p > 30) return 'text-amber-400'
    return 'text-green-400'
  }

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Deadline Prediction
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {velocityData.sprint_name} velocity analysis
          </p>
        </div>
      </div>

      {/* Big probability */}
      <div className="text-center mb-6">
        <div className={`text-5xl font-extrabold ${getProbColor(missProb)}`}>
          {missProb}%
        </div>
        <p className="text-sm text-gray-400 mt-1">chance of missing deadline</p>
      </div>

      {/* Date comparison */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-navy-900/60 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Original Deadline</p>
          <p className="text-sm font-semibold text-gray-300">{velocityData.original_deadline}</p>
        </div>
        <div className="bg-navy-900/60 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Predicted Completion</p>
          <p className={`text-sm font-semibold ${
            velocityData.predicted_delay_days > 0 ? 'text-red-400' : 'text-green-400'
          }`}>
            {velocityData.predicted_completion_date}
          </p>
        </div>
      </div>

      {/* Delay badge */}
      {velocityData.predicted_delay_days > 0 && (
        <div className="flex justify-center mb-4">
          <span className="px-4 py-1.5 rounded-full bg-red-900/30 text-red-400 text-sm font-bold border border-red-700/50">
            +{velocityData.predicted_delay_days} days delay predicted
          </span>
        </div>
      )}

      {/* Velocity stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-200">{velocityData.actual_velocity}</p>
          <p className="text-xs text-gray-500">Actual velocity</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-amber-400">{velocityData.required_velocity}</p>
          <p className="text-xs text-gray-500">Required velocity</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-200">
            {velocityData.completed_points}/{velocityData.planned_points}
          </p>
          <p className="text-xs text-gray-500">Points done</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Sprint Progress</span>
          <span>{velocityData.completion_percentage}%</span>
        </div>
        <div className="w-full bg-navy-900 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              (velocityData.completion_percentage || 0) < 40 ? 'bg-red-500' : 'bg-amd-purple'
            }`}
            style={{ width: `${velocityData.completion_percentage || 0}%` }}
          />
        </div>
      </div>

      {/* At-risk features */}
      {velocityData.at_risk_features?.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">At-Risk Features</p>
          <div className="flex flex-wrap gap-2">
            {velocityData.at_risk_features.map((feature) => (
              <span
                key={feature}
                className="px-2 py-1 bg-red-900/20 text-red-300 text-xs rounded border border-red-700/30"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
