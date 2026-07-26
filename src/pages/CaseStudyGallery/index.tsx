import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import Nav from '../../components/Nav'
import ViewToggle from '../../components/ViewToggle'
import FlutterCaseStudySlide from '../FlutterCaseStudyPage'
import PlatformEngineeringSlide from '../PlatformEngineeringPage'
import SlidesViewport from './SlidesViewport'
import styles from './CaseStudyGallery.module.css'

const SLIDE_COUNT = 2

export default function CaseStudyGallery() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === 'ArrowRight' && activeSlide < SLIDE_COUNT - 1) {
        setActiveSlide((i) => i + 1)
      } else if (e.key === 'ArrowLeft' && activeSlide > 0) {
        setActiveSlide((i) => i - 1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeSlide])

  return (
    <section id="flutter-platform" className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerCenter}>
          <ViewToggle activeIndex={activeSlide} onChange={setActiveSlide} />
        </div>
        <div className={styles.headerRight}>
          <Nav activeLink="Work" />
        </div>
      </header>

      <div className={styles.body}>
        <AnimatePresence>
          {activeSlide > 0 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={styles.backButton}
              onClick={() => setActiveSlide((i) => Math.max(0, i - 1))}
              aria-label="Previous section"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </motion.button>
          )}
        </AnimatePresence>

        <SlidesViewport activeIndex={activeSlide} onChange={setActiveSlide}>
          <FlutterCaseStudySlide />
          <PlatformEngineeringSlide />
        </SlidesViewport>
      </div>
    </section>
  )
}
