import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FeaturesProvider } from './context/FeaturesContext'
import Navigation from './components/Navigation'
import FeaturesGrid from './pages/FeaturesGrid'
import Timeline from './pages/Timeline'
import AddFeature from './pages/AddFeature'

function App() {
  return (
    <FeaturesProvider>
      <Router>
        <div className="min-h-screen bg-primary-background">
          <Navigation />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<FeaturesGrid />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/add-feature" element={<AddFeature />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FeaturesProvider>
  )
}

export default App