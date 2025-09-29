import { Search, X } from 'lucide-react'
import { useFeatures } from '../context/FeaturesContext'
import MonthFilter from './MonthFilter'

const normalizeValue = (value) => {
  if (value === null || value === undefined) {
    return ''
  }
  return String(value).trim().toLowerCase()
}

const FiltersPanel = ({ className = '', showMonthFilter = true, showTagsFilter = true }) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategories,
    selectedTags,
    toggleCategory,
    toggleTag,
    clearFilters,
    getAvailableCategories,
    getAvailableTags
  } = useFeatures()

  const categories = getAvailableCategories()
  const tags = getAvailableTags()

  const hasActiveFilters = Boolean(searchTerm.trim()) || selectedCategories.length > 0 || selectedTags.length > 0

  const containerClassName = ['space-y-6', className].filter(Boolean).join(' ')

  const isCategoryActive = (category) => selectedCategories.some(item => normalizeValue(item) === normalizeValue(category))
  const isTagActive = (tag) => selectedTags.some(item => normalizeValue(item) === normalizeValue(tag))

  return (
    <div className={containerClassName}>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Search Features
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title, summary, or tags"
              className="w-full bg-primary-surface border border-primary-surfaceElevated rounded-lg pl-10 pr-10 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-text-accent focus:border-text-accent"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {showMonthFilter && (
          <div className="md:justify-self-end w-full md:w-auto">
            <MonthFilter className="mb-0" />
          </div>
        )}
      </div>

      <div>
        <span className="block text-sm font-medium text-text-secondary mb-2">
          Filter by Category
        </span>
        {categories.length === 0 ? (
          <p className="text-xs text-text-muted">No categories available yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = isCategoryActive(category)
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors duration-200 ${
                    active
                      ? 'bg-text-accent text-white border-text-accent shadow-sm'
                      : 'bg-primary-surface border-primary-surfaceElevated text-text-secondary hover:text-text-primary hover:border-text-accent/40'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {showTagsFilter && tags.length > 0 && (
        <div>
          <span className="block text-sm font-medium text-text-secondary mb-2">
            Filter by Tags
          </span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = isTagActive(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors duration-200 ${
                    active
                      ? 'bg-primary-background text-text-accent border-text-accent'
                      : 'bg-primary-surface border-primary-surfaceElevated text-text-secondary hover:text-text-primary hover:border-text-accent/40'
                  }`}
                >
                  #{tag}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center text-sm text-text-muted hover:text-text-primary"
          >
            <X className="w-4 h-4 mr-2" />
            Clear search & filters
          </button>
        </div>
      )}
    </div>
  )
}

export default FiltersPanel

