import { Star, ThumbsUp } from 'lucide-react'
import { useFeatures } from '../context/FeaturesContext'

const FeatureCard = ({ feature, className = '' }) => {
  const { setSelectedFeature, upvoteFeature } = useFeatures()

  const handleClick = () => {
    setSelectedFeature(feature)
  }

  const handleUpvote = (event) => {
    event.stopPropagation()
    upvoteFeature(feature.id)
  }

  const averageRating = Number.isFinite(feature.rating) ? feature.rating : Number(feature.rating || 0)
  const ratingCount = Number.isFinite(feature.ratingCount) ? feature.ratingCount : Number(feature.ratingCount || 0)
  const formattedRating = averageRating > 0 ? averageRating.toFixed(1) : '0.0'

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
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl group-hover:scale-110 transition-transform duration-200">
          {feature.icon}
        </div>
        <div className="flex items-center space-x-2">
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium border
            ${getStatusColor(feature.status)}
          `}>
            {feature.status}
          </span>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary-surfaceElevated border border-primary-backgroundSecondary text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs font-semibold text-text-primary">{formattedRating}</span>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-text-accent transition-colors duration-200">
        {feature.title}
      </h3>

      <p className="text-text-secondary text-sm mb-3 font-medium">
        {feature.date}
      </p>

      <p className="text-text-muted text-sm leading-relaxed line-clamp-3">
        {feature.description}
      </p>

      {Array.isArray(feature.tags) && feature.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {feature.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-primary-surfaceElevated border border-primary-backgroundSecondary text-text-secondary"
            >
              #{tag}
            </span>
          ))}
          {feature.tags.length > 3 && (
            <span className="text-xs text-text-muted">+{feature.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-xs text-text-muted">
        <button
          type="button"
          onClick={handleUpvote}
          className="inline-flex items-center space-x-1 px-2 py-1 rounded-full border border-primary-backgroundSecondary hover:border-text-accent/50 hover:text-text-accent transition-colors"
        >
          <ThumbsUp className="w-3 h-3" />
          <span>{feature.upvotes || 0}</span>
        </button>
        <span>{feature.comments || 0} comments</span>
        <span>Rating {formattedRating} ({ratingCount || 0})</span>
      </div>

      <div className="mt-4 text-text-accent text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        Tap to open details →
      </div>
    </div>
  )
}

export default FeatureCard
