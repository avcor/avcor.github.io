import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FlutterCaseStudyPage from '../FlutterCaseStudyPage'
import DeepDivePanel from '../../components/ArchitectureDiagram/DeepDivePanel'
import LifecycleMap from '../../components/ArchitectureDiagram/LifecycleMap'
import { DEEP_DIVE_PANELS } from '../PlatformEngineeringPage/deepDiveData'
import {
  MAP_CONNECTORS,
  MAP_NODES,
  MAP_TITLE,
  MAP_VIEWBOX,
} from '../PlatformEngineeringPage/lifecycleMapData'
import { DEEP_DIVE_PANELS as CICD_DEEP_DIVE_PANELS } from '../CiCdArchitecturePage/deepDiveData'
import {
  MAP_CONNECTORS as CICD_MAP_CONNECTORS,
  MAP_NODES as CICD_MAP_NODES,
  MAP_TITLE as CICD_MAP_TITLE,
  MAP_VIEWBOX as CICD_MAP_VIEWBOX,
} from '../CiCdArchitecturePage/pipelineMapData'
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
                <LifecycleMap
                  nodes={MAP_NODES}
                  connectors={MAP_CONNECTORS}
                  title={MAP_TITLE}
                  viewBox={MAP_VIEWBOX}
                  activePanelId={selected}
                  onSelect={setSelected}
                  idSuffix="platform"
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

          <section id="cicd" className={styles.sectionLocked}>
            <div className={styles.arch}>
              <div className={styles.archMap}>
                <LifecycleMap
                  nodes={CICD_MAP_NODES}
                  connectors={CICD_MAP_CONNECTORS}
                  title={CICD_MAP_TITLE}
                  viewBox={CICD_MAP_VIEWBOX}
                  activePanelId={selectedCiCd}
                  onSelect={setSelectedCiCd}
                  idSuffix="cicd"
                />
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
                    <DeepDivePanel panel={selectedCiCdPanel} variant="stacked" onNavigate={setSelectedCiCd} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>

        <aside className={styles.labelCol}>
          <span className={styles.verticalLabel}>Flutter Integration</span>
        </aside>
      </div>
    </section>
  )
}
