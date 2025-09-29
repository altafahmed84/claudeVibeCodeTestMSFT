import React, { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const FeaturesContext = createContext()

export const useFeatures = () => {
  const context = useContext(FeaturesContext)
  if (!context) {
    throw new Error('useFeatures must be used within a FeaturesProvider')
  }
  return context
}

// Initial hardcoded features with enhanced engagement data
const initialFeatures = [
  {
    id: uuidv4(),
    title: 'GPT-5',
    date: 'August 7th',
    icon: '🧠',
    status: 'General availability',
    description: 'Advanced language model capabilities with enhanced reasoning and improved safety features',
    tldr: 'Next-gen AI model with enhanced reasoning and safety',
    category: 'AI Models',
    tags: ['GPT', 'AI Model', 'General AI'],
    upvotes: 856,
    comments: 142,
    rating: 4.8,
    ratingCount: 200,
    ratingTotal: 960,
    image: null,
    links: [],
    isStarred: false
  },
  {
    id: uuidv4(),
    title: 'Copilot function =Copilot()',
    date: 'August 18th',
    icon: '📊',
    status: 'Released',
    description: 'Excel integration for AI-powered functions and data analysis',
    tldr: 'AI-powered Excel functions for data analysis',
    category: 'Copilot',
    tags: ['Excel', 'Functions', 'Data Analysis'],
    upvotes: 324,
    comments: 45,
    rating: 4.6,
    ratingCount: 120,
    ratingTotal: 552,
    image: null,
    links: [],
    isStarred: false
  },
  {
    id: uuidv4(),
    title: 'Copilot Studio Value in M365 Copilot',
    date: 'September 1st',
    icon: '🛠️',
    status: 'Released',
    description: 'Enhanced value delivery through Copilot Studio integration with Microsoft 365',
    tldr: 'Build custom AI agents with no-code Copilot Studio',
    category: 'Copilot',
    tags: ['Copilot Studio', 'No-Code', 'M365'],
    upvotes: 267,
    comments: 38,
    rating: 4.4,
    ratingCount: 95,
    ratingTotal: 418,
    image: null,
    links: [],
    isStarred: false
  },
  {
    id: uuidv4(),
    title: 'Copilot Chat in Microsoft 365 Apps',
    date: 'September 15th',
    icon: '💬',
    status: 'Released',
    description: 'AI-powered chat assistant directly integrated into Word, Excel, PowerPoint, and Outlook for seamless productivity enhancement',
    tldr: 'AI chat across all M365 apps for productivity',
    category: 'Copilot',
    tags: ['AI Assistant', 'Productivity', 'M365'],
    upvotes: 247,
    comments: 23,
    rating: 4.7,
    ratingCount: 150,
    ratingTotal: 705,
    image: null,
    links: [],
    isStarred: false
  },
  {
    id: uuidv4(),
    title: 'Human-agent collab in Teams',
    date: 'September 18th',
    icon: '🤝',
    status: 'Released',
    description: 'Collaborative AI agent features in Microsoft Teams for enhanced productivity',
    tldr: 'AI agents working alongside humans in Teams',
    category: 'Teams',
    tags: ['Teams', 'Collaboration', 'AI Agents'],
    upvotes: 189,
    comments: 31,
    rating: 4.3,
    ratingCount: 90,
    ratingTotal: 387,
    image: null,
    links: [],
    isStarred: false
  },
  {
    id: uuidv4(),
    title: 'Role-based AI Solutions in M365 Copilot',
    date: 'October 10th',
    icon: '🧑‍💼',
    status: 'Released',
    description: 'Specialized AI solutions tailored for different organizational roles and workflows',
    tldr: 'Customized AI solutions for specific job roles',
    category: 'Copilot',
    tags: ['Role-based', 'Customization', 'Enterprise'],
    upvotes: 134,
    comments: 19,
    rating: 4.5,
    ratingCount: 110,
    ratingTotal: 495,
    image: null,
    links: [],
    isStarred: false
  }
]



const parseJsonArray = (value, fallback = []) => {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : fallback
    } catch (error) {
      return fallback
    }
  }

  return fallback
}

const clampRating = (value) => {
  if (!Number.isFinite(value)) return 0
  if (value < 0) return 0
  if (value > 5) return 5
  return value
}

