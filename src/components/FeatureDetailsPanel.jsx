import { useEffect, useState } from 'react'
import { useFeatures } from '../context/FeaturesContext'
import { X, Edit3, ExternalLink } from 'lucide-react'
import AdminForm from './AdminForm'

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

const FeatureDetailsPanel = () => {
  const { features, selectedFeature, setSelectedFeature } = useFeatures()
  const [showEditor, setShowEditor] = useState(false)

  if (!selectedFeature) return null

  useEffect(() => {
    if (!selectedFeature) return
    const refreshed = features.find(feature => feature.id === selectedFeature.id)
    if (refreshed && refreshed !== selectedFeature) {
      setSelectedFeature(refreshed)
    }
  }, [features, selectedFeature, setSelectedFeature])

  const handleClose = () => {
    setShowEditor(false)
    setSelectedFeature(null)
  }

  const handleEditorClose = () => {
    setShowEditor(false)
    const refreshed = features.find(feature => feature.id === selectedFeature.id)
    setSelectedFeature(refreshed || null)
  }

  return (
    <>
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] lg:w-[480px] bg-primary-surface border-l border-primary-surfaceElevated shadow-2xl z-40 overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary-surfaceElevated">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-background text-2xl">
              <span>{selectedFeature.icon}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{selectedFeature.title}</h2>
              <p className="text-sm text-text-secondary">{selectedFeature.category || 'Copilot'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowEditor(true)}
              className="p-2 hover:bg-primary-surfaceElevated rounded-lg transition-colors duration-200"
              aria-label="Edit feature"
            >
              <Edit3 className="w-5 h-5 text-text-secondary hover:text-text-accent" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-primary-surfaceElevated rounded-lg transition-colors duration-200"
              aria-label="Close details"
            >
              <X className="w-6 h-6 text-text-secondary hover:text-text-primary" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-8">
          {selectedFeature.tldr && (
            <div className="bg-primary-backgroundSecondary border border-primary-surfaceElevated rounded-xl p-4">
              <p className="text-sm text-text-primary">{selectedFeature.tldr}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedFeature.status)}`}>
              {selectedFeature.status}
            </span>
            {selectedFeature.date && (
              <span className="text-sm text-text-secondary">{selectedFeature.date}</span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Overview</h3>
              <p className="mt-2 text-text-muted leading-relaxed">{selectedFeature.description}</p>
            </div>
            {selectedFeature.category && (
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <span className="font-medium text-text-primary">Category:</span>
                <span>{selectedFeature.category}</span>
              </div>
            )}
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <span>{selectedFeature.upvotes || 0} upvotes</span>
              <span>{selectedFeature.comments || 0} comments</span>
              <span>Rating {selectedFeature.rating || 0}</span>
            </div>
          </div>

          {Array.isArray(selectedFeature.tags) && selectedFeature.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedFeature.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-primary-background text-text-secondary border border-primary-surfaceElevated"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(selectedFeature.links) && selectedFeature.links.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3">Related Links</h3>
              <div className="space-y-2">
                {selectedFeature.links.map((link, index) => (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-primary-surfaceElevated/40 border border-primary-surfaceElevated rounded-lg px-4 py-3 hover:border-text-accent hover:text-text-accent transition-colors"
                  >
                    <div className="min-w-0 pr-4">
                      <div className="text-sm font-medium text-text-primary">{link.title || 'View resource'}</div>
                      <div className="text-xs text-text-muted truncate">{link.url}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-text-muted flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditor && (
        <AdminForm
          feature={selectedFeature}
          mode="edit"
          onClose={handleEditorClose}
        />
      )}
    </>
  )
}

export default FeatureDetailsPanel
