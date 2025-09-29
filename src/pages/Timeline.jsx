import React, { useState } from 'react'
import { useFeatures } from '../context/FeaturesContext'
import FeatureDetailsPanel from '../components/FeatureDetailsPanel'
import FiltersPanel from '../components/FiltersPanel'

const Timeline = () => {
  const { setSelectedFeature, loading, getFilteredAndSortedFeatures, upvoteFeature } = useFeatures()
  const [showFilter, setShowFilter] = useState(false)

  const sortedFeatures = getFilteredAndSortedFeatures()

  const handleFeatureClick = (feature) => {
    setSelectedFeature(feature)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Released':
      case 'General availability':
        return 'bg-green-600 text-white'
      case 'Beta':
        return 'bg-blue-600 text-white'
      case 'Preview':
        return 'bg-yellow-600 text-white'
      case 'Coming Soon':
        return 'bg-purple-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''

    // Handle "August 7th" format and convert to "Aug 7, 2025"
    const monthMap = {
      'january': 'Jan', 'february': 'Feb', 'march': 'Mar', 'april': 'Apr',
      'may': 'May', 'june': 'Jun', 'july': 'Jul', 'august': 'Aug',
      'september': 'Sep', 'october': 'Oct', 'november': 'Nov', 'december': 'Dec'
    }

    const match = dateString.match(/^(\w+)\s+(\d+)/)
    if (match) {
      const [, monthName, day] = match
      const shortMonth = monthMap[monthName.toLowerCase()]
      if (shortMonth) {
        return `${shortMonth} ${day}, 2025`
      }
    }

    return dateString
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-background flex items-center justify-center">
        <div className="text-text-secondary">Loading timeline...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-background text-text-primary p-6">
      {/* Timeline Container - Smaller and Centered */}
      <div className="max-w-6xl mx-auto bg-primary-surface rounded-lg shadow-lg border border-primary-surfaceElevated">
        {/* Timeline Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-surfaceElevated">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-text-accent rounded flex items-center justify-center">
              <span className="text-white text-xs">📋</span>
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Feature Timeline</h2>
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center space-x-2 text-text-secondary border border-primary-surfaceElevated rounded px-3 py-1.5 hover:bg-primary-surfaceElevated transition-colors"
          >
            <span className="text-sm">⚙️</span>
            <span className="text-sm">Filter</span>
          </button>
        </div>

        {/* Filter Panel - Collapsible */}
        {showFilter && (
          <div className="px-6 py-4 border-b border-primary-surfaceElevated bg-primary-backgroundSecondary">
            <FiltersPanel />
          </div>
        )}

        {/* Timeline Content */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <div className="relative min-w-max">
              {/* Timeline Items */}
              <div className="flex items-start space-x-8 relative px-6">
                {/* Continuous Timeline Bar - positioned behind dots */}
                <div
                  className="absolute h-0.5 bg-gray-400"
                  style={{
                    top: '1.75rem', // Position at dot level (1.75rem from top of container)
                    left: '2.25rem', // Start after first dot center (1.5rem padding + 0.75rem dot center)
                    right: '2.25rem', // End before last dot center
                    zIndex: 1
                  }}
                ></div>

                {sortedFeatures.map((feature, index) => (
                  <div key={feature.id} className="flex flex-col items-center min-w-[280px] flex-shrink-0 relative">
                    {/* Date */}
                    <div className="text-center mb-2">
                      <div className="text-sm font-medium text-text-secondary">
                        {formatDate(feature.date)}
                      </div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm mb-4 relative z-10"></div>

                    {/* Feature Card */}
                    <div className="bg-primary-surfaceElevated rounded-lg border border-primary-backgroundSecondary overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full">
                      {/* Category Badge and Status */}
                      <div className="p-3 pb-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">{feature.icon}</span>
                              <span className="text-xs text-text-muted">{feature.category || 'Copilot'}</span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusColor(feature.status)}`}>
                              {feature.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Title and Description */}
                      <div className="px-3 pb-3">
                        <h3
                          onClick={() => handleFeatureClick(feature)}
                          className="font-semibold text-text-primary mb-2 text-sm leading-tight cursor-pointer hover:text-text-accent transition-colors"
                        >
                          {feature.title}
                        </h3>

                        <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                          {feature.tldr || feature.description}
                        </p>

                        {Array.isArray(feature.tags) && feature.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {feature.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 text-[10px] rounded-full bg-primary-backgroundSecondary text-text-secondary border border-primary-surfaceElevated"
                              >
                                #{tag}
                              </span>
                            ))}
                            {feature.tags.length > 3 && (
                              <span className="text-[10px] text-text-muted">+{feature.tags.length - 3}</span>
                            )}
                          </div>
                        )}

                        {/* Engagement Stats */}
                        <div className="flex items-center justify-between text-xs text-text-muted">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                upvoteFeature(feature.id)
                              }}
                              className="flex items-center space-x-1 hover:text-text-accent transition-colors"
                            >
                              <span>{feature.upvotes || 0} upvotes</span>
                            </button>
                            <span>{feature.comments || 0} comments</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>⭐</span>
                            <span className="font-medium">{feature.rating || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="text-center text-text-muted text-sm mt-6">
            ← Scroll to see all features →
          </div>
        </div>
      </div>

      {/* Feature Details Panel */}
      <FeatureDetailsPanel />
    </div>
  )
}

export default Timeline

