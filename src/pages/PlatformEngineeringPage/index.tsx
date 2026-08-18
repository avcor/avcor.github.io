import { useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionStepper from './SectionStepper'
import DeepDivePanel from './DeepDivePanel'
import { DEEP_DIVE_PANELS } from './deepDiveData'
import styles from './PlatformEngineeringPage.module.css'

const LAST = DEEP_DIVE_PANELS.length - 1

export default function PlatformEngineeringPage() {
  const [active, setActive] = useState(0)

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
    <div className={styles.content} onKeyDown={onKeyDown}>
      <div className={styles.stepperRow}>
        <SectionStepper activeIndex={active} onChange={setActive} />
      </div>

      <div className={styles.stage}>
        <AnimatePresence mode="wait">
          <motion.div
            key={DEEP_DIVE_PANELS[active].id}
            className={styles.panelHolder}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <DeepDivePanel panel={DEEP_DIVE_PANELS[active]} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
