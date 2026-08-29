import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LoggingCaseStudyPage from '../LoggingCaseStudyPage'
import LoggingEngineeringInAction from '../LoggingEngineeringInAction'
import DeepDivePanel from '../../components/ArchitectureDiagram/DeepDivePanel'
import LifecycleMap from '../../components/ArchitectureDiagram/LifecycleMap'
import { DEEP_DIVE_PANELS } from '../LoggingArchitecturePage/deepDiveData'
import { MAP_CONNECTORS, MAP_NODES, MAP_TITLE, MAP_VIEWBOX } from '../LoggingArchitecturePage/lifecycleMapData'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import SpyBar, { type SpySection } from '../CaseStudyGallery/SpyBar'
import styles from '../CaseStudyGallery/CaseStudyGallery.module.css'

/** The spy bar is purely the scroll stops; the recruiter-facing "Production
 *  Case Files" stop sits between Overview and Architecture, not hidden under
 *  an engineer-only label. */
const SPY_ITEMS: SpySection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'engineering', label: 'Production Case Files' },
  { id: 'architecture', label: 'System architecture' },
]

const SCROLL_IDS = SPY_ITEMS.map((s) => s.id)

export default function LoggingCaseStudyGallery() {
  const scrollRef = useRef<HTMLElement>(null)
  const scrollActive = useScrollSpy(SCROLL_IDS, scrollRef)
  const [selected, setSelected] = useState('log-capture')

  const onJump = (id: string) => {
    const container = scrollRef.current
    const el = container?.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
    if (container && el) container.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
  }

  const selectedPanel = useMemo(
    () => DEEP_DIVE_PANELS.find((p) => p.id === selected) ?? DEEP_DIVE_PANELS[0],
    [selected],
  )

  return (
    <section id="logging-system" className={styles.page} ref={scrollRef}>
      <div className={styles.layout}>
        <aside className={styles.spyCol}>
          <SpyBar sections={SPY_ITEMS} activeId={scrollActive} onJump={onJump} />
        </aside>

        <div className={styles.sections}>
          <section id="overview" className={styles.section}>
            <LoggingCaseStudyPage />
          </section>

          <section id="engineering" className={styles.sectionLocked}>
            <LoggingEngineeringInAction />
          </section>

          <section id="architecture" className={styles.sectionLocked}>
            <div className={styles.arch}>
              <div className={styles.archMap}>
                <LifecycleMap
                  nodes={MAP_NODES}
                  connectors={MAP_CONNECTORS}
                  title={MAP_TITLE}
                  viewBox={MAP_VIEWBOX}
                  activePanelId={selected}
                  onSelect={setSelected}
                  idSuffix="logging"
                />
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
                    <DeepDivePanel panel={selectedPanel} variant="stacked" onNavigate={setSelected} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>

        <aside className={styles.labelCol}>
          <span className={styles.verticalLabel}>Logging System</span>
        </aside>
      </div>
    </section>
  )
}
