import { AnimatePresence, motion } from 'framer-motion'
import PaymentCaseStudyPage from '../PaymentCaseStudyPage'
import DeepDivePanel from '../../components/ArchitectureDiagram/DeepDivePanel'
import LifecycleMap from '../../components/ArchitectureDiagram/LifecycleMap'
import { COLLABORATION_PANELS, PAYMENT_FLOW_PANELS } from '../PaymentArchitecturePage/deepDiveData'
import {
  COLLAB_MAP_CONNECTORS,
  COLLAB_MAP_NODES,
  COLLAB_MAP_TITLE,
  COLLAB_MAP_VIEWBOX,
  FLOW_MAP_CONNECTORS,
  FLOW_MAP_NODES,
  FLOW_MAP_TITLE,
  FLOW_MAP_VIEWBOX,
} from '../PaymentArchitecturePage/lifecycleMapData'
import { useGalleryScroll } from '../../hooks/useGalleryScroll'
import { usePanelSelection } from '../../hooks/usePanelSelection'
import SpyBar, { type SpySection } from '../CaseStudyGallery/SpyBar'
import styles from '../CaseStudyGallery/CaseStudyGallery.module.css'

const ease = [0.16, 1, 0.3, 1] as const

const SPY_ITEMS: SpySection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'collaboration', label: 'Team Alignment' },
  { id: 'payment-flow', label: 'Payment Flow' },
]

const SCROLL_IDS = SPY_ITEMS.map((s) => s.id)

export default function PaymentCaseStudyGallery() {
  const { scrollRef, activeId: scrollActive, onJump } = useGalleryScroll(SCROLL_IDS)
  const {
    selected: selectedCollab,
    setSelected: setSelectedCollab,
    selectedPanel: selectedCollabPanel,
  } = usePanelSelection(COLLABORATION_PANELS, 'requirements-alignment')
  const {
    selected: selectedFlow,
    setSelected: setSelectedFlow,
    selectedPanel: selectedFlowPanel,
  } = usePanelSelection(PAYMENT_FLOW_PANELS, 'order-and-gateway')

  return (
    <section id="payment-experience" className={styles.page} ref={scrollRef}>
      <div className={styles.layout}>
        <aside className={styles.spyCol}>
          <SpyBar sections={SPY_ITEMS} activeId={scrollActive} onJump={onJump} />
        </aside>

        <div className={styles.sections}>
          <section id="overview" className={styles.section}>
            <PaymentCaseStudyPage />
          </section>

          <section id="collaboration" className={styles.sectionLocked}>
            <div className={styles.arch}>
              <div className={styles.archMap}>
                <LifecycleMap
                  nodes={COLLAB_MAP_NODES}
                  connectors={COLLAB_MAP_CONNECTORS}
                  title={COLLAB_MAP_TITLE}
                  viewBox={COLLAB_MAP_VIEWBOX}
                  activePanelId={selectedCollab}
                  onSelect={setSelectedCollab}
                  idSuffix="payment-collab"
                />
              </div>

              <div className={styles.archDetail}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCollab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.22, ease }}
                    className={styles.archDetailInner}
                  >
                    <DeepDivePanel panel={selectedCollabPanel} variant="stacked" onNavigate={setSelectedCollab} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>

          <section id="payment-flow" className={styles.sectionLocked}>
            <div className={styles.arch}>
              <div className={styles.archMap}>
                <LifecycleMap
                  nodes={FLOW_MAP_NODES}
                  connectors={FLOW_MAP_CONNECTORS}
                  title={FLOW_MAP_TITLE}
                  viewBox={FLOW_MAP_VIEWBOX}
                  activePanelId={selectedFlow}
                  onSelect={setSelectedFlow}
                  idSuffix="payment-flow"
                />
              </div>

              <div className={styles.archDetail}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedFlow}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.22, ease }}
                    className={styles.archDetailInner}
                  >
                    <DeepDivePanel panel={selectedFlowPanel} variant="stacked" onNavigate={setSelectedFlow} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>
        </div>

        <aside className={styles.labelCol}>
          <span className={styles.verticalLabel}>Payment Experience</span>
        </aside>
      </div>
    </section>
  )
}
