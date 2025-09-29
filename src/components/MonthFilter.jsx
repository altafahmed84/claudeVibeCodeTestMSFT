import { useFeatures } from '../context/FeaturesContext'

export default function MonthFilter() {
  const { selectedMonth, setSelectedMonth, getAvailableMonths } = useFeatures()
  const availableMonths = getAvailableMonths()

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-text-secondary mb-2">
        Filter by Month
      </label>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="bg-surface border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      >
        <option value="all">All Months</option>
        {availableMonths.map(month => (
          <option key={month} value={month}>
            {capitalizeFirst(month)}
          </option>
        ))}
      </select>
    </div>
  )
}