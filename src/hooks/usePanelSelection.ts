import { useCallback, useMemo, useState } from 'react'
import type { DeepDivePanel } from '../components/ArchitectureDiagram/types'
import { trackEvent } from '../services/analytics'
import { useCaseStudyOverlay } from './useCaseStudyOverlay'

/**
 * Tracks which deep-dive panel a gallery's architecture map has selected and
 * resolves it to the panel object. Falls back to the first panel when the id
 * matches nothing, so the map and detail view can never render empty.
 *
 * Each user selection is reported as `deep_dive_select`, which shows which
 * architecture decisions readers actually dig into. The initial panel is not
 * reported: it is shown by default, not chosen.
 */
export function usePanelSelection(panels: DeepDivePanel[], initialId: string) {
  const [selected, setSelected] = useState(initialId)
  const { openId } = useCaseStudyOverlay()

  const select = useCallback(
    (id: string) => {
      setSelected(id)
      if (openId) trackEvent('deep_dive_select', { case_study_id: openId, panel_id: id })
    },
    [openId],
  )

  const selectedPanel = useMemo(
    () => panels.find((p) => p.id === selected) ?? panels[0],
    [panels, selected],
  )

  return { selected, setSelected: select, selectedPanel }
}
