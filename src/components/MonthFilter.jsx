import { useFeatures } from '../context/FeaturesContext'

export default function MonthFilter({ className = '' }) {
  const { selectedMonth, setSelectedMonth, getAvailableMonths } = useFeatures()
  const availableMonths = getAvailableMonths()

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const containerClass = ['mb-6', className].filter(Boolean).join(' ').trim()

  return (
    <div className={containerClass}>
      <label className="block text-sm font-medium text-text-secondary mb-2">
        Filter by Month
      </label>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="bg-primary-surface border border-primary-surfaceElevated rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-text-accent focus:border-text-accent hover:bg-primary-surfaceElevated transition-colors"
      >
        <option value="all" className="bg-primary-surface text-text-primary">All Months</option>
        {availableMonths.map(month => (
          <option key={month} value={month} className="bg-primary-surface text-text-primary">
            {capitalizeFirst(month)}
          </option>
        ))}
      </select>
    </div>
  )
}