import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FlutterCaseStudyPage from '../FlutterCaseStudyPage'
import DeepDivePanel from '../PlatformEngineeringPage/DeepDivePanel'
import LifecycleMap from '../PlatformEngineeringPage/LifecycleMap'
import { DEEP_DIVE_PANELS } from '../PlatformEngineeringPage/deepDiveData'
import CiCdDeepDivePanel from '../CiCdArchitecturePage/DeepDivePanel'
import CiCdLifecycleMap from '../CiCdArchitecturePage/LifecycleMap'
import { DEEP_DIVE_PANELS as CICD_DEEP_DIVE_PANELS } from '../CiCdArchitecturePage/deepDiveData'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import SpyBar, { type SpySection } from './SpyBar'
import styles from './CaseStudyGallery.module.css'

/** The spy bar is purely the scroll stops; concerns are explored via each map. */
const SPY_ITEMS: SpySection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'System architecture' },
  { id: 'cicd', label: 'CI/CD Architecture' },
]

const SCROLL_IDS = SPY_ITEMS.map((s) => s.id)

export default function CaseStudyGallery() {
  const scrollRef = useRef<HTMLElement>(null)
  const scrollActive = useScrollSpy(SCROLL_IDS, scrollRef)
  const [selected, setSelected] = useState('seam')
  const [selectedCiCd, setSelectedCiCd] = useState('scaffold-regen')

  const onJump = (id: string) => {
    const container = scrollRef.current
    const el = container?.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
    if (container && el) container.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
  }

  const selectedPanel = useMemo(
    () => DEEP_DIVE_PANELS.find((p) => p.id === selected) ?? DEEP_DIVE_PANELS[0],
    [selected],
  )

  const selectedCiCdPanel = useMemo(
    () => CICD_DEEP_DIVE_PANELS.find((p) => p.id === selectedCiCd) ?? CICD_DEEP_DIVE_PANELS[0],
    [selectedCiCd],
  )

  return (
    <section id="flutter-platform" className={styles.page} ref={scrollRef}>
      <div className={styles.layout}>
        <aside className={styles.spyCol}>
          <SpyBar sections={SPY_ITEMS} activeId={scrollActive} onJump={onJump} />
        </aside>

        <div className={styles.sections}>
          <section id="overview" className={styles.section}>
            <FlutterCaseStudyPage />
          </section>

          <section id="architecture" className={styles.sectionLocked}>
            <div className={styles.arch}>
              <div className={styles.archMap}>
                <LifecycleMap activePanelId={selected} onSelect={setSelected} />
              </div>

              <div className={styles.archDetail}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.archDetailInner}
                  >
                    <DeepDivePanel panel={selectedPanel} variant="stacked" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>

          <section id="cicd" className={styles.sectionLocked}>
            <div className={styles.arch}>
              <div className={styles.archMap}>
                <CiCdLifecycleMap activePanelId={selectedCiCd} onSelect={setSelectedCiCd} />
              </div>

              <div className={styles.archDetail}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCiCd}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.archDetailInner}
                  >
                    <CiCdDeepDivePanel panel={selectedCiCdPanel} variant="stacked" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