const normalizeFeature = (feature) => {
  if (!feature) return null

  const parsedTags = parseJsonArray(feature.tags)
  const parsedLinks = parseJsonArray(feature.links)

  const rawRatingCount = feature.ratingCount ?? feature.rating_count
  const rawRatingTotal = feature.ratingTotal ?? feature.rating_total
  let ratingCount = Number.isFinite(rawRatingCount) ? rawRatingCount : Number(rawRatingCount || 0)
  let ratingTotal = Number.isFinite(rawRatingTotal) ? rawRatingTotal : Number(rawRatingTotal || 0)

  let ratingValue = Number.isFinite(feature.rating) ? feature.rating : Number(feature.rating || 0)
  ratingValue = clampRating(ratingValue)

  if (!Number.isFinite(ratingCount) || ratingCount < 0) {
    ratingCount = 0
  }
  if (!Number.isFinite(ratingTotal)) {
    ratingTotal = 0
  }

  if (ratingCount > 0) {
    if (ratingTotal <= 0) {
      ratingTotal = ratingValue * ratingCount
    } else {
      ratingValue = ratingTotal / ratingCount
    }
  } else if (ratingValue > 0) {
    ratingCount = 1
    if (ratingTotal <= 0) {
      ratingTotal = ratingValue
    }
  }

  ratingValue = clampRating(ratingValue)
  ratingTotal = Math.max(0, ratingTotal)

  return {
    ...feature,
    tags: parsedTags,
    links: parsedLinks,
    upvotes: Number.isFinite(feature.upvotes) ? feature.upvotes : Number(feature.upvotes || 0),
    comments: Number.isFinite(feature.comments) ? feature.comments : Number(feature.comments || 0),
    rating: ratingValue,
    ratingCount,
    ratingTotal,
    isStarred: Boolean(feature.isStarred ?? feature.is_starred)
  }
}

