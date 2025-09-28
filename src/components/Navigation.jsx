import { Link, useLocation } from 'react-router-dom'
import { Rocket } from 'lucide-react'

const Navigation = () => {
  const location = useLocation()

  const navItems = [
    { name: 'Overview', path: '/', label: 'Features' },
    { name: 'Timeline', path: '/timeline', label: 'Timeline' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-backgroundSecondary border-b border-primary-surface">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Rocket className="w-8 h-8 text-text-accent" />
            <span className="text-xl font-semibold text-text-primary">
              AI Timeline
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-text-accent bg-primary-surface'
                    : 'text-text-secondary hover:text-text-primary hover:bg-primary-surface/50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Add Feature Button */}
            <Link
              to="/add-feature"
              className="px-6 py-2 bg-gradient-to-r from-timeline-gradientStart to-timeline-gradientEnd text-text-primary font-medium rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-lg"
            >
              + Add Feature
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation