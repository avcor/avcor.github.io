import { AnimatePresence, motion } from 'framer-motion'
import CaseStudyLabelCol from '../../components/CaseStudyLabelCol'
import PlatformOptimizationCaseStudyPage from '../PlatformOptimizationCaseStudyPage'
import DeepDivePanel from '../../components/ArchitectureDiagram/DeepDivePanel'
import LifecycleMap from '../../components/ArchitectureDiagram/LifecycleMap'
import { DEEP_DIVE_PANELS } from '../PlatformOptimizationArchitecturePage/deepDiveData'
import { MAP_CONNECTORS, MAP_NODES, MAP_TITLE, MAP_VIEWBOX } from '../PlatformOptimizationArchitecturePage/lifecycleMapData'
import { useGalleryScroll } from '../../hooks/useGalleryScroll'
import { usePanelSelection } from '../../hooks/usePanelSelection'
import SpyBar, { type SpySection } from '../CaseStudyGallery/SpyBar'
import styles from '../CaseStudyGallery/CaseStudyGallery.module.css'

const SPY_ITEMS: SpySection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Optimization areas' },
]

const SCROLL_IDS = SPY_ITEMS.map((s) => s.id)

export default function PlatformOptimizationCaseStudyGallery() {
  const { scrollRef, activeId: scrollActive, onJump } = useGalleryScroll(SCROLL_IDS)
  const { selected, setSelected, selectedPanel } = usePanelSelection(DEEP_DIVE_PANELS, 'storage-cache-discipline')

  return (
    <section id="platform-optimization" className={styles.page} ref={scrollRef}>
      <div className={styles.layout}>
        <aside className={styles.spyCol}>
          <SpyBar sections={SPY_ITEMS} activeId={scrollActive} onJump={onJump} compact />
        </aside>

        <div className={styles.sections}>
          <section id="overview" className={styles.section}>
            <PlatformOptimizationCaseStudyPage />
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
        </div>

        <CaseStudyLabelCol category="Optimization" name="Platform Optimization" />
      </div>
    </section>
  )
}
