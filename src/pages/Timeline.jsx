import { useFeatures } from '../context/FeaturesContext'
import FeatureDetailsPanel from '../components/FeatureDetailsPanel'
import MonthFilter from '../components/MonthFilter'

const Timeline = () => {
  const { setSelectedFeature, loading, getFilteredAndSortedFeatures } = useFeatures()

  // Get the filtered and sorted features for display
  const sortedFeatures = getFilteredAndSortedFeatures()

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Released':
      case 'General availability':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Beta':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Preview':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Coming Soon':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading timeline...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-timeline-gradientStart to-timeline-gradientEnd bg-clip-text text-transparent mb-4">
            Copilot Evolution
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Track the evolution of Microsoft Copilot features across time.
          </p>
        </div>

        {/* Month Filter */}
        <div className="flex justify-center mb-8">
          <MonthFilter />
        </div>

        {/* Timeline Container */}
        <div className="relative">
          <div className="timeline-scroll pb-6">
            <div className="flex space-x-8 min-w-max px-4">
              {sortedFeatures.map((feature, index) => (
                <div key={feature.id} className="flex flex-col items-center min-w-[280px]">
                  {/* Timeline Line */}
                  <div className="relative">
                    {/* Connecting Line */}
                    {index > 0 && (
                      <div className="absolute top-6 right-full w-8 h-0.5 bg-gradient-to-r from-timeline-gradientStart to-timeline-gradientEnd"></div>
                    )}

                    {/* Timeline Dot */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-timeline-gradientStart to-timeline-gradientEnd flex items-center justify-center shadow-lg">
                      <div className="text-2xl">{feature.icon}</div>
                    </div>
                  </div>

                  {/* Feature Card */}
                  <div
                    onClick={() => handleFeatureClick(feature)}
                    className="mt-6 bg-primary-surface rounded-2xl p-6 cursor-pointer hover:bg-primary-surfaceElevated transition-all duration-300 border border-primary-surfaceElevated hover:border-text-accent/30 shadow-lg hover:shadow-xl hover:shadow-text-accent/10 group w-full"
                  >
                    {/* Date */}
                    <div className="text-text-accent font-semibold text-sm mb-3 text-center">
                      {feature.date}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-text-primary mb-3 text-center group-hover:text-text-accent transition-colors duration-200">
                      {feature.title}
                    </h3>

                    {/* Status Badge */}
                    <div className="flex justify-center mb-4">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium border
                        ${getStatusColor(feature.status)}
                      `}>
                        {feature.status}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-text-muted text-sm leading-relaxed text-center line-clamp-3">
                      {feature.description}
                    </p>

                    {/* Hover Indicator */}
                    <div className="mt-4 text-text-accent text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center">
                      Click to view details →
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollbar indicator */}
          <div className="text-center text-text-muted text-sm mt-4">
            ← Scroll horizontally to view all features →
          </div>
        </div>

        {/* Feature Details Panel */}
        <FeatureDetailsPanel />
      </div>
    </div>
  )
}

export default Timeline