export const FeaturesProvider = ({ children }) => {
  const [features, setFeatures] = useState([])
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  const getStoredUserRating = (featureId) => {
    if (typeof window === 'undefined') return 0
    try {
      const raw = window.localStorage.getItem(`feature-rating-${featureId}`)
      const parsed = Number(raw)
      return Number.isFinite(parsed) ? parsed : 0
    } catch (error) {
      console.warn('Failed to read stored rating', error)
      return 0
    }
  }

  const persistUserRating = (featureId, ratingValue) => {
    if (typeof window === 'undefined') return
    try {
      if (!Number.isFinite(ratingValue) || ratingValue <= 0) {
        window.localStorage.removeItem(`feature-rating-${featureId}`)
      } else {
        window.localStorage.setItem(`feature-rating-${featureId}`, String(ratingValue))
      }
    } catch (error) {
      console.warn('Failed to persist rating', error)
    }
  }

  const attachUserRating = (feature, previousFeature = null) => {
    if (!feature) return feature
    const fallback = previousFeature?.userRating ?? 0
    const stored = getStoredUserRating(feature.id)
    const userRating = fallback || stored
    return userRating
      ? { ...feature, userRating }
      : { ...feature, userRating: 0 }
  }

  // Load features from database on app start
  useEffect(() => {
    loadFeaturesFromDatabase()
  }, [])

  // Helper function to parse date string to Date object for sorting
  const parseFeatureDate = (dateString) => {
    if (!dateString) return new Date(0)

    const cleaned = dateString.replace(/(\d+)(st|nd|rd|th)/gi, '$1')
    const monthDayMatch = cleaned.match(/^(\w+)\s+(\d{1,2})(?:,\s*(\d{4}))?/)
    if (monthDayMatch) {
      const [, monthName, day, year] = monthDayMatch
      const monthMap = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3,
        'may': 4, 'june': 5, 'july': 6, 'august': 7,
        'september': 8, 'october': 9, 'november': 10, 'december': 11
      }
      const monthIndex = monthMap[monthName.toLowerCase()]
      if (monthIndex !== undefined) {
        const yearValue = year ? parseInt(year, 10) : new Date().getFullYear()
        return new Date(yearValue, monthIndex, parseInt(day, 10))
      }
    }

    const parsed = new Date(cleaned)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }

    return new Date(dateString)
  }

  // Helper function to get month name from date string
  const getMonthFromDate = (dateString) => {
    const monthMatch = dateString.match(/^(\w+)/)
    return monthMatch ? monthMatch[1].toLowerCase() : null
  }

  // Sort features by date (chronological order)
  const sortFeaturesByDate = (featuresArray) => {
    return [...featuresArray].sort((a, b) => {
      const dateA = parseFeatureDate(a.date)
      const dateB = parseFeatureDate(b.date)
      return dateA - dateB
    })
  }

  // Filter features by selected month
  const filterFeaturesByMonth = (featuresArray) => {
    if (selectedMonth === 'all') return featuresArray

    return featuresArray.filter(feature => {
      const featureMonth = getMonthFromDate(feature.date)
      return featureMonth === selectedMonth.toLowerCase()
    })
  }

  const normalizeFilterValue = (value) => {
    if (value === null || value === undefined) {
      return ''
    }
    return String(value).trim().toLowerCase()
  }

  const filterFeaturesByCategories = (featuresArray) => {
    if (!selectedCategories.length) return featuresArray

    return featuresArray.filter(feature => {
      if (!feature.category) return false
      const normalizedCategory = normalizeFilterValue(feature.category)
      return selectedCategories.some(category => normalizeFilterValue(category) === normalizedCategory)
    })
  }

  const filterFeaturesByTags = (featuresArray) => {
    if (!selectedTags.length) return featuresArray

    return featuresArray.filter(feature => {
      if (!Array.isArray(feature.tags) || feature.tags.length === 0) return false
      const featureTags = feature.tags.map(tag => normalizeFilterValue(tag))
      return selectedTags.every(tag => featureTags.includes(normalizeFilterValue(tag)))
    })
  }

  const filterFeaturesBySearch = (featuresArray) => {
    const term = normalizeFilterValue(searchTerm)
    if (!term) return featuresArray

    return featuresArray.filter(feature => {
      const searchableFields = [
        feature.title,
        feature.tldr,
        feature.description,
        feature.category,
        ...(Array.isArray(feature.tags) ? feature.tags : [])
      ]

      const haystack = searchableFields
        .filter(Boolean)
        .map(value => normalizeFilterValue(value))
        .join(' ')

      return haystack.includes(term)
    })
  }

  const getAvailableCategories = () => {
    const categories = new Set()
    features.forEach(feature => {
      if (feature.category) {
        categories.add(feature.category)
      }
    })
    return Array.from(categories).sort((a, b) => a.localeCompare(b))
  }

  const getAvailableTags = () => {
    const tags = new Set()
    features.forEach(feature => {
      if (Array.isArray(feature.tags)) {
        feature.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort((a, b) => a.localeCompare(b))
  }

  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      const normalizedCategory = normalizeFilterValue(category)
      const exists = prev.some(item => normalizeFilterValue(item) === normalizedCategory)
      if (exists) {
        return prev.filter(item => normalizeFilterValue(item) !== normalizedCategory)
      }
      return [...prev, category]
    })
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      const normalizedTag = normalizeFilterValue(tag)
      const exists = prev.some(item => normalizeFilterValue(item) === normalizedTag)
      if (exists) {
        return prev.filter(item => normalizeFilterValue(item) !== normalizedTag)
      }
      return [...prev, tag]
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategories([])
    setSelectedTags([])
  }

  // Get available months from features
  const getAvailableMonths = () => {
    const months = new Set()
    features.forEach(feature => {
      const month = getMonthFromDate(feature.date)
      if (month) months.add(month)
    })
    return Array.from(months).sort((a, b) => {
      const monthOrder = ['january', 'february', 'march', 'april', 'may', 'june',
                         'july', 'august', 'september', 'october', 'november', 'december']
      return monthOrder.indexOf(a) - monthOrder.indexOf(b)
    })
  }

  // Get filtered and sorted features
  const getFilteredAndSortedFeatures = () => {
    const filteredByMonth = filterFeaturesByMonth(features)
    const filteredByCategory = filterFeaturesByCategories(filteredByMonth)
    const filteredByTag = filterFeaturesByTags(filteredByCategory)
    const filteredBySearch = filterFeaturesBySearch(filteredByTag)
    return sortFeaturesByDate(filteredBySearch)
  }

  const loadFeaturesFromDatabase = async () => {
    console.log('Loading features from database...')
    setLoading(true)
    try {
      const response = await fetch('/api/features')
      if (response.ok) {
        const dbFeatures = await response.json()
        console.log('Database features loaded:', dbFeatures.length, 'features')
        setFeatures(dbFeatures.map(normalizeFeature).map(feature => attachUserRating(feature)))
      } else {
        console.error('Failed to load features from database:', response.status)
        // Fallback to hardcoded features if database fails
        setFeatures(initialFeatures.map(normalizeFeature).map(feature => attachUserRating(feature)))
      }
    } catch (error) {
      console.error('Error loading features from database:', error)
      // Fallback to hardcoded features if database fails
      setFeatures(initialFeatures.map(normalizeFeature).map(feature => attachUserRating(feature)))
    } finally {
      setLoading(false)
    }
  }

  const addFeature = async (newFeature) => {
    console.log('Adding feature:', newFeature)
    setLoading(true)
    try {
      const response = await fetch('/api/features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFeature)
      })

      if (response.ok) {
        const feature = await response.json()
        console.log('Successfully added feature to database:', feature)
        setFeatures(prev => [attachUserRating(normalizeFeature(feature)), ...prev])
        return feature
      } else {
        const errorText = await response.text()
        console.error('Failed to save feature to database:', response.status, errorText)
        throw new Error(`Failed to save feature: ${response.status}`)
      }
    } catch (error) {
      console.error('Error adding feature:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateFeature = async (id, updates) => {
    setLoading(true)
    try {
      const existingFeature = features.find(feature => feature.id === id) || {}
      const payload = { ...existingFeature, ...updates }
      const { id: _omit, created_at, updated_at, ...body } = payload

      const response = await fetch(`/api/features/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        const updatedFeature = await response.json()
        const normalizedFeature = normalizeFeature(updatedFeature)
        const previousFeature = features.find(feature => feature.id === id) || null
        const featureWithRating = attachUserRating({ ...normalizedFeature }, previousFeature)
        setFeatures(prev => prev.map(f => (f.id === id ? featureWithRating : f)))
        return featureWithRating
      } else {
        const errorText = await response.text()
        console.error('Failed to update feature in database:', response.status, errorText)
        throw new Error('Failed to update feature')
      }
    } catch (error) {
      console.error('Error updating feature:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteFeature = async (id) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/features/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFeatures(prev => prev.filter(f => f.id !== id))
        persistUserRating(id, 0)
        if (selectedFeature?.id === id) {
          setSelectedFeature(null)
        }
      } else {
        const errorText = await response.text()
        console.error('Failed to delete feature from database:', response.status, errorText)
        throw new Error('Failed to delete feature')
      }
    } catch (error) {
      console.error('Error deleting feature:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const upvoteFeature = async (id) => {
    let snapshot = null

    setFeatures(prev => prev.map(f => {
      if (f.id !== id) return f
      snapshot = { ...f }
      return { ...f, upvotes: (f.upvotes || 0) + 1 }
    }))

    try {
      const response = await fetch(`/api/features/${id}/upvote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const updatedFeature = normalizeFeature(await response.json())
        setFeatures(prev => prev.map(f =>
          f.id === id
            ? attachUserRating({ ...updatedFeature }, f)
            : f
        ))
      } else {
        throw new Error('Failed to upvote feature')
      }
    } catch (error) {
      console.error('Error upvoting feature:', error)
      setFeatures(prev => prev.map(f =>
        f.id === id
          ? snapshot ? { ...snapshot } : f
          : f
      ))
    }
  }

  const rateFeature = async (id, ratingValue) => {
    const normalizedRating = clampRating(Number(ratingValue))
    if (normalizedRating < 1 || normalizedRating > 5) {
      console.warn('Ignoring rating outside 1-5 range', ratingValue)
      return
    }

    const previousStoredRating = getStoredUserRating(id)
    let snapshot = null

    setFeatures(prev => prev.map(f => {
      if (f.id !== id) return f

      snapshot = { ...f }
      const baseCount = Number.isFinite(f.ratingCount) && f.ratingCount > 0 ? f.ratingCount : 0
      const baseTotal = Number.isFinite(f.ratingTotal) && f.ratingTotal > 0
        ? f.ratingTotal
        : (Number.isFinite(f.rating) ? f.rating * baseCount : 0)

      const adjustedTotal = previousStoredRating > 0
        ? Math.max(0, baseTotal - previousStoredRating + normalizedRating)
        : baseTotal + normalizedRating
      const adjustedCount = previousStoredRating > 0
        ? Math.max(baseCount, 1)
        : baseCount + 1
      const adjustedAverage = adjustedCount > 0 ? adjustedTotal / adjustedCount : normalizedRating

      return {
        ...f,
        rating: clampRating(adjustedAverage),
        ratingCount: adjustedCount,
        ratingTotal: adjustedTotal,
        userRating: normalizedRating
      }
    }))

    try {
      const response = await fetch(`/api/features/${id}/rating`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: normalizedRating, previousRating: previousStoredRating })
      })

      if (response.ok) {
        const updatedFeature = normalizeFeature(await response.json())
        persistUserRating(id, normalizedRating)
        setFeatures(prev => prev.map(f =>
          f.id === id
            ? attachUserRating({ ...updatedFeature }, { ...snapshot, userRating: normalizedRating })
            : f
        ))
      } else {
        throw new Error('Failed to submit rating')
      }
    } catch (error) {
      console.error('Error rating feature:', error)
      persistUserRating(id, previousStoredRating)
      setFeatures(prev => prev.map(f =>
        f.id === id
          ? snapshot ? { ...snapshot } : f
          : f
      ))
    }
  }



  const value = {
    features,
    selectedFeature,
    setSelectedFeature,
    loading,
    selectedMonth,
    setSelectedMonth,
    searchTerm,
    setSearchTerm,
    selectedCategories,
    toggleCategory,
    selectedTags,
    toggleTag,
    clearFilters,
    addFeature,
    updateFeature,
    deleteFeature,
    upvoteFeature,
    rateFeature,
    refreshFeatures: loadFeaturesFromDatabase,
    getFilteredAndSortedFeatures,
    getAvailableMonths,
    getAvailableCategories,
    getAvailableTags
  }

  return (
    <FeaturesContext.Provider value={value}>
      {children}
    </FeaturesContext.Provider>
  )
}
