import { useFeatures } from '../context/FeaturesContext'

const FeatureCard = ({ feature, className = '' }) => {
  const { setSelectedFeature } = useFeatures()

  const handleClick = () => {
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

  return (
    <div
      onClick={handleClick}
      className={`
        bg-primary-surface rounded-2xl p-6 cursor-pointer
        hover:bg-primary-surfaceElevated transition-all duration-300
        border border-primary-surfaceElevated hover:border-text-accent/30
        shadow-lg hover:shadow-xl hover:shadow-text-accent/10
        group
        ${className}
      `}
    >
      {/* Feature Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
          {feature.icon}
        </div>

        {/* Status Badge */}
        <span className={`
          px-3 py-1 rounded-full text-xs font-medium border
          ${getStatusColor(feature.status)}
        `}>
          {feature.status}
        </span>
      </div>

      {/* Feature Title */}
      <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-text-accent transition-colors duration-200">
        {feature.title}
      </h3>

      {/* Feature Date */}
      <p className="text-text-secondary text-sm mb-3 font-medium">
        {feature.date}
      </p>

      {/* Feature Description */}
      <p className="text-text-muted text-sm leading-relaxed line-clamp-3">
        {feature.description}
      </p>

      {/* Hover Indicator */}
      <div className="mt-4 text-text-accent text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Click to view details →
      </div>
    </div>
  )
}

export default FeatureCard