import { useState } from 'react'
import { useFeatures } from '../context/FeaturesContext'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const AddFeature = () => {
  const { addFeature, loading } = useFeatures()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    icon: '🚀',
    status: 'Coming Soon',
    description: ''
  })

  const [errors, setErrors] = useState({})
  const [showIconDropdown, setShowIconDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [showYearDropdown, setShowYearDropdown] = useState(false)

  const iconOptions = ['🚀', '🌀', '📊', '👥', '🏗️', '💬', '🎯', '⚡', '🔧', '💡', '🎨', '📱']
  const statusOptions = [
    'Coming Soon',
    'Preview',
    'Beta',
    'Released',
    'General availability'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleDateSelect = (date) => {
    const options = { month: 'long', day: 'numeric' }
    const formattedDate = date.toLocaleDateString('en-US', options)
    setFormData(prev => ({
      ...prev,
      date: formattedDate
    }))
    setShowDatePicker(false)

    if (errors.date) {
      setErrors(prev => ({
        ...prev,
        date: ''
      }))
    }
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
    // Show 5 years in the past and 10 years in the future
    for (let year = currentYearValue - 5; year <= currentYearValue + 10; year++) {
      years.push(year)
    }
    return years
  }

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    const calendar = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendar.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(new Date(currentYear, currentMonth, day))
    }

    return calendar
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.date.trim()) {
      newErrors.date = 'Date is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await addFeature(formData)
      navigate('/')
    } catch (error) {
      console.error('Error adding feature:', error)
    }
  }

  return (
    <div className="min-h-screen bg-primary-background">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-timeline-gradientStart to-timeline-gradientEnd bg-clip-text text-transparent mb-4">
            Copilot Evolution
          </h1>
          <p className="text-text-secondary text-lg">
            Add a new feature to the Copilot timeline.
          </p>
        </div>

        {/* Form */}
        <div className="bg-primary-surface rounded-2xl p-8 border border-primary-surfaceElevated shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-text-primary font-medium mb-2">
                Feature Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-primary-background border border-primary-surfaceElevated rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-text-accent transition-colors duration-200"
                placeholder="Enter feature title..."
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Release Date
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full px-4 py-3 bg-primary-background border border-primary-surfaceElevated rounded-lg text-text-primary focus:outline-none focus:border-text-accent transition-colors duration-200 flex items-center justify-between"
                >
                  <span className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-text-accent" />
                    <span className={formData.date ? 'text-text-primary' : 'text-text-muted'}>
                      {formData.date || 'Select date...'}
                    </span>
                  </span>
                  <ChevronDown className="w-5 h-5 text-text-secondary" />
                </button>

                {showDatePicker && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-primary-surface border border-primary-surfaceElevated rounded-lg shadow-lg z-10 p-4">
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
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-primary-surface border border-primary-surfaceElevated rounded-lg shadow-lg z-20 max-h-40 overflow-y-auto">
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
                              setFormData(prev => ({ ...prev, date: customDate }))
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
              {errors.date && (
                <p className="text-red-400 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {/* Icon Dropdown */}
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Feature Icon
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIconDropdown(!showIconDropdown)}
                  className="w-full px-4 py-3 bg-primary-background border border-primary-surfaceElevated rounded-lg text-text-primary focus:outline-none focus:border-text-accent transition-colors duration-200 flex items-center justify-between"
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-2xl">{formData.icon}</span>
                    <span>Select Icon</span>
                  </span>
                  <ChevronDown className="w-5 h-5 text-text-secondary" />
                </button>

                {showIconDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-primary-surface border border-primary-surfaceElevated rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-6 gap-2 p-3">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, icon }))
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
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="w-full px-4 py-3 bg-primary-background border border-primary-surfaceElevated rounded-lg text-text-primary focus:outline-none focus:border-text-accent transition-colors duration-200 flex items-center justify-between"
                >
                  <span>{formData.status}</span>
                  <ChevronDown className="w-5 h-5 text-text-secondary" />
                </button>

                {showStatusDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-primary-surface border border-primary-surfaceElevated rounded-lg shadow-lg z-10">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, status }))
                          setShowStatusDropdown(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-primary-surfaceElevated transition-colors duration-200 text-text-primary first:rounded-t-lg last:rounded-b-lg"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-text-primary font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-primary-background border border-primary-surfaceElevated rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-text-accent transition-colors duration-200 resize-none"
                placeholder="Describe the feature and its capabilities..."
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-timeline-gradientStart to-timeline-gradientEnd text-text-primary font-medium rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Feature'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddFeature