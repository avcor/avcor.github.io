import { useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LifecycleMap from './LifecycleMap'
import DeepDivePanel from './DeepDivePanel'
import { DEEP_DIVE_PANELS } from './deepDiveData'
import styles from './PlatformEngineeringPage.module.css'

const LAST = DEEP_DIVE_PANELS.length - 1

export default function PlatformEngineeringPage() {
  const [active, setActive] = useState(0)
  const activePanel = DEEP_DIVE_PANELS[active]

  const selectById = (panelId: string) => {
    const idx = DEEP_DIVE_PANELS.findIndex((p) => p.id === panelId)
    if (idx >= 0) setActive(idx)
  }

  // Scoped to the panel region (onKeyDown, not window) so it never collides with
  // the gallery's Left/Right slide navigation in CaseStudyGallery.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(LAST, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (/^[1-9]$/.test(e.key)) {
      const idx = Number(e.key) - 1
      if (idx <= LAST) setActive(idx)
    }
  }

  return (
    <div className={styles.content} onKeyDown={onKeyDown} tabIndex={-1}>
      <div className={styles.stage}>
        <div className={styles.mapPane}>
          <LifecycleMap activePanelId={activePanel.id} onSelect={selectById} />
        </div>

        <div className={styles.detailPane}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel.id}
              className={styles.panelHolder}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <DeepDivePanel panel={activePanel} variant="split" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
