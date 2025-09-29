import React, { useState } from 'react'
import { useFeatures } from '../context/FeaturesContext'

const AdminForm = ({ feature = null, onClose, mode = 'create' }) => {
  const { addFeature, updateFeature, deleteFeature, loading } = useFeatures()

  const [formData, setFormData] = useState({
    title: feature?.title || '',
    tldr: feature?.tldr || '',
    description: feature?.description || '',
    category: feature?.category || 'Copilot',
    status: feature?.status || 'Coming Soon',
    date: feature?.date || '',
    icon: feature?.icon || '🚀',
    tags: feature?.tags || [],
    links: feature?.links || [],
    image: feature?.image || null
  })

  const [errors, setErrors] = useState({})
  const [newTag, setNewTag] = useState('')
  const [newLink, setNewLink] = useState({ title: '', url: '' })
  const [imagePreview, setImagePreview] = useState(feature?.image || null)

  const categories = ['Copilot', 'AI Agents', 'Teams', 'Analytics']
  const statuses = ['Released', 'Coming Soon', 'In Development', 'Beta', 'Preview', 'General availability']
  const icons = ['🚀', '🧠', '📊', '💬', '👥', '🎯', '⚡', '🔧', '📈', '🎨', '🔍', '📱', '💡', '🌟']

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Feature name is required'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Feature name must be 100 characters or less'
    }

    if (!formData.tldr.trim()) {
      newErrors.tldr = 'TL;DR summary is required'
    } else if (formData.tldr.length > 200) {
      newErrors.tldr = 'TL;DR summary must be 200 characters or less'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Detailed description is required'
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Release date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const featureData = {
        ...formData,
        upvotes: feature?.upvotes || 0,
        comments: feature?.comments || 0,
        rating: feature?.rating || 0
      }

      if (mode === 'create') {
        await addFeature(featureData)
      } else if (mode === 'edit') {
        await updateFeature(feature.id, featureData)
      }

      onClose()
    } catch (error) {
      console.error('Error saving feature:', error)
      setErrors({ submit: 'Failed to save feature. Please try again.' })
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this feature? This action cannot be undone.')) {
      try {
        await deleteFeature(feature.id)
        onClose()
      } catch (error) {
        console.error('Error deleting feature:', error)
        setErrors({ submit: 'Failed to delete feature. Please try again.' })
      }
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addLink = () => {
    if (newLink.title.trim() && newLink.url.trim()) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, { ...newLink }]
      }))
      setNewLink({ title: '', url: '' })
    }
  }

  const removeLink = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        setImagePreview(imageUrl)
        setFormData(prev => ({ ...prev, image: imageUrl }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary-surface rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-primary-surface border-b border-primary-surfaceElevated p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              {mode === 'create' ? 'Add New Feature' : 'Edit Feature'}
            </h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-500/20 border border-red-500/50 rounded p-3 text-red-400 text-sm">
              {errors.submit}
            </div>
          )}

          {/* Feature Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Feature Name *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 bg-primary-surfaceElevated border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-text-accent ${
                errors.title ? 'border-red-500' : 'border-primary-backgroundSecondary'
              }`}
              placeholder="Enter feature name (max 100 characters)"
              maxLength={100}
            />
            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
            <p className="mt-1 text-xs text-text-muted">{formData.title.length}/100 characters</p>
          </div>

          {/* TL;DR Summary */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              TL;DR Summary *
            </label>
            <textarea
              value={formData.tldr}
              onChange={(e) => handleInputChange('tldr', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 bg-primary-surfaceElevated border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-text-accent resize-none ${
                errors.tldr ? 'border-red-500' : 'border-primary-backgroundSecondary'
              }`}
              placeholder="Brief summary for quick overview (max 200 characters)"
              maxLength={200}
            />
            {errors.tldr && <p className="mt-1 text-sm text-red-400">{errors.tldr}</p>}
            <p className="mt-1 text-xs text-text-muted">{formData.tldr.length}/200 characters</p>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Detailed Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              className={`w-full px-3 py-2 bg-primary-surfaceElevated border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-text-accent resize-none ${
                errors.description ? 'border-red-500' : 'border-primary-backgroundSecondary'
              }`}
              placeholder="Comprehensive feature description with sales notes"
            />
            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
          </div>

          {/* Category and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 bg-primary-surfaceElevated border border-primary-backgroundSecondary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-text-accent"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-primary-surface text-text-primary">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-primary-surfaceElevated border border-primary-backgroundSecondary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-text-accent"
              >
                {statuses.map(status => (
                  <option key={status} value={status} className="bg-primary-surface text-text-primary">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Release Date and Icon Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Release Date *
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-3 py-2 bg-primary-surfaceElevated border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-text-accent ${
                  errors.date ? 'border-red-500' : 'border-primary-backgroundSecondary'
                }`}
                placeholder="e.g., August 7th, September 1st"
              />
              {errors.date && <p className="mt-1 text-sm text-red-400">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                className="w-full px-3 py-2 bg-primary-surfaceElevated border border-primary-backgroundSecondary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-text-accent"
              >
                {icons.map(icon => (
                  <option key={icon} value={icon} className="bg-primary-surface text-text-primary">
                    {icon} {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Feature Image (Optional)
            </label>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 bg-primary-surfaceElevated border border-primary-backgroundSecondary rounded-lg text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-text-accent file:text-white hover:file:bg-text-accent/80"
                />
              </div>
              {imagePreview && (
                <div className="w-20 h-20 bg-primary-surfaceElevated rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tags (Optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-text-accent/20 text-text-accent px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-text-accent hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 bg-primary-surfaceElevated border border-primary-backgroundSecondary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-text-accent"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-text-accent text-white rounded-lg hover:bg-text-accent/80 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Related Links */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Related Links (Optional)
            </label>
            <div className="space-y-2 mb-3">
              {formData.links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-primary-surfaceElevated p-3 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-text-primary">{link.title}</div>
                    <div className="text-sm text-text-secondary">{link.url}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                value={newLink.title}
                onChange={(e) => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                className="px-3 py-2 bg-primary-surfaceElevated border border-primary-backgroundSecondary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-text-accent"
                placeholder="Link title"
              />
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                className="px-3 py-2 bg-primary-surfaceElevated border border-primary-backgroundSecondary rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-text-accent"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={addLink}
                className="px-4 py-2 bg-text-accent text-white rounded-lg hover:bg-text-accent/80 transition-colors"
              >
                Add Link
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-primary-surfaceElevated">
            <div>
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Feature
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-primary-backgroundSecondary text-text-secondary rounded-lg hover:bg-primary-surfaceElevated transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-text-accent text-white rounded-lg hover:bg-text-accent/80 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : (mode === 'create' ? 'Create Feature' : 'Update Feature')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminForm