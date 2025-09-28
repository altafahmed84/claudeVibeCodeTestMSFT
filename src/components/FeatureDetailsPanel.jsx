import { useState } from 'react'
import { useFeatures } from '../context/FeaturesContext'
import { X, Edit3, Save, Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const FeatureDetailsPanel = () => {
  const { selectedFeature, setSelectedFeature, updateFeature } = useFeatures()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [showIconDropdown, setShowIconDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [showYearDropdown, setShowYearDropdown] = useState(false)

  if (!selectedFeature) return null

  const iconOptions = ['🚀', '🌀', '📊', '👥', '🏗️', '💬', '🎯', '⚡', '🔧', '💡', '🎨', '📱']
  const statusOptions = [
    'Coming Soon',
    'Preview',
    'Beta',
    'Released',
    'General availability'
  ]

  const startEditing = () => {
    setEditData({
      title: selectedFeature.title,
      date: selectedFeature.date,
      icon: selectedFeature.icon,
      status: selectedFeature.status,
      description: selectedFeature.description
    })
    setIsEditing(true)
  }

  const saveChanges = async () => {
    try {
      await updateFeature(selectedFeature.id, editData)
      setIsEditing(false)
      // Close the feature panel after successful save
      setSelectedFeature(null)
    } catch (error) {
      console.error('Error updating feature:', error)
    }
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditData({})
    setShowIconDropdown(false)
    setShowStatusDropdown(false)
    setShowDatePicker(false)
    setShowYearDropdown(false)
  }

  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDateSelect = (date) => {
    const options = { month: 'long', day: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-US', options)
    handleEditChange('date', formattedDate)
    setShowDatePicker(false)
  }

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const generateYearOptions = () => {
    const currentYearValue = new Date().getFullYear()
    const years = []
    for (let year = currentYearValue - 5; year <= currentYearValue + 10; year++) {
      years.push(year)
    }
    return years
  }

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    const calendar = []

    for (let i = 0; i < firstDay; i++) {
      calendar.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(new Date(currentYear, currentMonth, day))
    }

    return calendar
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-primary-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary-surfaceElevated">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary-surfaceElevated">
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIconDropdown(!showIconDropdown)}
                  className="text-4xl hover:bg-primary-surfaceElevated p-2 rounded-lg transition-colors duration-200"
                >
                  {editData.icon}
                </button>
                {showIconDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-primary-surface border border-primary-surfaceElevated rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-6 gap-2 p-3">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => {
                            handleEditChange('icon', icon)
                            setShowIconDropdown(false)
                          }}
                          className="p-2 hover:bg-primary-surfaceElevated rounded-lg transition-colors duration-200 text-2xl"
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-4xl">{selectedFeature.icon}</div>
            )}
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                  className="text-2xl font-semibold bg-primary-background border border-primary-surfaceElevated rounded-lg px-3 py-1 text-text-primary focus:outline-none focus:border-text-accent"
                />
              ) : (
                <h2 className="text-2xl font-semibold text-text-primary">
                  {selectedFeature.title}
                </h2>
              )}
              {isEditing ? (
                <div className="relative mt-1">
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="flex items-center space-x-2 px-3 py-1 bg-primary-background border border-primary-surfaceElevated rounded text-text-secondary hover:border-text-accent focus:outline-none focus:border-text-accent transition-colors duration-200"
                  >
                    <Calendar className="w-4 h-4 text-text-accent" />
                    <span className={editData.date ? 'text-text-primary' : 'text-text-muted'}>
                      {editData.date || 'Select date...'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-text-secondary" />
                  </button>

                  {showDatePicker && (
                    <div className="absolute top-full left-0 mt-1 bg-primary-surface border border-primary-surfaceElevated rounded-lg shadow-lg z-20 p-4 min-w-[300px]">
                      {/* Month/Year Navigation */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() => navigateMonth('prev')}
                          className="p-2 hover:bg-primary-surfaceElevated rounded-lg transition-colors duration-200"
                        >
                          <ChevronLeft className="w-4 h-4 text-text-secondary hover:text-text-primary" />
                        </button>

                        <div className="flex items-center space-x-2">
                          <h4 className="text-text-primary font-medium">
                            {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long' })}
                          </h4>

                          {/* Year Dropdown */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowYearDropdown(!showYearDropdown)}
                              className="flex items-center space-x-1 px-2 py-1 hover:bg-primary-surfaceElevated rounded-lg transition-colors duration-200"
                            >
                              <span className="text-text-primary font-medium">{currentYear}</span>
                              <ChevronDown className="w-3 h-3 text-text-secondary" />
                            </button>

                            {showYearDropdown && (
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-primary-surface border border-primary-surfaceElevated rounded-lg shadow-lg z-30 max-h-40 overflow-y-auto">
                                {generateYearOptions().map((year) => (
                                  <button
                                    key={year}
                                    type="button"
                                    onClick={() => {
                                      setCurrentYear(year)
                                      setShowYearDropdown(false)
                                    }}
                                    className={`w-full px-4 py-2 text-left hover:bg-primary-surfaceElevated transition-colors duration-200 ${
                                      year === currentYear ? 'text-text-accent' : 'text-text-primary'
                                    }`}
                                  >
                                    {year}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigateMonth('next')}
                          className="p-2 hover:bg-primary-surfaceElevated rounded-lg transition-colors duration-200"
                        >
                          <ChevronRight className="w-4 h-4 text-text-secondary hover:text-text-primary" />
                        </button>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1 text-center text-sm">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="p-2 text-text-muted font-medium">
                            {day}
                          </div>
                        ))}

                        {generateCalendar().map((date, index) => (
                          <div key={index} className="p-1">
                            {date ? (
                              <button
                                type="button"
                                onClick={() => handleDateSelect(date)}
                                className="w-8 h-8 rounded-lg hover:bg-primary-surfaceElevated text-text-primary hover:text-text-accent transition-colors duration-200"
                              >
                                {date.getDate()}
                              </button>
                            ) : (
                              <div className="w-8 h-8"></div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Custom date input */}
                      <div className="mt-4 pt-3 border-t border-primary-surfaceElevated">
                        <input
                          type="text"
                          placeholder="Or type custom date (e.g., Q4 2024, Late 2024)"
                          className="w-full px-3 py-2 bg-primary-background border border-primary-surfaceElevated rounded-lg text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-text-accent transition-colors duration-200"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const customDate = e.target.value.trim()
                              if (customDate) {
                                handleEditChange('date', customDate)
                                setShowDatePicker(false)
                                e.target.value = ''
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-text-secondary">{selectedFeature.date}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={startEditing}
                className="p-2 hover:bg-primary-surfaceElevated rounded-lg transition-colors duration-200"
              >
                <Edit3 className="w-5 h-5 text-text-secondary hover:text-text-accent" />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={saveChanges}
                  className="p-2 hover:bg-primary-surfaceElevated rounded-lg transition-colors duration-200"
                >
                  <Save className="w-5 h-5 text-green-400 hover:text-green-300" />
                </button>
                <button
                  onClick={cancelEditing}
                  className="p-2 hover:bg-primary-surfaceElevated rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-red-400 hover:text-red-300" />
                </button>
              </div>
            )}
            <button
              onClick={() => setSelectedFeature(null)}
              className="p-2 hover:bg-primary-surfaceElevated rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-text-secondary hover:text-text-primary" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Badge */}
          <div className="mb-6">
            {isEditing ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium border cursor-pointer hover:opacity-80 transition-opacity duration-200 flex items-center space-x-2
                    ${getStatusColor(editData.status)}
                  `}
                >
                  <span>{editData.status}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-primary-surface border border-primary-surfaceElevated rounded-lg shadow-lg z-10">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          handleEditChange('status', status)
                          setShowStatusDropdown(false)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-primary-surfaceElevated transition-colors duration-200 text-text-primary first:rounded-t-lg last:rounded-b-lg"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span className={`
                px-4 py-2 rounded-full text-sm font-medium border
                ${getStatusColor(selectedFeature.status)}
              `}>
                {selectedFeature.status}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Description
            </h3>
            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) => handleEditChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-primary-background border border-primary-surfaceElevated rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-text-accent transition-colors duration-200 resize-none"
                placeholder="Describe the feature and its capabilities..."
              />
            ) : (
              <p className="text-text-muted leading-relaxed">
                {selectedFeature.description}
              </p>
            )}
          </div>

          {!isEditing && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-text-primary mb-2">Release Date</h4>
                <p className="text-text-secondary">{selectedFeature.date}</p>
              </div>

              <div>
                <h4 className="font-medium text-text-primary mb-2">Status</h4>
                <p className="text-text-secondary">{selectedFeature.status}</p>
              </div>

              {selectedFeature.category && (
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Category</h4>
                  <p className="text-text-secondary">{selectedFeature.category}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeatureDetailsPanel