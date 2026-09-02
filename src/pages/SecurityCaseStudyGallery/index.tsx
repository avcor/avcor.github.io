import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SecurityCaseStudyPage from '../SecurityCaseStudyPage'
import DeepDivePanel from '../../components/ArchitectureDiagram/DeepDivePanel'
import LifecycleMap from '../../components/ArchitectureDiagram/LifecycleMap'
import { DEEP_DIVE_PANELS } from '../SecurityArchitecturePage/deepDiveData'
import {
  MAP_CONNECTORS,
  MAP_NODES,
  MAP_TITLE,
  MAP_VIEWBOX,
} from '../SecurityArchitecturePage/lifecycleMapData'
import { DEEP_DIVE_PANELS as RUNTIME_DEEP_DIVE_PANELS } from '../SecurityRuntimePage/deepDiveData'
import {
  MAP_CONNECTORS as RUNTIME_MAP_CONNECTORS,
  MAP_NODES as RUNTIME_MAP_NODES,
  MAP_TITLE as RUNTIME_MAP_TITLE,
  MAP_VIEWBOX as RUNTIME_MAP_VIEWBOX,
} from '../SecurityRuntimePage/lifecycleMapData'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import SpyBar, { type SpySection } from '../CaseStudyGallery/SpyBar'
import styles from '../CaseStudyGallery/CaseStudyGallery.module.css'

const SPY_ITEMS: SpySection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Data & transport' },
  { id: 'runtime', label: 'Runtime integrity' },
]

const SCROLL_IDS = SPY_ITEMS.map((s) => s.id)

export default function SecurityCaseStudyGallery() {
  const scrollRef = useRef<HTMLElement>(null)
  const scrollActive = useScrollSpy(SCROLL_IDS, scrollRef)
  const [selected, setSelected] = useState('obfuscated-cert-pinning')
  const [selectedRuntime, setSelectedRuntime] = useState('root-hook-detection')

  const onJump = (id: string) => {
    const container = scrollRef.current
    const el = container?.querySelector<HTMLElement>(`#${CSS.escape(id)}`)
    if (container && el) container.scrollTo({ top: el.offsetTop, behavior: 'smooth' })
  }

  const selectedPanel = useMemo(
    () => DEEP_DIVE_PANELS.find((p) => p.id === selected) ?? DEEP_DIVE_PANELS[0],
    [selected],
  )

  const selectedRuntimePanel = useMemo(
    () => RUNTIME_DEEP_DIVE_PANELS.find((p) => p.id === selectedRuntime) ?? RUNTIME_DEEP_DIVE_PANELS[0],
    [selectedRuntime],
  )

  return (
    <section id="app-security-platform" className={styles.page} ref={scrollRef}>
      <div className={styles.layout}>
        <aside className={styles.spyCol}>
          <SpyBar sections={SPY_ITEMS} activeId={scrollActive} onJump={onJump} />
        </aside>

        <div className={styles.sections}>
          <section id="overview" className={styles.section}>
            <SecurityCaseStudyPage />
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
                  idSuffix="security-transport"
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

          <section id="runtime" className={styles.sectionLocked}>
            <div className={styles.arch}>
              <div className={styles.archMap}>
                <LifecycleMap
                  nodes={RUNTIME_MAP_NODES}
                  connectors={RUNTIME_MAP_CONNECTORS}
                  title={RUNTIME_MAP_TITLE}
                  viewBox={RUNTIME_MAP_VIEWBOX}
                  activePanelId={selectedRuntime}
                  onSelect={setSelectedRuntime}
                  idSuffix="security-runtime"
                />
              </div>

              <div className={styles.archDetail}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedRuntime}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.archDetailInner}
                  >
                    <DeepDivePanel panel={selectedRuntimePanel} variant="stacked" onNavigate={setSelectedRuntime} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>

        <aside className={styles.labelCol}>
          <span className={styles.verticalLabel}>App Security</span>
        </aside>
      </div>
    </section>
  )
}
