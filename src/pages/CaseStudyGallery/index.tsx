import { useEffect, useState, type CSSProperties } from 'react'
import Nav from '../../components/Nav'
import ViewToggle from '../../components/ViewToggle'
import EngineeringAchievementsRail from '../../components/EngineeringAchievementsRail'
import FlutterCaseStudySlide from '../FlutterCaseStudyPage'
import PlatformEngineeringSlide from '../PlatformEngineeringPage'
import { useRailBand } from '../../hooks/useRailBand'
import SlidesViewport from './SlidesViewport'
import styles from './CaseStudyGallery.module.css'

const SLIDE_COUNT = 2

export default function CaseStudyGallery() {
  const [activeSlide, setActiveSlide] = useState(0)
  const { containerRef, railRef, band } = useRailBand()

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

      <div
        className={styles.body}
        ref={containerRef}
        style={{ '--rail-band': band } as CSSProperties}
      >
        <div className={styles.rail} ref={railRef}>
          <EngineeringAchievementsRail />
        </div>

        <SlidesViewport activeIndex={activeSlide} onChange={setActiveSlide}>
          <FlutterCaseStudySlide />
          <PlatformEngineeringSlide />
        </SlidesViewport>
      </div>
    </section>
  )
}
