import CursorGlow from './components/CursorGlow'
import Home from './pages/Home'
import ImpactPage from './pages/ImpactPage'
import IndexPage from './pages/IndexPage'
import CaseStudyOverlay from './features/CaseStudyOverlay'
import { CaseStudyOverlayProvider } from './context/CaseStudyOverlayContext'

export default function App() {
  return (
    <CaseStudyOverlayProvider>
      <CursorGlow />
      <Home />
      <ImpactPage />
      <IndexPage />

      {/* Case study details are no longer a scroll section, they slide up as a
          sheet when a leaf node is selected on the index circuit. */}
      <CaseStudyOverlay />
    </CaseStudyOverlayProvider>
  )
}
