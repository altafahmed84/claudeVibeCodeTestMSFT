import { useFeatures } from '../context/FeaturesContext'
import FeatureCard from '../components/FeatureCard'
import FeatureDetailsPanel from '../components/FeatureDetailsPanel'
import FiltersPanel from '../components/FiltersPanel'

const FeaturesGrid = () => {
  const { loading, getFilteredAndSortedFeatures } = useFeatures()

  const sortedFeatures = getFilteredAndSortedFeatures()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading features...</div>
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
            Explore the latest features and capabilities of Microsoft Copilot across different platforms and applications.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10">
          <div className="bg-primary-surface rounded-2xl border border-primary-surfaceElevated p-6">
            <FiltersPanel />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFeatures.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
            />
          ))}
        </div>

        {/* Feature Details Panel */}
        <FeatureDetailsPanel />
      </div>
    </div>
  )
}

export default FeaturesGrid
