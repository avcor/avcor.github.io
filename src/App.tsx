import { MotionConfig } from 'framer-motion'
import SiteHeader from './components/SiteHeader'
import Home from './pages/Home'
import ImpactPage from './pages/ImpactPage'
import IndexPage from './pages/IndexPage'
import ContactPage from './pages/ContactPage'
import CaseStudyOverlay from './features/CaseStudyOverlay'
import { CaseStudyOverlayProvider } from './context/CaseStudyOverlayContext'
import SiteAnalytics from './features/SiteAnalytics'

export default function App() {
  return (
    /* Visitors with reduced motion get fades only, no movement */
    <MotionConfig reducedMotion="user">
      <CaseStudyOverlayProvider>
        <SiteAnalytics />
        <SiteHeader />
        <Home />
        <ImpactPage />
        <IndexPage />
        <ContactPage />

        {/* Case study details are no longer a scroll section, they slide up as a
            sheet when a leaf node is selected on the index circuit. */}
        <CaseStudyOverlay />
      </CaseStudyOverlayProvider>
    </MotionConfig>
  )
}
