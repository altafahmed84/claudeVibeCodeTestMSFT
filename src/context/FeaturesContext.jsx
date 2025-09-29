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

// Initial hardcoded features from Figma
const initialFeatures = [
  {
    id: uuidv4(),
    title: "GPT-5",
    date: "August 7th",
    icon: "🌀",
    status: "General availability",
    description: "Advanced language model capabilities with enhanced reasoning and improved safety features"
  },
  {
    id: uuidv4(),
    title: "Copilot function =Copilot()",
    date: "August 18th",
    icon: "📊",
    status: "Released",
    description: "Excel integration for AI-powered functions and data analysis"
  },
  {
    id: uuidv4(),
    title: "Human-agent collab in Teams",
    date: "September 18th",
    icon: "👥",
    status: "Released",
    description: "Collaborative AI agent features in Microsoft Teams for enhanced productivity"
  },
  {
    id: uuidv4(),
    title: "Copilot Studio Value in M365 Copilot",
    date: "September 1st",
    icon: "🏗️",
    status: "Released",
    description: "Enhanced value delivery through Copilot Studio integration with Microsoft 365"
  },
  {
    id: uuidv4(),
    title: "Copilot Chat in M365 Apps",
    date: "September 15th",
    icon: "💬",
    status: "Released",
    description: "Integrated chat across Word, Excel, PowerPoint, Outlook, and OneNote"
  },
  {
    id: uuidv4(),
    title: "Role-based AI Solutions in M365 Copilot",
    date: "October 10th",
    icon: "🎯",
    status: "Released",
    description: "Specialized AI solutions tailored for different organizational roles and workflows"
  }
]

export const FeaturesProvider = ({ children }) => {
  const [features, setFeatures] = useState([])
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('all')

  // Load features from database on app start
  useEffect(() => {
    loadFeaturesFromDatabase()
  }, [])

  // Helper function to parse date string to Date object for sorting
  const parseFeatureDate = (dateString) => {
    // Handle different date formats
    if (!dateString) return new Date(0) // Default to earliest date if no date

    // Try to parse "Month Day" format (e.g., "August 7th", "September 15th")
    const monthDayMatch = dateString.match(/^(\w+)\s+(\d+)/)
    if (monthDayMatch) {
      const [, monthName, day] = monthDayMatch
      const currentYear = new Date().getFullYear()
      const monthMap = {
        'january': 0, 'february': 1, 'march': 2, 'april': 3,
        'may': 4, 'june': 5, 'july': 6, 'august': 7,
        'september': 8, 'october': 9, 'november': 10, 'december': 11
      }
      const monthIndex = monthMap[monthName.toLowerCase()]
      if (monthIndex !== undefined) {
        return new Date(currentYear, monthIndex, parseInt(day))
      }
    }

    // Fallback to Date parsing
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
    const filtered = filterFeaturesByMonth(features)
    return sortFeaturesByDate(filtered)
  }

  const loadFeaturesFromDatabase = async () => {
    console.log('Loading features from database...')
    setLoading(true)
    try {
      const response = await fetch('/api/features')
      if (response.ok) {
        const dbFeatures = await response.json()
        console.log('Database features loaded:', dbFeatures.length, 'features')
        setFeatures(dbFeatures)
      } else {
        console.error('Failed to load features from database:', response.status)
        // Fallback to hardcoded features if database fails
        setFeatures(initialFeatures)
      }
    } catch (error) {
      console.error('Error loading features from database:', error)
      // Fallback to hardcoded features if database fails
      setFeatures(initialFeatures)
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
        setFeatures(prev => [feature, ...prev])
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
      const response = await fetch(`/api/features/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        const updatedFeature = await response.json()
        setFeatures(prev => prev.map(f => f.id === id ? updatedFeature : f))
        return updatedFeature
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

  const value = {
    features,
    selectedFeature,
    setSelectedFeature,
    loading,
    selectedMonth,
    setSelectedMonth,
    addFeature,
    updateFeature,
    deleteFeature,
    refreshFeatures: loadFeaturesFromDatabase,
    getFilteredAndSortedFeatures,
    getAvailableMonths
  }

  return (
    <FeaturesContext.Provider value={value}>
      {children}
    </FeaturesContext.Provider>
  )
}