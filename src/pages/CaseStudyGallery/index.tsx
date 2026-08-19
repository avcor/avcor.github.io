import { useEffect, useState } from 'react'
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
        <SlidesViewport activeIndex={activeSlide} onChange={setActiveSlide}>
          <FlutterCaseStudySlide />
          <PlatformEngineeringSlide />
        </SlidesViewport>
      </div>
    </section>
  )
}
